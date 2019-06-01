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
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
	// get a persistence manager
	PersistenceManager pm = PMF.get().getPersistenceManager();

	// get the log in question
	String log_id = request.getParameter("id");
	SKOLogNew log = pm.getObjectById(SKOLogNew.class, Long.parseLong(log_id));
%>

Log ID: <%= log.getId().toString() %><br/>
GUID: <%= log.getGuid() %><br/>
Timestamp: <%= log.getTimestamp().toString() %><br/>
Log Content:<br/>
<textarea rows="40" cols="80"><%= log.getLogContent().getValue() %></textarea>

</body>
</html>