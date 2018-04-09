var SKOStateMachine = function(markupTree, studentModel){
    /** Primary States that Impact Control: 
        isRenderingActive - Can't interrupt rendering
        isRenderingRequired - No need to render if nothing left
        isSWFLoaded - Can't set dialogs w/o talking heads
        isTutoringActive - Should wait until tutoring done before doing anything else
        isTutoringRequired - Can't render more until required tutoring done
        isKnowledgeRequired - Can't render more until knowledge available to check if tutoring required
    */
    TUTORING_REQ_THRESHOLD = 1.0;
    
    // State Objects and Flags
    var _.swfLoaded = false;
    var _tutoringPage = new TutoringPage(markupTree);
    var _renderControl = new sko_render_controller.RenderingController(_tutoringPage);
    var _tutorControl = new TutoringController();  // Modify this
    var _studentModel = studentModel;
    var _lastTutoringReqGroupNum = null;    // Don't want to recheck knowledge during a tutoring group
    var _tutorButtonClickPending = null;
    // var _sugTutoringPending = {};
    var _reqTutoringPending = [];
    // this._reqKnowledgePending = {};
    
    // Initialization
    _tutorControl.setCurrentDialog("56079b5f-30ea-44da-8244-ef6f0b890ae1");     // Needs to happen before SWF loaded

    // SWF Loading
    this.isSWFLoaded = function(){
        return _.swfLoaded;
    };
     this.setSWFLoaded = function(isLoaded){
        _.swfLoaded = isLoaded;
    };
    this.onSWFLoaded = function(id){
        if (id === _tutorControl.getCurrentDialog()){
            _.swfLoaded = true;
        }
    };
    
    // Rendering Required
    this.isRenderingActive = function(){
        return (_renderControl.isRenderingActive());
    };
    this.isRenderingRequired = function(){
        return (!_renderControl.isRenderingComplete());
    };
    
    // Tutoring Active
    this.isTutoringActive = function(){
        return _tutorControl.isTutoringActive();
    };
    this.startTutoring = function(id){
        console.log('start tutoring state');
        _tutorControl.start(id);
    };
    this.onDialogDone = function(id){
        if (id === _tutorControl.getCurrentDialog()){
            var guid = _tutorControl.end();
            // Remove from pending, if in required list
            if (id != null){
                var i = indexOf.call(_reqTutoringPending, id);
                if (i > -1){
                    console.log("Finished the required dialog: " + id);
                    _reqTutoringPending.splice(i,1);
                } else {
                    console.log("Finished a NON-required dialog:" + id);
                }
            } else {
                console.log("Finished an unregistered dialog:" + id);
            }
        }
    };
    
    // Tutoring Button
    this.isTutoringButtonClicked = function(){
        return (_tutorButtonClickPending != null);
    };
    this.getTutoringButtonClicked = function(){
        return _tutorButtonClickPending;
    };
    this.onTutoringButtonClicked = function(groupNum){
        _tutorButtonClickPending = groupNum;
    };
    this.clearTutoringButtonClicked = function(){
        _tutorButtonClickPending = null;
    };
    
    // Tutoring Required
    this.isTutoringPending = function(){
        return (_reqTutoringPending.length > 0);
    };
    this.requireTutoring = function(id){
        _reqTutoringPending.push(id);
    };
    this.nextRequiredTutoring = function(){
        /** Gets the next tutoring dialog required, in no specific order */
        return _reqTutoringPending[0];
    };
    this.clearRequiredTutoring = function(){
        _reqTutoringPending = [];
        
    };
    this.checkIfTutoringRequired = function(groupNum){
        var concept = _tutoringPage.getTutoringConcept(groupNum);
        var knowledge = _studentModel.get_knowledge(concept);
        if (knowledge == null){
            console.log("Concept was not found in student model: " + concept);
            return false;
        } else if (knowledge >= TUTORING_REQ_THRESHOLD) {
            return false;
        } else {
            return true;
        }
    };
    this.resetTutoringState = function(){
        this.clearRequiredTutoring();
        _tutorControl.end();
        $("#SKO_Presentation").scrollTop($("#SKO_Presentation")[0].scrollHeight);
        // var o = $("#SKO_Presentation");
        // o.scrollTop = o.scrollHeight);
    };
    
    //this.checkIfTutoringSuggested // This function will be for increasing salience for tutor button
    
    // Knowledge Required
    // Will need this once knowledge calls are distributed
    
    // State Transitions
    this.runController = function(){
        var id, renderStatus;
        //console.log('Running state controller');
        // Can't do anything else until rendering mode done.
        if (!this.isRenderingActive()){
            // Can't do anything else until tutoring mode done.
            if (this.isTutoringButtonClicked()){
                console.log("Tutoring Button Clicked:" + this.getTutoringButtonClicked());
                if ((this.isTutoringActive()) || this.isTutoringPending()){
                    // If tutoring already active, clear out user request
                    // TODO: Add verbal response
                    this.clearTutoringButtonClicked();
                } else {
                    // Activate the main dialog
                    id = _tutoringPage.getTutoringMainDialog(this.getTutoringButtonClicked());
                    this.clearTutoringButtonClicked();
                    if (id != null){
                        this.requireTutoring(id);
                    }
                }
            } else if (this.isTutoringActive()){
                // console.log("Tutoring Active:" + _tutorControl.getCurrentDialog());
                // Do nothing until tutoring complete
            // Start pending tutoring if required and SWF available
            } else if (this.isTutoringPending()) {
                //console.log("Tutoring Pending: " + _reqTutoringPending);
                if (this.isSWFLoaded()){
                    console.log("Tutoring Pending: SWF Loaded");
                    this.setSWFLoaded(false);      // Loading a new SWF
                    this.startTutoring(this.nextRequiredTutoring());
                }
            // Need to render and we can render if required tutoring done
            } else if (this.isRenderingRequired()){
                // console.log("Rendering");
                // Render stuff until tutoring is required
                renderStatus = _renderControl.renderUntilTutoring();
                if (renderStatus === sko_render_controller.TUTORING_POINT_HIT){
                    // Add any suggested tutoring signals here
                    if (this.checkIfTutoringRequired(_renderControl.getGroupIndex())){
                        id = _tutoringPage.getTutoringPointDialog(_renderControl.getGroupIndex(),
                                                                  _renderControl.getTutoringIndex());
                        this.requireTutoring(id);
                    }
                }
            } 
        } else {
            //console.log("Rendering Active");
        }
    };
};