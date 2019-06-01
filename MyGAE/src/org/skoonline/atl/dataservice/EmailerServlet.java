package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.ArrayList;
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
import org.skoonline.atl.dataservice.utils.Emailer;

import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class EmailerServlet extends HttpServlet {
	public static final Logger log = Logger.getLogger(EmailerServlet.class.getName());
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doPost(request, response);
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException{
		String jsonString = request.getParameter("json");
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(jsonString);
			// guid, currentUser, groups, message
			String guid = jsonObject.getString("guid");
			String message = jsonObject.getString("message");
			String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
			boolean hasGroups = jsonObject.has("groups");
			boolean hasIndividuals = jsonObject.has("individuals");
			if (hasGroups) {
				JSONArray groups = jsonObject.getJSONArray("groups");
				if (!PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.OWNER)) {
					response.getWriter().write("{\"error\":\"You must be at least an owner to send emails.\"}");
					response.flushBuffer();
				} else {
					List<Permission> perms = PermissionManager.getPermissionsByGUID(guid);
					List<Integer> groupTo = new ArrayList<Integer>();
					for (int i = 0; i < groups.length(); i++) {
						groupTo.add(groups.getInt(i));
					}
					for (Permission p : perms) {
						if (groupTo.contains(p.getPermission())) {
							Emailer.sendMessage(ATLGAEUtils.fixEmail(p.getUser()), "xiangenhu@gmail.com", message, "Message from ATL");
						}
					}
				}
			}
			if (hasIndividuals) {
				JSONArray individuals = jsonObject.getJSONArray("individuals");
				if (!PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.OWNER)) {
					response.getWriter().write("{\"error\":\"You must be at least an owner to send emails.\"}");
					response.flushBuffer();
				} else {
					for (int i = 0; i < individuals.length(); i++) {
						Emailer.sendMessage(ATLGAEUtils.fixEmail(individuals.getString(i)), "xiangenhu@gmail.com", message, "Message from ATL");
					}
				}
			}
		} catch (JSONException e) {
			log.severe(e.getMessage());
		}
	}
	
	
}
