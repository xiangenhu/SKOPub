// For assistance contact mediasemantics.com

var recognizeBase = "https://apiwest.x-in-y.com/app/recognize";


var AudioContext = window.AudioContext || window.webkitAudioContext;
var OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
if (!window.AudioContext) alert("Sorry, this test is not available on this device.");

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var context;

var recording;
var recorder;
var recordingRate;
var recordingLanguage;


var Manderin=["Linlin","Lisheng","Lily","Hui","Liang","Qiang"];	
var Taiwanese=["Yafrang"];		
var Cantonese=["Kaho","Kayan"];	

function selectLanguage(TeacherVoice){
	if (Manderin.indexOf(TeacherVoice)>0){
		return "cmn-Hans-CN";
	}
	if (Taiwanese.indexOf(TeacherVoice)>0){
		return "cmn-Hant-TW";
	}
	if (Cantonese.indexOf(TeacherVoice)>0){
		return "yue-Hant-HK";
	}
	return "en-US";
}

function startStopRecording() {
	recordingLanguage = selectLanguage(V1);
	if (!context) context = new AudioContext();
	
    if (!recording) {
        recording = true;
		// $("#inputText").val();
        animateSpinner();

        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, onSuccess, onFail);
        } else {
            console.log('navigator.getUserMedia not present');
        }
    } else {
        recording = false;
        stopRecording();
    }
}

function onSuccess(s) {
    recordingRate = context.sampleRate
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource, {workerPath:"js/recorderWorker.js"});
    recorder.record();
}

function onFail(e) {
    console.log('Unable to record: ', e);
};

function stopRecording() {
    recorder.stop();

    recorder.getBuffer(function(a) {

        var buf = a[0];

        // Resample to 16khz
        var o = new OfflineAudioContext(1, buf.length, 16000);
        var b = o.createBuffer(1, buf.length, recordingRate);
        var newbuf = b.getChannelData(0);
        for (var i = 0; i < buf.length; i++) {
            newbuf[i] = buf[i];
        }
        var source = o.createBufferSource();
        source.buffer = b;
        source.connect(o.destination);
        source.start(0);
        o.oncomplete = function(e) {
            var resampledAudioBuffer = e.renderedBuffer;
            var cd = resampledAudioBuffer.getChannelData(0);

            var dataview = encodeRaw(cd, true);
            var audioBlob = new Blob([dataview], { type: 'audio/wav' });

            var reader = new FileReader();
            reader.onload = function(event) {
                var s = event.target.result;
                if (s.substr(0,22) != "data:audio/wav;base64,") console.log("ASSUMPTION VIOLATED");

                var xhr = new XMLHttpRequest();
                xhr.open("POST", recognizeBase, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.addEventListener("load", function() {
					onRecognition(JSON.parse(xhr.response).transcript);
					recorder = null;
                }, false);
                // Post the mono 16khz 16 bit WAV file, encoded in base64
                xhr.send("language=" + encodeURIComponent(recordingLanguage) + "&data=" + encodeURIComponent(s.substr(22)));
            };
            reader.readAsDataURL(audioBlob);
        }
        o.startRendering();
    });
}

function floatTo16BitPCM(output, offset, input, howmany){
    for (var i = 0; i < howmany; i++, offset+=2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string){
    for (var i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function encodeWAV(samples, mono){
    var howMany = Math.ceil(samples.length * 16000 / recordingRate);
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + howMany * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, mono?1:2, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 16000 * (mono?1:2)*2, true);
    view.setUint16(32, (mono?1:2)*2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, howMany * 2, true);
    floatTo16BitPCM(view, 44, samples, howMany);
    return view;
}

function encodeRaw(samples, mono){
    var howMany = Math.ceil(samples.length * 16000 / recordingRate);
    var buffer = new ArrayBuffer(samples.length * 2);
    var view = new DataView(buffer);
    floatTo16BitPCM(view, 0, samples, howMany);
    return view;
}

//
// Record button spinner
//

var spinner = document.getElementById('spinner'), ctx = spinner.getContext('2d'), w = 75, h = 75, rad = Math.PI/180, phi = 2, size = 25, r = 0;

function drawSpinnerCanvas(r, num){
    for (var i = size; i >= 0; i--) {
        var x = w/2 + num*Math.cos((r+i*2)*phi*rad),
            y = h/2 + num*Math.sin((r+i*2)*phi*rad);

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, " + (num%255) + ", " + (num%255) + ", " + 1/(25-i+1) + ")";;
        ctx.arc(x, y, 3, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

function animateSpinner(){
    if (recording) requestAnimationFrame( animateSpinner );
    ctx.clearRect(0, 0, w, h);
    if (!recording) return;
    r += 1;
    drawSpinnerCanvas(r, 30);
}

//animateSpinner(); // test

// recorder
(function(window){

      var WORKER_PATH = 'js/recorderWorker.js';
      var Recorder = function(source, cfg){
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
        var worker = new Worker(config.workerPath || WORKER_PATH);
        worker.postMessage({
          command: 'init',
          config: {
            sampleRate: this.context.sampleRate
          }
        });
        var recording = false,
          currCallback;

        this.node.onaudioprocess = function(e){
          if (!recording) return;
          worker.postMessage({
            command: 'record',
            buffer: [
              e.inputBuffer.getChannelData(0)/*,
              e.inputBuffer.getChannelData(1)*/
            ]
          });
        }

        this.configure = function(cfg){
          for (var prop in cfg){
            if (cfg.hasOwnProperty(prop)){
              config[prop] = cfg[prop];
            }
          }
        }

        this.record = function(){
       
          recording = true;
        }

        this.stop = function(){
        
          recording = false;
        }

        this.clear = function(){
          worker.postMessage({ command: 'clear' });
        }

        this.getBuffer = function(cb) {
          currCallback = cb || config.callback;
          worker.postMessage({ command: 'getBuffers' })
        }

        this.exportRaw = function(cb){
          currCallback = cb || config.callback;
          if (!currCallback) throw new Error('Callback not set');
          worker.postMessage({
            command: 'exportRaw'
          });
        }
		
        this.exportWAV = function(cb, type){
          currCallback = cb || config.callback;
          type = type || config.type || 'audio/wav';
          if (!currCallback) throw new Error('Callback not set');
          worker.postMessage({
            command: 'exportMonoWAV', // was exportWAV
            type: type
          });
        }

        worker.onmessage = function(e){
          var blob = e.data;
          currCallback(blob);
        }

        source.connect(this.node);
        this.node.connect(this.context.destination);    //this should not be necessary
      };

      Recorder.forceDownload = function(blob, filename){
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = filename || 'output.wav';
        var click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
      }

      window.Recorder = Recorder;

    })(window);
	