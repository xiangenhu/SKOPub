/* Flex Level Popup Menu v1.0
* Created: Dec 27th, 2009 by DynamicDrive.com. This notice must stay intact for usage 
* Author: Dynamic Drive at http://www.dynamicdrive.com/
* Visit http://www.dynamicdrive.com/ for full source code
*/

//Version 1.1 (March 5th, 2010): Each flex menu (UL) can now be associated with a link dynamically, and/or defined using JavaScript instead of as markup.
//Version 1.2 (July 1st, 2011): Menu updated to work properly in popular mobile devices such as iPad/iPhone and Android tablets.


//Usage: $(elementselector).addpopupmenu('menuid')
//ie:
//jQuery(document).ready(function($){
	//$('a.mylinks').addpopupmenu('popupmenu1') //apply popup menu with ID "popmenu1" to links with class="mylinks"
//})

jQuery.noConflict()

var timeEnter;
var timeSpent;
var timeLeave;

var jquerypopupmenu={
	arrowpath: 'img/arrow.gif', //full URL or path to arrow image
	popupmenuoffsets: [0, 0], //additional x and y offset from mouse cursor for popup menus
	animspeed: 200, //reveal animation speed (in milliseconds)
	showhidedelay: [150, 150], //delay before menu appears and disappears when mouse rolls over it, in milliseconds

	//***** NO NEED TO EDIT BEYOND HERE
	startzindex:1000,
	ismobile:navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null, //boolean check for popular mobile browsers
	builtpopupmenuids: [], //ids of popup menus already built (to prevent repeated building of same popup menu)

	positionul:function($, $ul, e){
		var istoplevel=$ul.hasClass('jqpopupmenu') //Bool indicating whether $ul is top level popup menu DIV
		var docrightedge=$(document).scrollLeft()+$(window).width()-40 //40 is to account for shadows in FF
		var docbottomedge=$(document).scrollTop()+$(window).height()-40
		if (istoplevel){ //if main popup menu DIV
			var x=e.pageX+this.popupmenuoffsets[0] //x pos of main popup menu UL
			var y=e.pageY+this.popupmenuoffsets[1]
			x=(x+$ul.data('dimensions').w > docrightedge)? docrightedge-$ul.data('dimensions').w : x //if not enough horizontal room to the ridge of the cursor
			y=(y+$ul.data('dimensions').h > docbottomedge)? docbottomedge-$ul.data('dimensions').h : y
		}
		else{ //if sub level popup menu UL
			var $parentli=$ul.data('$parentliref')
			var parentlioffset=$parentli.offset()
			var x=$ul.data('dimensions').parentliw //x pos of sub UL
			var y=0

			x=(parentlioffset.left+x+$ul.data('dimensions').w > docrightedge)? x-$ul.data('dimensions').parentliw-$ul.data('dimensions').w : x //if not enough horizontal room to the ridge parent LI
			y=(parentlioffset.top+$ul.data('dimensions').h > docbottomedge)? y-$ul.data('dimensions').h+$ul.data('dimensions').parentlih : y
		}
		$ul.css({left:x, top:y})
	},
	
	showbox:function($, $popupmenu, e){
		clearTimeout($popupmenu.data('timers').hidetimer)
		$popupmenu.data('timers').showtimer=setTimeout(function(){$popupmenu.show(jquerypopupmenu.animspeed)}, this.showhidedelay[0]);
	},

	hidebox:function($, $popupmenu){
		clearTimeout($popupmenu.data('timers').showtimer)
		$popupmenu.data('timers').hidetimer=setTimeout(function(){$popupmenu.hide(100)}, this.showhidedelay[1]) //hide popup menu plus all of its sub ULs
	},


	buildpopupmenu:function($, $menu, $target){
		$menu.css({display:'block', visibility:'hidden', zIndex:this.startzindex}).addClass('jqpopupmenu').appendTo(document.body)
		$menu.bind('mouseenter', function(){
			clearTimeout($menu.data('timers').hidetimer);
		})		
		$menu.bind('mouseleave', function(){ //hide menu when mouse moves out of it
			jquerypopupmenu.hidebox($, $menu);
		})
		$menu.data('dimensions', {w:$menu.outerWidth(), h:$menu.outerHeight()}) //remember main menu's dimensions
		$menu.data('timers', {})
		var $lis=$menu.find("ul").parent() //find all LIs within menu with a sub UL
		$lis.each(function(i){
			var $li=$(this).css({zIndex: 1000+i})
			var $subul=$li.find('ul:eq(0)').css({display:'block'}) //set sub UL to "block" so we can get dimensions
			$subul.data('dimensions', {w:$subul.outerWidth(), h:$subul.outerHeight(), parentliw:this.offsetWidth, parentlih:this.offsetHeight})
			$subul.data('$parentliref', $li) //cache parent LI of each sub UL
			$subul.data('timers', {})
			$li.data('$subulref', $subul) //cache sub UL of each parent LI
			$li.children("a:eq(0)").append( //add arrow images
				'<img src="'+jquerypopupmenu.arrowpath+'" class="rightarrowclass" style="border:0;" />'
			)
			$li.bind(jquerypopupmenu.triggerevt, function(e){ //show sub UL when mouse moves over parent LI
			    timeEnter=new Date();
				var $targetul=$(this).css('zIndex', ++jquerypopupmenu.startzindex).addClass("selected").data('$subulref')
				if ($targetul.queue().length<=1){ //if 1 or less queued animations
					clearTimeout($targetul.data('timers').hidetimer)
					$targetul.data('timers').showtimer=setTimeout(function(){
						jquerypopupmenu.positionul($, $targetul, e)
						$targetul.show(jquerypopupmenu.animspeed)
					}, jquerypopupmenu.showhidedelay[0])
					if (jquerypopupmenu.triggerevt=="click" && $(e.target).next('ul').length==1) //if LI being clicked on is a menu header
						return false
				}
			})
			$li.bind('mouseleave', function(e){ //hide sub UL when mouse moves out of parent LI
			
				var $targetul=$(this).data('$subulref'); 
				var qestion=$(this).find("a").html().replace(/<\/?[^>]+(>|$)/g, "");
				var Answer=$(this).find("li").find("a").html().replace(/<\/?[^>]+(>|$)/g, "");
				displayDebugging('#DebuggingArea',$(this).find("a").html());
				displayDebugging('#DebuggingArea',$(this).find("li").find("a").html());
				timeLeave=new Date();
				timeSpent=(timeLeave-timeEnter);
				displayDebugging('#DebuggingArea',timeSpent.toString());
				var aStatementA =composeViewHintsStatement(qestion,Answer,timeEnter,timeSpent);
				sendStatement(aStatementA);
				
				clearTimeout($targetul.data('timers').showtimer)
				$targetul.data('timers').hidetimer=setTimeout(function(){$targetul.hide(100).data('$parentliref').removeClass('selected')}, jquerypopupmenu.showhidedelay[1])
			})
		})
		$menu.find('ul').andSelf().css({display:'none', visibility:'visible'}) //collapse all ULs again
		$menu.data('$targetref', $target)
		this.builtpopupmenuids.push($menu.get(0).id) //remember id of popup menu that was just built
	},

	

	init:function($, $target, $popupmenu){
		this.triggerevt=(this.ismobile)? "click" : "mouseenter"
		this.showhidedelay[0]=(this.ismobile)? 0 : this.showhidedelay[0]
		if (this.builtpopupmenuids.length==0){ //only bind click event to document once
			$(document).bind("click", function(e){
				if (e.button==0){ //hide all popup menus (and their sub ULs) when left mouse button is clicked
					$('.jqpopupmenu').find('ul').andSelf().hide()
				}
			})
		}
		if (jQuery.inArray($popupmenu.get(0).id, this.builtpopupmenuids)==-1) //if this popup menu hasn't been built yet
			this.buildpopupmenu($, $popupmenu, $target)
		if ($target.parents().filter('ul.jqpopupmenu').length>0) //if $target matches an element within the popup menu markup, don't bind onpopupmenu to that element
			return
		$target.bind(jquerypopupmenu.triggerevt, function(e){
			$popupmenu.css('zIndex', ++jquerypopupmenu.startzindex)
			jquerypopupmenu.positionul($, $popupmenu, e)
			jquerypopupmenu.showbox($, $popupmenu, e)
			if (jquerypopupmenu.triggerevt=="click")
				e.preventDefault()
		})
		$target.bind("mouseleave", function(e){
			jquerypopupmenu.hidebox($, $popupmenu)
		})
	}
}

jQuery.fn.addpopupmenu=function(popupmenuid){
	var $=jQuery
	return this.each(function(){ //return jQuery obj
		var $target=$(this)
			jquerypopupmenu.init($, $target, $('#'+popupmenuid))
	})
};

//By default, add popup menu to anchor links with attribute "data-popupmenu"

// jQuery(document).ready(function($){
//	var $anchors=$('*[data-popupmenu]')
//	$anchors.each(function(){
//		$(this).addpopupmenu(this.getAttribute('data-popupmenu'))
//	})
//})

//ddlistmenu: Function to define a UL list menu dynamically

function ddlistmenu(id, className){
	var menu=document.createElement('ul')
	if (id)
		menu.id=id
	if (className)
		menu.className=className
	this.menu=menu
}

ddlistmenu.prototype={
	addItem:function(url, text, target){
		var li=document.createElement('li')
		li.innerHTML='<a href="'+url+'" target="'+target+'">'+text+'</a>'
		this.menu.appendChild(li)
		this.li=li
		return this
	},
	addSubMenu:function(){
		var s=new ddlistmenu(null, null)
		this.li.appendChild(s.menu)
		return s

	}
}