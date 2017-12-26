
(function(namespace, undefined) {
    var CONTENT_DISPLAYED = "Content Displayed",
        TUTORING_POINT_HIT = "Tutoring Hit",
        GROUP_FINISHED = "Group Finished",
        ALL_GROUPS_FINISHED = "All Finished";
    
    var TUTORING_IMAGE_LOCATION = "tutorImage.png";

    var RenderingController = function(tutoringPage){
        var RENDER_FADE_IN_TIME = 1200;

        var _tutoringPage = tutoringPage;
        var _isRendering = false;
        console.log("IS RENDERING? " + _isRendering);
        var _groupIndex = 0;
        var _contentIndex = -1;
        var _tutoringPointIndex = -1;

        this.isRenderingActive = function(){
            return _isRendering;
        };
        
        this.isRenderingComplete = function(){
            return (_groupIndex >= _tutoringPage.getNumGroups());
        };
        
        this.isGroupComplete = function(){
            return (_contentIndex >= _tutoringPage.getGroupSize(_groupIndex));
        };
        
        this.getGroupIndex = function(){
            return _groupIndex;
        };
        
        this.getContentIndex = function(){
            return _contentIndex;
        };
        
        this.getTutoringIndex = function(){
            return _tutoringPointIndex;
        };
        
        var addAndRenderElement = function(elementStr){
            var anObj = $(elementStr);
            $(RENDERING_PANEL).append(anObj);
            anObj.hide(0);
            console.log("Scroll Height" + $(RENDERING_PANEL)[0].scrollHeight);
            anObj.fadeIn(RENDER_FADE_IN_TIME);
            $(RENDERING_PANEL).scrollTop($(RENDERING_PANEL)[0].scrollHeight);
        };
        
        this.renderAll = function(){
            console.log("Start Render all");
            _isRendering = true;
            var renderStatus = null;
            for (var i=_groupIndex; i < _tutoringPage.getNumGroups(); i++){
                renderStatus = this.renderGroup();
            }
            _isRendering = false;
            return renderStatus;
        };
        
        this.renderGroup = function(){
            console.log("Start Render group");
            _isRendering = true;
            var renderStatus = null;
            while((renderStatus !== GROUP_FINISHED) &&
                  (renderStatus !== ALL_GROUPS_FINISHED)){
                renderStatus = this._renderElement();
            }
            _isRendering = false;
            return renderStatus;
        };
        
        this.renderUntilTutoring = function(){
            console.log("Start Render until tutor");
            _isRendering = true;
            var renderStatus = null;  
            while((renderStatus !== TUTORING_POINT_HIT) &&
                  (renderStatus !== ALL_GROUPS_FINISHED)){
                renderStatus = this._renderElement();
            }
           _isRendering = false;
            return renderStatus;
        };
        
        this.renderElement = function(){
            console.log("Start Render element");
            _isRendering = true;
            var renderStatus = null;
            renderStatus = this._renderElement();
            _isRendering = false;
            return renderStatus;
        };
        
        this._renderElement = function(){
            console.log("IS RENDERING? " + _isRendering);
            var renderStr, renderStatus, contentType, gContent;
            renderStatus = this._nextElement();
            console.log('Tutor Group / Tutor Pt / Content Item: '+ _groupIndex +
                        '/' + _tutoringPointIndex + '/' + _contentIndex);
            
            if ((renderStatus === ALL_GROUPS_FINISHED) || (renderStatus === GROUP_FINISHED)){
                return renderStatus;
            } else {
                renderStatus = CONTENT_DISPLAYED;
                contentType = _tutoringPage.getGroupContentType(_groupIndex, _contentIndex);
                gContent = _tutoringPage.getGroupContent(_groupIndex, _contentIndex);
                // Render various elements
                if (contentType === TUTORING_GROUP_LABELS.TEXT_CONTENT){
                    renderStr = '<span>' + gContent.content + '</span>';
                    addAndRenderElement(renderStr);
                } else if (contentType === TUTORING_GROUP_LABELS.NEWLINE_CONTENT){
                    addAndRenderElement('<br>');
                } else if (contentType === TUTORING_GROUP_LABELS.TUTOR_BUTTON_CONTENT){
                    //renderStr = '<button type="button" onClick="tutor_button_clicked('+_groupIndex +')">Tutoring</button>';
                    renderStr = '<span><a href="javascript:tutor_button_clicked('+_groupIndex+')"><img id="" src="'+ 
                                TUTORING_IMAGE_LOCATION + '" alt="Tutoring"></a></span>';
                    addAndRenderElement(renderStr);
                } else if (contentType === TUTORING_GROUP_LABELS.TUTORING_LINK_CONTENT){
                    renderStr = '<span><a href='+gContent.content.link_address+' target="_blank">' + 
                                    gContent.content.link_name +'</a></span>';
                    addAndRenderElement(renderStr);
                } else if (contentType === TUTORING_GROUP_LABELS.TUTORING_POINT_CONTENT) {
                    _tutoringPointIndex++;
                    renderStatus = TUTORING_POINT_HIT;
                } else {
                    console.log("Invalid group content type: " + contentType);
                }
                return renderStatus;
            }
        };
        
        this._nextElement = function(){
            if (this.isRenderingComplete()){
                console.log("All Groups Complete!");
                _contentIndex = -1;
                _tutoringPointIndex = -1;
                return ALL_GROUPS_FINISHED;
             } else if (_contentIndex+1 >= _tutoringPage.getGroupSize(_groupIndex)){
                console.log("Group Complete!");
                _groupIndex++;
                _contentIndex = -1;
                _tutoringPointIndex = -1;
                return GROUP_FINISHED;
             } else {
                console.log("Moving to the next rendered element!");
                _contentIndex++;
                return null;
             }
        };
    };
    
    // Publicly Accessible Elements
    namespace.RenderingController = RenderingController;
    namespace.CONTENT_DISPLAYED = CONTENT_DISPLAYED;
    namespace.TUTORING_POINT_HIT = TUTORING_POINT_HIT;
    namespace.GROUP_FINISHED = GROUP_FINISHED;
    namespace.ALL_GROUPS_FINISHED = ALL_GROUPS_FINISHED;
})(window.sko_render_controller = window.sko_render_controller || {});


//function random_id_generator (){
    // Credit to Original Author: Broofa@Stackoverflow.com
//    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//            return v.toString(16);
//            });
//}