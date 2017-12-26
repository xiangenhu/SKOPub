//var ALGE078_HTML_GROUP;
var STATE_MACHINE;
var tutor_button_clicked = null;
var RENDERING_PANEL = "#SKO_Presentation";

function setTutorRenderingPanel(panelName) {
	RENDERING_PANEL = panelName;
}

function main(){

	var cacheStr = '[{"student":"faisal","concept":"simple","knowledge_level":1}]';
	var cache = JSON.parse(cacheStr);

	var student = new student_model_cache("faisal",cache);
	var html_group = [["tutoring_group",
                      {"contents": [{"type":"text", "content":"A Tutor Group Starts Hereeeee.  "},
                                    {"type":"tutoring_button"},
                                    {"type":"tutoring_point"},
                                    {"type":"text", "content":"  "},
                                    {"type":"tutoring_link", "content":{"link_name":"Can you go to google?", "link_address":"http://google.com"}},
                                    {"type":"text", "content":"The Tutoring Group Ends Here.<br><br>"}],
                        "concept":"simple-sko",
                        "SKO_names" : ["af32dc0c-bfa3-40b2-af4a-2e96955cb236"], //309810bd-94c9-4d70-94de-c2812475b617
                        "main_dialog_index" : 0}],
                       ["text_group", {"type":"text", "content":"This is a text-group which is not related with any tutoring-group.<br><br>"}],
                       ["tutoring_group", 
                       {"contents": [{"type":"text", "content":"A new Tutoring Group.  "},
                                     {"type":"tutoring_button"},
                                     {"type":"tutoring_point"}, 
                                     {"type":"text", "content":"End of group 2."}],
                        "concept":"complex-sko",
                        "SKO_names" : ["7c52876a-956b-4900-b5d8-552bbdf9393d"],
                        "main_dialog_index" : 0}]];
	
	//var js = JSON.parse(json);
    console.log(html_group);
	//return new SKOStateMachine(html_group,student);
    return new SKOStateMachine(ALGE078_HTML_GROUP, student);
}

//$(document).ready(function(){
$(window).load(function(){
	var sm = main();
	STATE_MACHINE = sm;
	tutor_button_clicked = function(groupNum) {
        sm.onTutoringButtonClicked(groupNum);
	};
	// Run the controller until infinity
    window.setInterval(function(){sm.runController();}, 200);

    $('#TutoringInput').keypress(function(event) {
        // Check the keyCode and if the user pressed Enter (code = 13) 
        if (event.keyCode == 13) {
            SendStudentDialog(document.getElementById('TutoringInput').value)
            $("#TutoringInput").val("");
        }
    });
});   