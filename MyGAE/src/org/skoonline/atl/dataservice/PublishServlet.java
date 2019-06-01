package org.skoonline.atl.dataservice;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOScriptDAL;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.security.PermissionManager;

import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class PublishServlet extends HttpServlet {
	@Override 
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String json = req.getParameter("json");
		JSONObject jsonObject = null;
		try {
			jsonObject = new JSONObject(json);
			String guid = jsonObject.getString("guid");
			boolean published = jsonObject.getBoolean("published");
			if (published) {
				SKOScriptDAL.publish(guid);
			} else {
				SKOScriptDAL.unpublish(guid);
			}
		} catch (JSONException e) {
			resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
		}
	}
	
	private boolean verifyOwner(String guid) {
		String nickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
		if (!PermissionManager.checkPermission(nickname, guid, PermissionConstants.OWNER))
			return false;
		return true;
	}
}
