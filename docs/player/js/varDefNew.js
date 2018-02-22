function qs(search_for,defaultstr) {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	for (var i = 0; i<parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0  && search_for == parms[i].substring(0,pos)) {
			return parms[i].substring(pos+1);
			}
		}
		return defaultstr;
	}

if (Location=="China")
{
	
	var UserStudent=qs("UserStudent","小明");
	var SKOGuid=qs("guid","50ed8af1-3fd1-4ca2-ab1d-3b5cc97fbfbf");
	var SKOSchool=qs("school","https://ccnu.x-in-y.com:8889");
	var MediaBase=qs("MediaBase","https://xiangenhu.github.io/ATMedia/IMG/CAT/")
}else{
	var UserStudent=qs("UserStudent","Carl");
	var SKOGuid=qs("guid","df365267-1fc9-485b-8918-fb926757369c");
	var SKOSchool=qs("school","https://class.x-in-y.com");
	if (SKOSchool.indexOf("onrstem")>0){
		SKOSchool=qs("school","https://onrstem.x-in-y.com");
	}
	var MediaBase=qs("MediaBase","https://xiangenhu.github.io/ATMedia/IMG/StatsTutorDemo_ANOVAIntro_ID/")
}

var SchoolName="class.skoonline.org";

var ATExt="http://autotutor.x-in-y.com/AT";
var LOMExt="https://standards.ieee.org/findstds/standard/";
var ITProfile="https://umiis.github.io/ITSProfile/";

var LOMTag=qs("LOM","educational");
var xAPI=qs("xAPI","1");
var xAPIType=qs("xAPIType","1");
var STARTING=qs("ST","");

var SpeakList = [];
var DEBUGGING=qs("DEBUGGING","0");

// English Character and SKO Default

var EXPID=qs("EXPID","EXPID");

var Status="";

var timeStart=new Date();

var urlPageForIFrame = qs("url","");

var PnQCode="";

var LOMString;

var MediaWidth=qs("MW","400");
var MediaHight=qs("MW","300");
var SHUP=qs("SHUP","0");
var SHRT=qs("SHRT","0");


var lrsL=qs("lrsL","alttai");

var LRSURL;
var LRSLogin;
var LRSPassword;

var IMGgexmlData = [];
var VideoxmlData = [];
var IDxmlData = [];
var AREAText="";

var theXMLScript;

var RetriveSKOObj={
		guid:SKOGuid,
		source:"ScriptOnly",
		return:"scriptContent",
		authorname:"xiangenhu"
	};
	
var S1=false;
var S2=false;;
var S3=false;;
var S4=false;;
	

var language=qs("lang","english");
var LSASpaceName=qs("LSAS","English_TASA");
var ProjectName=qs("ProjN","ET");
var UseDB=qs("UserDB","true");
	
var Auser="mailto:"+decodeURIComponent(qs("user","xhu@memphis.edu"));
var MoodleID=qs("MID","4");

var fullname=decodeURIComponent(qs("fullname","John Doe"));

var TutorName=qs("Tutor","AT:");

var SiteHome=qs("SiteHome","AutoTutor");

var TutorEmail=decodeURIComponent(qs("TutorEmail","autotutor@memphis.edu"));

var HomePage=decodeURIComponent(qs("HomePage","http://et.x-in-y.com"));

// ASAT Only
var ActiveQuestion;

var type_of_SKO="ID";

var avatarBKIMG=encodeURIComponent(qs("abkimg","http://autotutor.x-in-y.com/AT/img/BackGround.jpg"));
// var avatarBKIMG=qs("abkimg","img/BackGround");
var avatarBKColor=qs("abkclr","cccccc");

var IDtoACE=Auser;
var IntitalText = qs("iniText","No idea");
var aceurl=qs("aceurl","https://ace.x-in-y.com/aceapi2017/api/aceaction");
var startingIndex=parseInt(qs("STI","0"));

var STARTNow=qs("SNow","1");
var dialogHistory=[];
var InReplay=false;
var SaveKCScore;
var AllowReplay=(qs("RP","1")=="1");
var GetResultScore={};
var SKOTitle="AutoTutor";
var QueryString;
var xAPIObject;
var questionsAsked;
var ShowIndividualDialogHistor=qs("SIHD","0");
var ShowIndividualChat=qs("SIC","0");
var ChatVerb1="Listen from";
var ChatVerb2="Ask";
var ListenVerStr="listen";
// Verbs 
var matchAnswer_of="matchAnswer";
var SaveKCScoreStr="SaveKCScore";
var viewPnQStr="view";
var TransitionStr="transition";
var Evaluate_Input_Of="Evaluate";
var VERBS="verbs";
var jsonOfXml;