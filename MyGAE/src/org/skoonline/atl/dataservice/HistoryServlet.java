package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class HistoryServlet extends HttpServlet {
	private User user = null;
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		boolean loggedIn = checkLogin();
		try {
			JSONObject jsonObject = new JSONObject();
			JSONArray scriptsArray = new JSONArray();
			if (loggedIn) {
				for (ViewedScript s : getHistory()) {
					JSONObject scriptObject = new JSONObject();
					scriptObject.put("guid", s.getGuid());
					scriptObject.put("timestamp", s.getTimestamp().toString());
					scriptsArray.put(scriptObject);
				}
			}
			jsonObject.put("scripts", scriptsArray);
			response.getWriter().write(jsonObject.toString());
		} catch (JSONException e) {
			response.getWriter().write("{\"error\":\"JSON Exception: " + e.getMessage() + "\"}");
		}
	}
	
	private boolean checkLogin() {
		user = UserServiceFactory.getUserService().getCurrentUser();
		if (user == null)
			return false;
		return true;
	}
	
	private List<ViewedScript> getHistory() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(ViewedScript.class);
		query.setFilter("user == needle");
		query.declareParameters("User needle");
		query.declareImports("import com.google.appengine.api.users.User");
		List<ViewedScript> scripts = (List<ViewedScript>) query.execute(user);
		return scripts;
	}
}
