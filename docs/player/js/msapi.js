if (qs("LoC","0")=="0"){
	var animateBase = "https://apiwest.x-in-y.com/app/animate.jpeg";
	var rivescriptBase = "https://apiwest.x-in-y.com/app/rivescript";
	var chatscriptBase = "https://apiwest.x-in-y.com/app/chatscript";
	console.log("Server Location: API West: Virginia");
}else {
	var animateBase = "https://apieast.x-in-y.com/app/animate.jpeg";
	var rivescriptBase = "https://apieast.x-in-y.com/app/rivescript";
	var chatscriptBase = "https://apieast.x-in-y.com/app/chatscript";
	console.log("Server Location: API West: Tokyo");
}


var chars = {}; // indexed by id
var o = {};

var V1=qs("V1","Matthew");
var V2=qs("V2","Salli");
var V3=qs("V3","Kimberly");
var V4=qs("V4","Justin");


var C1=qs("C1","Steve");
var C2=qs("C2","Kate");
var C3=qs("C3","Angela");
var C4=qs("C4","Carl");

var F1=qs("F1","Head");
var F2=qs("F2","Head");
var F3=qs("F3","Head");
var F4=qs("F4","Head");


var Q1=qs("Q1","0");
var Q2=qs("Q2","0");
var Q3=qs("Q3","0");
var Q4=qs("Q4","0");


var idAnimating; // or falsy if none
var n = 0;
var queue;
var savedURL;
var loaded;

function msInit(c) {
	chars = c;
	idAnimating = undefined;
	queue = [];
	loaded = 0;
	var idFirst;
	for (var id in chars) {
		if (!idFirst) idFirst = id;
		var char = chars[id];
		char.renderer = new PIXI.CanvasRenderer(char.width, char.height);
		char.stage = new PIXI.Container();
		char.state = "";
		char.holderDiv = document.getElementById(id+"Renderer");
		char.holderDiv.innerHTML = "";
		msSpeakQueued(id, '','');
	}
	// simplest idle
	//setTimeout(doIdleThing, 3000+Math.random()*3000);
}

/*
function doIdleThing() {
	if (!idAnimating && queue.length == 0) {
		execute("<blink/>");
	}
	setTimeout(doIdleThing, 3000+Math.random()*3000);
}
*/


function ReplaceText(MoveID,Text){
	var Res=Text;
	Res=Res.replace("_student", C2);
	Res=Res.replace("_student_", C2);
	Res=Res.replace("_tutor", C1);
	Res=Res.replace("_tutor_", C1);
	Res=Res.replace("_NAMES1_", C2);
	Res=Res.replace("_NAMES2_", C3);
	Res=Res.replace("_NAMES3_", C4);
	Res=Res.replace("_NAMET_", C1);
	Res=Res.replace("_SELF_", MoveID);
	return Res;
}


function msSpeakQueued(id, text,note) {

	if (id==null) {
		id=C2;
	}

	if (InReplay==false)
	{
		var SpeechObj={};
		SpeechObj.id=id;
		SpeechObj.text=text;
		dialogHistory.push(SpeechObj);
	}
	text=ReplaceText(id, text);
	console.log("msSpeakQueued("+id+", "+text+")");
	var action = "<say>" +text + "</say>";
	if (idAnimating || startShield) {
		queue.push([id, action,note]);
	}
	else {
		playTTS(id, action,note);
	}


}

function startShieldDown() {
	if (queue.length > 0) {
		var a = queue.shift();
		if (a[0]==null) {
		a[0]=C2;
	}
		playTTS(a[0], a[1], a[2]);
		onQueueLengthDecrease(queue.length);
	}
}

function playTTS(id, action,note) {
	if (id==null) return;
	idAnimating = id;
	console.log("playTTS("+id+", "+action+")");
	var char = chars[id];
  	var audio = document.getElementById("audio");
    audio.oncanplaythrough = function() {
        audio.pause();
        execute(id, action,note)
    }
    var audioURL = animateBase + "?character=" + char.character +
								 "&format=" + char.format +
								 "&voice=" + char.voice +
								 "&backimage="+avatarBKIMG+
								 "&action=" + encodeURIComponent(action) +
								 "&state=" + char.state +
								 "&audio=true";
    audio.src = audioURL;
    audio.play();
		/*added Lister to the audio play, if the audio play is ended
		and Youtube Video ID on server is got, play youtube video*/
		audio.addEventListener("ended", function(){
			AudioEND = true;
			console.log("################## Audio play end    --- >      " + AudioEND);
			if(AudioEND == true && typeof VideoxmlData != 'undefined'){
				player.cueVideoById(VideoxmlData["#text"], -1, -1, null);
				AudioEND = false;
				console.log("########## play the youtube video    ------->" + AudioEND);
			}

 		});
}

function printoutDialogHistory(id,Target,action){
	if ($(Target)==null){
		return;
	}

	var rex = /(<([^>]+)>)/ig;
	var captionText=action.replace(rex , "").trim();
	if (captionText!="")
	{
		var caption="<b>"+id+"</b>: "+captionText;
		displayConversation(Target,caption);
	}

}

function execute(id, action,note) {
	console.log("execute("+id+", "+action+")");
	var char = chars[id];

	savedURL = animateBase + "?character=" + char.character  +
							 "&format=" + char.format +
							 "&voice=" + char.voice +
							 "&backimage="+avatarBKIMG+
							 "&action=" + encodeURIComponent(action) +
							 "&state=" + char.state;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", savedURL, true);
    xhr.addEventListener("load", function() {
		char.data = JSON.parse(xhr.getResponseHeader("x-msi-animationdata"));
		++n;
		PIXI.loader.add("image"+n, savedURL).load(function() {
			char.texture = PIXI.loader.resources["image"+n].texture;
			// render the first frame and start animation loop
			char.frame = undefined;
			char.start = undefined;
			animate(0);
			// start audio
			if (savedURL.indexOf(encodeURIComponent("<say>")) > -1) {
				var audio = document.getElementById("audio");   // for use with playAudio
				audio.play();
				// Added to print out history
				printoutDialogHistory(id,"#Coversation",action);
				$("#ShowHistory").fadeIn();
				if (id==C1){
					$("#ShowHistoryC1").fadeIn();
					$("#ShowHistoryAll1").fadeIn();
					printoutDialogHistory(id,"#SpeechC1",action);
				}
				if (id==C2){
					$("#ShowHistoryC2").fadeIn();
					$("#ShowHistoryAll2").fadeIn();
					printoutDialogHistory(id,"#SpeechC2",action);
				}
				if (id==C3){
					$("#ShowHistoryC3").fadeIn();
					printoutDialogHistory(id,"#SpeechC3",action);
				}
				if (id==C4){
					$("#ShowHistoryC4").fadeIn();
					printoutDialogHistory(id,"#SpeechC4",action);
				}
				if (note!="")
				{
					var anObj={};
					anObj.id=id;
					var rex = /(<([^>]+)>)/ig;
					var captionText=action.replace(rex , "").trim();
					anObj.action=captionText;
					anObj.note=note;
					UpdateStatementsID(anObj);
				}
			}
		});
    }, false);
    xhr.send();
}

function animate(timestamp) {
//	console.log("render idAnimating id "+idAnimating);
	var char = chars[idAnimating];

	if (!char.start)
		char.start = timestamp;
	var progress = timestamp - char.start;

	// exit case (or not loaded)
	if (char.frame == -1 || !char.data)
	{
        animateComplete();
	}
	else
	{
		var frameNew = Math.floor(progress / 1000 * char.data.fps);
		if (frameNew == char.frame) {
			requestAnimationFrame(animate);
		}
		else
		{
			char.frame = frameNew;

			if (char.frame >= char.data.frames.length)
			{
				animateComplete();
			}
			else
			{
				// first arg is the image frame to show
				var recipe = char.data.recipes[char.data.frames[char.frame][0]];
				char.stage.removeChildren();
				for (var i = 0; i < recipe.length; i++) {
					var sprite = new PIXI.Sprite(new PIXI.Texture(char.texture, new PIXI.Rectangle(recipe[i][2]+(i==0?0:1), recipe[i][3]+(i==0?0:1), recipe[i][4]-(i==0?0:2), recipe[i][5]-(i==0?0:2))));
					sprite.x = recipe[i][0]+(i==0?0:1);
					sprite.y = recipe[i][1]+(i==0?0:1);
					char.stage.addChild(sprite);
				}

				// third arg is an extensible side-effect string that is triggered when a given frame is reached
				if (char.data.frames[char.frame][2])
					embeddedCommand(idAnimating, char.data.frames[char.frame][2]);
				// second arg is -1 if this is the last frame to show, or a recovery frame to go to if stopping early
				if (char.data.frames[char.frame][1] == -1)
					char.frame = -1;
				else if (char.stopping && char.data.frames[char.frame][1])
					char.frame = char.data.frames[char.frame][1];

				//Render the stage to see the animation
				char.renderer.render(char.stage);
				requestAnimationFrame(animate);
			}
		}
	}
}

function abort() {
	if (idAnimating) {
		var char = chars[idAnimating];
		char.stopping = true;
		var audio = document.getElementById("audio");
		audio.pause();
	}
}

function animateComplete() {
//	console.log("animateComplete() idAnimating was "+idAnimating);
	idAnimating = undefined;
	if (loaded < Object.keys(chars).length) {
		loaded++;
		if (loaded == Object.keys(chars).length) {
			for (id in chars) {
				var char = chars[id];
				// add renderer to div if not already there
				if (char.renderer.view.parent != char.holderDiv)
					char.holderDiv.appendChild(char.renderer.view);
			}
			onSceneLoaded();
		}
	}
	if (queue.length > 0) {
		var a = queue.shift();
		playTTS(a[0], a[1],a[2]);
		onQueueLengthDecrease(queue.length);
	}
}

function renderStartShield(divId, widthEmbed, heightEmbed)
{
	var div = document.getElementById(divId);
	div.style.display = "block";
	div.innerHTML = '<canvas id="'+divId+'StartShield" style="position:absolute; left:0px; top:0px;" width="'+widthEmbed+'px" height="'+heightEmbed+'px"/></canvas>';
	var e = document.getElementById(divId+"StartShield")
	if (e)
	{
		// Background
		var ctx = e.getContext('2d');
		ctx.fillStyle= "#000000";
		ctx.globalAlpha=0.5;
		ctx.fillRect(0,0,widthEmbed,heightEmbed);

		var x = widthEmbed/2;
		var y = heightEmbed/2;

		// Inner
		ctx.beginPath();
		ctx.arc(x, y , 25, 0 , 2*Math.PI, false);
		ctx.fillStyle = "#999999";
		ctx.globalAlpha = 0.5;
		ctx.fill();

		// Outer
		ctx.beginPath();
		ctx.arc(x, y , 27, 0 , 2*Math.PI, false);
		ctx.strokeStyle = "#cccccc";
		ctx.lineWidth = 5;
		ctx.globalAlpha = 1;
		ctx.stroke();

		// Triangle
		ctx.beginPath();
		x -= 12; y -= 15;
		ctx.moveTo(x, y);
		y += 30;
		ctx.lineTo(x, y);
		y -= 15; x += 30;
		ctx.lineTo(x, y);
		y -= 15; x -= 30;
		ctx.lineTo(x, y);
		ctx.fillStyle = "#cccccc";
		ctx.globalAlpha = 1;
		ctx.fill();
	}
}
function LoadChara(id,character,format,voice){
	var width;
	var height;
	if (id=="") return;

	if (format == "Head") {width = 250; height = 200;}
	else if (format == "Bust") {width = 375; height = 300;}
	else if (format == "Body") {width = 500; height = 400;}
	else if (format == "Cartoon") {width = 307; height = 397;}

	document.getElementById(id).style.width = width+"px";
	document.getElementById(id).style.height = height+"px";
	document.getElementById(id+"Renderer").style.width = width+"px";
	document.getElementById(id+"Renderer").style.height = height+"px";
	o[id] = {character:character, format:format, width:width, height:height, voice:voice};

}


function onLoad() {
	$("#getreadybtn").hide();
	$("#Start").fadeOut();
	loadLRS(lrsL);
	$('#audio').trigger("play");
	 $(document).ready(function(){
		if (qs("url","")==""){
		$('#innerframe').hide()
		}else{
		$('#innerframe').attr('src', qs("url",""));
		}
	  })
	if (qs("SR","0")!="0"){
			$("#RecordBtn").css("display", "block");
		}else{
			$("#RecordBtn").css("display", "none");
		}
	ConnectAndGetScriptsFromSKOServer();

}

var iPad = navigator.userAgent.match(/iPad/i);
var android = navigator.userAgent.match(/android/i);
var startShield = false; //iPad||android;  // OPTIONAL - use this if you want your character to start talking right away
if (startShield) renderStartShield("shield", width, height);
function onPlay() {
	var div = document.getElementById("shield");
	shield.style.display = "none";
	startShieldDown();
}

function onSceneLoaded() {
	// a chance to queue up some opening speech
}


function onQueueLengthDecrease(n) {
	// can be used to refill the queue
}

function addQuestion(Character){
	var Question='<div id="'+Character+'Question" style="display:none; width:100%"><textarea id="'+Character+'inputText" rows="1"  style="width:100%"></textarea><br/><input type="submit" id="'+Character+'_SubmitAnswer" value="Ask '+Character+'" align="right"/></div>';
	return Question;
	}

function loadCharas(){
	o={};
	var Avatars = document.getElementById("TopDiv");
	var s = '';
	if (C1.length>1){
		s += '<div id="'+C1+'" class="tl-agent"><div id="'+C1+'Renderer"></div>';
		if (ShowIndividualDialogHistor=="1") {
			s += '<input type="submit" id="ShowHistoryC1" value="+"/>';
			s += '<input type="submit" id="ShowHistoryAll1" value="++"/>';
		}
		if ((ShowIndividualChat=="1") && (Q1==1)){
			s += '<input type="submit" id="ShowQuestion1" value="?" style="display:none"/>';
			s += addQuestion(C1)
		}
		s +='</div>';

	}
	if (C2.length>1)	{
		s += '<div id="'+C2+'" class="tr-agent"><div id="'+C2+'Renderer"></div>';
		if (ShowIndividualDialogHistor=="1") {
			s += '<input type="submit" id="ShowHistoryC2" value="+"/>';
			s += '<input type="submit" id="ShowHistoryAll2" value="++"/>';
		}
		if ((ShowIndividualChat=="1") && (Q2==1)){
			s += '<input type="submit" id="ShowQuestion1" value="?" style="display:none"/>';
			s += addQuestion(C2)
		}
		s +='</div>';

	}
	if (C3.length>1)	{
		s += '<div id="'+C3+'" class="bl-agent">';
		if (ShowIndividualDialogHistor=="1"){
			s += '<input type="submit" id="ShowHistoryC3" value="+"/>';
		}
		s += '<div id="'+C3+'Renderer"></div>';
		if ((ShowIndividualChat=="1") && (Q3==1)){
			s += '<input type="submit" id="ShowQuestion3" value="?" style="display:none"/>';
			s += addQuestion(C3);
		}
		s += '</div>';

	}
	if (C4.length>1)	{

		s += '<div id="'+C4+'" class="br-agent">';
		if (ShowIndividualDialogHistor=="1"){
			s += '<input type="submit" id="ShowHistoryC4" value="+"/>';
		}
		s += '<div id="'+C4+'Renderer"></div>';
		if ((ShowIndividualChat=="1") && (Q4==1)){
			s += '<input type="submit" id="ShowQuestion4" value="?" style="display:none"/>';
			s += addQuestion(C4);
		}
		s += '</div>';
	}
	Avatars.innerHTML = s;
	if (C1.length>1)
	LoadChara(C1,C1,F1,V1);
	if (C2.length>1)
	LoadChara(C2,C2,F2,V2);
	if (C3.length>1)
	LoadChara(C3,C3,F3,V3);
	if (C4.length>1)
	LoadChara(C4,C4,F4,V4);
	msInit(o);


	 $("#ShowHistoryC1").click(function(){
			$("#SpeechC1").slideToggle();
		});
	 $("#ShowHistoryAll1").click(function(){
			$("#Coversation").slideToggle();
		});

    if (Q1=="1"){
		$("#ShowQuestion1").show();
	}

    if (Q2=="1"){
		$("#ShowQuestion2").show();
	}

	  if (Q3=="1"){
		$("#ShowQuestion3").show();
	}

    if (Q4=="1"){
		$("#ShowQuestion4").show();
	}
	 $("#ShowQuestion1").click(function(){
			$("#"+C1+"Question").slideToggle();
		});
	$("#ShowQuestion2").click(function(){
			$("#"+C2+"Question").slideToggle();
		});
	$("#ShowQuestion3").click(function(){
			$("#"+C3+"Question").slideToggle();
		});
	$("#ShowQuestion4").click(function(){
			$("#"+C4+"Question").slideToggle();
		});



	 $("#"+C1+"_SubmitAnswer").click(function(){
			rivescriptRespond(C1)
		});

	 $("#"+C2+"_SubmitAnswer").click(function(){
			rivescriptRespond(C2)
		});

	 $("#"+C3+"_SubmitAnswer").click(function(){
			rivescriptRespond(C3)
		});
	 $("#"+C4+"_SubmitAnswer").click(function(){
			rivescriptRespond(C4)
		});



	 $("#ShowHistoryC2").click(function(){
			$("#SpeechC2").slideToggle();
		});

	 $("#ShowHistoryAll2").click(function(){
			$("#Coversation").slideToggle();
		});


	 $("#ShowHistoryC3").click(function(){
			$("#SpeechC3").slideToggle();
		});

	 $("#ShowHistoryC4").click(function(){
			$("#SpeechC4").slideToggle();
		});


}

function ShowComponent(Comp,Show){
	if (Show=="1"){
		$(Comp).show()
	}else{
		$(Comp).hide()
	}
}

function embeddedCommand(id, cmd) {
	HandleCMD(id,cmd);
}

function rivescriptRespond(Character) {
	var InputField="#"+Character+"inputText";
	var InputText=$(InputField).val();

	var SpeechObj={};
	SpeechObj.id=Character;
	SpeechObj.text='You ansked me a question question : '+InputText+'<cmd QuestionC1="'+InputText+'"/>';
	dialogHistory.push(SpeechObj);
	var botid="";
	if (Character==C1){
		botid="a";
	}else if (Character==C2){
		botid="b";
	}if (Character==C3){
		botid="c";
	}else if (Character==C4){
		botid="d";
	}
	if (botid=="") return;
	respondRiveScript(UserStudent, InputText,botid, function(text) {
		var SpeechObj={};
		SpeechObj.id=Character;
		SpeechObj.text='I responded : '+text;
		dialogHistory.push(SpeechObj);

		var xAPIRecord={};
	    xAPIRecord.Question=InputText;
		xAPIRecord.Answer=text;
		xAPIRecord.AnsweredBy=Character;
		xAPIRecord.ChatEngine="RiveScript";
		UpdateStatementsAnswerFromChatScripts("QnA",xAPIRecord);

		$(InputField).val("");
		msSpeakQueued(Character, text+"<blink/>","");
	});
}
function chatscriptTest(Character) {
	var InputField="#"+Character+"inputText";
	var InputText=$(InputField).val();

	var SpeechObj={};
	SpeechObj.id=Character;
	SpeechObj.text='You ansked me a question question : '+InputText+'<cmd QuestionC1="'+InputText+'"/>';
	dialogHistory.push(SpeechObj);
	var botid="a";
	if (Character==C1){
		botid="a";
	}else{
		botid="b";
	}
	respondChatScript(UserStudent, InputText,botid, function(text) {
		var SpeechObj={};
		SpeechObj.id=Character;
		SpeechObj.text='I responded : '+text;
		dialogHistory.push(SpeechObj);

		var xAPIRecord={};
	    xAPIRecord.Question=InputText;
		xAPIRecord.Answer=text;
		xAPIRecord.AnsweredBy=Character;
		xAPIRecord.ChatEngine="RiveScript";
		UpdateStatementsAnswerFromChatScripts("QnA",xAPIRecord);

		$(InputField).val("");
		msSpeakQueued(Character, text+"<blink/>"),"";
	});
}

function respondRiveScript(userid, userText, botid, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", rivescriptBase + "?userid=" + encodeURIComponent(userid) + "&botid=" + botid + "&text=" + encodeURIComponent(userText), true);
    xhr.addEventListener("load", function() {
		fn(JSON.parse(xhr.response).text);
    }, false);
    xhr.send();
}

function respondChatScript(userid, userText, botid, fn) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chatscriptBase + "?userid=" + encodeURIComponent(userid) + "&botid=" + botid + "&text=" + encodeURIComponent(userText), true);
    xhr.addEventListener("load", function() {
		fn(JSON.parse(xhr.response).text);
    }, false);
    xhr.send();
}
