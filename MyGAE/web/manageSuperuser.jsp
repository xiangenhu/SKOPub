<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.skoonline.atl.dataservice.ATLGAEUtils"%>
<%@page import="javax.jdo.PersistenceManager"%>
<%@page import="org.skoonline.atl.dataservice.utils.PMF"%>
<%@page import="javax.jdo.Query"%>
<%@page import="org.skoonline.atl.dataservice.Superuser"%>
<%@page import="java.util.List"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
	if (!ATLGAEUtils.isAdmin()) {
		response.getWriter().write("You must be a superuser to access this page.  Please logout and log back in as a user with superuser permissions.");
		return;
	}

	// get all superusers
	PersistenceManager pm = PMF.get().getPersistenceManager();
	Query query = pm.newQuery(Superuser.class);
	List<Superuser> superusers = (List<Superuser>)query.execute();

	String deleteRowTemplate = "<input type=\"checkbox\" name=\"deletedUsernames\" value=\"%1$s\"/>%1$s<br/>";

	String formTemplate = "<div id=\"addSuperuser\">";
	formTemplate += "<p>Add New Superuser</p>";
	formTemplate += "<form action=\"/addsuperuser\" method=\"post\">";
	formTemplate += "<input type=\"text\" name=\"username\"/><br/>";
	for (Superuser s : superusers)
		formTemplate += String.format(deleteRowTemplate, s.getUser());
	formTemplate += "<input type=\"submit\" value=\"Submit\"/>";
	formTemplate += "</form>";
	formTemplate += "</div>";

	response.getWriter().write(formTemplate);
%>
</body>
</html>