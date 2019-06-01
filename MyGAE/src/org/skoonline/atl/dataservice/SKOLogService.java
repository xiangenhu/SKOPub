package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOLogNewDAL;
import org.skoonline.atl.dataservice.entities.SKOLogNew;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class SKOLogService extends HttpServlet {
	private static final Logger logg = Logger.getLogger(MyScriptsServlet.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String action = req.getParameter("action");
		String guid = req.getParameter("guid");
		String log = req.getParameter("log");
		String SID = req.getParameter("SID");
		String SRT = req.getParameter("SRT");
		String user = req.getParameter("user");
		logg.info("SKO Log: "+action);
		logg.info("SRT:"+SRT);
		logg.info("SID:"+SID);
		logg.info("Log:"+log);
		logg.info("USER"+user);
		if(SID==null){
			SID="";
		}
		if(SRT==null){
			SRT="";
		}
		if(guid==null){
			guid="";
		}
		if(user==null){
			user="";
		}

		if (action.toLowerCase().equals("create")) {
			resp.getWriter().write(addLog(guid, log, SRT, SID));
		} else {
			resp.getWriter().write(getEntries(guid,SID, SRT, user));
		}
	}
	
	private String addLog(String guid, String log, String SRT, String SID) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		SKOLogNew skoLog = new SKOLogNew();
		skoLog.setGuid(guid);
		skoLog.setLogContent(new Text(log));
		skoLog.setUser(UserServiceFactory.getUserService().getCurrentUser());
		skoLog.setTimestamp(new Date());
		skoLog.setSID(SID);
		skoLog.setSRT(SRT);
		
		try {
			pm.makePersistent(skoLog);
			return String.format(Constants.jsonMessageTemplate, "success", String.format("Created new log at %1$s", skoLog.getTimestamp().toString()));
		} catch (Exception e) {
			return String.format(Constants.jsonMessageTemplate, "error", "Failed to create log");
		} finally {
			pm.close();
		}
		
	}
	
	private String getEntries(String guid,String sid, String srt, String user) {
		logg.info("get entries");
		List<SKOLogNew> logs = SKOLogNewDAL.getSKOLogsByGuid(guid,sid,srt, user);
		logg.info("get entries>>"+ logs);
		JSONObject jsonObject = new JSONObject();
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		if (!PermissionManager.checkPermission(currentUser.getNickname(), guid, PermissionConstants.OWNER)) {
			try {
				jsonObject.put("error", "User must have at least OWNER permissions to access the logs");
			} catch (JSONException e) {
				
			}
		} else {
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
		logg.info(jsonObject.toString());
		return jsonObject.toString();
	}
}
