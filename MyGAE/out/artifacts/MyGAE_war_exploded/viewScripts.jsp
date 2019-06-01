<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
 <%@ page import="javax.jdo.PersistenceManager" %>
 <%@ page import="java.util.List" %>
 <%@ page import="org.skoonline.atl.dataservice.utils.PMF" %>
 <%@ page import="org.skoonline.atl.dataservice.SKOScript" %>
 <%@ page import="javax.jdo.Query" %>
 <%@ page import="org.skoonline.atl.dataservice.ATLGAEUtils" %>
<%@page import="org.skoonline.atl.dataservice.security.PermissionConstants" %>
 <%@page import="java.net.URLDecoder"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" type="text/css" href="/css/Views.css"/>
<title>Published Scripts</title>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$("span.timestamp").each(function (i, e) {
		var serverTime = $(this).attr("utc");
		var localTime = new Date(serverTime);
		$(this).html(localTime.toLocaleDateString() + " " + localTime.toLocaleTimeString());
	});
});
</script>
</head>
<body>
<%
	PersistenceManager pm = PMF.get().getPersistenceManager();
	Query query = pm.newQuery(SKOScript.class);
	query.setFilter("published == needle");
	query.setOrdering("timestamp descending");
	query.declareParameters("boolean needle");
	List<SKOScript> scripts = (List<SKOScript>)query.execute(true);
	String htmlTemplate = "<tr>";
	htmlTemplate += "<td>%1$s</td>";
	htmlTemplate += "<td>%2$s</td>";
	htmlTemplate += "<td><span class=\"timestamp\" utc=\"%4$s\"></span></td>";
	htmlTemplate += "<td>%5$s</td>";
    htmlTemplate += "<td class=\"skoView\"><a href=\"" + PermissionConstants.APP_VIEWER + "GAE=skodev2010&guid=%3$s\" target=\"viewer\">View</a></td>";
	htmlTemplate += "</tr>";
	
	String notesTemplate = "<tr class=\"notesRow\">";
	notesTemplate += "<td colspan=\"5\">&nbsp;&nbsp;%1$s</td>";
	notesTemplate += "</tr>";
	
	response.setContentType("text/html");
	response.getWriter().write("<table>");
	response.getWriter().write("<tr><td class=\"header\">Title</td><td class=\"header\">Type</td><td class=\"header\">Last Updated</td><td class=\"header\">Author Email</td><td></td></tr>");
	for (SKOScript s : scripts) {
		String decodedTitle = URLDecoder.decode(s.getTitle(), "utf-8");
		String lastUpdated = s.getTimestamp().toString();
		String prettyScriptType = ATLGAEUtils.getPrettyScriptType(s.getScriptType());
		String authorEmail = ATLGAEUtils.fixEmail(s.getCreatedBy().getNickname());
		String decodedNotes = URLDecoder.decode(s.getNotes(), "utf-8");
		response.getWriter().write(String.format(htmlTemplate, decodedTitle, prettyScriptType, s.getGuid(), lastUpdated, authorEmail));
		response.getWriter().write(String.format(notesTemplate, ATLGAEUtils.stripCDATA(decodedNotes)));
	}
	response.getWriter().write("</table>");
%>
</body>
</html>