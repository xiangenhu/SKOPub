$(document).on("cut copy paste","#inputText",function(e) {
				if (DEBUGGING!="2") {
					e.preventDefault();
				}
			})


$(document).bind('keypress', function(e){
		  if(e.which === 13) { // return
			 $("input#SubmitAnswer").trigger('click');
		  }
		 })





function displayInformation(target,text){
//	$(target).show();
	var d = new Date();
	var p = $('<p align="left">').html("<hr/>"+d.toLocaleString()+":<br/>"+text);
			var appending=qs("append","1");
			if (appending==1){
				$(target).append(p)
				}else{
					$(target).prepend(p)
				}
	$(target).scrollTop($(target).prop("scrollHeight"));
}


function displayMSG(target,text){
	$(target).show();
	$(target).html(text);
}


function displayCode(target,text){
	$(target).show();
	var p = '<pre><code>'+text+'</code></pre>';
			var appending=qs("append","1");
			if (appending==1){
				$(target).append(p)
				}else{
					$(target).prepend(p)
				}
	$(target).scrollTop($(target).prop("scrollHeight"));
}

function displayConversation(target,text){
	// $(target).show();
	var p = $('<p>').html(text);
			var appending=qs("append","1");
			if (appending==1){
				$(target).append(p)
				}else{
					$(target).prepend(p)
				}
	$(target).scrollTop($(target).prop("scrollHeight"));

}

function displayDebugging(target,text){
			if (DEBUGGING!=0);
			{
				var p = $('<p>').html(text);
				var appending=qs("append","1");
				if (appending==1){
					$(target).append(p)
					}else{
						$(target).prepend(p)
					}
			}

		}


function GenerateImgMap(MapData)
{
	var HotSpotLength=MapData[0].MapInfor.length;
	var i = 0;
	var ManueInfor="";
	var MW=parseInt(MediaWidth);
	var MH=parseInt(MediaHight);
	AREAText='<map name="PnQ" id="PnQ">';
	for (i = 0; i < HotSpotLength; i++) {
		var MapInforData=MapData[0].MapInfor[i];
			if (MapInforData.Act=="SPOTS"){
				var x1=MW*parseFloat(MapInforData.X1);
				var x2=MW*parseFloat(MapInforData.X2);
				var y1=MH*parseFloat(MapInforData.Y1);
				var y2=MH*parseFloat(MapInforData.Y2);
				AREAText=AREAText+'<area href="#" shape="rect" coords="'+x1.toString()
				                                                    +','+y1.toString()
																	+','+x2.toString()
																	+','+y2.toString()
																	+'" data-popupmenu="popmenu'+i.toString()+'"/>';

				}
			var j = 0;
			ManueInfor = ManueInfor+'<ul id="popmenu'+i.toString()+'" class="jqpopupmenu">';
			for (j =0; j<MapInforData.Questions.length;j++){
				var QuestInfor= MapInforData.Questions[j];
				ManueInfor=ManueInfor+'<li><a href="#">'+MapInforData.Questions[j].Quest+'</a><ul><li><a href="#">'+MapInforData.Questions[j].Answer+'</a><li></ul></li>';
			}
			ManueInfor=ManueInfor+'</ul>\n';
		}
    AREAText=AREAText+'</map>'+ ManueInfor;
}


function displayMedia(MediaContainer,MediaBase,MediaURL){

 	var text='<img align="center" usemap="#PnQ" width="'+MediaWidth+'" height="'+MediaHight+'" src="'+MediaBase+MediaURL+'"/>';
	if (MediaURL.toUpperCase().includes("HTTP")==true) {
		text='<img align="center" width="400" usemap="#PnQ" src="'+MediaURL+'"/>';
	}

	if (Status=="ASATPageIMG")
	{
		GenerateImgMap(IMGgexmlData);
		text=text+AREAText;

	}
	$(MediaContainer).html(text);
	if (Status=="ASATPageIMG") {
			jQuery(document).ready(function($){
			var $anchors=$('*[data-popupmenu]')
			$anchors.each(function(){
			$(this).addpopupmenu(this.getAttribute('data-popupmenu'))
			})
		})
	}

}

function image(Target,MGDFile) {
	displayMedia(Target,MediaBase,MGDFile)
	$(Target).fadeIn();
}
function ReplayDialog(){
	InReplay=true;
	if (dialogHistory.length==0) return;
	msSpeakQueued(C1,"I will replay the dialogue now.<cmd clear='1'/>","");
	for (var i=0;i<dialogHistory.length;i++){
		msSpeakQueued(dialogHistory[i].id,dialogHistory[i].text,"");
	}
}

function HandleCMD(id,cmd){
var msg;
//     alert(JSON.stringify(cmd));
	 if (cmd.xapinote!=null){
//		alert(cmd.xapinote);
	}

	if (cmd.img!=null){
		image("#MediaContainer",MediaBase+cmd.img);

	}
	if (cmd.yt!=null){
		$("#video-placeholder").fadeIn();
	}

	if (cmd.mv!=null){
		$("#video-placeholder").fadeIn();
	}


	if (cmd.action!=null){
		if (cmd.action=="LCCDone"){
			LCCObj.style.display = "none";
		}
		if (cmd.action=="LCC") {
			GetLCCHere();	
		}
	}




	if (cmd.currentHint!=null){
		msg=ActiveQuestion;
		var afontsize=parseInt(qs("hqfs","4"));
		displayMSG("#ASATQuestion",msg.fontsize(afontsize));
		$("#InputArea").fadeIn();

		$("#inputText").val("");
		$("#inputText").prop('disabled', (InReplay==true));
		$("#SubmitAnswer").prop('disabled', (InReplay==true));
		var anObj={};
		anObj.id=id;
		var rex = /(<([^>]+)>)/ig;
		var captionText=msg.replace(rex , "").trim();
		anObj.action=captionText;
		anObj.note="Hint/Prompt";
		UpdateStatementsID(anObj);
	}
	if (cmd.NEXT!=null){

		if (cmd.NEXT!="END"){
			StartTutoring(cmd.NEXT,SKOScriptsinJSON);
		}
	}
	if (cmd.currentQuestion!=null){

		// msg=cmd.currentQuestion;
		 msg=ActiveQuestion;
	//	alert(msg);
	   displayDebugging("#DebuggingArea",msg);
		var afontsize=parseInt(qs("hqfs","5"));
		displayMSG("#ASATMainQuestion",msg.fontsize(afontsize));
		$("#InputArea").fadeIn();
		$("#inputText").val("");
		$("#inputText").val("");
		$("#inputText").prop('disabled', (InReplay==true));
		$("#SubmitAnswer").prop('disabled', (InReplay==true));

		var anObj={};
		anObj.id=id;
		var rex = /(<([^>]+)>)/ig;
		var captionText=msg.replace(rex , "").trim();
		anObj.action=captionText;
		anObj.note="Main Question";
		UpdateStatementsID(anObj);
	}
	if (cmd.Replay!=null) {
		displayMSG("#DoneMsg",SaveKCScore);
		$("#ASATQuestion").hide();
		$("#InputArea").hide();
		$("#inputText").val("");
		if (AllowReplay){
			$("#Replay").show();
		}else{
			$("#Replay").hide();
		}
		$("#Replay").click(function(){
			$("#DoneMsg").hide();
			$("#DoneMsg").html("");
			ReplayDialog();
		});
		$("#Restart").click(function(){
			location.reload();
		});

	}
	if (cmd.Sinput!=null){
		$("#inputText").val(cmd.Sinput);
	}
	if (cmd.replay!=null){
		$("#ASATQuestion").hide();
		$("#InputArea").hide();
		$("#inputText").val("");
	}
	if (cmd.clear!=null){
		$("#Coversation").html("");
		$("#ASATQuestion").html("");
		$("#SpeechC1").html("");
		$("#SpeechC2").html("");
		$("#ASATQuestion").hide();
		$("#InputArea").hide();
	}
}


function TestJS(){
	ConnectAndGetScriptsFromSKOServer();
}
