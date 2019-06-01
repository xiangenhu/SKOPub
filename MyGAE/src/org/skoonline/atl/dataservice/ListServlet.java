package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class ListServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException{
		// get current user
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		// create query
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("createdBy == user");
		query.declareImports("import com.google.appengine.api.users.User");
		query.declareParameters("User user");
		List<SKOScript> scripts = (List<SKOScript>)query.execute(user);
		// create json object for return
		JSONObject returnObject = new JSONObject();
		JSONArray scriptArray = new JSONArray();
		// create json object for each entity
		for (SKOScript script : scripts) {
			try {
				JSONObject scriptObject = new JSONObject();
				scriptObject.put("guid", script.getGuid());
				scriptObject.put("title", script.getTitle());
				scriptObject.put("scriptType", script.getScriptType());
				scriptArray.put(scriptObject);
			} catch (JSONException e) {
				response.getOutputStream().print("{\"error\":\"JSON Exception\"}");
			}
		}
		try {
			returnObject.put("scripts", scriptArray);
		} catch (JSONException e) {
			response.getOutputStream().print("{\"error\":\"JSON Exception\"}");
		}
		pm.close();
		response.getOutputStream().print(returnObject.toString());
	}
}
