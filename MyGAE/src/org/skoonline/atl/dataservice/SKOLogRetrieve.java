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
import org.skoonline.atl.dataservice.dal.SKOLogNewDAL;
import org.skoonline.atl.dataservice.entities.SKOLogNew;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class SKOLogRetrieve extends HttpServlet {
	private static final Logger logg = Logger.getLogger(MyScriptsServlet.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String json_string = req.getParameter("json");
		JSONObject jsonObject=new JSONObject();
		try {
			jsonObject = new JSONObject(json_string);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String guid="";
		try {
			guid = jsonObject.getString("guid");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			guid = "";
		}
		String SID="";
		try {
			SID = jsonObject.getString("SID");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String SRT="";
		try {
			SRT = jsonObject.getString("SRT");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String user="";
		try {
			user = jsonObject.getString("user");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if (!isLoggedIn()) {
			logg.info("NOT Logged In");
			String loginurl = UserServiceFactory.getUserService().createLoginURL("/retrieveRecord?json="+json_string);
			resp.sendRedirect(loginurl);
		}else{
			
			resp.getWriter().write(getEntries(guid,SID, SRT, user));
		}
		
	}
	private String getEntries(String guid,String sid, String srt, String user) {
		logg.info("get entries");
		
		JSONObject jsonObject = new JSONObject();
//		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
//		if (!PermissionManager.checkPermission(currentUser.getNickname(), guid, PermissionConstants.OWNER)) {
//			try {
//				jsonObject.put("error", "User must have at least OWNER permissions to access the logs, Please check your guid");
//			} catch (JSONException e) {
//				
//			}
//		} else {
			List<SKOLogNew> logs = SKOLogNewDAL.getSKOLogsByGuid(guid,sid,srt, user);
			if(logs==null){
				try {
					jsonObject.put("error", "No Record Found with this search");
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			else{
				JSONArray jsonArray = new JSONArray();
				for (SKOLogNew log : logs) {
					JSONObject logObject = new JSONObject();
					try {
						logObject.put("content", log.getLogContent().getValue());
						logObject.put("timestamp", log.getTimestamp().toString());
						logObject.put("user", log.getUser());
						jsonArray.put(logObject);
					} catch (JSONException e) {
						
					}
				}
				try {
					jsonObject.put("logs", jsonArray);
				} catch (JSONException e) {
					
				}		
			}
//		}
		logg.info(jsonObject.toString());
		return jsonObject.toString();
	}
	

	private User getLoggedInUser() {
		return UserServiceFactory.getUserService().getCurrentUser();
	}
	
	private Boolean isLoggedIn() {
		return !(getLoggedInUser() == null);
	}
	
}
