var STUDENT_PROPERTY = 'student';
var CONCEPT_PROPERTY = 'concept';
var KNOWLEDGE_LEVEL_PROPERTY = 'knowledge_level';

function student_model_cache (student,cache){

	//Private Variable
	var _cache = cache;
	var _student = student; 

	//Private function
	function calculate_knowledge(concept){
		// Call to a server;
		//now just for demo
	   if(concept=='SimpleSKO')
	        return 1;
	    else
	        return 0.5;
	}
	
	function find_in_cache(_concept){

		for( obj in _cache){
			if(_cache[obj].hasOwnProperty(STUDENT_PROPERTY) && _cache[obj].hasOwnProperty(CONCEPT_PROPERTY)){
				if(_cache[obj].student == _student && _cache[obj].concept == _concept)
				{
					console.log('knowledge found in cache');
					return _cache[obj].knowledge_level;
				}
			}
		}
		return -1;
	}

	// Public Function
	this.clear_cache = function(){
		console.log('cache clear');
		// cache clear;
	}
	this.show_cache = function(){
		console.log(JSON.stringify(_cache));
	}
	function add_knowledge_to_cache(concept,knowledge_level){
			var element_str = '{"' + STUDENT_PROPERTY + '":"' + _student + '","' +
									 CONCEPT_PROPERTY + '":"' + concept + '","' + 
									 KNOWLEDGE_LEVEL_PROPERTY + '":0}';
			console.log(element_str);
			cache_element =  JSON.parse(element_str);
			_cache.push(cache_element);
	}

	this.get_knowledge = function(concept){

		var knowledge_level=0;
		knowledge_level = find_in_cache(concept);
		if(knowledge_level <0 ){
			console.log('knowledge not found in cache');
			knowledge_level = calculate_knowledge(concept);
			add_knowledge_to_cache(concept,knowledge_level);
		}
		return knowledge_level;
	}
}


// This function is to test the student_model_cache object
function student_model_cache_start(){

	var cacheStr = '[{"student":"faisal","concept":"SimpleSKO","knowledge_level":1}]';
	var cache = JSON.parse(cacheStr);

	var me = new student_model_cache("faisal",cache);
	console.log(me.get_knowledge("SimpleSKO"));
	console.log(me.get_knowledge("ComplexSKO"));

	//me.show_cache()
}