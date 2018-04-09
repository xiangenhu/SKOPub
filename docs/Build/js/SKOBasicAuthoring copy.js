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
					var CookieValue = parms[i].substring(pos+1); 
					setCookie(search_for, CookieValue,1);
				//	alert("Set Cookie Value " + search_for +": "+ CookieValue);
					return parms[i].substring(pos+1);
				} else {
					var CookieValue = getCookie(search_for);
					if (CookieValue!=null){
				//		alert("Get Cookie Value " + search_for +": "+ CookieValue);
						return CookieValue;
					}else
					return defaultstr;
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
	    var index = baseurl.indexOf("authoring");
	    baseurl = baseurl.substr(0, index-1);
	    flashvars.serverbaseURL = qs("BURL",baseurl);	
	        
	    var CBurl = "http://"+window.location.host+"/";
	    flashvars.CBSever=qs("CBserver",CBurl);
	  
	    

            flashvars.DEBUGGING = qs("DEBUGGING","0");
            flashvars.GUID = qs("guid","");
	    flashvars.starting = qs("ST","");
	    flashvars.TITLE = qs("TITLE","");
	    flashvars.ContentURL = qs("ContentURL","");
	    flashvars.pump = qs("pump","0");
	    flashvars.prompt = qs("prompt","0");
	    flashvars.contentAnalysis = qs("ca","0");
	    flashvars.trialog = qs("trialog","0");
	    flashvars.twoAvatars = qs("twoAvatars","0");	        
	    flashvars.threeAvatars = qs("threeAvatars","0");
	    flashvars.regexp = qs("regexp","0");
	    flashvars.exportscripts = qs("es","0");
	    flashvars.OGUID = qs("oguid","");
	    flashvars.RetrieveOld = qs("rourl","http://skodev2010.appspot.com/retrieve");
	    flashvars.localFile = qs("LF","ASAT");    
	        
	    flashvars.LoadLocal = qs("ll","0");
	        
	    flashvars.ASAT = qs("asat","0");
	    flashvars.ASATAgents = qs("asatAT","0");
	    flashvars.ASATSpeechActs = qs("asatSA","0");         
	    flashvars.ASATRigidPacks = qs("asatRP","0");       
	    flashvars.ASATTutoringPacks = qs("asatTP","1");  
	    flashvars.ASATRules = qs("asatRL","0");
	    
	   
        

                // content analysis version only
            
	    flashvars.contentAnalysis=qs("ca","0"); // 1 means it will be cantent analysis
            flashvars.itemType11 = "config/Type11.xml";
            flashvars.itemType12 = "config/Type12.xml";
            flashvars.itemType13 = "config/Type13.xml";
            flashvars.itemType21 = "config/Type21.xml";
            flashvars.itemType22 = "config/Type22.xml";
            flashvars.itemType23 = "config/Type23.xml";
            flashvars.itemType5 = "config/Type5.xml";
            flashvars.SKOMessage = "config/SKOMessage.xml";
	    
	    // content analysis version only
            
	     // Multilanguage version only
	    
            flashvars.chn =qs("chn","http://www.x-in-y.com/ItemTypes/chn.xml");
            flashvars.lang=qs("lang","");
	    
	     // Multilanguage version only
			 
            
                      
            

            
            
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
                "660", "500", 
                SWFVersionStr, xiSwfUrlStr, 
                flashvars, params, attributes);
            // JavaScript enabled so display the flashContent div in case it is not replaced with a .swf object.
            SWFObject.createCSS("#flashContent", "display:block;text-align:left;");
            
            //  Export GUID after saving
            
            var EditingURL;
            var PlayingURL;
         
            function GetEditURL()
            {
          //  alert(EditingURL);
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