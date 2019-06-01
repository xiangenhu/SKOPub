package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.Date;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class ViewedServlet extends HttpServlet {
	private User user = null;
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		if (checkLogin()) {
			String jsonString = request.getParameter("json");
			try {
				JSONObject jsonObject = new JSONObject(jsonString);
				String guid = jsonObject.getString("guid");
				store(guid);
				response.getWriter().write("{\"done\":\"done\"}");
			} catch (JSONException e) {
				response.getWriter().write("{\"error\":\"JSON Exception: " + e.getMessage() + "\"}");
			}
		}
	}
	
	private void store(String guid) {
		ViewedScript viewedScript = new ViewedScript();
		viewedScript.setGuid(guid);
		viewedScript.setUser(user);
		viewedScript.setTimestamp(new Date());
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		try {
			pm.makePersistent(viewedScript);
		} finally {
			pm.close();
		}
	}
	
	private boolean checkLogin() {
		user = UserServiceFactory.getUserService().getCurrentUser();
		if (user == null)
			return false;
		return true;
	}
}
