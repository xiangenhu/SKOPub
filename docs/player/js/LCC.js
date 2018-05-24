
var inputBaseObj={
			minStrength:0,
			guid:"ea8308d1-f93c-457d-84c8-1fa4457c7148",
			type:2,
			include_ttop:true,
			text:"习",
			minRankby:0,
			etop:500,
			category:"news",
			format:"json",
			wc:0,
			ttop:500,
			domain:"nodomain",
			include_etop:true,
			SS:"ch002",
			current:"酒",
			notes:"",
			userGuid:"ee0e00c7-367e-4476-bf69-d7f6cd874a4b",
			minWeight:0,
			sessionKey:"",
			target:"学"};

function POSTtoBase(Method,lccurl,Target,Current){
	inputBaseObj.current="我要学一些东西车";
	inputBaseObj.target="学校";
	var getUrl = $.ajax({
		type: Method,
		url: lccurl,
		data: "json="+JSON.stringify(inputBaseObj),
			success: function(data) {
				var obj = JSON.parse(data);
				inputBaseObj.sessionKey=obj.sessionKey;
				$("#DebuggingArea").show();
				var LCC={IN:0.0,IO:0.0,RN:0.0,RO:0.0,CC:0.0,CT:0.0,sessionKey:""}
				LCC.IN=obj.IN;
				LCC.IO=obj.IO;
				LCC.RN=obj.RN;
				LCC.RO=obj.RO;
				LCC.CC=obj.CC;
				LCC.CT=obj.CT;
				LCC.sessionKey=obj.sessionKey;
				displayInformation("#DebuggingArea",JSON.stringify(LCC));
			}
		})
}


function processingBase(data){
	$("#DebuggingArea").show();
	displayInformation("#DebuggingArea",JSON.stringify(data));
}
