// Constants
// -------------------------------------
var AUTO_TUTOR_LITE_SWF_NAME = 'ATL';
var TUTOR_NAME = 'Tutor',
	STUDENT1_NAME = 'Student1',
	STUDENT2_NAME = 'Student2',
	STUDENT3_NAME = 'Student3';

// JS Message Data Keys
var MSG_OUT_KEY = 'type';
var GUID_KEY = 'guid';

// JS Message Types
var DIALOG_DONE_MSG = 'Done';
var SWF_LOAD_DONE_MSG = 'Done Loading';

// Flash Message Data Keys
var FLASH_MSG_KEY = "msg";
var FLASH_ORIGINAL_GUID_KEY = "OriginalGUID";
var FLASH_CURRENT_GUID_KEY = "CurrentGUID";
var FLASH_NEXT_GUID_KEY = "";
var FLASH_CURRENT_DATE_KEY = "date";

// Flash Message Types
var FLASH_ID_DIALOG_DONE_MSG = "End of Scenes";
var FLASH_TUTOR_DIALOG_DONE_MSG = "Tutoring done";
var FLASH_TUTOR_LCC_DONE_MSG = "LCC Done";
var FLASH_SWF_LOAD_DONE_MSG = SWF_LOAD_DONE_MSG;

// MESSAGING!
//-------------------------------   
var RECEIVE_MESSAGE_URL_RESTRICTION = "*";      // Will be "www.x-in-y.com"
var POST_PARENT_URL_RESTRICTION = "*";          // Will be "www.x-in-y.com"
var POST_CHILD_URL_RESTRICTION = "*";           // Will be "www.x-in-y.com"

// Create IE + others compatible message event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Receiving Messages
//-------------------------------
// Listen to message from child window
var resolveMessageEvent = function resolveMessageEvent(e){
	var data, guid, input, speech, text, agentName;
    if (RECEIVE_MESSAGE_URL_RESTRICTION === "*" || e.origin === RECEIVE_MESSAGE_URL_RESTRICTION) {
		try {
			data = JSON.parse(e.data);
		} catch (err){
			console.log("Invalid JSON data from: " + e.origin);
            console.log("Data was: " + e.data);
			return;
		}
        if (data.type === 'guid'){
            guid = data.guid;
            setSKOByGUID(guid);
        } else if (data.type === 'student_input'){
            input = data.student_input;
            submitTutoringInput(input);
		} else if (data.type === 'student_question'){
            input = data.student_input;
            agentRespond(TUTOR_NAME, input);
        } else if (data.type === 'agent_speech'){
            speech = data.speech;
            text = data.text;
            agentName = data.agentNum;
            agentSpeech(agentName, text, speech);
        }
    }
};
eventer(messageEvent, resolveMessageEvent, false);

// Post Messages
//-------------------------------
// Send message from child window
var makeJSMessage = function (type, guid){
    var gKey = GUID_KEY;
    var mKey = MSG_OUT_KEY;
    var msg = {};
    msg[mKey] = type;
    msg[gKey] = guid;
    console.log("MADE MESSAGE");
    return JSON.stringify(msg);
};
var DialogComplete = function (guid) {
    console.log("ATL Msg: Dialog Done");
    parent.postMessage(makeJSMessage(DIALOG_DONE_MSG, guid), POST_PARENT_URL_RESTRICTION);
};
var SWFLoadComplete = function (guid) {
    console.log("ATL Msg: SWF Load Done");
	parent.postMessage(makeJSMessage(SWF_LOAD_DONE_MSG, guid), POST_PARENT_URL_RESTRICTION);
};

//  General JS Utilities
//-------------------------------
var trimString = function (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

var isDialogDoneFlashMSG = function(str) {
    if (str === FLASH_TUTOR_DIALOG_DONE_MSG){
        return true;
    } else if (str === FLASH_ID_DIALOG_DONE_MSG){
        return true;
    } else if (str === FLASH_TUTOR_LCC_DONE_MSG){
        return true;
    } else {
        return false;
    }
};
var javascriptListener = function (str) {
    console.log("JS Listener Heard: " + str);
    var guid, flashMsgType;
    try {
		data = JSON.parse(str);
	} catch (err){
        console.log("Invalid JSON data from: Flash SWF");
        console.log("Data was: " + data);
		return;
	}
    flashMsgType = trimString(data[FLASH_MSG_KEY]);
    console.log(data[FLASH_MSG_KEY] + ": Done Dialog=" + 
                (isDialogDoneFlashMSG(flashMsgType)) + ", DoneLoad=" +
                (flashMsgType  === FLASH_SWF_LOAD_DONE_MSG));
	if (isDialogDoneFlashMSG(flashMsgType)){
        guid = data[FLASH_CURRENT_GUID_KEY];
		DialogComplete(guid);
	} else if (flashMsgType  === FLASH_SWF_LOAD_DONE_MSG){
        guid = data[FLASH_CURRENT_GUID_KEY];
		SWFLoadComplete(guid);
	}
     return "successful";
};
 
var getATLInstance = function (){
    return document.getElementById(AUTO_TUTOR_LITE_SWF_NAME);
};

//  Dialog and Scene Control
//-------------------------------
var setSKOByGUID = function (guid) {
    var ATLInstance = getATLInstance();
    ATLInstance.MoveToSKO(guid);
};

var goToSKONextStep = function () {
    var ATLInstance = getATLInstance();
    ATLInstance.NextStep("Hello World");
};

//  User Input
//-------------------------------
var submitTutoringInput = function(input) { // Not sure if working
    var ATLInstance = getATLInstance();
    try {
        ATLInstance.TutoringControl(input);
    } catch(err) {
        console.log("STUDENT FAILED TO SAY: "+input);
    }
};

var submitLCCInput = function (input) {		// Not working
    var ATLInstance = getATLInstance();
    ATLInstance.controlLCC(input);
};

// Agent Speech and Display: Not working
var agentSpeech = function (agentName, words, speech){
	var ATLInstance = getATLInstance();
    if (agentName == TUTOR_NAME){
		ATLInstance.TeacherSay(words);
	} else if (agentName == STUDENT1_NAME){
		ATLInstance.Student1Say(words);
	} else if (agentName == STUDENT2_NAME){
		ATLInstance.Student2Say(words);
	} else if (agentName == STUDENT3_NAME){
		ATLInstance.Student3Say(words);
	} else {
		throw new Error("ERROR: Agent with name <" + agentName + "> not found");
	}
};

var agentRespond = function (agentName, words) {
	var ATLInstance = getATLInstance();
    if (agentName == TUTOR_NAME){
		ATLInstance.TeacherRespond(words);
	} else if (agentName == STUDENT1_NAME){
		ATLInstance.Student1Respond(words);
	} else if (agentName == STUDENT2_NAME){
		ATLInstance.Student2Respond(words);
	} else if (agentName == STUDENT3_NAME){
		ATLInstance.Student3Respond(words);
	} else {
		throw new Error("ERROR: Agent with name <" + agentName + "> not found");
	}
};

var agentDisplay = function (agentName, isHidden) {
    var showMsg = null;
    var ATLInstance = getATLInstance();
    if (isHidden){
        showMsg = "hide";
    } else {
        showMsg = "show";
    }
    if (agentName == TUTOR_NAME){
		ATLInstance.ShowHideTeacher(showMsg);
	} else if (agentName == STUDENT1_NAME){
		ATLInstance.ShowHideStudent1(showMsg);
	} else if (agentName == STUDENT2_NAME){
		ATLInstance.ShowHideStudent2(showMsg);
	} else if (agentName == STUDENT3_NAME){
		ATLInstance.ShowHideStudent3(showMsg);
	} else {
		throw new Error("ERROR: Agent with name <" + agentName + "> not found");
	}
};
