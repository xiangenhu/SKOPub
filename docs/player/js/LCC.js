
var inputBaseObj={
			minStrength:0,
			guid:"ea8308d1-f93c-457d-84c8-1fa4457c7148",
			type:2,
			include_ttop:true,
			text:"酒",
			minRankby:0,
			etop:10,
			category:"news",
			format:"json",
			wc:0,
			ttop:50,
			domain:"nodomain",
			include_etop:true,
			SS:"ch002",
			current:"酒",
			notes:"",
			userGuid:"ee0e00c7-367e-4476-bf69-d7f6cd874a4b",
			minWeight:0,
			LCCSessionKey:"",
			target:"学"};

function POSTtoBase(Method,lccurl,Target,Current){
	inputBaseObj.text=Current;
	inputBaseObj.target=Target;
	$("#DebuggingArea").show();
	displayInformation("#DebuggingArea",JSON.stringify(inputBaseObj));
	var getUrl = $.ajax({
		type: Method,
		url: lccurl,
		data: "json="+JSON.stringify(inputBaseObj),
			success: function() {
				var userData=data;
				processingBase(userData);
			}
		})
}


function processingBase(data){
	$("#DebuggingArea").show();
	displayInformation("#DebuggingArea",JSON.stringify(data));
}
