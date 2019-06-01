<%@ page language="java" contentType="text/html; charset=US-ASCII"
    pageEncoding="US-ASCII"%>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@page import="java.util.logging.Logger" %>

<%
Logger Log=Logger.getLogger(this.getClass().getName());

	User currentUser = UserServiceFactory.getUserService().getCurrentUser();
	String nickname = "";
	if (currentUser != null) {
		nickname = currentUser.getNickname().toLowerCase();
		if (!nickname.contains("@"))
			nickname += "@gmail.com";
	}
	
	String baseURL = (String)request.getParameter("BURL");
	
	String baseURLA = (String)request.getParameter("BURLA");
	String baseURLP = (String)request.getParameter("BURLP");
	

	
	


	if(baseURL == null){
		baseURL= "https://asat.x-in-y.com";
	}
	baseURL = baseURL.replaceAll("/+$", "");
	String domainURL =  request.getServerName();
	
	if(baseURLP == null){
		baseURLP = baseURL+"/player1024768.html";
	}
	else{
		baseURLP = baseURLP.replaceAll("\\?", "");
	//	baseURLP = baseURLP+"?";
	}
	
	if(baseURLA == null){
		baseURLA = baseURL+"/author1024768.html";
	}
	else{
		baseURLA = baseURLA.replaceAll("\\?", "");
	//	baseURLA = baseURLA+"?";
	}
	
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>SKOs associated with: <%= nickname %></title>
	<link rel="stylesheet" href="css/datepicker.css">
	<link rel="stylesheet" href="css/bootstrap.min.css"/>
	<style type="text/css">
		.skoListHeader {
			font-weight: bold;
		}

		.skoListHeader a {
			color: #000;
		}

		.row div a.btn {
			width: 80%;
		}

		#loading {
			position: absolute;
			top: 49%;
			left: 46%;
			visibility: hidden;
		}
		
		.popupalert {
			display: none;
		}
	</style>
</head>
<body>
<div align="center">Click <a href="/author1024768.html" target="_top">here</a> to create new script.</div>
<br/>
	<div id="loading">
		<div class="alert alert-success">
	  		<strong>Loading </strong> <img src="img/ajax-loader.gif"/>
		</div>
	</div>

	<div class="container">
		<div class="row">
			<div class="span4"></div>
			<div class="span4">
				<div class="alert popupalert">
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					SKO has been moved to the trash bin.  <a href="/trash.jsp">View Trash Bin</a>
				</div>
			</div>
			<div class="span4"></div>
		</div>
	    <ul class="nav nav-tabs">
	    	<li id="tabOwner" class="active"><a href="#">Owner</a></li>
	    	<li id="tabCreator"><a href="#">Creator</a></li>
	    	<li id="tabCollaborator"><a href="#">Collaborator</a></li>
	    	<li id="tabViewer"><a href="#">Viewer</a></li>
	    	<li id="trash"><a href="/trash.jsp">Trash Bin</a></li>
		    <li>
	    		<button type="button" class="btn btn-default btn-search" style="margin-top:5%"value="Search-On" >Search</button>
	    		
	    	</li>	     
 	    	<li>	            
	    		<div class="search-box">

	  					<form class="form-inline"  role="form">
	  					<input type="name" class="form-control  search-title" style="height:25px" id="search-title" placeholder="Enter Title">
	  					<input type="name" class="form-control  search-type input-small"  style="height:25px" id="search-type" placeholder="Enter Type">
		                 	<input type="date" class="form-control  search-date-start" style="height:25px" name="start" placeholder="MM/DD/YYYY" />
		                 	<span class="add-on" style="vertical-align: center;height:25px">to</span>
		                 	<input type="date" class="form-control  search-date-end" style="height:25px" name="end" placeholder="MM/DD/YYYY"/>
		                <button type="button" id ="btn-submit"class="btn btn-primary">Submit</button>
		             </form>
                </div>
  						
	    	</li>	    	
	    	<!--  
	    	<li>
	    		 <button type="submit" class="btn btn-search navbar-btn pull-right" value="Search-On" >Search</button>
	    	</li>	     
	    	<li>	            
	    			<div class="search-box container">
	    			<div>
	  					<input type="text" class="search-query search-title" placeholder="Title">
	  					<input type="text" class="search-query search-type" placeholder="Script Type">
	  					</div>
	  					<p/>
	  					<div class="input-daterange" id="datepicker" >
		                    <input type="text" class="input-small search-date-start" name="start" placeholder="MM/DD/YYYY" />
		                    <span class="add-on" style="vertical-align: top;height:20px">to</span>
		                    <input type="text" class="input-small search-date-end" name="end" placeholder="MM/DD/YYYY"/>
                		</div>
                		<div>
	  						<button type="submit" class="btn btn-default navbar-btn">Submit</button>
	  						<span class="total-search-found"></span>
	  					</div>	
	  					
  					</div>	
  						
	    	</li>-->
	    	
	    </ul>

	    <div class="row">
	    	<div class="span4 skoListHeader"><a href="#" id="skoHeaderTitle">Title</a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderScripttype">Script Type</a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderDate">Date<i class="icon-arrow-down"></i></a></div>
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
    <script src="https://code.jquery.com/jquery-latest.js"></script>
	<script src="scripts/bootstrap.min.js"></script>
	<script src="scripts/bootstrap-datepicker.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min.js"></script>
	<script>
		$(function() {
            $('.input-daterange').datepicker({
                todayBtn: "linked"
            });
			$(".search-box").hide();
			
			var sortField = "date";
			var sortDesc = true;
			var currentTab = "owner";
			var offset = 0;
			var permissions = {
					"owner": 8,
					"creator": 4,
					"collaborator": 2,
					"viewer": 1
			};
			
			var months = [
				"Jan.",
				"Feb.",
				"Mar.",
				"Apr.",
				"May",
				"Jun.",
				"Jul.",
				"Aug.",
				"Sep.",
				"Oct.",
				"Nov.",
				"Dec."
			];

			$(".btn-search").click(function(){
				//console.log("Filter button clicked");
				
				console.log($('.btn-search').val());
				
				if($('.btn-search').val() == "Search-On"){
					$(".search-box").fadeIn();
					$('.btn-search').val("Search-Off");
					$('.btn-search').text("Close");
				}
				else{
					$(".search-box").fadeOut();
					$('.btn-search').val("Search-On");
					$('.btn-search').text("Search");
					$(".search-title").val("");
					$(".search-type").val("");
					$(".search-date-start").val("");
					$(".search-date-end").val("");
					refresh();
				}
					
				
			})

			$("#btn-submit").click(function(){
				console.log("Filter button clicked");
				refresh();
			})
 
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

			$(".nav li").click(function() {
				var isActive = $(this).hasClass("active");
				if (!isActive) {
					var activeTab = $(".nav").find(".active");
					activeTab.removeClass("active");
					$(this).addClass("active");
					currentTab = $(this).attr("id").substr(3).toLowerCase();
					offset = 0;
					updateSKOs();
				}
			});
			
			$(".nextLink").click(function() {
				++offset;
				refresh();
			});
			
			$(".prevLink").click(function() {
				--offset;
				refresh();
			});

			function updateSKOs() {
				refresh();
			}

			function tabId(id) {
				var tabId = "skoHeader" + id[0].toUpperCase() + id.substr(1);
				return $("#" + tabId);
			}

			function updateSort() {
				var tab = tabId(sortField);
				var iconId = (sortDesc == true) ? "icon-arrow-down" : "icon-arrow-up";
				$(tab).append($("<i>").addClass(iconId));
				refresh();
			}

			function init() {
				refresh();
			}

			function refresh() {
				<% Log.info( "REFRESH CALLING..." ); %>
				var url = "/myscriptsdata";
				$("#loading").css("visibility","visible");
				$.ajax({
					url: url,
					type: "get",
					data: {
						permissionLevel: permissions[currentTab],
						offset: offset,
						search_title: $(".search-title").val(),
						search_type: $(".search-type").val(),
						search_date_start: $(".search-date-start").val(),
						search_date_end: $(".search-date-end").val(),
						sortField: sortField,
						sortDescending: sortDesc
					}
				}).done(function(data){
					var pageData = JSON.parse(data);
					
					if (pageData.loginUrl != null) {
						window.location.href = pageData.loginUrl;
					}
					
					$("#loading").css("visibility","hidden");
					
					var content = $("#skos");
					$(content).find("div.row").remove();
					var skos = pageData.skos;
					console.log(skos);
					
					$(".total-search-found").html('<font color="gray">Total Found: '+ pageData.totalSko +'</font>');
					
					for (var i = 0; i < skos.length; i++) {
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
					
						var title = $("<div>").addClass("span4").html(unescape(skos[i].title));
						var scriptType = $("<div>").addClass("span2").html(unescape(skos[i].scriptType));
						//var date = $("<div>").addClass("span2").html(unescape(skos[i].lastUpdated));
						var date = $("<div>").addClass("span2").html(fmtDate);
						var tableRow = $("<div>").addClass("row");
						$(tableRow).append(title).append(scriptType).append(date);
						
						var guid = unescape(skos[i].guid);
											
						var viewUrl = "<%=baseURLP%>"+"?guid="+guid;
						var editUrl = "<%=baseURLA%>"+"?guid="+guid;
						var detailsUrl = "https://"+"<%=domainURL%>"+"/permissions.jsp?guid="+guid+"&BURLA="+"<%=baseURLA%>"+"&BURLP="+"<%=baseURLP%>"+"&BURL="+"<%=baseURL%>";
						
						var viewBtn = $("<a>").addClass("btn").attr({"href": viewUrl, "target": "editor"}).html("View");
						var editBtn = $("<a>").addClass("btn").attr({"href": editUrl, "target": "editor"}).html("Edit");
						var detailsBtn = $("<a>").addClass("btn").attr({"href": detailsUrl, "target": "editor"}).html("Details");
						var trashBtn = $("<a>").addClass("btn").addClass("btnTrash").data("guid", guid).html('<i class="icon-trash"></i>');
						
						$(trashBtn).click(function() {
							var guid = $(this).data("guid");
							$.ajax({
								url: "/trash",
								type: "post",
								data: {
									guid: guid
								}
							}).done(function(data) {
								$(".popupalert").css({"display": "block"});
								refresh();
							});
						});
						
						var viewCell = $("<div>").addClass("span1");
						$(viewCell).append(viewBtn);
						var editCell = $("<div>").addClass("span1");
						$(editCell).append(editBtn);
						var detailsCell = $("<div>").addClass("span1");
						$(detailsCell).append(detailsBtn);
						
						if (permissions[currentTab] > 2) {
							var trashCell = $("<div>").addClass("span1");
							$(trashCell).append(trashBtn);
						}
						
						$(tableRow).append(trashCell);
						$(tableRow).append(editCell);
						$(tableRow).append(detailsCell);
						
						if (unescape(skos[i].scriptType) != "ContentAnalysis") {
							$(tableRow).append(viewCell);
						} else {
							$(tableRow).append($("<div>"));
						}
						
						$(tableRow).css({"marginBottom": "5px", "paddingBottom": "5px"});
						
						if (i != skos.length - 1) {
							$(tableRow).css({"borderBottom": "1px solid #E8E8E8"});
						}
						
						$("#skos").append(tableRow);
						
						
						
					}
					// construct pager
					$("#pagerNext").empty();
					$("#pagerPrev").empty();
					
					/*
					Paging handles here
					*/
// 					var pageCount = skos.length / 10;
// 					if (skos.length % 10 != 0)
// 						++pageCount;
//					var currentpage = 0;
	
					var pageCount = pageData.pageCount;
					var currentpage = pageData.currentPage + 1;
					
					
					if (offset > 0) {
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
				});
			}

			init();
			
			
		});
	</script>
</body>
</html>