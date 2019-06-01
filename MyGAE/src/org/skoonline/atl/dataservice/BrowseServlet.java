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

@SuppressWarnings("serial")
public class BrowseServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("published == isPublished");
		query.declareParameters("Boolean isPublished");
		List<SKOScript> publishedScripts = (List<SKOScript>)query.execute(true);
		JSONObject jsonObject = new JSONObject();
		JSONArray scriptArray = new JSONArray();
		try {
			for (SKOScript script : publishedScripts) {
				JSONObject scriptObject = new JSONObject();
				scriptObject.put("guid", script.getGuid());
				scriptObject.put("title", script.getTitle());
				scriptObject.put("scriptType", script.getScriptType());
				scriptArray.put(scriptObject);
			}
		} catch (JSONException e) {
			response.getOutputStream().print("{\"error\":\"JSON Exception\"}");
		}
		try {
			jsonObject.put("scripts", scriptArray);
		} catch (JSONException e) {
			
		}
		pm.close();
		response.getOutputStream().print(jsonObject.toString());
	}
}
