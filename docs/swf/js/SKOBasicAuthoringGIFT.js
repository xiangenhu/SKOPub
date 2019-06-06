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
	  function javascriptxAPIListener(s) 
        	{
             //	alert("Operation is: "+s);
                var old=document.getElementById( "LogFile" ).innerHTML;
             	document.getElementById( "LogFile" ).innerHTML = s + "\n =============== \n\n"+ old;
             	document.getElementById( "MSG" ).innerHTML =s;
             	
             	return "successful";
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
				return defaultstr;			}
            var SWFVersionStr = "11.1.0";
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {};
		// Decide what to turn on at starting
		
		flashvars.AvatarList = qs("AvatarList","DEFAULT");
		
		var baseurl = window.location.href;
	    var index = baseurl.indexOf("authoring");
	    baseurl = baseurl.substr(0, index-1);
	    flashvars.serverbaseURL = qs("BURL","");
	     
	    var CBurl = "http://"+window.location.host+"/";
	    flashvars.CBSever=qs("CBserver",CBurl);
	    flashvars.SKOT =qs("SKOT","baseurl");
	    flashvars.LOM = qs("LOM","1");
		flashvars.skoserver = qs("skoserver","https://dsspp.gifttutoring.org");  
        flashvars.DSSPP = qs("DSSPP","https://dsspp.gifttutoring.org");
		flashvars.ServerType = qs("ServerType","NonGAE");
		flashvars.UNLIMITED = qs("UNLIMITED","1");
        flashvars.DEBUGGING = qs("DEBUGGING","1");
        flashvars.GUID = qs("guid","");
        flashvars.GUID = qs("guid","c75c783e-4a01-4a64-9107-2b1e2a0bfdaa");
        flashvars.timerOn = qs("timerOn","1");
	    flashvars.starting = qs("ST","ASAT");
	    flashvars.helpOn = qs("helpOn","1");
	    flashvars.helpLocation = qs("helpLo","http://help.skoonline.org/en/");
	    flashvars.GMPR = qs("GMPR","0");
		flashvars.AvatarList = qs("AvatarList","DEFAULT");
		flashvars.Advanced = qs("Advanced","1");
	    flashvars.TITLE = qs("TITLE","");
	    flashvars.ContentURL = qs("ContentURL","");
	    flashvars.pump = qs("pump","1");
	    flashvars.prompt = qs("prompt","1");
	    flashvars.trialog = qs("trialog","0");
	    flashvars.twoAvatars = qs("twoAvatars","0");	        
	    flashvars.threeAvatars = qs("threeAvatars","0");
	    flashvars.regexp = qs("regexp","0");
	    flashvars.exportscripts = qs("es","0");
	    flashvars.OGUID = qs("oguid","0");
	    flashvars.RetrieveOld = qs("rourl","https://dsspp.gifttutoring.org/retrieve");
	    flashvars.localFile = qs("LF","ASAT");   
	    flashvars.MediaBase = qs("MediaBase","")
	    flashvars.LRSURL = qs("LRSURL","https://lrs.adlnet.gov/xAPI/");   
	    flashvars.LRSAdmin = qs("LRSAdmin","SKOAdmin");   
	    flashvars.LRSPassword = qs("LRSPassword","password");   
	    flashvars.LoginPoint = qs("LoginPoint","https://dsspp.gifttutoring.org/myScripts.jsp");   
	    flashvars.SL = qs("SL","0");     
	    flashvars.LoadLocal = qs("ll","1");

		flashvars.html5PlayURL = qs("H5Url","https://xiangenhu.github.io/SKOPub/player/index.html");
		flashvars.SeverCTrY = qs("H5SC","USA");
		flashvars.html5Start = qs("H5ST","ID");
        
        flashvars.BURLP = qs("BURLP","https://xiangenhu.github.io/SKOPub/player/index.html");
        flashvars.BURLA = qs("BURLA","https://xiangenhu.github.io/SKOPub/general/authorGIFT.html");  
	        
	    flashvars.ASAT = qs("ASAT","1");
	    flashvars.CA = qs("CA","1");
	    flashvars.MC = qs("MC","1");
	    flashvars.MA = qs("MA","1");
	    flashvars.FIB = qs("FIB","1");
	    flashvars.SR = qs("SR","1");
	    flashvars.ID = qs("ID","1");
	    flashvars.TU = qs("TU","1");
	    flashvars.GI = qs("GI","1");
	    
	    
	    flashvars.ASATAgents = qs("asatAT","1");
	    flashvars.ASATSpeechActs = qs("asatSA","1");         
	    flashvars.ASATRigidPacks = qs("asatRP","1");       
	    flashvars.ASATTutoringPacks = qs("asatTP","1");  
	    flashvars.ASATRules = qs("asatRL","1");
	        
        flashvars.RMT = qs("RMT","1"); // Editing Remote SKOs
        flashvars.MPR = qs("MPR","1"); // Export MPR files
        
	    flashvars.saveas = qs("saveas","1");
      
	    flashvars.ID = qs("ID","1");
	    flashvars.cMPRf = qs("cMPRf","1");
	    
	    
        flashvars.saveP = qs("saveP","0"); // Save load profile
      
            
            
            flashvars.itemType11 = "config/Type11.xml";
            flashvars.itemType12 = "config/Type12.xml";
            flashvars.itemType13 = "config/Type13.xml";
            flashvars.itemType21 = "config/Type21.xml";
            flashvars.itemType22 = "config/Type22.xml";
            flashvars.itemType23 = "config/Type23.xml";
            flashvars.itemType5 = "config/Type5.xml";
            flashvars.itemType6 = "config/Type6.xml";
            flashvars.SKOMessage = "config/SKOMessage.xml";
            flashvars.POPChoice = "config/POPChoice.xml";// Need To Change
            
            flashvars.chn = qs("chn","config/chn.xml");
            flashvars.lang = qs("lang","chn");

			
			 
            
             flashvars.SampleIDGUID=qs("SIDguid","");
	    	flashvars.SampleMAGUID=qs("SMAguid","");
	    	flashvars.SampleESSAYGUID=qs("STUguid","");
	    	flashvars.SampleMCGUID=qs("SMCguid","");
	    	flashvars.SampleFIBGUID=qs("SFIBguid","");
	    	flashvars.SampleSRGUID=qs("SSRguid",""); 
            flashvars.SampleTTGUID=qs("STTguid","");
            flashvars.SampleSTBGUID=qs("SSTBguid","");
            flashvars.SampleASATGUID=qs("SASATguid","");
            flashvars.SampleDISSGUID=qs("SASATguid","");
            

			flashvars.LoadProfile = qs("LoadProfile","0");
            
            flashvars.PlayWindow=qs("PlayWindow","ChildPanel");  
            
		
		
		
		
            var params = {};
            params.quality = "high";
            params.bgcolor = "#fdf0f0";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            var attributes = {};
            attributes.id = "authoring";
            attributes.name = "authoring";
            attributes.align = "middle";
            SWFObject.embedSWF(
                "../swf/authoring.swf", "flashContent", 
                "1024", "768", 
                SWFVersionStr, xiSwfUrlStr, 
                flashvars, params, attributes);
            SWFObject.createCSS("#flashContent", "display:block;text-align:left;");
            
            var EditingURL;
            var PlayingURL;        
            function GetEditURL()
            {
            return EditingURL;
            } 
            
            function GetPlayerURL()
            {
           // alert(PlayingURL);
             return PlayingURL;
            }     
              
            function theGuid(s) 
        	{
            	EditingURL = flashvars.serverbaseURL+"../swf/authoring.html?guid = "+s;
            	PlayingURL = flashvars.serverbaseURL+"../swfATL.html?guid = "+s;
            //	alert(EditingURL);
          	}