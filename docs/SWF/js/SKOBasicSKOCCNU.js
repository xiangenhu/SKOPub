   function qs(search_for,defaultstr) {		
            var query = window.location.search.substring(1);
			var parms = query.split('&');
			for (var i=0; i<parms.length; i++) {
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
	    	var index = baseurl.indexOf("ATL.html");
	    	baseurl = baseurl.substr(0, index-1);
	   	    flashvars.serverbaseURL = qs("BURL",baseurl);
	    	var CBurl = "http://"+window.location.host+"/";
	    	flashvars.CBSever=qs("CBserver",CBurl);
			
            flashvars.ATWS=qs("atws","http://141.225.42.101/atws4/service1.asmx?WSDL");
            flashvars.ACEWebAPI=qs("ACEWebAPI","http://prod.x-in-y.com/aceapicors8/api/aceex");
            flashvars.ShowDH = qs("ShowDH","0");   
           	flashvars.skoserver = qs("skoserver","http://ccnu.x-in-y.com:8889");  
            flashvars.DSSPP = qs("DSSPP","http://ccnu.x-in-y.com:8889");
	        flashvars.PRC=qs("PRC","1");
            flashvars.Review_Btn=qs("Review_Btn","0");
            flashvars.NoWait=qs("NW","1");
            flashvars.LaunchNew=qs("LN","0");
	    	flashvars.LogicalPrevious=qs("lp","");
	    	flashvars.STIndex=qs("STIndex","0");
	    	
	    	flashvars.IDcompWidth=qs("IDcompWidth","580");
	    	
	    	flashvars.LCCSeedQuestionFontSize=qs("LCCSeedQuestionFontSize","11");
	    	
	    	flashvars.LCCInputFontSize=qs("LCCInputFontSize","11");
	    	flashvars.MediaBase = qs("MediaBase",""); 
	    	flashvars.xAPI=qs("xAPI","0");
            flashvars.AvatarList = qs("AvatarList","DEFAULT");
       
            flashvars.GUID = qs("guid","61e7bd6e-36b8-420b-ab0a-bee6d6904aab");
            flashvars.userGuid=qs("userGuid","5637ddcb-4675-43a5-bc3d-874f20c92da6");
            
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
            flashvars.ONRDemo=qs("ONRDemo","1");
            flashvars.SL = qs("SL","0");
            flashvars.ReportParam = qs("ReportParam","0");
             flashvars.RL = qs("RL","0");
             flashvars.expOn = qs("expOn","0");
         
            flashvars.ATLCCShow=qs("ATLCCShow","1");
            
            flashvars.LRSURL = qs("LRSURL","https://lrs.adlnet.gov/xAPI/");   
	    	flashvars.LRSAdmin = qs("LRSAdmin","SKOAdmin");   
	    	flashvars.LRSPassword = qs("LRSPassword","password"); 
	    	 flashvars.BURLP = qs("BURLP","http://www.auto-tutor.com/1024768/general/ATL.html");
            flashvars.BURLA = qs("BURLA","http://www.auto-tutor.com/1024768/general/author.html");  
	    	

            flashvars.PlayerUrl = qs("PlayerUrl","http://www.auto-tutor.com/1024768/general/ATL.html");
            flashvars.EditorUrl = qs("EditorUrl","http://www.auto-tutor.com/1024768/general/author.html");  
	    	
	    	flashvars.LoginPoint = qs("LoginPoint","http://ccnu.x-in-y.com:8889/myScripts.jsp");  
            
            flashvars.TalkingHeadOnly=qs("THO","0"); // Talkinghead only if value = 1;
            flashvars.avatarlocationchange=qs("ALC","0"); // change location if value is 1
	        
            flashvars.bgAlpha=qs("bgalpha","1"); // number between 0 and 1
            flashvars.bgSize=qs("bgSize","100");  // "auto" means no stretch, "100%" means stretch
            
            flashvars.GetLearner=qs("GL","0");
            
            flashvars.MS="0.1";
            flashvars.WS="TASAALL";
            flashvars.MN="10";
            flashvars.SM="FA";
	        flashvars.TargetMS="0.3";
            flashvars.spp="http://semantic-spaces.appspot.com/stringquery3?";
            flashvars.randomFeedback="";
            
            flashvars.pv=qs("pv","0");  //pv=1 means published version
            
            flashvars.PlayWindow=qs("PlayWindow","ChildPanel");  
            
            flashvars.RMT = qs("RMT","1"); // running Remote SKOs
            flashvars.timerOn = qs("timerOn","0");
            
 //           flashvars.YTL = qs("YTL","XOLOLrUBRBY");
            
            flashvars.YTL = qs("YTL","NOYOUTUBE");
            
            flashvars.AllowStop = qs("AllowStop","0"); // Allow Student Stop automatical play mode
             flashvars.BookMark = qs("BookMark","0");
             
            flashvars.CWL = qs("CWL","0"); // Content Window Location: 0: Centered, 1: Go with the teacher;
             
			 
            
			
             
            var params = {};
            params.quality = "high";
            params.bgcolor = "#869ca7";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            var attributes = {};
            attributes.id = "ATL";
            attributes.name = "ATL";
            attributes.align = "middle";
			attributes.wmode ="transparent";
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
             //	alert("Operation is: "+s);
                var old=document.getElementById( "LogFile" ).innerHTML;
             	document.getElementById( "LogFile" ).innerHTML =  old+"\n"+s;
             	return "successful";
         	}
			function BKG()
		  	{
		  	    var img=qs("BKG","");
		  		document.body.background = img;
				document.body.style.backgroundRepeat = "no-repeat";
		  		return;
		  	}
        	function javascriptListener(s) 
        	{
             //	alert("Operation is: "+s);
                var old=document.getElementById( "LogFile" ).innerHTML;
             	document.getElementById( "LogFile" ).innerHTML = s + "\n =============== \n\n"+ old;
             	document.getElementById( "MSG" ).innerHTML =s;
             	return "successful";
         	}
         	function javascriptxAPIListener(s) 
        	{
             //	alert("Operation is: "+s);
                var old=document.getElementById( "LogFile" ).innerHTML;
             	document.getElementById( "LogFile" ).innerHTML = s + "\n =============== \n\n"+ old;
             	document.getElementById( "MSG" ).innerHTML =s;
             	
             	return "successful";
         	}