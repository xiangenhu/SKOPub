var TUTOR_HEAD_BOX_NAME = '#tutoring_box';

function TutoringController(){
	var _isActive = false;
	var _currentDialogId = null;
    var _SAFETY_DELAY = 3000;        // Prevent dialogs from cutting each other off, most of the time

	var tutoring_show = function (){
        $(TUTOR_HEAD_BOX_NAME).fadeIn();
    };
	
    var tutoring_hide = function (){
        $(TUTOR_HEAD_BOX_NAME).fadeOut();
    };
	
    this.start = function(id){
		_isActive = true;
        _currentDialogId = id;
        setTimeout(function(){SetDialogGUID(id);},_SAFETY_DELAY);
        tutoring_show();
    };
    this.restart = function(){
        _isActive = true;
        setTimeout(function(){SetDialogGUID(_currentDialogId);},_SAFETY_DELAY);
        tutoring_show();
    };
    this.end  = function(){
        //tutoring_hide();
		_isActive = false;
		var id = _currentDialogId;
		_currentDialogId = null;
        return id;
    };
	this.getCurrentDialog = function(){
        return _currentDialogId;
    };
    this.setCurrentDialog = function(id){
        _currentDialogId = id;
    };
    this.isTutoringActive = function(){
        return _isActive;
    };
}
  