package org.skoonline.atl.dataservice.security;

public class PermissionConstants {
	public static final int VIEWER = 1;
	public static final int COLLABORATOR = 2;
	public static final int OWNER = 4;
	public static final int CREATOR = 8;
	
	public static final String APP_VIEWER = "https://asat.x-in-y.com"+"/player1024768.html?";
	//public static final String APP_EDITOR = "https://www.x-in-y.com/onrstem/html/authoring.html?";
	public static final String APP_EDITOR = "https://asat.x-in-y.com"+"/author1024768.html?";
	
	public static final String EMAIL_TEMPLATE_VIEWER_URL = APP_VIEWER + "guid=%2$s";
	public static final String EMAIL_TEMPLATE_EDITOR_URL = APP_EDITOR + "guid=%2$s";
	
	public static final String EMAIL_TEMPLATE_INVITATION_HEADER = "Hello %1$s, %2$s has shared %3$s with you.";
	public static final String EMAIL_TEMPLATE_INVITATION_COLLABORATOR = "\nPlease click or copy the following link into your browser to edit:  " + EMAIL_TEMPLATE_EDITOR_URL;
	public static final String EMAIL_TEMPLATE_INVITATION_VIEWER = "\nPlease click or copy the following link into your browser to view:  " + EMAIL_TEMPLATE_VIEWER_URL;
	public static final String EMAIL_TEMPLATE_INVITATION_CLOSING = "\nThank you and have a nice day.";
	
	
}
