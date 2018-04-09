  function setCookie(c_name,value,exdays){
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
			document.cookie=c_name + "=" + c_value;
			}
         
         function getCookie(c_name){
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1){
  				c_start = c_value.indexOf(c_name + "=");
				}
			if (c_start == -1){
  				c_value = null;
  				} else {
  					c_start = c_value.indexOf("=", c_start) + 1;
  					var c_end = c_value.indexOf(";", c_start);
  					if (c_end == -1){
						c_end = c_value.length;
				}
				c_value = unescape(c_value.substring(c_start,c_end));
			}
			return c_value;
			}
			
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
              // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
            var SWFVersionStr = "11.1.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {};

            
	    
	  
	    var baseurl = window.location.href;            
	    var index = baseurl.toUpperCase().indexOf("ATL");
	    baseurl = baseurl.substr(0, index-1);
	    flashvars.serverbaseURL = qs("BURL",baseurl);	
	    
	    flashvars.BURLA = qs("BURLA","http://sko.skoonline.org/author.html");
	    flashvars.BURLP = qs("BURLP","http://sko.skoonline.org/player.html");
	    
		flashvars.TeacherBKG=qs("TeacherBKG","");
        flashvars.StudentBKG=qs("StudentBKG","");

		
		flashvars.AvatarList = qs("AvatarList","DEFAULT");
	        
	    var CBurl = "http://"+window.location.host+"/";
	    flashvars.CBSever=qs("CBserver",CBurl);
            
            flashvars.NoAssessment=qs("NoAss","0");
            flashvars.SWA=qs("SWA","0");
	  
			flashvars.ATWS=qs("atws","http://141.225.42.101/atws4/service1.asmx?WSDL");
	   
            flashvars.ACEWebAPI=qs("ACEWebAPI","http://prod.x-in-y.com/aceapicors8/api/aceex");
			
			flashvars.ShowDH = qs("ShowDH","0"); 
	    
            flashvars.NoWait=qs("NW","0");
            flashvars.LaunchNew=qs("LN","0");
            flashvars.LogicalPrevious=qs("lp","");
	    
            flashvars.GUID = qs("guid","02740d85-ef3d-49d7-a66a-4a65dce67c42");
			flashvars.userGuid=qs("userGuid","ba40ff5a-3442-4b62-99ae-b895630af21e");
            
            flashvars.AVATAR=qs("AVATAR","0");
            flashvars.AIML=qs("AIML","0");
            flashvars.SID=qs("SID","");
            flashvars.rndFb=qs("rndFb","");
            flashvars.AllowFinish=qs("AF","");
            flashvars.EDITING=qs("EDITING","");
            flashvars.LCCRESULT=qs("LCCRESULT","");
            flashvars.DEBUGGING=qs("DEBUGGING","0");
            flashvars.AuthorName=qs("dt","Development Team");
            flashvars.AuthorEmail=qs("AE","S.K.O. Online");
            flashvars.PUBLISH=qs("pub","");
            flashvars.URL=qs("hurl","http://www.skoonline.org");
            flashvars.BKIMG=qs("BK",""); 
            flashvars.ATLCCShow=qs("ATLCCShow","0");
            flashvars.ONRDemo=qs("ONRDemo","0");
            flashvars.SL = qs("SL","1");
            flashvars.RL = qs("RL","1");
            flashvars.xAPI = qs("xAPI","0");

            flashvars.ReportParam = qs("ReportParam","0");
            flashvars.LoginPoint = qs("LoginPoint","http://sko.skoonline.org/player.html");


            flashvars.LRSURL = qs("LRSURL","https://lrs.adlnet.gov/xAPI/");   
            flashvars.LRSAdmin = qs("LRSAdmin","SKOAdmin");   
	        flashvars.LRSPassword = qs("LRSPassword","password");   
	    
           flashvars.PlayerUrl = qs("PlayerUrl","http://sko.skoonline.org/player.html");
           flashvars.EditorUrl = qs("EditorUrl","http://sko.skoonline.org/author.html");
         
            
            flashvars.TalkingHeadOnly=qs("THO","0"); // Talkinghead only if value = 1;
            flashvars.avatarlocationchange=qs("ALC","0"); // change location if value is 1	        
            flashvars.bgAlpha=qs("bgalpha","1"); // number between 0 and 1
            flashvars.bgSize=qs("bgSize","100");  // "auto" means no stretch, "100%" means stretch
            
            flashvars.MS="0.1";
            flashvars.WS="TASAALL";
            flashvars.MN="10";
            flashvars.SM="FA";
	        flashvars.TargetMS="0.3";
            flashvars.spp="http://semantic-spaces.appspot.com/stringquery3?";
            flashvars.randomFeedback="";
            
            		 
	    flashvars.username = qs("username","Keith");  
		 flashvars.skoserver = qs("skoserver","http://sko.skoonline.org");  
            flashvars.DSSPP = qs("DSSPP","http://dsspp.skoonline.org");
			
			 flashvars.AllowStop = qs("AllowStop","1"); // Allow Student Stop automatical play mode
            
            flashvars.ServerType = qs("ServerType","GAE");
            flashvars.pv = qs("pv","0");
             flashvars.PlayWindow=qs("PlayWindow","_self");
             flashvars.timerOn = qs("timerOn","0");
			 
			 flashvars.STIndex=qs("STIndex","0");
			 
			 
            flashvars.TeacherBKG=qs("TeacherBKG","");
             
            flashvars.StudentBKG=qs("StudentBKG","");
			
			flashvars.IDcompWidth=qs("IDcompWidth","580");
			flashvars.IDcompHeight=qs("IDcompHeight","568");
			flashvars.LCCSeedQuestionFontSize=qs("LCCSeedQuestionFontSize","14");
	    	
	    	flashvars.LCCInputFontSize=qs("LCCInputFontSize","14");
			
			flashvars.BookMark=qs("BookMark","0");
			
		//	flashvars.YTL = qs("YTL","QO_WUMyhxSw");
		    flashvars.YTL = qs("YTL","NOYOUTUBE");
			
             flashvars.CWL = qs("CWL","0"); // Content Window Location: 0: Centered, 1: Go with the teacher;
			 flashvars.GetLearner=qs("GL","0");
            var params = {};
            params.quality = "high";
            params.bgcolor = "#fcfdfe";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            var attributes = {};
            attributes.id = "ATL";
            attributes.name = "ATL";
            attributes.align = "middle";
            SWFObject.embedSWF(
                "../swfATL.swf", "flashContent", 
                "1024", "768", 
                SWFVersionStr, xiSwfUrlStr, 
                flashvars, params, attributes);
            // JavaScript enabled so display the flashContent div in case it is not replaced with a .swf object.
            SWFObject.createCSS("#flashContent", "display:block;text-align:left;");
            
            //  ADD JS function Calls
            
            function LCCControl() 
            {
            	var LCCInput = document.getElementById("LCCInput");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.LCCControl(LCCInput.value);
            }
            
            
            function TutoringControl() 
            {
            	var TutoringInput = document.getElementById("TutoringInput");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.TutoringControl(TutoringInput.value);
            }
            
            function MoveToSKO() 
            {
            	var MoveToSKO = document.getElementById("NextSKO");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.MoveToSKO(NextSKO.value);
            }
            function MoveToSKO2() 
            {
            	var MoveToSKO = document.getElementById("NextSKO");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.MoveToSKO(NextSKO2.value);
            }
            
            function NextStep() {
            	var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.NextStep("Hello World");
        	}
        	 
        	 
            function TeacherSay() {
            	var TeacherWords = document.getElementById("TeacherWords");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.TeacherSay(TeacherWords.value);
        	}
        	function TeacherRespond() {
            	var TeacherQuestion = document.getElementById("TeacherQuestion");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.TeacherRespond(TeacherQuestion.value);
        	}
        	
        	function ShowHideTeacher() {
            	var showTeacher = document.getElementById("showTeacher");
           		var AddCallbackExample = document.getElementById("ATL");
            	AddCallbackExample.ShowHideTeacher(showTeacher.value);
        	}
        	 
        	function SKOLogReceiver(s) 
        	{
                console.log("RECEIEVED LOG");
             //	alert("Operation is: "+s);
                var old=document.getElementById( "LogFile" ).innerHTML;
             	document.getElementById( "LogFile" ).innerHTML =  old+"\n"+s;
             	return "successful";
         	}
 
        	function javascriptDummyListener(s) 
        	{
             //	alert("Operation is: "+s);
                console.log("STUFF HAPPENING!");
                var old=document.getElementById( "MSG" ).innerHTML;
             	document.getElementById( "MSG" ).innerHTML =  old+"\n"+s;
             	return "successful";
         	}