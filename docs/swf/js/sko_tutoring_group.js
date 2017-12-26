

var TUTORING_GROUP_LABELS = {
	TUTORING_GROUP_NAME : "tutoring_group",
	TEXT_GROUP : "text_group",
	TEXT_CONTENT : "text",
    NEWLINE_CONTENT : "newline",
	TUTOR_BUTTON_CONTENT : "tutoring_button",
	TUTORING_POINT_CONTENT : "tutoring_point",
	TUTORING_LINK_CONTENT : "tutoring_link"};

var TutoringPage = function(markup_tree){
	var _markup_tree = markup_tree;
    
    this.getNumGroups = function(){
        return _markup_tree.length;
    };
    
    this.isTutoringGroup = function(groupNum){
        return _markup_tree[groupNum][0] === TUTORING_GROUP_LABELS.TUTORING_GROUP_NAME;
    };
    
    this.isTextGroup = function(groupNum){
        return _markup_tree[groupNum][0] === TUTORING_GROUP_LABELS.TEXT_GROUP;
    };
    
    this.getGroupSize = function(groupNum){
        if (this.isTutoringGroup(groupNum)){
            return _markup_tree[groupNum][1].contents.length;
        } else if (this.isTextGroup(groupNum)){
            // Text groups are atomic (size=1)
            return 1;
        } else {
            throw new Error("Invalid group type on tutoring page: " + _markup_tree[groupNum][0]);
        }
    };
    
    this.getGroupContent = function(groupNum, contentNum){
        if (this.isTutoringGroup(groupNum)){
            return _markup_tree[groupNum][1].contents[contentNum];
        } else if (this.isTextGroup(groupNum)){
            return _markup_tree[groupNum][1];
        } else {
            throw new Error("Invalid group type on tutoring page: " + _markup_tree[groupNum][0]);
        }
    };
    
    this.getGroupContentType = function(groupNum, contentNum){
        if (this.isTutoringGroup(groupNum)){
            console.log(this.getGroupContent(groupNum, contentNum));
            return this.getGroupContent(groupNum, contentNum).type;
        } else if (this.isTextGroup(groupNum)){
            return TUTORING_GROUP_LABELS.TEXT_CONTENT;
        } else {
            throw new Error("Invalid group type on tutoring page: " + _markup_tree[groupNum][0]);
        }
    };
    
    // Functions Specific to Tutoring Groups
	this.getTutoringConcept = function(groupNum){
		if (this.isTutoringGroup(groupNum)){
			return _markup_tree[groupNum][1].concept;
		} else {
			return null;
		}
	};
    
    this.getNumTutoringPoints = function(groupNum){
        if ((this.isTutoringGroup(groupNum)) && 
            (_markup_tree[groupNum][1].SKO_names != null) && 
            (_markup_tree[groupNum][1].SKO_names.length != null)){
            return _markup_tree[groupNum][1].SKO_names.length;
        } else {
            return 0;
        }
    };
	
	this.getTutoringMainDialog = function(groupNum){
		if (this.isTutoringGroup(groupNum)){
            var mainDialogIndex = _markup_tree[groupNum][1].main_dialog_index;
            return this.getTutoringPointDialog(groupNum, mainDialogIndex);
		} else {
			return null;
		}
	};
	
	this.getTutoringPointDialog = function(groupNum, tutoringPoint){
		if (this.isTutoringGroup(groupNum)){
            if ((tutoringPoint != null) && 
                (tutoringPoint < this.getNumTutoringPoints(groupNum))){
                return _markup_tree[groupNum][1].SKO_names[tutoringPoint];
            } else {
                return null;
            }
		} else {
			return null;
		}
	};
};