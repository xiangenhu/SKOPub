
var inputBaseObj={
			minStrength:0,
			guid:"ea8308d1-f93c-457d-84c8-1fa4457c7148",
			type:2,
			include_ttop:true,
			text:"习",
			minRankby:0,
			etop:100,
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
			
var LCC={IN:0.0,IO:0.0,RN:0.0,RO:0.0,CC:0.0,CT:0.0,sessionKey:"",Current:0.0,Target:0.0};
			
function SubmitLCC(){
	 GetLCC("GET",lccurl,$("#thisTarget").val(),$("#LCCInput").val());
	 
}

var TurnCount =1;	

var DataIN= [];
		
var DataRN= [];
		
		
var DataIO= [];

var DataRO= [];
		
var DataCC= [];
		
var DataCT= [];
		
// var TotalLCC={DataIN:DataIN,DataRN:DataRN,DataIO:DataIO,DataRO:DataRO};

function DrawChart(Data,ChartName,ChartLabel) {
var chart = new CanvasJS.Chart(ChartName, {
	theme: "light1", // "light2", "dark1", "dark2"
	animationEnabled: true, // change to true		
	title:{
		text: ChartLabel
	},
	data: [
	{
		// Change type to "bar", "area", "spline", "pie",etc.
		type: "column",
		dataPoints: Data
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
				LCC.sessionKey=obj.sessionKey;
				LCC.Current=Current;
				LCC.Target=Target;
				
				LCC.sessionKey=obj.sessionKey;
				$("#LCCFeedback").show();
				
				var newIN={ label: TurnCount.toString(),  y: obj.IN*100 };
				DataIN.push(newIN);
				
				var newRN={ label: TurnCount.toString(),  y: obj.RN*100 };
				DataRN.push(newRN);
				
				var newIO={ label: TurnCount.toString(),  y: obj.IO*100 };
				DataIO.push(newIO);
				
				var newRO={ label: TurnCount.toString(),  y: obj.RO*100 };
				DataRO.push(newRO);
				
				var newCC={ label: TurnCount.toString(),  y: obj.CC };
				DataCC.push(newCC);
				
				var newCT={ label: TurnCount.toString(),  y: obj.CT };
				DataCT.push(newCT);
				
				
				DrawChart(DataRN,"LCCFeedbackRN","Relevent New %");
				DrawChart(DataIN,"LCCFeedbackIN","Irrelevent New %");
				DrawChart(DataRO,"LCCFeedbackRO","Relevent Old %");
				DrawChart(DataIO,"LCCFeedbackIO","Irrelevent Old %");
				DrawChart(DataCC,"LCCFeedbackCC","Current Contribution (Maximum 1.00)");
				DrawChart(DataCT,"LCCFeedbackCT","Total Coverage (Maximum 1.00)");
				$("#LCCInput").val("");
				TurnCount++;
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
		    html=html+"<li> sessionKey:"+LCC.sessionKey+"</il>";
			html=html+"</ul>"
		
		displayInformation("#LCCFeedback",html);
}