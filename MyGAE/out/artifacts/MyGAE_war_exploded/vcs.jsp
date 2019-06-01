<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.skoonline.atl.dataservice.security.PermissionManager"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="org.skoonline.atl.dataservice.security.PermissionConstants"%>
<%@page import="java.util.List"%>
<%@page import="org.skoonline.atl.dataservice.entities.SKOScriptHistory"%>
<%@page import="org.skoonline.atl.dataservice.dal.SKOScriptHistoryDAL"%>
<%@page import="org.skoonline.atl.dataservice.SKOScript"%>
<%@page import="org.skoonline.atl.dataservice.dal.SKOScriptDAL"%>
<%@page import="org.skoonline.atl.dataservice.entities.viewmodels.VCSViewModel"%>
<%@page import="org.w3c.dom.css.ViewCSS"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Version Control System</title>
</head>
<body>
<% 
	String guid = request.getParameter("guid");
	String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
	
	if (!PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.OWNER)) {
		
	} else {
		List<VCSViewModel> history = SKOScriptHistoryDAL.getHistoryForVCS(guid);
		
		response.getWriter().write("<table>");
		for (VCSViewModel h : history) {
			response.getWriter().write("<tr>");
			response.getWriter().write(String.format("<td>%1$s</td>", h.getScript().getTitle())); // sko title
			response.getWriter().write(String.format("<td>%1$s</td>", h.getMostRecentHistory().getTimestamp().toString())); // timestamp
			response.getWriter().write(String.format("<td>%1$s</td>", h.getMostRecentHistory().getLastUpdatedBy().getNickname())); // last updated by
			response.getWriter().write(String.format("<td><a href=\"#\">View</td>"));
			response.getWriter().write(String.format("<td><a href=\"#\">Revert</td>"));
			response.getWriter().write("</tr>");
		}
		response.getWriter().write("</table>");
	}
%>
</body>
</html>