var SKOScriptsinJSON;
var ID;
var IDxmlData;
var AutoTutorScript;
var SKOConfig;
var Speakingobj;

var currentQuestion="";	
var currentHint="";	
function xmlToJson(xml) {
	// Create the return object
	var obj = {};
	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["currentAttributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["currentAttributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}else if (xml.nodeType == 4) { // cdata section
		obj = xml.nodeValue
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				var JSONStr=JSON.stringify(xmlToJson(item));
				obj[nodeName] = xmlToJson(item);
			}  else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item)); 
			}
		}
	}
	return obj;
};


function GetLRSInfor(jsonOfXml){
	loadLRS(lrsL);
	/* 
LRSURL=qs("lrs",jsonOfXml.SKOSCRIPTS.currentAttributes.LRSURL);
LRSLogin=qs("lrslogin",jsonOfXml.SKOSCRIPTS.currentAttributes.LRSAdmin);
LRSPassword=qs("lrspassword",jsonOfXml.SKOSCRIPTS.currentAttributes.LRSPassword); */
}


function getMediaBase(jsonOfXml){
	MediaBase=jsonOfXml.SKOSCRIPTS.SKOConfig.PageConfig.MediaBaseURL["#cdata-section"];
	var BackGround=jsonOfXml.SKOSCRIPTS.SKOConfig.PageConfig.BKIMG["#cdata-section"];
	bkg=qs("bkg",MediaBase+BackGround);
	$("body").css("background-image","url('"+bkg+"')"); 
	$("body").css("background-repeat","no-repeat"); 
	$("body").css("background-size","cover");
 }
 
 
function GetstringBetween(OrigStr,Str1,Str2){
	var starint1=OrigStr.indexOf(Str1)+Str1.length;
	var starint2=OrigStr.indexOf(Str2);
	return OrigStr.substr(starint1, starint2-starint1);
}	

function GetCharacter(id,str){
//	if (str=="") return ;
	var ConfigArray=str.split("&");
	if ((ConfigArray.length<2)||(str=="")) {
		if (id==1){
			C1=qs("C1","Steve");
		}else if (id==2){
			C2=qs("C2","Kate");
		} else if (id==3){
			C3=qs("C3","Angela");
		} else if (id==4){
			C4=qs("C4","Carl");
		}
		return ;
	}
	if (id==1){
		C1=qs("C1",ConfigArray[0].split("=")[1]);
		F1=qs("F1",ConfigArray[1].split("=")[1]);		
		V1=qs("V1",ConfigArray[2].split("=")[1]);	
	}else if (id==2){
		C2=qs("C2",ConfigArray[0].split("=")[1]);
		F2=qs("F2",ConfigArray[1].split("=")[1]);		
		V2=qs("V2",ConfigArray[2].split("=")[1]);	
	} else if (id==3){
		C3=qs("C3",ConfigArray[0].split("=")[1]);
		F3=qs("F3",ConfigArray[1].split("=")[1]);		
		V3=qs("V3",ConfigArray[2].split("=")[1]);	
	} else if (id==4){
		C4=qs("C4",ConfigArray[0].split("=")[1]);
		F4=qs("F4",ConfigArray[1].split("=")[1]);		
		V4=qs("V4",ConfigArray[2].split("=")[1]);	
	}
	
}
 
function getAvatars(jsonOfXml){
	var itemAgent = jsonOfXml.SKOSCRIPTS.SKOConfig.PageConfig.AVATAR.currentAttributes;
	var Teacher=itemAgent.Teacher;
	var Student1=itemAgent.Student1;
	var Student2=itemAgent.Student2;
	var Student3=itemAgent.Student3;
	
	GetCharacter(1,Teacher);
	GetCharacter(2,Student1);
	GetCharacter(3,Student2);
	GetCharacter(4,Student3);
	
} 
var SpeechArray1=[];
var SpeechArray2=[];
var SpeechArray3=[];

function AddOneSpeech(aitem){
	
	var itemAgent = aitem.PageConfig.AVATAR.currentAttributes;
	var itemAct = aitem.PageConfig;
	var aTITLE=aitem.TITLE["#text"];
	var OtherActions="";
	var Speakingobj = {
			Agent: "",
			Data: "",
			TITLE:""
		}
	Speakingobj.TITLE=aTITLE;
	if (itemAct.mediaTypeXML!=null)
	{			
		if (itemAct.mediaTypeXML["#text"] == "ImageOnly") {
			OtherActions='<cmd img="'+aitem.PageConfig.MediaURLXML["#text"]+'"/>'
		}
		if (itemAct.mediaTypeXML["#text"] == "MovieOnly") {
			OtherActions='<cmd mv="'+aitem.PageConfig.MediaURLXML["#text"]+'"/>'
		}
		if (itemAct.mediaTypeXML["#text"] == "YouTubeOnly") {
			OtherActions='<cmd yt="'+aitem.PageConfig.MediaURLXML["#text"]+'"/>'
		}
	}
	if (itemAgent.useTeacher == "true") {
		Speakingobj.Agent = C1;
	} else if (itemAgent.useStudent1=="true") {
		Speakingobj.Agent = C2;
	} else if (itemAgent.useStudent2=="true") {
		Speakingobj.Agent = C3;
	} else if (itemAgent.useStudent3=="true") {
		Speakingobj.Agent = C4;
	}
	
	var speakStr=aitem.mattextS["#cdata-section"];
	if ((speakStr!="") && (Speakingobj.Agent!="")){
		Speakingobj.Data = OtherActions+ReplaceTest(Speakingobj.Agent,speakStr);
	
		var userActionAfter="<pause/>";
		var userActionBefore="<pause/>";
		
		if (aitem.CurrentAgent==C2){
			userActionAfter=userActionAfter+'<lookuser/><blink/>';				
			userActionBefore=userActionBefore+"<blink/>";
		}else{
			userActionAfter=userActionAfter+'<lookuser/><blink/>';				
			userActionBefore=userActionBefore+"<blink/>";
		}
		SpeechArray1.push(Speakingobj.Agent);
		SpeechArray2.push(userActionBefore+Speakingobj.Data+userActionAfter);
		SpeechArray3.push(aTITLE);
	}
}


function IDDialog(jsonOfXml) {
	var item = jsonOfXml.SKOSCRIPTS.ID.ITEM;
	SpeechArray1=[];
	SpeechArray2=[];
	SpeechArray3=[];
	var transision="";
	if (jsonOfXml.SKOSCRIPTS.AutoTutorScript!=null){
		transision='<cmd NEXT="ASATPageIMG"/>';
	}else{
		transision='<cmd NEXT="END"/>';
	}
	if (item.length==null){
	AddOneSpeech(item);
	}else {
		for(var i=0; i<item.length; i++) {
			AddOneSpeech(item[i]);
		}
	}
	for (i=0; i<SpeechArray1.length;i++){
		if (i==(SpeechArray1.length-1)){
			msSpeakQueued(SpeechArray1[i],SpeechArray2[i]+transision,SpeechArray3[i]);
		}else msSpeakQueued(SpeechArray1[i],SpeechArray2[i],SpeechArray3[i]);
	}
//	msSpeakQueued(C1,transision,"End_Of_Speech");

}


function ReplaceComputerStr(Text){
	var Res=Text;
	Res=Res.replace("ComputerTutor", "<b> "+C1+" </b>");
	Res=Res.replace("ComputerStudent1", "<b> "+C2+" </b>");
	Res=Res.replace("ComputerStudent2", "<b> "+C3+" </b>");
	Res=Res.replace("ComputerStudent3", "<b> "+C4+" </b>");
	Res=Res.replace("ComputerStudent", "<b> "+C2+" </b>");
	Res=Res.replace("_student_", C2);
	Res=Res.replace("_NAMES1_", C2);
	Res=Res.replace("_NAMES2_", C3);
	Res=Res.replace("_NAMES3_", C4);
	Res=Res.replace("_NAMET_", C1);
	return Res;
}

function ReplaceTest(MoveID,Text){
	var Res=Text;
	try {
			Res=Res.replace("_student_", C2);
			Res=Res.replace("_NAMES1_", C2);
			Res=Res.replace("_NAMES2_", C3);
			Res=Res.replace("_NAMES3_", C4);
			Res=Res.replace("_NAMET_", C1);
			Res=Res.replace("_SELF_", MoveID);
		}
		catch(err) {
		}
	return Res;
}



function GetASATPagePnQ(jsonOfXml){
	var ASDATPage=jsonOfXml.SKOSCRIPTS.AutoTutorScript.ASATPageConfigration;
	if (ASDATPage==null)
	{
		StartTutoring("ASAT",jsonOfXml);
		return;
	}
	pageImage = ASDATPage.ASATPageImage;
	displayInformation("#DebuggingArea",JSON.stringify(pageImage));
	if(pageImage==null){
		StartTutoring("ASAT",jsonOfXml);
		return;
	}
	if (pageImage.ASATPageImgHotSpots==null)
	{
		StartTutoring("ASAT",jsonOfXml);
		return;
	}
	if (pageImage.ASATPageImgFile==null)
	{
		StartTutoring("ASAT",jsonOfXml);
		return;
	}
	var mediaIndex = 0;
	var objStar = {
			Agent: "System",
			Act: "ShowMedia",
			Data: pageImage.ASATPageImgFile["#text"],
		}
	var MapInform=[];
	mediaIndex++;
	for(var i=0; i<pageImage.ASATPageImgHotSpots.length; i++) {
		var objLoc = {
			Agent: "System",
			Act: "SPOTS",
			X1:pageImage.ASATPageImgHotSpots[i].ASATPageImgHotSpotX1["#text"],
			Y1:pageImage.ASATPageImgHotSpots[i].ASATPageImgHotSpotY1["#text"],
			X2:pageImage.ASATPageImgHotSpots[i].ASATPageImgHotSpotX2["#text"],
			Y2:pageImage.ASATPageImgHotSpots[i].ASATPageImgHotSpotY2["#text"],
			
		}
		var Questions = [];
		var QuestionPage = pageImage.ASATPageImgHotSpots[i].ASATPageImgListOfQuestions;
		
		for (var j=0; j<QuestionPage.ASATPageImgListOfQuestion.length; j++){
			var AnAnswer=QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotAnswer["#cdata-section"];
		    var NewAnAnswer=AnAnswer.replace(/[\r\n]/g, '');
			var Items={
				Title:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotQuestionName["#text"],
				Quest:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotQuestion["#text"],
				QuestForm:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotQuestionForm["#text"],
				QuestBy:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotQuestionBy["#text"],
				Answer:NewAnAnswer,
				AnswerForm:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotAnswerForm["#text"],
				AnswerBy:QuestionPage.ASATPageImgListOfQuestion[j].ASATPageImgHotSpotAnswerBy["#text"],
			}
			Questions.push(Items);
		}
		objLoc.Questions=Questions;
		MapInform.push(objLoc);
		mediaIndex++;
	}
	objStar.MapInfor=MapInform;  
	IMGgexmlData.push(objStar);
	displayMedia("#MediaContainer",MediaBase,objStar.Data);
	Status="ASAT";
	POSTtoACE("POST");
}
function GetSKOTitle(jsonOfXml){	
	var Title=jsonOfXml.SKOSCRIPTS.SKOConfig.TITLE["#cdata-section"];
	return Title;
}



function QueryStringToJSON() {            
	var pairs = window.location.href.split('?')[1].split('&');
	
	var result = {};
	pairs.forEach(function(pair) {
		pair = pair.split('=');
		result[pair[0]] = decodeURIComponent(pair[1] || '');
	});
	result.SKOTitle=SKOTitle;
	result.timeStart=timeStart;
	var timeNow=new Date();
	result.timeNow=timeNow;
	result.timeTaken=timeNow.getTime()-timeStart.getTime();
	return JSON.parse(JSON.stringify(result));
}

function GetLoMEducational(jsonOfXml){	
	var Educational=jsonOfXml.SKOSCRIPTS.ScriptsLOM.lom.educational;
	return Educational;
}

function StartTutoring(MODE,jsonOfXml){
		displayDebugging("#DebuggingArea","Debugging: Starting "+MODE);
		$('#myBar').fadeOut();
		$('#ASATQuestion').fadeOut();
		$('#InputArea').fadeOut();		
		if (parseInt(xAPI)>0){
			LOMString=GetLoMEducational(jsonOfXml);	
			detectingJsonArray(LOMString);
		}
		SKOTitle=GetSKOTitle(jsonOfXml);	
		
		if (MODE=="ID"){
				Status="ID";
				IDDialog(jsonOfXml);
		} 
		if (MODE=="ASATPageVideo"){
				Status="ASATPageVideo";
				GetASATPageVideo(jsonOfXml);
		}
		if (MODE=="ASATPageIMG"){
				Status="ASATPageIMG";
				GetASATPagePnQ(jsonOfXml);
		}
		if (MODE=="ASAT"){
				Status="ASAT";
				POSTtoACE("POST");	
		} 
}


function AvatarsAction(data){	
		actionLength=data.ACEActions.length;
		var i;
		var ActionList=[];
		var InputCMD1="";
		var InputCMD2="";
		var InputCMD3="";
		for (i=0;i<actionLength;i++){
			var action=data.ACEActions[i];		
			if ((action.Act=="Speak")||(action.Act=="WaitForInput")||(action.Act=="ShowMedia")){
				if (action.Act=="WaitForInput")	{
					if (currentHint!="") {
					//	InputCMD1='<cmd currentHint="'+encodeURIComponent(currentHint)+'"/>';
						InputCMD1='<cmd currentHint="1"/>';
						ActiveQuestion=currentHint;
						currentHint="";
					};
					if (currentQuestion!="") {
					//	InputCMD2='<cmd currentQuestion="'+encodeURIComponent(currentQuestion)+'"/>';
						InputCMD2='<cmd currentQuestion="1"/>'
						ActiveQuestion=currentQuestion;
						currentQuestion="";
					};
				} 
				if (action.Act=="ShowMedia"){
					InputCMD3='<cmd img="'+action.Data+'"/>';
				}
				if (action.Agent == "ComputerTutor") {
						action.CurrentAgent = C1;
					}
				if (action.Agent == "ComputerStudent") {
						action.CurrentAgent = C2;
					} 
				if (action.Agent == "ComputerStudent1") {
						action.CurrentAgent = C2;
					} 
				if (action.Agent == "ComputerStudent2") {
						action.CurrentAgent = C3;
					} 
				if (action.Agent == "ComputerStudent3") {
						action.CurrentAgent = C4;
					} 
				if (action.Act=="Speak"){
					var adata=action.Data+" "+InputCMD3;
					action.Data=ReplaceTest(action.CurrentAgent,adata);
					ActionList.push(action);
				}
				}
			}	
		if (InputCMD2+InputCMD1!=""){
			ActionList[ActionList.length-1].Data=ActionList[ActionList.length-1].Data+InputCMD2+InputCMD1;
		}else {
			ActionList[ActionList.length-1].Data=ActionList[ActionList.length-1].Data+'<cmd Replay="1"/>';
		}
//		alert(ActionList[ActionList.length-1].Data);
		
		if (ActionList.length==1){
			displayInformation("#DebuggingArea","ActionList ===> "+JSON.stringify(ActionList[0]));
			msSpeakQueued(ActionList[0].CurrentAgent,ActionList[0].Data,"");
			return;
		} 
		
		
		for (i=0;i<ActionList.length;i++){
			var userActionAfter="<pause/>";
			var userActionBefore="<pause/>";
			if (ActionList[i].CurrentAgent==C2){
				userActionAfter=userActionAfter+"<lookuser/><blink/>";				
			    userActionBefore=userActionBefore+"<blink/>";
			}else{
				userActionAfter=userActionAfter+"<lookuser/><blink/>";				
			    userActionBefore=userActionBefore+"<blink/>";
			}
			msSpeakQueued(ActionList[i].CurrentAgent,userActionBefore+ActionList[i].Data+userActionAfter,"");
		}
}



function SpeakRandom(){
	var randomSpeach=[];
	randomSpeach.push(UserStudent+", Please answer the questions.<bigsmile/>");
	randomSpeach.push(UserStudent+", You need to answer, thanks! <bigsmile/>");
	randomSpeach.push(UserStudent+", I expecting your answers. <bigsmile/>");
	randomSpeach.push(UserStudent+", I expecting your answers. <bigsmile/>");
	randomSpeach.push(UserStudent+", Without Answering this question, We do not know how to help you.<bigsmile/>");
	randomSpeach.push(UserStudent+", Don't worry about wrong answers. Go ahead and tell me any part of the answer you think you might know..<bigsmile/>");
	randomSpeach.push(UserStudent+", This can be tricky, but any answer will give us a starting point to build on. <bigsmile/>");
	randomSpeach.push(UserStudent+", Go ahead and take a guess. We can work from there. <bigsmile/>");
	randomSpeach.push(UserStudent+", Don't be afraid to make a mistake. Take a guess. <bigsmile/>");
	randomSpeach.push(UserStudent+", I am here to help. Please try to answer to we can work through this question together.<bigsmile/>");
	randomSpeach.push(UserStudent+", Don’t feel like you have to know the answer perfectly right away. We can work through whatever answer you give. <bigsmile/>");
	randomSpeach.push(UserStudent+", There are no wrong answers, just different starting points for our discussion. Go ahead and write any part of the answer you think you might know. <bigsmile/>");
	var intg=Math.floor(Math.random() * randomSpeach.length);
	var speakerIndex=Math.floor(Math.random() * 2);
	if (speakerIndex==1) {
		msSpeakQueued(C1,randomSpeach[intg],"")
	}else{
		msSpeakQueued(C2,randomSpeach[intg],"")
	}
}


function matchNonSense(input){
	var matchingString=[];
	matchingString.push(RegExp("n[o’]t\s+sur\w*"));
	matchingString.push(RegExp("no\s+idea"));
	matchingString.push(RegExp("c\w*n’?t\s+say"));
	matchingString.push(RegExp("i’?m\s+lost"));
	matchingString.push(RegExp("don’?t\s+k?now?"));
	matchingString.push(RegExp("wh?at\?"));
	matchingString.push(RegExp("need\s+.?.?.?.?.?.?.?\s+hint?"));
	matchingString.push(RegExp("get\s+.?.?.?.?.?.?.?.?\s+hint?"));
	var i;
	for (i=0; i<matchingString.length;i++){
		if (input.match(matchingString[i]))	{
	//		alert(matchingString[i]);
			return true;
		}
	}
	return false;
}

$(document).ready(function () {
		if (DEBUGGING=="2"){
			$("#utilityBar").show();
			$("#Debugging").click(
				function (event) {
				$("#DebuggingArea").slideToggle();	
			})
		}
		 $("#ShowHistory").click(function(){
				$("#Coversation").slideToggle();
			});
})



$(document).ready(function () {
	$('input#SubmitAnswer').click(
	function (event) {
		var Input=$('textarea#inputText').val();
		if (Input.trim()==""){
			SpeakRandom();
			return
		}
				
	/* 	if (matchNonSense(Input.trim())==true){
			SpeakRandom();
			$('textarea#inputText').val("");
			return
		} */
		Status="ASAT";
		$('textarea#inputText').val("");
		event.preventDefault();
		$("#InputArea").fadeOut();
		$('#ASATQuestion').fadeOut();
		PuttoACE(Input);
		});
})

function detectKey(Key,Action){
	var j;
	for (j=0;j<Action.length;j++){
		if (Action[j].Act==Key)	{
			return true;
		}
	}
	return false;
}

function GetMainQuestion(data){
	Closing=false;
	var i,j;
	currentQuestion="";
	currentHint="";	
	var speechdata="";
	var TransitionsLength=data.Log.Transitions.length;
	for (i = 0; i < TransitionsLength; i++) {
		var currentTransaction=data.Log.Transitions[i];
		var ActionLength=currentTransaction.Actions.length;
		var AnStateID=currentTransaction.StateID;
		if(AnStateID=="MainQuestion"){
			for (j = 0; j < ActionLength; j++) {
				if(currentTransaction.Actions[j].Act=="Speak"){
					currentQuestion=currentTransaction.Actions[j].Data;
					questionsAsked=currentQuestion;
				}
			}
		}else if (AnStateID=="Closing"){
			Closing=true;
			for (j = 0; j < ActionLength; j++) {
				if(currentTransaction.Act=="Speak"){
					currentHint=currentTransaction.Actions[j].Data;						
					questionsAsked=currentHint;
				}
			}
		}else {
			for (j = 0; j < ActionLength; j++) {
				if(currentTransaction.Actions[j].Act=="Speak"){
					speechdata=currentTransaction.Actions[j].Data;
				}
			}
		}	
		
		/* if (detectKey("WaitForInput",currentTransaction.Actions)==true){
			displayInformation("#DebuggingArea","ActionLength "+ActionLength.toString());
			currentHint=speechdata;
			questionsAsked=currentHint;
		} */
		 
		if (currentTransaction.Actions[ActionLength-1].Act=="WaitForInput"){
			currentHint=speechdata;
			questionsAsked=currentHint;
		} 
	}
}


function processingReturn(data){
	displayInformation("#DebuggingArea",JSON.stringify(data));
	GetMainQuestion(data);
	AvatarsAction(data);
	UpdateStatementsASAT(data,xAPIType); //xAPI LRS
}


function ComposeSKOLink(SType){
	    if (SType=="GAE")
     	{
			var SKO ={
				guid:SKOGuid,
				TagName:"AutoTutorScript",
				source:"ScriptOnly",
				authorname:"xiangenhu",
				return:"scriptContent"
			}
		    var school,text;
			school=SKOSchool;
			text= school+"/retrieve?json="+JSON.stringify(SKO);
			return text;
		}
		if (SType=="NONGAE")
     	{
			var SKO ={
				guid:SKOGuid,
				return:"scriptContent"
			}
		    var school,text;
			school=SKOSchool;
			text= school+"/retrieve?json="+JSON.stringify(SKO);
			return text;
		}
}
var ScriptURL=ComposeSKOLink("GAE");
var UserEmail=qs("user","xhu@memphis.edu");
var iputObj={
			Id:UserEmail,
			ScriptURL:ScriptURL,
			User:UserStudent,
			language:language.toLowerCase(),
			LSASpaceName:LSASpaceName,
			ProjectName:ProjectName,
			UseDB:UseDB,
			Text:""
		};
var ChineseVoice=["Linlin","Lisheng","Lily","Hui","Liang","Qiang","Yafrang","Kaho","Kayan"];	
	
function SetLanguage(Voice){
	if (ChineseVoice.indexOf(Voice)>0){
		iputObj.language="chinese";
		iputObj.LSASpaceName="Chinese_General";
	}
	displayInformation("#DebuggingArea","Set LSA Language: "+JSON.stringify(iputObj));
}	
		
function POSTtoACE(Method){
	SetLanguage(V1);
	iputObj.Text=IntitalText;
	var getUrl = $.ajax({
		type: Method,
		url: aceurl,
		data: iputObj,
			success: function() {
				PuttoACE(IntitalText);
			}
		})
}


function PuttoACE(Inputtext){
	SetLanguage(V1);
	iputObj.Text=Inputtext;
	if (Inputtext!=IntitalText)
	{
		if (InReplay==false)
		{
			var SpeechObj={};
			SpeechObj.id=C1;
			SpeechObj.text='Your input is: '+Inputtext+' <cmd Sinput="'+Inputtext+'"/>';
			dialogHistory.push(SpeechObj);
			var SpeechObj2={};
			SpeechObj2.id=C1;
			SpeechObj2.text='I processed your input and continue.<cmd replay="1"/>';
			dialogHistory.push(SpeechObj2);
			
		}
		var caption="<b>Me: </b>"+Inputtext;
		displayConversation("#Coversation",caption);
	}
	var getUrl = $.ajax({
		type: "PUT",
		url: aceurl,
		data: iputObj,
		success: function (data) {
			var userData=data;
			processingReturn(userData);
		}
	})
}




function ConnectAndGetScriptsFromSKOServer() {
	RetriveSKOObj.TagName="SKOSCRIPTS";
	var url  = SKOSchool+"/retrieve?json="+JSON.stringify(RetriveSKOObj); 
	var IDRetrive  = new XMLHttpRequest();
	IDRetrive.overrideMimeType('text/xml; charset=utf-8');
	IDRetrive.open('GET', url, true);
	IDRetrive.onload = function () {
		var ScriptsRetrivedToXML="<?xml version='1.0' encoding='utf-8'?> \n" + IDRetrive.responseText;
		SKOScriptsinJSON = xmlToJson($.parseXML(ScriptsRetrivedToXML));
		// Get basic components
		
		ID=SKOScriptsinJSON.SKOSCRIPTS.ID;
        AutoTutorScript=SKOScriptsinJSON.SKOSCRIPTS.AutoTutorScript;
		SKOConfig=SKOScriptsinJSON.SKOSCRIPTS.SKOConfig;	
		
		// Get basic components	
		
		GetLRSInfor(SKOScriptsinJSON)
			
		getMediaBase(SKOScriptsinJSON);
	
		getAvatars(SKOScriptsinJSON);
		loadCharas();
		StartTutoring(STARTING,SKOScriptsinJSON);
		return
	}
	IDRetrive.send(null);
}