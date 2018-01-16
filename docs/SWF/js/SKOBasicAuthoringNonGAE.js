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
				return defaultstr;			}
            var SWFVersionStr = "11.1.0";
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {};
		// Decide what to turn on at starting
		
		flashvars.AvatarList = qs("AvatarList","DEFAULT");
		flashvars.MediaBase = qs("MediaBase","/1024768/"); 
		
        flashvars.BURLP = qs("BURLP","http://sko.skoonline.org/player1024768.html");
        flashvars.BURLA = qs("BURLA","http://sko.skoonline.org/author1024768.html");  
		
        flashvars.ASAT = qs("ASAT","1");
	    flashvars.CA = qs("CA","0");
	    flashvars.MC = qs("MC","0");
	    flashvars.MA = qs("MA","0");
	    flashvars.FIB = qs("FIB","0");
	    flashvars.SR = qs("SR","1");
	    flashvars.ID = qs("ID","1");
	    flashvars.TU = qs("TU","0");
	    flashvars.GI = qs("GI","0");
		flashvars.UNLIMITED = qs("UNLIMITED","1");
		flashvars.trialog = qs("trialog","0");
		// What is the address in Learning Record Store
        flashvars.LRSURL = qs("LRSURL","https://lrs.adlnet.gov/xAPI/");   
        flashvars.LRSAdmin = qs("LRSAdmin","SKOAdmin");   
	    flashvars.LRSPassword = qs("LRSPassword","password");
		
	    var baseurl = window.location.href;
	    var index = baseurl.toUpperCase().indexOf("AUTHOR");
	    baseurl = baseurl.substr(0, index-1);
	    flashvars.serverbaseURL = qs("BURL",baseurl);
        flashvars.LoginPoint = qs("LoginPoint",window.location.href);
		
		flashvars.dobackup=qs("dobackup","1");
		
	    var CBurl = "http://"+window.location.host+"/";
	    flashvars.CBSever=qs("CBserver",CBurl);
		
		flashvars.GMPR = qs("GMPR","0");
		flashvars.Advanced = qs("Advanced","1");
	  		flashvars.saveas = qs("saveas","0");
		flashvars.LOM = qs("LOM","1");
		flashvars.helpOn = qs("helpOn","1");		flashvars.DEBUGGING = qs("DEBUGGING","0");		flashvars.GUID = qs("guid","");		flashvars.starting = qs("ST","");		flashvars.TITLE = qs("TITLE","");
		flashvars.ContentURL = qs("ContentURL","");
		flashvars.pump = qs("pump","0");
		flashvars.prompt = qs("prompt","0");
	    flashvars.twoAvatars = qs("twoAvatars","0");	        
	    flashvars.threeAvatars = qs("threeAvatars","0");
	    flashvars.regexp = qs("regexp","0");
	    flashvars.exportscripts = qs("es","0");
	    flashvars.OGUID = qs("oguid","0");
	    flashvars.RetrieveOld = qs("rourl","");
	    flashvars.localFile = qs("LF","ASAT");  
		flashvars.LoadLocal = qs("ll","1");
		flashvars.ASAT = qs("ASAT","1");
	    flashvars.ASATAgents = qs("asatAT","1");
	    flashvars.ASATSpeechActs = qs("asatSA","1");         
	    flashvars.ASATRigidPacks = qs("asatRP","1");       
	    flashvars.ASATTutoringPacks = qs("asatTP","1");  
	    flashvars.ASATRules = qs("asatRL","1");
	    flashvars.helpLocation = qs("helpLo","http://cs.gifttutoring.org/help/en/");
		flashvars.HelpEXT = qs("HelpEXT","htm");
	    flashvars.SL = qs("SL","0"); //save logs
	    flashvars.contentAnalysis=qs("ca","0"); // 1 means it will be cantent analysis
		
		flashvars.itemType11 = "config/Type11.xml";
		flashvars.itemType12 = "config/Type12.xml";
		flashvars.itemType13 = "config/Type13.xml";
		flashvars.itemType21 = "config/Type21.xml";
		flashvars.itemType22 = "config/Type22.xml";
		flashvars.itemType23 = "config/Type23.xml";
		flashvars.itemType5 = "config/Type5.xml";
		flashvars.SKOMessage = "config/SKOMessage.xml";
		flashvars.POPChoice = "config/POPChoice.xml";
		flashvars.chn =qs("chn","config/chn.xml");
		flashvars.lang=qs("lang","");
		
		flashvars.ServerType = qs("ServerType","NoneGAE");
		flashvars.LoadProfile = qs("LoadProfile","0");  //=1 when GAE is used
		flashvars.PlayWindow=qs("PlayWindow","_self");		flashvars.RMT = qs("RMT","1"); // Editing Remote SKOs
		flashvars.MPR = qs("MPR","1"); // Export MPR files
		flashvars.saveas = qs("saveas","0");
	    
		flashvars.SampleIDGUID = qs("SIDguid","92bcfa68-af47-4e82-809f-19853437fdb0");
	    flashvars.SampleMAGUID = qs("SMAguid","");
	    flashvars.SampleESSAYGUID = qs("STUguid","");
	    flashvars.SampleMCGUID = qs("SMCguid","");
	    flashvars.SampleFIBGUID = qs("SFIBguid","");
	    flashvars.SampleSRGUID = qs("SSRguid",""); 
        flashvars.SampleTTGUID = qs("STTguid","");
        flashvars.SampleSTBGUID = qs("SSTBguid","");
        flashvars.SampleASATGUID = qs("SASATguid","50ed8af1-3fd1-4ca2-ab1d-3b5cc97fbfbf");
		
	    flashvars.saveP = qs("saveP","0"); // Save load profile
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