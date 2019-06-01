<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.User" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
  <title>AutoTutor Launcher</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>
<table align="center" height="100%">
<tr>
<td align="center">
<br/>
<br/>
<br/>
<br/>
<div class="container" align="center">
<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#author">Create Your SKOs</button>
<div>
<br/>
<br/>
<br/>
<br/>
<div class="container" align="center">
<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myAuthored">List Your SKOs</button>
</div>

<br/>

<br/>
<br/>
<br/>

</td>
</tr>
</table>

 <div class="container" align="center">
  <div class="modal fade" id="author" role="dialog" data-keyboard="false" data-backdrop="static">
	<div style="width: 1100px; height: 810px"> 
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
       <center>
			<iframe id="ChildPanel1" src="http://www.x-in-y.com/1024768/generalv1/authoring.html?skoserver=https://asat.x-in-y.com&&AvatarList=https://asat.x-in-y.com/avatarsAli.xml"
				width="1032" height="774" seamless frameboard="0"></iframe>
		</center> 
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
	 </div>
  </div>
</div>

<div class="container" align="center">
 <div class="modal fade" id="myAuthored" role="dialog" data-keyboard="false" data-backdrop="static">
	<div style="width: 1100px; height: 810px"> 
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
       <center>
			<iframe id="ChildPanel2" src="https://asat.x-in-y.com/myScripts.jsp"
				width="1032" height="774" seamless frameboard="0"></iframe>
		</center> 
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
	 </div>
  </div>
</div>


</body>

</html>