// MyxAPI Wrapper
var wrapper;
ADL.launch(function(err, launchdata, xAPIWrapper) {
	loadLRS(lrsL);
	if (!err) {
		wrapper = ADL.XAPIWrapper = xAPIWrapper;
		console.log("--- content launched via xAPI Launch ---\n", wrapper.lrs, "\n", launchdata);
	} else {
		wrapper = ADL.XAPIWrapper;
		wrapper.changeConfig({
				endpoint: LRSURL,
				user: LRSLogin,
				password:LRSPassword
			})
		console.log("--- content statically configured ---\n", wrapper.lrs);
	}
}, true);


function MyExtObj(ParentObjInfor,GroupObjInfo,CategoryInfo,OtherObjInfor){
	var Obj={};
	if(!OtherObjInfor){
		OtherObjInfor = {};
	}

	var ParentObjInforStr={"https://umiis.github.io/ITSProfile/Extensions/parent":ParentObjInfor};

	var GroupObjInfoString={"https://umiis.github.io/ITSProfile/Extensions/grouping":GroupObjInfo};

	var CategoryInfoString={"https://umiis.github.io/ITSProfile/Extensions/category":CategoryInfo};

	var OtherObjInforString={"https://umiis.github.io/ITSProfile/Extensions/other":OtherObjInfor};

	var contextActivitiesObj={};
	var ParentObj={};
	ParentObj.objectType="Activity";
	ParentObj.id="https://umiis.github.io/ITSProfile/Extensions/parent";
	ParentObj.definition={};
	ParentObj.definition.extensions=ParentObjInforStr;
	contextActivitiesObj.parent=[ParentObj];
	Obj.extensions = {"http://autotutor&46;x-in-y&46;com/AT" : ParentObjInfor};

	var GroupingObj={};
	GroupingObj.objectType="Activity";
	GroupingObj.id="https://umiis.github.io/ITSProfile/Extensions/grouping";
	GroupingObj.definition={};
	GroupingObj.definition.extensions=GroupObjInfoString;
	contextActivitiesObj.grouping=[GroupingObj];

	var categoryObj={};
	categoryObj.objectType="Activity";
	categoryObj.id="https://umiis.github.io/ITSProfile/Extensions/category";
	categoryObj.definition={};
	categoryObj.definition.extensions=CategoryInfoString;
	contextActivitiesObj.category=[categoryObj];

	var otherObj={};
	otherObj.objectType="Activity";
	otherObj.id="https://umiis.github.io/ITSProfile/Extensions/other";
	otherObj.definition={};
	otherObj.definition.extensions=OtherObjInforString;
	contextActivitiesObj.other=[otherObj];



//	contextActivitiesObj.grouping=[{"objectType":"Activity","id":"https://umiis.github.io/ITSProfile/grouping"}];
//	contextActivitiesObj.category=[{"objectType":"Activity","id":"https://umiis.github.io/ITSProfile/category"}];
//	contextActivitiesObj.other=[{"objectType":"Activity","id":"https://umiis.github.io/ITSProfile/other"}];

//	Obj.extensions=extObj;
	Obj.contextActivities=contextActivitiesObj;
	return Obj;
}

function DoSearch(Statement){
	try{
		var search = ADL.XAPIWrapper.searchParams();
		var SeachObj={};
		SeachObj.mbox=Auser;
		SeachObj.objectType="Agent";
		 search['agent']=JSON.stringify(SeachObj);
		 search['verb']=Statement.verb.id;
		 search['limit']=1;
		var ret = ADL.XAPIWrapper.getStatements(search);
		var i=0;
		if(ret){
		  for (i=0;i<ret.statements.length;i++)
		  {
			displayDebugging('#DebuggingArea',"=========");
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].actor));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].verb));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].object));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].result));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].result.response));
			displayDebugging('#DebuggingArea',JSON.stringify(ret.statements[i].context.contextActivities.parent[0].definition.extensions["http://autotutor.x-in-y.com/AT"].timeTaken));
			displayDebugging('#DebuggingArea',"++++++++++");
		  }
		  return;
		}
  }catch(e){
    alert("error getting records: " + e);
  }
}


function detectingJsonArray(ajson){
	 if (Array.isArray(ajson)){
		 delete ajson;
	 }else{
		 for (var key in ajson) {
			if (Array.isArray(ajson[key])){
				 delete ajson[key];
			}
		 }
	 }
}

function sendStatement(aStatement){
	if (Array.isArray(aStatement)) {
		console.log('sending array - multi stmt... ');
		displayDebugging('#DebuggingArea',JSON.stringify(aStatement.verb.id)+" "+EXPID);
		DoSearch(aStatement);
		wrapper.sendStatements(aStatement, outputResults);
	} else {
		console.log('sending object - single stmt... ');
//		displayDebugging('#DebuggingArea',JSON.stringify(aStatement.verb.id));
//		DoSearch(aStatement);
		wrapper.sendStatement(aStatement, outputResults);
	}

}

function GetResult(Score){
	var ResultStatement ={};
	var ResultScore={};
	ResultScore.scaled=Score;
	ResultScore.min=0;
	ResultScore.max=1;
	ResultScore.raw=Score;
	ResultStatement.score=ResultScore;
	return ResultStatement;
}


function ComposeActor(ActorName,homePage,ambox){
	var actorObj={};
	var actorAccountObj={};
	var AString=decodeURIComponent(homePage);
	actorObj.name=ActorName;
	actorObj.objectType="Agent";
	if (AString.toLowerCase().indexOf("mailto")==0){
		actorObj.mbox=AString;
		return actorObj;
	}else{
		actorAccountObj.name=ambox;
		actorAccountObj.homePage=decodeURIComponent(homePage);
		actorObj.account=actorAccountObj;
	}
	displayDebugging("#DebuggingArea",JSON.stringify(actorObj)+"==========");
	return actorObj;
}
function Compose_matchScore(data){
	var resultObj={};
	var resultScoreObj={};
	resultScoreObj.scaled=Math.max(data.Match,data.LSAMatch,data.RegExMatch);
	resultScoreObj.min=0;
	resultScoreObj.max=1;
	resultScoreObj.raw=Math.max(data.Match,data.LSAMatch,data.RegExMatch);
	resultObj.score=resultScoreObj;
	resultObj.success=data.Pass;
	resultObj.response=data.AnswerType;
	resultObj.completion=data.Pass;
	var extensionsObj={"https://umiis.github.io/ITSProfile/System/matchAnswer":data};
	resultObj.extensions=extensionsObj;
	return resultObj;
}


function GetObjective1(actormbx,atype){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={};
	NameObj.en=fullname;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}


function GetObjective4(actormbx,atype,NameOfObject){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={};
	NameObj.en=NameOfObject;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}


function GetObjective6(actormbx,atype,Question){
	var Object={};
	Object.id=actormbx;
	Object.objectType=atype;
	var OBJDefObj={};
	var DefinitionObj={"en-US":Question};
	DefinitionObj.type=atype;
	OBJDefObj.description=DefinitionObj;
	var NameObj={"en-US":Question};
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}

function GetObjective3(actormbx,atype,TargetID){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":""};
	DefinitionObj.type=atype;
//	DefinitionObj.en=" ";
	OBJDefObj.description=DefinitionObj;
	var NameObj={"en-US":fullname+" on "+TargetID};
//	NameObj.en=fullname+" on "+TargetID;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}

function GetObjectiveActivityRef(actormbx,atype,ATObject,inputOfStudent){
	var Object={};
	Object.id=SKOGuid;
	Object.objectType="StatementRef";
	return Object;
}

function GetObjective2(actormbx,atype,ATObject,inputOfStudent){
	var Object={};
	Object.id=actormbx;
	Object.objectType="Activity";
	var OBJDefObj={};
	var DefinitionObj={"en-US":inputOfStudent.action};
	DefinitionObj.type=atype;
//	DefinitionObj.en=;
	OBJDefObj.description=DefinitionObj;
	var NameObj={"en-US":ATObject};
//	NameObj.en=;
	OBJDefObj.name=NameObj;
	Object.definition=OBJDefObj;
	displayDebugging("#DebuggingArea",JSON.stringify(Object));
	return Object;
}

function FindTarget(EvaluationData){
	var lengths=EvaluationData.Assessments.length;
	var i;
	for (i=0; i<lengths;i++){
		if (EvaluationData.Assessments[i].TargetID!="Event"){
			return EvaluationData.Assessments[i].TargetID;
		}
	}
	return "";
}

function ComposeStatementRef(typeofStatement,actormbx,actorType,verbID,ObjectID,data){
	var OldVerbID=verbID;
	actorObj=ComposeActor(fullname,HomePage,MoodleID);
	var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString}};
	var AverbID="https://umiis.github.io/ITSProfile/StatementRef/"+verbID;
	xAPIObject=GetObjectiveActivityRef(ATLink,verbID,TaegetStr,data.TargetID);
	if (OldVerbID==SaveKCScoreStr){
		var TName=TutorName+" "+SKOTitle;
		var ATLink=window.location.href;
		SchoolName=SKOSchool.split("//")[1];
		TutorEmail=SKOGuid+"@"+SchoolName;
		actorObj=ComposeActor(TName,ATLink,TutorEmail);
		GetResultScore.response=data.Data.split(":")[0];
		displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));

		var statement={
			actor:actorObj,
			verb:{
					id:AverbID,
					display:{"en-US":verbID}
				},
			object: xAPIObject,
			result: GetResultScore,
			context:MyExtObj(QueryString,LOMString,data.Transitions,null)
		}
	} else if (OldVerbID==matchAnswer_of) {
		actorObj=ComposeActor(fullname,HomePage,MoodleID);
		displayDebugging("#DebuggingArea",JSON.stringify(actorObj));
		GetResultScore=Compose_matchScore(data);
		var TaegetStr=data.AnswerType+", "+data.TargetID+" of "+TutorName+SKOTitle;
		var ATLink=SKOSchool+"?"+SKOGuid+"&Obj="+data.TargetID;

		displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));

		var statement={
			actor:actorObj,
			verb:{
					id:AverbID,
					display:{"en-US":verbID}
				},
			result:GetResultScore,
			object: xAPIObject,
			context:MyExtObj(QueryString,LOMString,data.Transitions,null)
		}
	}
	return statement;
}

function composeViewHintsStatement(Question,Answer,StartTime,Duration){
	var Statement={};
	var actorObj=ComposeActor(fullname,Auser,MoodleID);
	var verbObj={};
	verbObj.id=ITProfile+"Activity/"+viewPnQStr;
	verbObj.display={"en-US":viewPnQStr};
	TutorEmail=SKOGuid+"@"+SchoolName;

	var ObjectObj={};
	ObjectObj.id= "http://"+SchoolName+"/ with guid "+SKOGuid;
    ObjectObj.definition={
      "name": { "en-US":SKOTitle+": PnQ: "+Question}
    }
	var NewQStr={}
	NewQStr.ScriptID=SKOGuid+"@"+SchoolName;
	var ATLink=window.location.href.split("?")[0];
	NewQStr.question=Question;
	NewQStr.answer=Answer;
	NewQStr.timeStart=StartTime;
	NewQStr.timeTaken=Duration;
	NewQStr.playerHost=ATLink;
	NewQStr.objectType="PnQ";
//	NewQStr.problemGUID=SKOGuid;
    var SplitTitle=SKOTitle.split(":");
	if (SplitTitle.length>0){
		NewQStr.problemID=SplitTitle[1];
	}else {
		NewQStr.problemID=SKOTitle;
	}

	ObjectObj.definition.extensions={"https://umiis.github.io/ITSProfile/view":NewQStr};
//	QueryString.hintPnQ=NewQStr;
	Statement.context=MyExtObj(null,null,null,null)
    Statement.actor=actorObj;
	Statement.verb=verbObj;
	Statement.object=ObjectObj;
	displayDebugging('#DebuggingArea',JSON.stringify(Statement));
	return Statement;

}

function ComposeStatement(typeofStatement,actormbx,actorType,verbID,ObjectID,data){
//	LOMString={};
	var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString,ITProfile:data.Transitions}};
	var actorObj;
	QueryString=QueryStringToJSON();
	xAPIObject=GetObjective1(actormbx,verbID);

	if (verbID==ChatVerb1){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var anID="mailto:"+verbID+"@autotutor.x-in-y.com";
		xAPIObject=GetObjective4(anID,verbID,"AT Chat Service");
	}else if (verbID==ChatVerb2){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var anID="mailto:"+verbID+"@autotutor.x-in-y.com";
		xAPIObject=GetObjective4(anID,verbID,"AT Chat Service");
	}else if (verbID==ListenVerStr){
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var ATLink=window.location.href;
		var TaegetStr=data.id+" of "+TutorName+SKOTitle+" on "+data.note;
		xAPIObject=GetObjective2(ATLink,verbID,TaegetStr,data);
	};


	//	ITProfile:data.Transitions,

	var OldVerbID=verbID;
	var AverbID=ITProfile+typeofStatement+"/"+verbID;
	if (Status=="ASAT")
	{
		if (OldVerbID==ListenVerStr) {
			actorObj=ComposeActor(fullname,Auser,MoodleID);
			var ATLink=window.location.href.split("?")[0];
			var TaegetStr=data.id+" of "+TutorName+SKOTitle+" on "+data.note;
			xAPIObject=GetObjective2(ATLink,verbID,TaegetStr,data);

			var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString,ITProfile:data.Transitions}};

			var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,data.Transitions,null)
				}
		}else if (OldVerbID==TransitionStr) {
			var TName=TutorName+" "+SKOTitle;
			var ATLink=window.location.href.split("?")[0];
			SchoolName=SKOSchool.split("//")[1];
			TutorEmail=SKOGuid+"@"+SchoolName;
			actorObj=ComposeActor(TName,ATLink,TutorEmail);
			var Question=FindTarget(data);
			if (Question==""){
				Question="Tutor Start"
			}
			xAPIObject=GetObjective3(actormbx,verbID,Question);

			displayDebugging("#DebuggingArea",JSON.stringify(actorObj));
			displayDebugging("#DebuggingArea",JSON.stringify(xAPIObject));

			var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,data.Transitions,null)
			}
		}else if (OldVerbID==Evaluate_Input_Of) {
				var TName=TutorName+" "+SKOTitle;
				var ATLink=window.location.href.split("?")[0];
				SchoolName=SKOSchool.split("//")[1];
				TutorEmail=SKOGuid+"@"+SchoolName;
				actorObj=ComposeActor(TName,ATLink,TutorEmail);
			//	GetResultScore=Compose_matchScore(data);
				xAPIObject=GetObjective3(actormbx,verbID,FindTarget(data));

				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					result:GetResultScore,
					object: xAPIObject,
					context:MyExtObj(QueryString,LOMString,data.Transitions,null)
				}
			} else if (OldVerbID==matchAnswer_of) {
				var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString}};
				actorObj=ComposeActor(fullname,Auser,MoodleID);
				// actorObj=ComposeActor(fullname,HomePage,MoodleID);
				displayDebugging("#DebuggingArea",JSON.stringify(actorObj));
				GetResultScore=Compose_matchScore(data);
				var TaegetStr=data.AnswerType+", "+data.TargetID+" of "+TutorName+SKOTitle;
				var ATLink=SKOSchool+"?"+SKOGuid+"&Obj="+data.TargetID;
				xAPIObject=GetObjectiveActivityRef(ATLink,verbID,TaegetStr,data.input);

				displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));

				var statement={
					actor:actorObj,
					verb:{
							id:AverbID,
							display:{"en-US":verbID}
						},
					result:GetResultScore,
					object: xAPIObject,
					context:MyExtObj(QueryString,LOMString,data.Transitions,null)
				}
			} else 	if (OldVerbID==SaveKCScoreStr) {
				var extObj={"extensions":{ATExt:QueryString,LOMExt:LOMString}};
				var TName=TutorName+" "+SKOTitle;
				var ATLink=window.location.href.split("?")[0];
				SchoolName=SKOSchool.split("//")[1];
				TutorEmail=SKOGuid+"@"+SchoolName;
				actorObj=ComposeActor(fullname,Auser,MoodleID);
				// actorObj=ComposeActor(fullname,HomePage,MoodleID);
			   //	actorObj=ComposeActor(TName,ATLink,TutorEmail);
				xAPIObject=GetObjectiveActivityRef(ATLink,verbID,TaegetStr,data.input);
			GetResultScore.response=data.Data.split(":")[0];
			displayDebugging("#DebuggingArea",JSON.stringify(GetResultScore));

			var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				result: GetResultScore,
				context:MyExtObj(QueryString,LOMString,data.Transitions,null)
			}
		}else{
			var TName=TutorName+" "+SKOTitle;
				var ATLink=window.location.href.split("?")[0];
				SchoolName=SKOSchool.split("//")[1];
				TutorEmail=SKOGuid+"@"+SchoolName;
				actorObj=ComposeActor(TName,ATLink,TutorEmail);
			var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,data.Transitions,null)
			}
		}
	}else{
		actorObj=ComposeActor(fullname,Auser,MoodleID);
		var statement={
				actor:actorObj,
				verb:{
						id:AverbID,
						display:{"en-US":verbID}
					},
				object: xAPIObject,
				context:MyExtObj(QueryString,LOMString,data.Transitions,null)
			}
	}
	return statement;
}

  var outputResults = function (resp, thing) {
	var spanclass = "text-info";
	var text = "";
	if (resp.status >= 400) {
		spanclass = "text-danger";
		text = (thing.totalErrors > 1) ? "Errors: " : "Error: ";
		for ( var res in thing.results ) {
			text += "<br>" + ((thing.results[res].instance.id) ? thing.results[res].instance.id : "Statement " + res);
			for ( var err in thing.results[res].errors ) {
				text += "<br>&nbsp;&nbsp;" + thing.results[res].errors[err].trace;
				text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + thing.results[res].errors[err].message;
			}
		}
	} else {
		if ( resp.responseText )
			text = "LRS "+LRSURL+ "Successfully sent " + resp.responseText+" "+EXPID;
		else
			text = thing+" "+EXPID;
	}
	displayDebugging('#DebuggingArea',text);
};

function UpdateStatementsASAT(data,MyxAPIType){
	var j = 0;
	var Localurl=SKOGuid;
	var An_xAPIType=parseInt(MyxAPIType);
	var transActions=data.Log.Transitions;

	var CumulatedKCMessage="";

	displayDebugging('#DebuggingArea',JSON.stringify(data.Log.Assessments));

	if (An_xAPIType>0){ // Total Transaction Together

		var aStatementA = ComposeStatement("verbs",Auser,"Agent",TransitionStr,Localurl,data.Log);
		sendStatement(aStatementA);

		var AssessmentLength=data.Log.Assessments.length;
		var counter=0;
		if (AssessmentLength>0){
			for (counter=0; counter<AssessmentLength;counter++){
				if (data.Log.Assessments[counter].TargetID!="Event"){
					//	var AssessmentVB=data.Log.Assessments[counter].TargetID;
					var Matchdata=data.Log.Assessments[counter];
					Matchdata.input=data.Log.Input["CurrentText"];
					var AssessmentVB=matchAnswer_of;
					displayDebugging('#DebuggingArea',JSON.stringify(Matchdata));
					var aStatementC = ComposeStatement("System",Auser,"Agent",AssessmentVB,Localurl,Matchdata);
					sendStatement(aStatementC);
				}
			}
			var input_and_assessment={Input:data.Log.Input,	Assessments:data.Log.Assessments}
			var aStatementB = ComposeStatement("System",Auser,"Agent",Evaluate_Input_Of,Localurl,input_and_assessment);
			sendStatement(aStatementB);
		}
	}
	var trasisionLength=transActions.length;
    for (j = 0; j < trasisionLength; j++) {
	   if (transActions[j].RuleID!=null) {
			var transActionsActions=transActions[j].Actions;
			var transActionsRulesID="follow_rule_"+transActions[j].RuleID+"_when_interact_with";
			if (An_xAPIType>1){ // Total Transaction RuleID
				var aStatement = ComposeStatement("verbs",Auser,"Agent",transActionsRulesID,Localurl,transActionsActions);
				sendStatement(aStatement);
			}
			var actionLength=transActionsActions.length;
			var k=0;
			for (k = 0; k < actionLength; k++) {
				var transActionsRulesIDAction = transActionsActions[k].Act;
				    if (transActionsActions[k].Agent=="System"){
				    displayDebugging('#DebuggingArea',JSON.stringify(transActionsActions[k]));
					displayDebugging('#DebuggingArea','=====================');
					}
					if (transActionsRulesIDAction==SaveKCScoreStr){
						var score=parseFloat(transActionsActions[k].Data.split(":")[1]);
						GetResultScore=GetResult(score);
						var aStatement = ComposeStatement("verbs",Auser,"Agent",transActionsRulesIDAction,Localurl,transActionsActions[k]);
						sendStatement(aStatement);
						if (transActionsActions[k].Data!=""){
							CumulatedKCMessage=CumulatedKCMessage+"<b>"+transActionsActions[k].Data+"</b><br/>";
						}
					}
					SaveKCScore="<p align='Center'>Your score for current learning in the form of <br/> Coverage of Knowledge Components (KC):<br/>"+
					CumulatedKCMessage+"<input type='submit' id='Replay' value='Replay'/><input type='submit' id='Restart' value='Restart'/></p>";
				if (An_xAPIType>2){
					if (transActionsRulesIDAction!=SaveKCScoreStr){
						var verbstr="perform_action_"+transActionsRulesIDAction+"_when_interact_with";
						var aStatement = ComposeStatement("verbs",Auser,"Agent",verbstr,Localurl,transActionsActions[k]);
						sendStatement(aStatement);
					}
				}
			}
		}
	}
}

function UpdateStatementsQuestionToChatScripts(Character,data){
	if (xAPI=="1"){
		var Localurl=SKOGuid;
		var AskingChatScripts="AskingChatScripts";
		var aStatement = ComposeStatement(Character,Auser,"Agent",AskingChatScripts,Localurl,data);
		sendStatement(aStatement);
	}

}

function UpdateStatementsAnswerFromChatScripts(Character,data){
	if (xAPI=="1"){
		var Localurl=SKOGuid;
		var aStatement = ComposeStatement(Character,Auser,"Agent",ChatVerb1,Localurl,data);
		sendStatement(aStatement);
	}

}


function UpdateStatementsID(data){
	if (xAPI=="1"){
		var Localurl=SKOGuid;
		var Assessment=ListenVerStr;
		var aStatement = ComposeStatement("System",Auser,"Agent",Assessment,Localurl,data);
		sendStatement(aStatement);
	}

}
