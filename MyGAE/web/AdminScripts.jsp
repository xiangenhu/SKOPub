<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
 <%@ page import="com.google.appengine.api.users.User" %>
 <%@ page import="com.google.appengine.api.users.UserService" %>
 <%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
 <%@ page import="javax.jdo.PersistenceManager" %>
 <%@ page import="java.util.List" %>
 <%@ page import="org.skoonline.atl.dataservice.utils.PMF" %>
 <%@ page import="org.skoonline.atl.dataservice.SKOScript" %>
 <%@ page import="javax.jdo.Query" %>
 <%@ page import="org.skoonline.atl.dataservice.ATLGAEUtils" %>
 <%@ page import="org.skoonline.atl.dataservice.utils.Misc" %>
 <%@ page import="org.skoonline.atl.dataservice.security.PermissionConstants" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.net.URLDecoder"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="/css/Views.css"/>
<title>Scripts you authored</title>
<link rel="stylesheet" href="css/datepicker.css">
<link rel="stylesheet" href="css/bootstrap.min.css"/>
    <script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="scripts/bootstrap.min.js"></script>
	<script src="scripts/bootstrap-datepicker.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min.js"></script>	
	<style type="text/css">
		.skoListHeader {
			font-weight: bold;
		}

		.skoListHeader a {
			color: #000;
		}

		.row div a.btn {
			width: 70%;
		}

		#loading {
			position: absolute;
			top: 49%;
			left: 46%;
//			visibility: hidden;
		}
		
		.popupalert {
			display: none;
		}
.container2 {
  margin: 0 auto;
  width: 95%;
  }
  .search-box {
 margin-top: 1%;
  }


	</style>
</head>
<body>

	<div id="loading">
		<div class="alert alert-success">
	  		<strong>Loading </strong> <img src="img/ajax-loader.gif"/>
		</div>
	</div>
	<div class="container2">
		<ul class="nav">	     
	    	<li>	           
	    		<div class="search-box">
	 
	  					<input type="text" class="search-query search-title" placeholder="Title">
	  					<input type="text" class="search-query search-type input-small" placeholder="Script Type">
	  					<input type="text" class="search-query search-author" placeholder="Author">
	  					<span class="input-daterange" id="datepicker" >
		                 	<input type="text" class="search-query input-small search-date-start" name="start" placeholder="MM/DD/YYYY" />
		                 	<span class="add-on" style="vertical-align: top;height:20px">to</span>
		                 	<input type="text" class=" search-query input-small search-date-end" name="end" placeholder="MM/DD/YYYY"/>
		                 </span>
         
                </div>
             </li>
             <li>
                	<div style="margin-top:5px">
	  						<button type="submit" class="btn btn-default navbar-btn">Submit</button>
	  					
  							<button type="submit" class="btn btn-search navbar-btn" value="Search-On" >Search</button>
  					</div>
  			</li>
		</ul>
	

  						
	    	
	<div class="row">
	    	<div class="span3 skoListHeader"><a href="#" id="skoHeaderTitle">Title</a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderScripttype">Script Type</a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderDate">Date<i class="icon-arrow-down"></i></a></div>
	    	<div class="span3 skoListHeader"><a href="#" id="skoHeaderScriptauthor">Author</a></div>
	    	<div class="span1 skoListHeader"><a href="#" id="skoHeaderScriptpublish">Published</a></div>
	    	<div class="span4 skoListHeader">Actions</div>
	</div>
	<div id="skos">
		
	</div>	
	<div id="pager">
			<div class="span1" id="pagerPrev"></div>
			<div class="span1" id="pagerNext"></div>
			<div class="span10"></div>
		</div>
	
</div>

	
	
<script type="text/javascript">
var skos;
var offset = 0;
var page_row=10;
var sortField = "date";
var sortDesc = true;

$(document).ready(function() {
	var QueryString = function () {
		  // This function is anonymous, is executed immediately and 
		  // the return value is assigned to QueryString!
		  var query_string = {};
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    	// If first entry with this name
		    if (typeof query_string[pair[0]] === "undefined") {
		      query_string[pair[0]] = pair[1];
		    	// If second entry with this name
		    } else if (typeof query_string[pair[0]] === "string") {
		      var arr = [ query_string[pair[0]], pair[1] ];
		      query_string[pair[0]] = arr;
		    	// If third or later entry with this name
		    } else {
		      query_string[pair[0]].push(pair[1]);
		    }
		  } 
		    return query_string;
		} ();
	$('.input-daterange').datepicker({
        todayBtn: "linked"
    });
	$(".search-box").hide();
	$(".btn-default").hide();
	
	$(".btn-search").click(function(){
		
		console.log($('.btn-search').val());
		
		if($('.btn-search').val() == "Search-On"){
			
			console.log("Search Box Showing...");
			$(".search-box").fadeIn();
			$(".btn-default").fadeIn();
			$('.btn-search').val("Search-Off");
			$('.btn-search').text("Close");
		}
		else{
			console.log("Search Box Closing...");
			$(".search-box").fadeOut();
			$(".btn-default").fadeOut();
			$('.btn-search').val("Search-On");
			$('.btn-search').text("Search");
			$(".search-title").val("");
			$(".search-type").val("");
			$(".search-author").val("");
			$(".search-date-start").val("");
			$(".search-date-end").val("");
			loadData();
		}
			
		
	})

	$(".btn-default").click(function(){
		console.log("Filter button clicked");
		loadData();
	})	
	
	
	
	
	console.log("READY");
	loadData();
	
	
	$(".btnTrash").each(function(i, e) {
		$(this).click(confirmDelete);
	});

	$("a.notes").each(function(i, e) {
		$(this).click(showNotes);
	});

	$("span.timestamp").each(function (i, e) {
		var serverTime = $(this).attr("utc");
		var localTime = new Date(serverTime);
		$(this).html(localTime.toLocaleDateString() + " " + localTime.toLocaleTimeString());
	});
	
	function loadData(){
		$("#loading").show();
		offset = 0;
		var endpoint = "/admindata";
		var method = "GET";
		var params = {title:$(".search-title").val(), type:$(".search-type").val(), author:$(".search-author").val(), start_date:$(".search-date-start").val(), end_date:$(".search-date-end").val()};
		var opts = {url:endpoint, type:method, data: params, success: dataLoadSucess};
		console.log(opts);
		$.ajax(opts);
	}
	function dataLoadSucess(result){
		console.log("Success"+result);

		$("#loading").hide();
		if(result.indexOf("error") > -1){
			$(".container2").remove();
		
			//alert("You must be a superuser to access this page.  Please logout and log back in as a user with superuser permissions.");
			$("body").append("<b>You must be a superuser to access this page.  Please logout and log back in as a user with superuser permissions.</b>");
		}
		else{		
		console.log(JSON.parse(result));
		skos=JSON.parse(result);
		refresh();
		}
	}
	function showNotes() {
	}

	function confirmDelete(guid) {
		var needle = guid;//$(this).attr("guid");
		console.log(guid);
		var confirmResult = confirm("Are you sure you want to delete this script?");
		if (confirmResult) {
			var endpoint = "/delete";
			var method = "GET";
			var params = {json:"{guid:" + needle + "}"};
			var opts = {url:endpoint, type:method, data: params, success: refreshPage};
			$.ajax(opts);
		}
	}

	function refreshPage(result) {
		var error = eval("(" + result + ")");
		if (error.complete)
			alert(error.complete);
		else
			alert(error.error);
		window.location.reload();
	}

	function refresh(){
		
		console.log("refresh:"+ QueryString.BURLA);
		var content = $("#skos");
		$(content).find("div.row").remove();
		//for (var i = 0; i < skos.length ; i++) {
		for (var i = offset*page_row; i < offset*page_row+page_row ; i++) {
			
			if(i >= skos.length)
				break;
			
			var skoDate = unescape(skos[i].updatedDate);
			var mDate = moment(skoDate);
			var month = mDate.month() + 1;
			var fmtDate = month.toString() + "/" + mDate.date().toString() + "/" + mDate.year().toString();
			var hour = mDate.hour(); 
			var minute = mDate.minute();
			var ampm =  (hour > 11) ? "AM" : "PM";
			hour = (hour > 12) ? hour - 12 : hour;
			minute = (minute < 10) ? "0" + minute : minute.toString(); 
			fmtDate += " " + hour + ":" + minute + " " + ampm;
		
			//var title = $("<div>").addClass("span4").html(unescape(skos[i].skoTitle));
			var skoDate = unescape(skos[i].lastUpdated);
			var mDate = moment(skoDate);
			var month = mDate.month() + 1;
			var fmtDate = month.toString() + "/" + mDate.date().toString() + "/" + mDate.year().toString();
			var hour = mDate.hour(); 
			var minute = mDate.minute();
			var ampm =  (hour > 11) ? "AM" : "PM";
			hour = (hour > 12) ? hour - 12 : hour;
			minute = (minute < 10) ? "0" + minute : minute.toString(); 
			fmtDate += " " + hour + ":" + minute + " " + ampm;
		
			var title = $("<div>").addClass("span3").html(unescape(skos[i].title));
			
			
			var scriptType = $("<div>").addClass("span2").html(unescape(skos[i].scriptType));
			var date = $("<div>").addClass("span2").html(fmtDate);
			var author = $("<div>").addClass("span3").html(unescape(skos[i].createdBy));
			var published = $("<div>").addClass("span1").html(unescape(skos[i].published));
			var tableRow = $("<div>").addClass("row");
			$(tableRow).append(title).append(scriptType).append(date).append(author).append(published);
			
			var guid = unescape(skos[i].guid);
			
			
			var viewUrl = "https://asat.x-in-y.com/player1024768.html?guid="+guid;//"guid="+guid;
			var editUrl = "https://asat.x-in-y.com/author1024768.html?guid="+guid;//"guid="+guid;
			if(QueryString.BURLP){
				viewUrl = QueryString.BURLP+"?guid="+guid;
			}
			if(QueryString.BURLA){
				editUrl = QueryString.BURLA+"?guid="+guid;
			}

			var detailsUrl = "/permissions.jsp?guid="+guid+"&&BURLP="+viewUrl+"&&BURLA="+editUrl;
			//var historyUrl = "/history?sko_id="+guid;

			var viewBtn = $("<a>").addClass("btn").attr({"href": viewUrl, "target": "view"}).html("View");
			var editBtn = $("<a>").addClass("btn").attr({"href": editUrl, "target": "editor"}).html("Edit");
			var detailsBtn = $("<a>").addClass("btn").attr({"href": detailsUrl, "target": "details"}).html("Details");
			var trashBtn = $("<a>").addClass("btn").addClass("btnTrash").data("guid", guid).html('<i class="icon-trash"></i>');
			//var restoreBtn = $("<a>").addClass("btn").addClass("btnRestore").data("guid", guid).html('<i class="icon-refresh"></i>');
			//var historyBtn = $("<a>").addClass("btn").attr({"href": historyUrl, "target": "history"}).html("History");

			var viewCell = $("<div>").addClass("span1");
			$(viewCell).append(viewBtn);
			var editCell = $("<div>").addClass("span1");
			$(editCell).append(editBtn);
			var detailsCell = $("<div>").addClass("span1");
			$(detailsCell).append(detailsBtn);		
			var trashCell = $("<div>").addClass("span1");
			$(trashCell).append(trashBtn);
			$(trashBtn).click(function() {
				
				var guid = $(this).data("guid");
				confirmDelete(guid);
				
			})
			
			$(tableRow).append(trashCell);
			$(tableRow).append(editCell);
			$(tableRow).append(viewCell);
			$(tableRow).append(detailsCell);	
			
			
			
			$(tableRow).css({"marginBottom": "5px", "paddingBottom": "5px"});
			
			if (i != skos.length - 1) {
				$(tableRow).css({"borderBottom": "1px solid #E8E8E8"});
			}
			
			
			$("#skos").append(tableRow);
		}
		
		$("#pagerNext").empty();
		$("#pagerPrev").empty();
   		var pageCount = Math.ceil(skos.length/page_row);
		console.log(pageCount + " "+ offset);
		if (offset > 0 ) {
			var prevLink = $("<a>").addClass("btn").addClass("prevLink").html("Prev").click(function() {		
				--offset;
				refresh();
			});
			$("#pagerPrev").append(prevLink);
		}
		
		if (offset < pageCount-1) {
			var nextLink = $("<a>").addClass("btn").addClass("nextLink").html("Next").click(function() {
				++offset;
				refresh();
			});
			$("#pagerNext").append(nextLink);
		}		
	}	
    $(".skoListHeader a").click(function() {
		$(tabId(sortField)).find("i").remove();
		var id = $(this).attr("id").toLowerCase().substr(9);
		if (sortField != id) {
			sortField = id;
			sortDesc = false;
		} else {
			sortDesc = !sortDesc;
		}

		updateSort();
	});
	
	
	function updateSort() {
		console.log("updateSort=>" + sortField + "=>" + sortDesc);
		console.log(skos)
		var tab = tabId(sortField);
		$(tab).find("i").remove();
		var iconId = (sortDesc == false) ? "icon-arrow-down" : "icon-arrow-up";
		$(tab).append($("<i>").addClass(iconId));
		if(sortField == 'title')
			skos.sort(sort_by_title);
		
		if(sortField == 'scripttype')
			skos.sort(sort_by_type);
		if(sortField == 'scriptauthor')
			skos.sort(sort_by_author);
		
		
		if(sortField == 'date')
			skos.sort(sort_by_date);
		if(sortField == 'scriptpublish')
			skos.sort(sort_by_publish);

		
		if(sortDesc)
			skos.reverse();
		
		refresh();
	};

	function sort_by_title(x,y){
		var xTitle = x.title.toUpperCase();
		var yTitle = y.title.toUpperCase();
		return ((xTitle == yTitle) ? 0 : ((xTitle > yTitle) ? 1 : -1 ));
	}
	function sort_by_type(x,y){
		return ((x.scriptType == y.scriptType) ? 0 : ((x.scriptType > y.scriptType) ? 1 : -1 ));
	}
	function sort_by_author(x,y){
		var xTitle = x.createdBy.toUpperCase();
		var yTitle = y.createdBy.toUpperCase();
		return ((xTitle == yTitle) ? 0 : ((xTitle > yTitle) ? 1 : -1 ));
	}
	function sort_by_publish(x,y){
		return ((x.published == y.published) ? 0 : ((x.published > y.published) ? 1 : -1 ));
	}
	function sort_by_date(x,y){
		var mDatex = moment(unescape(x.lastUpdated));
		var mDatey = moment(unescape(y.lastUpdated));
		return ((mDatex == mDatey) ? 0 : ((mDatex > mDatey) ? 1 : -1 ));
	}

	function tabId(id) {
		var tabId = "skoHeader" + id[0].toUpperCase() + id.substr(1);
		return $("#" + tabId);
	};
	
});
</script>

</body>
</html>