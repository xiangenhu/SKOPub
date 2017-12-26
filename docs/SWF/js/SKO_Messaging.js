RECEIVE_MESSAGE_URL_RESTRICTION = "*";  
POST_PARENT_URL_RESTRICTION = "*";          // Will be "http://www.aleks.com"
POST_CHILD_URL_RESTRICTION = "*";           // Will be "www.x-in-y.com"


// Create IE + others compatible message event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Receiving Messages
//-------------------------------
// Listen to message from child window
eventer(messageEvent,function(e) {
    if (RECEIVE_MESSAGE_URL_RESTRICTION === "*" || e.origin === RECEIVE_MESSAGE_URL_RESTRICTION) {
		try {
			data = JSON.parse(e.data);
		} catch (err){
			console.log("Invalid JSON data from: " + e.origin);
            console.log("Data was: " + e.data);
			return;
		}
        console.log("RECIEVED: " + data);
        logMessageReceived(data);
        if (data.type === "Done") {
            onDialogDone(data.guid);
        } else if (data.type === "Done Loading"){
			onSWFLoadDone(data.guid);
		}
    }
},false);

var onDialogDone = function(guid){
    console.log("Done with dialog");
    // Signals end of dialog to tutor controller
    STATE_MACHINE.onDialogDone(guid);
};

var onSWFLoadDone = function(guid){
    console.log("Done with SWF loading:" + guid);
    // Signals SWF agents active
    setTimeout(function(){STATE_MACHINE.onSWFLoaded(guid);}, 200);
};

var logMessageReceived = function(data){
    var keys = Object.keys(data);
    var dataStr = "Time = " + new Date() + "\n";
    dataStr += JSON.stringify(data) + "\n\n";
    /*
    dataStr += "{'CLASS_ID' : 'Message',\n 'TYPE': '" + data.type + "',\n";
    for (i=0; i<keys.length; i++){
        if (keys[i] != data.type) {
            dataStr += "'" + keys[i] + "' : '" + data[keys[i]] + "',\n";
        }
    }
    dataStr += "}\n"; */
    document.getElementById("logs").value += dataStr;
};

// Sending Messages
//-------------------------------
var CloseWindow = function () {
    $("#Avatar").attr('src', "about:blank");    // Fix for IE rendering issue
    parent.postMessage("Close", POST_PARENT_URL_RESTRICTION);
};
var OutputDialog = function (speech, text, agentNum) {
    var msg = JSON.stringify({'type' : 'agent_speech', 'text' : text, 'speech' : speech, 'agentNum' : agentNum});
    document.getElementById("Avatar").contentWindow.postMessage(msg, POST_CHILD_URL_RESTRICTION);
};
var SetDialogGUID = function (guid) {
    var msg = JSON.stringify({'type' : 'guid', 'guid' : guid});
    document.getElementById("Avatar").contentWindow.postMessage(msg, POST_CHILD_URL_RESTRICTION);
	console.log("SET GUID to: " + guid);
};
var SendStudentDialog = function (text) {
    // For sending student dialog during a tutoring session
    if (typeof text === 'undefined'){   
        text = document.getElementById("TutoringInput").value;
    }
    var msg = JSON.stringify({'type' : 'student_input', 'student_input' : text});
    document.getElementById("Avatar").contentWindow.postMessage(msg, POST_CHILD_URL_RESTRICTION);
};
var SendStudentQuestion = function(text) {
    // For sending a student question, which requires an AIML response
        if (typeof text === 'undefined'){   
        text = document.getElementById("TutoringInput").value;
    }
    var msg = JSON.stringify({'type' : 'student_question', 'student_input' : text});
    document.getElementById("Avatar").contentWindow.postMessage(msg, POST_CHILD_URL_RESTRICTION);
};