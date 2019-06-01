package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

public class DeleteServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		String json = URLDecoder.decode(request.getParameter("json"), "utf-8");
		String guid = "";
		JSONObject jsonObjectBody = new JSONObject();
		try {
			jsonObjectBody = new JSONObject(json);
			guid = jsonObjectBody.getString("guid");
		} catch (JSONException e) {
			try {
				response.getOutputStream().print("{\"error\":\"Invalid JSON\"}");
			} catch (IOException ioe) {
				
			}
		}
		
		User user = UserServiceFactory.getUserService().getCurrentUser();
		
		if (user == null) {
			try {
				response.getOutputStream().print("{\"error\":\"No user logged in\"}");
			} catch (IOException e) {
				
			}
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("guid == needle");
		query.declareParameters("String needle");
		List<SKOScript> scripts = (List<SKOScript>)query.execute(guid);
		if (scripts.size() > 0) {
			SKOScript script = scripts.get(0);
			if (script.getCreatedBy().getNickname().equals(user.getNickname())) {
				pm.deletePersistent(script);
				response.getWriter().write("{\"complete\":\"complete\"}");
			} else {
				try {
					response.getWriter().write("{\"error\":\"Scripts can only be deleted by the author\"}");
				} catch (IOException e) {
					
				}
			}
		} else {
			try {
				response.getOutputStream().print("{\"error\":\"Script with GUID not found\"}");
			} catch (IOException e) {
				
			}
		}
	}
}
