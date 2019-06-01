<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.UUID" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
	User currentUser = UserServiceFactory.getUserService().getCurrentUser();
	if (currentUser == null) 
		response.sendRedirect(UserServiceFactory.getUserService().createLoginURL(request.getRequestURI()));

	Date timestamp = new Date();
	UUID guid = UUID.randomUUID();
%>
	<p>
		Current User: <%= currentUser.getNickname() %>
	</p>
	<p>
		Timestamp: <%= timestamp.toString() %>
	</p>
	<p>
		GUID: <%= guid.toString() %>
	</p>
	<hr/>
	<form action="/script" method="post">
		Component Type: <input type="text" name="componentType"/><br/>
		Script Type: <input type="text" name="scriptType"/><br/>
		Resource Type: <input type="text" name="resourceType"/><br/>
		Resource Location: <input type="text" name="resourceLocation"/><br/>
		Title: <input type="text" name="title"/><br/>
		Notes: <input type="text" name="notes"/><br/>
		<textarea cols="80" rows="20" name="scriptContent"></textarea><br/>
		Published: <input type="checkbox" name="published" value="is_published"/><br/>
		<input type="hidden" name="createdBy" value="<%= currentUser.getNickname() %>"/>
		<input type="hidden" name="timestamp" value="<%= timestamp.toString() %>"/>
		<input type="hidden" name="guid" value="<%= guid.toString() %>"/>
		<input type="submit" value="Add"/>
	</form>
</body>
</html>