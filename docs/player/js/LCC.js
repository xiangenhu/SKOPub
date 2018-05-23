
var inputBaseObj={
			minStrength:0,
			guid:"7956527b-c315-44e4-87c7-03fd35c65c48",
			type:2,
			include_ttop:true,
			text:"people",
			minRankby:0,
			etop:10,
			category:"news",
			format:"json",
			wc:0,
			ttop:50,
			domain:"nodomain",
			include_etop:true,
			SS:"fa",
			current:"boy",
			notes:"",
			userGuid:"ba40ff5a-3442-4b62-99ae-b895630af21e",
			minWeight:0,
			LCCSessionKey:"",
			target:"My life is great"};
			

function POSTtoBase(Method,lccurl,Target,Current){
	inputBaseObj.text=Current;
	inputBaseObj.target=Target;
	var getUrl = $.ajax({
		type: Method,
		url: lccurl,
		data: iputObj,
			success: function() {
				var userData=data;
				processingBase(userData);
			}
		})
}


function processingBase(data){
	displayInformation("#DebuggingArea",JSON.stringify(data));
}
