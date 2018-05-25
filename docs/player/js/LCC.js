
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
			
var LCC={IN:0.0,IO:0.0,RN:0.0,RO:0.0,CC:0.0,CT:0.0,sessionKey:"",Current:"",Target:""}
			
function SubmitLCC(){
	 GetLCC("GET",lccurl,$("#LCCtargetText").val(),$("#LCCInput").val());
}


function DrawChart(LCC) {

var chart = new CanvasJS.Chart("LCCFeedback", {
	theme: "light1", // "light2", "dark1", "dark2"
	animationEnabled: false, // change to true		
	title:{
		text: "LCC"
	},
	data: [
	{
		// Change type to "bar", "area", "spline", "pie",etc.
		type: "column",
		dataPoints: [
			{ label: "Irrelevant New",  y: LCC.IN  },
			{ label: "Relevant New", y: LCC.RN  },
			{ label: "Irrelevant Old", y: LCC.IO  },
			{ label: "Relevant Old",  y: LCC.RO  },
		]
	}
	]
});
chart.render();

}
			
function GetLCC(Method,lccurl,Target,Current){
	inputBaseObj.current=Current;
	inputBaseObj.target=Target;
	var getUrl = $.ajax({
		type: Method,
		url: lccurl,
		data: "json="+JSON.stringify(inputBaseObj),
			success: function(data) {
				var obj = JSON.parse(data);
				inputBaseObj.sessionKey=obj.sessionKey;
				LCC.IN=obj.IN;
				LCC.IO=obj.IO;
				LCC.RN=obj.RN;
				LCC.RO=obj.RO;
				LCC.CC=obj.CC;
				LCC.CT=obj.CT;
				LCC.Current=Current;
				LCC.Target=Target;
				
				LCC.sessionKey=obj.sessionKey;
				$("#LCCFeedback").show();
				DrawChart(LCC);
//				processing(LCC);
			}
		})
}

function processing(LCC){
		$("#LCCInput").val("")
		$("#LCCFeedback").show();
		var html="<ul>";
		    html=html+"<li> Irrelevant New:"+LCC.IN.toString()+"</il>";
		    html=html+"<li> Relevant New:"+LCC.RN.toString()+"</il>";
		    html=html+"<li> Irrelevant Old:"+LCC.IO.toString()+"</il>";
		    html=html+"<li> Relevant Old:"+LCC.RO.toString()+"</il>";
		    html=html+"<li> Current Score:"+LCC.CC.toString()+"</il>";
		    html=html+"<li> Total Coverage:"+LCC.CT.toString()+"</il>";
			html=html+"</ul>"
		
		displayInformation("#LCCFeedback",html);
}