<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="com.google.appengine.api.users.User"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="org.skoonline.atl.dataservice.security.PermissionManager"%>
<%@page import="org.skoonline.atl.dataservice.security.PermissionConstants"%>
<%@page import="javax.jdo.PersistenceManager"%>
<%@page import="org.skoonline.atl.dataservice.utils.PMF"%>
<%@page import="javax.jdo.Query"%>
<%@page import="org.skoonline.atl.dataservice.entities.SKOLogNew"%>
<%@page import="java.util.List"%>
<%@page import="org.skoonline.atl.dataservice.utils.Misc"%>
<%@page import="org.skoonline.atl.dataservice.ATLGAEUtils"%>
<%
	String guid = request.getParameter("guid");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js"></script>
<title>Insert title here</title>
</head>
<body>
SID: <input type="text" id="sidtext" name="sidtext"><br>
SRT: <input type="text" id="srttext" name="srttext"><br>
<button id="submitbutton" type="button">Submit</button>
</body>
<script>
$(document).ready(function() {
	
		refresh();
		$("#submitbutton").click(function(){
			console.log("button clicked");
			refresh();
		});
	}); 
	
	function refresh(){
		
		var url = "/skolog";
		$.ajax({
			url: url,
			type: "get",
			data: {
				action:"view",
				guid:"<%=guid%>",
				SID:$("#sidtext").val(),
				SRT:$("#srttext").val()
			}
		}).done(function(data){
			console.log(data);
		})
		
	/*	
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		
		// get guid of script to view
		String guid = request.getParameter("guid");
		
		// does the user have permission to view this script
		if (!PermissionManager.checkPermission(currentUser.getNickname(), guid, PermissionConstants.OWNER)) {
			response.flushBuffer();
		} else {
			// get all of the logs for this script and display them
			PersistenceManager pm = PMF.get().getPersistenceManager();
			
			Query query = pm.newQuery(SKOLogNew.class);
			query.setFilter("guid == sko_id");
			//query.setFilter("SRT == 'speak'");
			//query.setFilter("SID == 'Faisal'");
			query.declareParameters("String sko_id");
			query.declareParameters("String speak");

			List<SKOLogNew> logs = null;
			try {
				logs = (List<SKOLogNew>)query.execute(guid);
				console.log(logs);
			} finally {
				pm.close();
			}	
		}		*/
	}
</script>
</html>