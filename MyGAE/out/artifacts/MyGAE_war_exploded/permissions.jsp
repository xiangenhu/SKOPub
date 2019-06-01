<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.datastore.Text" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="org.skoonline.atl.dataservice.security.PermissionManager" %>
<%@ page import="org.skoonline.atl.dataservice.security.PermissionConstants" %>
<%@ page import="org.skoonline.atl.dataservice.entities.Permission" %>
<%@ page import="org.skoonline.atl.dataservice.dal.SKOScriptDAL" %>
<%@ page import="org.skoonline.atl.dataservice.dal.SKOScriptHistoryDAL" %>
<%@ page import="org.skoonline.atl.dataservice.SKOScript" %>
<%@ page import="org.skoonline.atl.dataservice.entities.SKOScriptHistory" %>
<%@ page import="org.skoonline.atl.dataservice.entities.viewmodels.VCSViewModel" %>
<%@ page import="org.skoonline.atl.dataservice.utils.Misc" %>
<%@page import="org.skoonline.atl.dataservice.security.PermissionConstants" %>
<%@ page import="java.util.List" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.skoonline.atl.dataservice.ATLGAEUtils"%><html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Share your S.K.O</title>
<link rel="stylesheet" type="text/css" href="/css/Views.css"/>
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript">

</script>
</head>
<body>
<%
	String guid = request.getParameter("guid");
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
//		baseURLP = baseURLP+"?";
	}
	
	if(baseURLA == null){
		baseURLA = baseURL+"/author1024768.html";
	}
	else{
		baseURLA = baseURLA.replaceAll("\\?", "");
//		baseURLA = baseURLA+"?";
	}
	
	
	
	
	SKOScript script = SKOScriptDAL.getSKOByGuid(guid);
	boolean published = script.getPublished();
	String chkPublishedChecked = published ? "checked" : "";
	List<VCSViewModel> scriptHistory = SKOScriptHistoryDAL.getHistoryForVCS(guid);
	int vl = 0;
	try {
		vl = Integer.parseInt(request.getParameter("vl"), 10);
	} catch (NumberFormatException ex) {
		
	}
	
%>

<%
	String permTemplate = "<table align=\"center\">";
	permTemplate +="<tr><td valign=\"top\" nowrap bgcolor=\"#EEFFFF\">";
	response.getWriter().write(permTemplate);
	User currentUser = UserServiceFactory.getUserService().getCurrentUser();
	if (currentUser == null) 
		response.sendRedirect(UserServiceFactory.getUserService().createLoginURL(request.getRequestURI()));
	
	String currentNickname = currentUser.getNickname();
	
	
	if (!PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.OWNER)) {
		response.flushBuffer();
	} else {
		List<Permission> perms8 = PermissionManager.getPermissionsByGUID8(guid);
		response.getWriter().write("<b>Creator:</b> <br/>");
		String AuthorpermTemplate8="%1$s<br/>";
		for (Permission p : perms8) {
			String userEmail = p.getUser();
			if (userEmail.indexOf("@") == -1)
				userEmail += "@gmail.com";
			response.getWriter().write(String.format(AuthorpermTemplate8, userEmail));
		}
		response.getWriter().write("<hr/>");
		
		List<Permission> perms4 = PermissionManager.getPermissionsByGUID4(guid);
		int perm4Count = perms4.size();
		response.getWriter().write("<b>Owners("+perm4Count+"):</b> <br/>");
		String AuthorpermTemplate4="%1$s &nbsp; &nbsp; <a href=\"#\" user=\"%3$s\" perm=\"%4$s\" class=\"removeLink\">[remove]</a><br/>";
		for (Permission p : perms4) {
			if ((p.getPermission() > 0) && !(p.getUser().equals(currentNickname))) {
				String userEmail = p.getUser();
				if (userEmail.indexOf("@") == -1)
					userEmail += "@gmail.com";
				response.getWriter().write(String.format(AuthorpermTemplate4, userEmail, p.getPermission(), p.getUser(), p.getPermission()));
			}
		}
		List<Permission> perms2 = PermissionManager.getPermissionsByGUID2(guid);
		int perm2Count = perms2.size();
		response.getWriter().write("<hr/><b>Collaborator("+perm2Count+"):</b> <br/>");

		String AuthorpermTemplate2="%1$s &nbsp; &nbsp; <a href=\"#\" user=\"%3$s\" perm=\"%4$s\" class=\"removeLink\">[remove]</a><br/>";
		for (Permission p : perms2) {
			if ((p.getPermission() > 0) && !(p.getUser().equals(currentNickname))) {
				String userEmail = p.getUser();
				if (userEmail.indexOf("@") == -1)
					userEmail += "@gmail.com";
				response.getWriter().write(String.format(AuthorpermTemplate2, userEmail, p.getPermission(), p.getUser(), p.getPermission()));
			}
		}
		List<Permission> perms1 = PermissionManager.getPermissionsByGUID1(guid);
		int perm1Count = perms1.size();
		response.getWriter().write("<hr/><b>Viewers("+perm1Count+"):</b> <br/>");
		String AuthorpermTemplate1="%1$s &nbsp; &nbsp; <a href=\"#\" user=\"%3$s\" perm=\"%4$s\" class=\"removeLink\">[remove]</a><br/>";
		for (Permission p : perms1) {
			if ((p.getPermission() > 0) && !(p.getUser().equals(currentNickname))) {
				String userEmail = p.getUser();
				if (userEmail.indexOf("@") == -1)
					userEmail += "@gmail.com";
				response.getWriter().write(String.format(AuthorpermTemplate1, userEmail, p.getPermission(), p.getUser(), p.getPermission()));
			}
		}
	}
	
	
%>
</td><td align="center">
<b>S.K.O. Details</b><br/>
<div id="skodetails">
<b>Title:</b> <span id="skotitle"><%= Misc.decodeString(script.getTitle()) %></span><br/>
<b>GUID:</b> <span id="skoguid"><%= Misc.decodeString(script.getGuid()) %></span><br/>
<b>Created By:</b> <span id="skocreatedby"><%= Misc.checkEmail(script.getCreatedBy().getNickname()) %></span><br/>
<b>Last Updated: </b><span id="skotimestamp" class="timestamp" utc="<%= script.getTimestamp().toString() %>"></span><br/>
<b>Last Updated By: </b><%= Misc.checkEmail(scriptHistory.get(0).getMostRecentHistory().getLastUpdatedBy().getNickname()) %><br/>
<b>Notes:</b> <span id="skonotes"><%= ATLGAEUtils.stripCDATA(Misc.decodeString(script.getNotes())) %></span>
</div>
<div id="btnContainer">
<% if (!script.getScriptType().equals("ContentAnalysis")) { %>
<button id="btnViewSKO" guid="<%= guid %>">View</button>
<% } %>
<button id="btnEditSKO" guid="<%= guid %>">Edit</button>
<% if (vl == 1) { %>
	<button id="btnViewLogs" guid="<%= guid %>">Logs</button>
<% } %>
</div>
<hr/>

<b>Invite people to your S.K.O. </b><br/>Type their email addresses (separated by comma).<br/>
<textarea id="nicknamesToAdd" cols="60" rows="6"></textarea><br/>
<input type="button" id="btnAdd" value="invite"/> <input type="radio" name="permsGroup" id="rdoPermissionLevelOwner" value="owner"/> as owner  &nbsp; 
<input type="radio" name="permsGroup" id="rdoPermissionLevelCollaborator" value="collaborator"/>as collaborator &nbsp;
<input type="radio" name="permsGroup" id="rdoPermissionLevelViewer" value="viewer" checked="true"/> as viewer<br/>
(also send email invitations <input type="checkbox" name="sendInvitation" value="SendInvites" id="chkSendInvites" checked>)<br/>
<input type="checkbox" id="chkPublished" <%= chkPublishedChecked %>/> Anyone in the world may view this S.K.O. (make it public)<br/>
</td></tr>
<tr>
	<td colspan="2">
		<div id="historyHeader"><span id="historyDialogOpenClose">[ + ]</span>&nbsp;S.K.O. Revision History</div>
		<div id="historyDialog">
		<table>
		<tr>
			<td>Author</td>
			<td>Title</td>
			<td>Timestamp</td>
		</tr>
		<%
			for (VCSViewModel h : scriptHistory) {
		%>
			<tr>
				<td class="historyLastUpdated"><%= h.getMostRecentHistory().getLastUpdatedBy() %></td>
				<td class="historyTitle">
				<%
					String title = h.getMostRecentHistory().getTitle();
					if (title != null) {
				%>
						<%= Misc.decodeString(Misc.sanitizeUnicode(h.getMostRecentHistory().getTitle())) %>
				<%
					} else {
				%>
						&nbsp;
				<%
					}
				%>
				
				</td>
				<td class="historyTimestamp"><span class="timestamp" utc="<%= h.getMostRecentHistory().getTimestamp().toString() %>"></span></td>
				<td><a href="#" guid="<%= h.getMostRecentHistory().getKey().getId() %>" class="revertHistory">Revert</a></td>
			</tr>
			
			<tr>
				<td colspan="3">
					<div style="float:left;width:20px">&nbsp;</div>
					<b>
				<%
					String notes = h.getMostRecentHistory().getNotes();
					if (notes != null) {
				%>
						<%= ATLGAEUtils.stripCDATA(Misc.decodeString(notes)) %>
				<%
					} else {
				%>
						&nbsp;
				<%
					}
				%>
					</b>
					<div class="clear:both"></div>
				</td>
			</tr>
			
		<%
			}
		%>
		</table>
		</div>
	</td>
</tr>
<tr>
	<td colspan="2">
		<div id="emailerHeader"><span id="emailerDialogOpenClose">[ + ]</span>&nbsp;Send Email to Collaborators</div>
		<div id="emailerDialog">
			Enter the text of the email:<br/>
			<textarea id="emailerMessage" cols="100" rows="6"></textarea><br/>
			Send to:
			<input type="checkbox" id="emailerOwners"/>Owners
			<input type="checkbox" id="emailerCollaborators"/>Collaborators
			<input type="checkbox" id="emailerViewers"/>Viewers<br/>
			<input type="button" id="btnEmailerSend" value="Send Email"/>
			<span id="emailerSendStatus">Sending ...</span>
		</div>
	</td>
</tr>
<tr>
	<td colspan="2">
		<div id="mailHeader"><span id="mailDialogOpenClose">[ + ]</span>&nbsp;Send Email</div>
		<div id="mailDialog">
			Enter the text of the email:<br/>
			<textarea id="mailMessage" cols="100" rows="6"></textarea><br/>
			Send to: (separate addresses with commas)<br/>
			<textarea id="mailRecipients" cols="100" rows="6"></textarea><br/>
			<input type="button" id="btnMailSend" value="Send Email"/>
			<span id="mailSendStatus">Sending ...</span>
		</div>
	</td>
</tr>
</table>


<script type="text/javascript">
$(document).ready(function() {
	$(".removeLink").click(removeLink);
	$("#btnAdd").click(btnAdd_Click);
	$("#chkPublished").change(chkPublished_Change);
	$("#emailerHeader").click(emailHeader_Click);
	$("#historyHeader").click(historyHeader_Click);
	$("#btnEmailerSend").click(btnEmailerSend_Click);
	$("#mailHeader").click(mailHeader_Click);
	$("#btnMailSend").click(btnMailSend_Click);
	$("button.delete").each(function(i, e) {
		$(this).click(confirmDelete);
	});
	$("#btnViewSKO").click(btnViewSKO_Click);
	$("#btnEditSKO").click(btnEditSKO_Click);
	$("#btnViewLogs").click(btnViewLogs_Click);
	$("span.timestamp").each(function (i, e) {
		var serverTime = $(this).attr("utc");
		var localTime = new Date(serverTime);
		$(this).html(localTime.toLocaleDateString() + " " + localTime.toLocaleTimeString());
	});
	$("a.revertHistory").each(function() {
		var guid = $(this).attr("guid");
		$(this).click(function() {
			var endpoint = "/revert";
			var method = "GET";
			var params = {historyId:guid};
			var opts = {url:endpoint, type:method, data: params, success: refreshPage};
			$.ajax(opts);
		});
	});
});

function btnViewSKO_Click() {
	var guid = $(this).attr("guid");
	//var url = "http://www.x-in-y.com/onrstem/html/ATL.html?GAE=skodev2012&guid=" + guid;
	var url =  "<%=baseURLP%>"+"?guid="+guid;
	window.open(url);
}

function btnEditSKO_Click() {
	var guid = $(this).attr("guid");
	//var url = "http://www.x-in-y.com/onrstem/html/authoring.html?GAE=skodev2012&guid=" + guid;
	var url =  "<%=baseURLA%>"+"?guid="+guid;
	window.open(url);
}

function btnViewLogs_Click() {
	var guid = $(this).attr("guid");
	var url = "/viewLogs.jsp?guid=" + guid;
	window.location.href=url;
}

function confirmDelete() {
	var needle = $(this).attr("guid");
	var confirmResult = confirm("Are you sure you want to delete this script?");
	if (confirmResult) {
		var endpoint = "/delete";
		var method = "GET";
		var params = {json:"{guid:" + needle + "}"};
		var opts = {url:endpoint, type:method, data: params, success: refreshPage};
		$.ajax(opts);
	}
}

function btnEmailerSend_Click() {
	var groups = "[";
	if ($("#emailerOwners")[0].checked)
		groups += "8,4,";
	if ($("#emailerCollaborators")[0].checked)
		groups += "2,";
	if ($("#emailerViewers")[0].checked)
		groups += "1,";

	// trim the trailing comma
	groups = groups.substring(0, groups.length - 1);

	groups += "]";

	var message = $("#emailerMessage")[0].value;
	var guid = "<%= guid %>";

	var params = {json:"{groups:" + groups +",message:\"" + message + "\",guid:\"" + guid + "\"}"};
	var endpoint = "/emailer";
	var method = "GET";
	var opts = {url:endpoint, type:method, data: params, success: sendEmailComplete};
	$("#emailerSendStatus").html("Sending ...");
	$("#emailerSendStatus").css("display","block");
	$.ajax(opts);
}

function btnMailSend_Click() {
	var taEmails = $("#mailRecipients")[0].value;
	var addresses = taEmails.split(',');
	var groups = "[";
	for (var i = 0; i < addresses.length; i++)
		groups += "'" + addresses[i] + "',";
	groups = groups.substring(0, groups.length - 1);
	groups += "]";

	var message = $("#emailerMessage")[0].value;
	var guid = "<%= guid %>";

	var params = {json:"{individuals:" + groups +",message:\"" + message + "\",guid:\"" + guid + "\"}"};
	var endpoint = "/emailer";
	var method = "GET";
	var opts = {url:endpoint, type:method, data: params, success: sendEmailComplete};
	$("#emailerSendStatus").html("Sending ...");
	$("#emailerSendStatus").css("display","block");
	$.ajax(opts);
}

function sendEmailComplete(data) {
	if (data.length > 0) {
		var o = eval("(" + data + ")");
		if (o.error)
			alert(o.error);
		else 
			alert("Other error");
	}
	else {
		$("#emailerMessage")[0].value = "";
		$("#emailerSendStatus").html("Email send complete!");
	}
}

function emailHeader_Click() {
	$("#emailerDialog").toggle();
	if ($("#emailerDialog").css("display") == "none") {
		$("#emailerDialogOpenClose").html("[ + ]");
	} else {
		$("#emailerDialogOpenClose").html("[ - ]");
	}
}

function mailHeader_Click() {
	$("#mailDialog").toggle();
	if ($("#mailDialog").css("display") == "none") {
		$("#mailDialogOpenClose").html("[ + ]");
	} else {
		$("#mailDialogOpenClose").html("[ - ]");
	}
}

function historyHeader_Click() {
	$("#historyDialog").toggle();
	if ($("#historyDialog").css("display") == "none") {
		$("#historyDialogOpenClose").html("[ + ]");
	} else {
		$("#historyDialogOpenClose").html("[ - ]");
	}
}

function removeLink() {
	var endpoint = "/permission";
	var method = "GET";
	
	var params = {json:"{guid:<%= guid %>,permission:" + $(this).attr("perm") + ",nickname:" + $(this).attr("user") + ",method:revoke,source:web}"};
	var opts = {url:endpoint, type:method, data: params, success: refreshPage};
	$.ajax(opts);
}

function refreshPage() {
	window.location.reload();
}

function chkPublished_Change() {
	var params = {json:"{published:" + $("#chkPublished")[0].checked + ",guid:<%= guid %>}"};
	var endpoint = "/publish";
	var method = "GET";
	var opts = {url:endpoint, type:method, data: params, success: refreshPage};
	$.ajax(opts);
}

function btnAdd_Click() {
	var pNames = "";
	var names = $("#nicknamesToAdd")[0].value;
	var nList = names.split(",");
	for (var i = 0; i < nList.length; i++) {
		var n = nList[i].indexOf("@gmail.com");
		if (n != -1) 
			nList[i] = nList[i].substr(0, n);
		pNames += nList[i] + "~";
	}
	pNames = pNames.substr(0, pNames.length - 1);
	var sendEmail = $("#chkSendInvites")[0].checked;
	//var params = {json:"{guid:<%= guid %>,permission:" + getPerm() + ",nickname:" + pNames + ",method:grant,source:web,sendEmail:" + sendEmail + "}"};
	//var params = {json:"{guid:<%= guid %>,permission:" + getPerm() + ",nickname:" + pNames + ",method:grant,source:web,sendEmail:" + sendEmail + ",BURL:<%= baseURL %>}"};
	var baseURL = "<%= baseURL %>".replace(/http:\/\//g,"");
	baseURL = baseURL.replace(/\//g,"U_R_L");

	console.log(baseURL);
	var params = {json:"{guid:<%= guid %>,permission:" + getPerm() + ",nickname:" + pNames + ",method:grant,source:web,BURL:"+baseURL + ",sendEmail:" + sendEmail + "}"};
	
	console.log(params);
	var endpoint = "/permission";
	var method = "GET";
	var opts = {url:endpoint, type:method, data: params, success: permModifyComplete};
	$.ajax(opts);
}

function permModifyComplete(data) {
	if (data.length > 0) {
		var o = eval("(" + data + ")");
		if (o.error)
			alert("ERROR"+o.error);
		else 
			alert("Other error");
	}
	else
		refreshPage();
}

function getPerm() {
	if ($("#rdoPermissionLevelOwner")[0].checked)
		return "owner";
	if ($("#rdoPermissionLevelCollaborator")[0].checked)
		return "collaborator";
	if ($("#rdoPermissionLevelViewer")[0].checked)
		return "viewer";
	
}
</script>
</body>
</html>