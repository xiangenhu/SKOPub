package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.utils.ScriptComparerTitle;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class TrashServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(MyScriptsServlet.class.getName());
	private int pageSize = 10;
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		
		if (currentUser == null) {
			String loginUrl = UserServiceFactory.getUserService().createLoginURL("/trash.jsp");
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("loginUrl", loginUrl);
				response.getWriter().write(loginUrl);
			} catch (JSONException e) {
				response.getWriter().write("{\"error\":, \"" + e.getMessage() + "\"}");
			}
		} else {
			String skoGuid = request.getParameter("guid");
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == skoGuid");
			query.declareParameters("String skoGuid");
			List<Permission> toTrash = (List<Permission>)query.execute(skoGuid);
			
			
			
			try {
				for (Permission p : toTrash) {
					p.setInTrash(true);
				    pm.makePersistent(p);
				}
			} finally {
				pm.close();
			}
		}
	}
	
	public void doDelete(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		
		if (currentUser == null) {
			String loginUrl = UserServiceFactory.getUserService().createLoginURL("/trash.jsp");
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("loginUrl", loginUrl);
				response.getWriter().write(loginUrl);
			} catch (JSONException e) {
				response.getWriter().write("{\"error\":, \"" + e.getMessage() + "\"}");
			}
		} else {
			String skoGuid = request.getParameter("guid");
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == skoGuid");
			query.declareParameters("String skoGuid");
			List<Permission> toTrash = (List<Permission>)query.execute(skoGuid);
			
			
			try {
				for (Permission p : toTrash) {
					p.setInTrash(false);
					pm.makePersistent(p);
				}
			} finally {
				pm.close();
			}
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		
		if (currentUser == null) {
			String loginUrl = UserServiceFactory.getUserService().createLoginURL("/trash.jsp");
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("loginUrl", loginUrl);
				response.getWriter().write(loginUrl);
			} catch (JSONException e) {
				response.getWriter().write("{\"error\":, \"" + e.getMessage() + "\"}");
			}
		} else {
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Query permissionQuery = pm.newQuery(Permission.class);
			String username = UserServiceFactory.getUserService().getCurrentUser().getNickname();
			permissionQuery.setFilter("user == username && inTrash == isInTrash");
			permissionQuery.declareParameters("String username, boolean isInTrash");
			
			List<Permission> permissions = (List<Permission>)permissionQuery.executeWithArray(new Object[] {username, true});
			log.info(String.format("There were %1$s permissions", permissions.size()));
			JSONArray skos = new JSONArray();
			
			List<SKOScript> skoScripts = new ArrayList<SKOScript>();
			
			for (Permission p : permissions) {
				Query skoQuery = pm.newQuery(SKOScript.class);
				skoQuery.setFilter("guid == skoGuid");
				skoQuery.declareParameters("String skoGuid");
				List<SKOScript> scripts = (List<SKOScript>)skoQuery.execute(p.getGuid());
				if (scripts.size() > 0) {
					SKOScript script = scripts.get(0);
					skoScripts.add(script);
				}
			}
			
			
			Collections.sort(skoScripts, new ScriptComparerTitle());
			
			int pageCount = skoScripts.size() / pageSize;
			if (skoScripts.size() % pageSize != 0)
				++pageCount;
			
			for (SKOScript script : skoScripts) {
				JSONObject sko = new JSONObject();
				try {
					sko.put("title", script.getTitle());
					sko.put("scriptType", script.getScriptType());
					sko.put("lastUpdated", script.getTimestamp().toString());
					sko.put("guid", script.getGuid());
					skos.put(sko);
				} catch (JSONException e) {
					log.warning(script.getGuid());
					log.warning(e.getMessage());
				}
			}
			
			JSONObject pageData = new JSONObject();
			try {
				pageData.put("skos", skos);
				pageData.put("pageCount", pageCount);
				pageData.put("currentPage", 1);
			} catch (JSONException e) {
				log.warning(e.getMessage());
			}
			
			response.getWriter().print(pageData.toString());
		}
	}
	
	private User getLoggedInUser() {
		return UserServiceFactory.getUserService().getCurrentUser();
	}
	
	private Boolean isLoggedIn() {
		return !(getLoggedInUser() == null);
	}
}
