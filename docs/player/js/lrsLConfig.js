
function loadLRS(alrsL){
	if (EXPID=="EXP_PJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","18a268597272c9d3464ae526a1288a209339e800");
		LRSPassword=qs("lrspassword","28d209b75d1634697b067ee20ed935895c742d24");
		return;
	}else if  (EXPID=="EXP_XWH"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","8e925885103d531618441f327a709812b9b152d6");
		LRSPassword=qs("lrspassword","afbfedd822c53b234cf47f2bfd772ce06331ffcd");
		return;
	}else if (EXPID=="EXP_HMJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","0e6136cde2eeadd31ee2ef6c43e66677145b79cf");
		LRSPassword=qs("lrspassword","6dd84480537f9ad706a39c5bbfd4ec17f504e73d");
		return;
	}else if  (EXPID=="EXP_FJJ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","0e785b90fe871eb57fcf336b047e919db0aecab5");
		LRSPassword=qs("lrspassword","d0a12c723f36630ec76bb66bc31275130caaad5d");
		return;
	}else if (EXPID=="EXP_WXG"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","a23f0d681463d236cdade077ba5df2d7ccd0ad8d");
		LRSPassword=qs("lrspassword","9a9a90822c2a115bd4faab54df9bbbf24ae5947e");
		return;
	}else if  (EXPID=="EXP_YL"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","8f80af0b4fbda63d409f75cd1d62c7cfea3d30ff");
		LRSPassword=qs("lrspassword","7954e2d253626d7dbf841ca4655d87fd2bae1afb");
		return;
	}else if  (EXPID=="EXP_XHU"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","55fbff2173de0f46a5118b0af58a881a51ce7c31");
		LRSPassword=qs("lrspassword","24654696160e729381025a23233b72b83e41a404");
		return;
	}else if  (EXPID=="EXP_WYQ"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","1fc2355f083962ee1566201db16d5bb949357590");
		LRSPassword=qs("lrspassword","0587d0e880622d33348008e63d0e96424cb552b5");
		return;
	}else if  (EXPID=="EXP_WCY"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","38040b95f93e3329a5915beb95fcc7cdc13109a8");
		LRSPassword=qs("lrspassword","46b3c9d86cc44e88ab43016f2e34467c7f04d5f4");
		return;
	}else if  (EXPID=="EXP_ATT"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","fa410e6b8f62fdfe595c9fc70bb3a1f45fbf7e36");
		LRSPassword=qs("lrspassword","08aa82f31b906b39faa1b4b3cbda54109279ea7d");
		return;
	}else if  (EXPID=="EXP_XK"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","0d069667018b5a5babba26b181152603afedd0b5");
		LRSPassword=qs("lrspassword","2dd3aef39b1b15a3886248573a9bfc4c9e776211");
		return;
	}else if  (EXPID=="EXP_HYH"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","57f07fcb79f9b99a1a6566f31f2767aac4acd03b");
		LRSPassword=qs("lrspassword","5d7f0bab58976319af03733d7a9305f5930f143f");
		return;
	}else if  (EXPID=="EXP_LXX"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","703bee2389b5219d1f8202af21e0984f8673716b");
		LRSPassword=qs("lrspassword","d55e3bd2bd5e3c8b40df2a44791f66601bf6a2af");
		return;
	}else if  (EXPID=="EXP_GHS"){
		LRSURL=qs("lrs","https://ccnu.x-in-y.com/data/xAPI/");
		LRSLogin=qs("lrslogin","82b9bf9fb9c86d55f01ae25509dfc22afe4a4429");
		LRSPassword=qs("lrspassword","dfd1f821f63530f4d4066b2a34312912e56d29f1");
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
		LRSURL=qs("lrs","https://lrs.x-in-y.com/data/xAPI/");
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
