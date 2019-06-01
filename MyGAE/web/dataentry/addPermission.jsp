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
%>
	<form action="/permission" method="post">
		GUID: <input type="text" name="guid"/><br/>
		Nickname: <input type="text" name="user"/><br/>
		Permissions:<br/>
		<input type="checkbox" name="permission" value="owner"/>&nbsp;Owner<br/>
		<input type="checkbox" name="permission" value="collaborator"/>&nbsp;Collaborator<br/>
		<input type="checkbox" name="permission" value="viewer"/>&nbsp;Viewer<br/>
		<input type="submit" value="Add"/>
	</form>
</body>
</html>