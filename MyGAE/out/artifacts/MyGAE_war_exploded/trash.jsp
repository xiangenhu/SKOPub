<%@ page language="java" contentType="text/html; charset=US-ASCII"
    pageEncoding="US-ASCII"%>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.users.User" %>

<%
	User currentUser = UserServiceFactory.getUserService().getCurrentUser();
	String nickname = "";
	if (currentUser != null) {
		nickname = currentUser.getNickname().toLowerCase();
		if (!nickname.contains("@"))
			nickname += "@gmail.com";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>SKOs in trash associated with: <%= nickname %></title>
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
					SKO has been moved to your scripts.  <a href="/myScripts.jsp">View Scripts</a>
				</div>
			</div>
			<div class="span4"></div>
		</div>
	    <ul class="nav nav-tabs">
	    	<li id="tabOwner"><a href="/myScripts.jsp">Your Scripts</a></li>
	    </ul>

	    <div class="row">
	    	<div class="span4 skoListHeader"><a href="#" id="skoHeaderTitle">Title<i class="icon-arrow-up"></i></a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderScripttype">Script Type</a></div>
	    	<div class="span2 skoListHeader"><a href="#" id="skoHeaderDate">Date</a></div>
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
    <script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="scripts/bootstrap.min.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min.js"></script>
	<script>
		$(function() {
			var sortField = "title";
			var sortDesc = false;
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
			
			$(".btnTrash").click(function() {
				var guid = $(this).data("guid");
				var url = "/trash"
				var type = "post"
				var data = {
					guid: guid
				};
				$.ajax({
					url: url,
					type: type,
					data: data
				}).done(function(data) {
					$(".popupalert").css({"display": "block"});
					refresh();
				});
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
				var url = "/trash";
				$("#loading").css("visibility","visible");
				$.ajax({
					url: url,
					type: "get",
					data: {
						permissionLevel: permissions[currentTab],
						offset: offset,
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
						
						var restoreBtn = $("<a>").addClass("btn").addClass("btnRestore").data("guid", guid).html('<i class="icon-refresh"></i>');
						
						$(restoreBtn).click(function() {
							var guid = $(this).data("guid");
							$.ajax({
								url: "/trash?guid=" + guid,
								type: "delete"
							}).done(function(data) {
								$(".popupalert").css({"display": "block"});
								refresh();
							});
						});
						
						var restoreCell = $("<div>").addClass("span1");
						$(restoreCell).append(restoreBtn);
						
						$(tableRow).append(restoreCell);
						
						$(tableRow).css({"marginBottom": "5px", "paddingBottom": "5px"});
						
						if (i != skos.length - 1) {
							$(tableRow).css({"borderBottom": "1px solid #E8E8E8"});
						}
						
						$("#skos").append(tableRow);
						
						
						
					}
					// construct pager
					$("#pagerNext").empty();
					$("#pagerPrev").empty();
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