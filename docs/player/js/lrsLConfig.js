
function loadLRS(alrsL){
	if (EXPID=="EXP_PJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_XWH"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if (EXPID=="EXP_HMJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_FJJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if (EXPID=="EXP_WXG"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_YL"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_XHU"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_WYQ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_WCY"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_ATT"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","47c79d59b972d91ce41c807e6354a623c64f0e6d");
		LRSPassword=qs("lrspassword","386aa49bcc32c0a7c917a9226c41617e4fb47b6f");
		return;
	}else if  (EXPID=="EXP_XK"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_HYH"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_LXX"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}else if  (EXPID=="EXP_GHS"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","958bb8880897d9da09f2607e5493e529297eb580");
		LRSPassword=qs("lrspassword","a1ad7a54767922d2d34c054dfa240db161632511");
		return;
	}
	if (SKOSchool.indexOf("ccnu")>0){
		alrsL="alttaiCCNU";
	}
	if (alrsL=="alttaiCCNU"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","94f907221d68e107ea69c709d43e2094f39e948f");
		LRSPassword=qs("lrspassword","aebdc3fdc190eee683040df157b10e2d8d2752a4");
	}else if (alrsL=="alttaiLECC"){
		LRSURL=qs("lrs","https://47.96.129.133/data/xAPI/");
		LRSLogin=qs("lrslogin","1577fd4655971901ce2c8ca1b05a6729f6bec679");
		LRSPassword=qs("lrspassword","1aec59fc6d308399e63e679ad913a39514ff63bd");
	}else if (alrsL=="soartech"){
		LRSURL=qs("lrs","https://target-dev.soartech.com:8002/data/xAPI/");
		LRSLogin=qs("lrslogin","f8aeaeeac65549866cfbf04e3b651f0add305c29");
		LRSPassword=qs("lrspassword","6428f1f73759d36b65dee1814fd515366163349c");
	}else if (alrsL=="iis"){
		LRSURL=qs("lrs","http://lrs.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","17e055b6235655b9893e27fe877fa5f46ef3f6cd");
		LRSPassword=qs("lrspassword","0a0e8ad3df11b173b7eea1593f4ba3cea441429d");
	}else if (alrsL=="veracity"){
		LRSURL=qs("lrs","https://umiis.lrs.veracity.it/xapi/");
		LRSLogin=qs("lrslogin","d7189fdf90ec4c94b4e9ebbae59a94e1");
		LRSPassword=qs("lrspassword","5990dc30472640c687828d9dad545e12");
	}else{
		LRSURL=qs("lrs","https://tokyo.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","4f88781d5cbb14651f0b62237cc88acae405acf1");
		LRSPassword=qs("lrspassword","1ea428fb86b9f0a901434eb82034abe773e21487");
	}
}
