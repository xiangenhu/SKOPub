package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.security.PermissionManager;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class PermissionServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(PermissionServlet.class.getName());
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException {
		doPost(request, response);
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		String jsonString = request.getParameter("json");
		JSONObject jsonObject = null;
		String guid = "";
		String perm = "";
		int permission = 0;
		String nickname = "";
		String m = "";
		int method = 0;
		String source = "";
		String searchTerm = "";
		String baseURL= "";
		boolean sendEmail = false;
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		if (currentUser == null) {
			response.getWriter().write("{\"error\":\"Not logged in\"}");
			response.flushBuffer();
		}
		String currentNickname = currentUser.getNickname();
		log.info("JSON:"+jsonString);
		try {
			jsonObject = new JSONObject(jsonString);
			guid = jsonObject.getString("guid");
			perm = jsonObject.getString("permission");
			nickname = jsonObject.getString("nickname");
			m = jsonObject.getString("method");
			source = jsonObject.getString("source");
			if (jsonObject.has("sendEmail"))
				sendEmail = jsonObject.getBoolean("sendEmail");
			if (m.equals("search"))
				searchTerm = jsonObject.getString("searchTerm");
			log.info("JSON:"+jsonString);
			if (jsonObject.has("BURL")){
				
				baseURL = jsonObject.getString("BURL");
				baseURL = baseURL.replaceAll("U_R_L", "/");
				}
			
			log.info("baseURL:"+baseURL);
			
		} catch (JSONException e) {
			log.info("ERRRRRRRRROR");
			response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
		}
		
		
			
		
		permission = getIntPerm(perm);
		method = getIntMethod(m);
		boolean permissionExist = PermissionManager.checkPermission(nickname, guid, permission);
		boolean isAdmin = ATLGAEUtils.isAdmin();
		boolean isOwner = PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.OWNER);
		boolean isCreator = PermissionManager.checkPermission(nickname, guid, PermissionConstants.CREATOR);
		boolean isCollaborator = PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.COLLABORATOR);
		boolean isViewer = PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.VIEWER);
		
		int level = PermissionManager.getPermissionLevel(currentNickname, guid);
		
		switch (method) {
		case 0: // grant
//			if (isCreator) {
//				//response.getWriter().write("{\"error\":\"Cannot modify CREATOR permissions\"}");
//			} else 
				
			if (level < PermissionConstants.OWNER) 
				response.getWriter().write("{\"error\":\"Must be owner to access permissions\"}");
			else {
				String[] nList = nickname.split("~");
				for (String n : nList) {
					boolean isAuthoringTool = source.toLowerCase().equals("authoringtool");
					PermissionManager.grantPermission(n, guid,baseURL ,permission, isAuthoringTool, sendEmail);
				}
			}
			break;
		case 1: // revoke
//			if (isCreator) {
//				//response.getWriter().write("{\"error\":\"Cannot modify CREATOR permissions\"}");
//			} else 
			if (level < PermissionConstants.OWNER)
				response.getWriter().write("{\"error\":\"Must be owner to access permissions\"}");
			else {
				if (permissionExist) {
					PermissionManager.revokePermission(nickname, guid, permission);
				} else {
					response.getWriter().write("{\"error\":\"Permission does not exist\"}");
				}
			}
			break;
		case 2: // check
			if (isAdmin) {
				response.getWriter().write("{\"permissionExists\":true}");
			}
			if (permissionExist) {
				response.getWriter().write("{\"permissionExists\":true}");
			} else {
				response.getWriter().write("{\"permissionExists\":false}");
			}
			break;
		case 3: // get
			if (isAdmin) {
				response.getWriter().write("{\"permissionLevel\":" + PermissionConstants.OWNER + "}");
				response.flushBuffer();
			} else {
				if (level < PermissionConstants.COLLABORATOR)
					response.getWriter().write("{\"error\":\"Must be owner to access permissions\"}");
				else {
					response.getWriter().write("{\"permissionLevel\":" + PermissionManager.getPermissionLevel(nickname, guid) + "}");
				}	
			}
			break;
		case 4: // search
			if (level < PermissionConstants.COLLABORATOR)
				response.getWriter().write("{\"error\":\"Must be owner to access permissions\"}");
			else {
				List<Permission> perms = null;
				if (searchTerm.equals("nickname")) {
					perms = PermissionManager.getPermissionsByNickname(nickname);
				} else if (searchTerm.equals("guid")) {
					perms = PermissionManager.getPermissionsByGUID(guid);
				}
				try {
					JSONObject permsObject = new JSONObject();
					JSONArray permsArray = new JSONArray();
					if (perms != null)
						for (Permission p : perms)
						permsArray.put(p.toJson());
					permsObject.put("perms", permsArray);
					response.getWriter().write(permsObject.toString());
				} catch (JSONException e) {
					response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
				}
			}
			break;
		default:
			break;
		}
	}
	
	private int getIntPerm(String p) {
		if (p.toLowerCase().equals("creator")) {
			return PermissionConstants.CREATOR;
		} else if (p.toLowerCase().equals("owner")) {
			return PermissionConstants.OWNER;
		} else if (p.toLowerCase().equals("collaborator")) {
			return PermissionConstants.COLLABORATOR;
		} else if (p.toLowerCase().equals("viewer")) {
			return PermissionConstants.VIEWER;
		} else {
			return -1;
		}
	}
	
	private int getIntMethod(String m) {
		if (m.toLowerCase().equals("grant")) {
			return 0;
		} else if (m.toLowerCase().equals("revoke")) {
			return 1;
		} else if (m.toLowerCase().equals("check")) {
			return 2;
		} else if (m.toLowerCase().equals("get")) {
			return 3;
		} else if (m.toLowerCase().equals("search")) {
			return 4;
		} else {
			return -1;
		}
	}
}
