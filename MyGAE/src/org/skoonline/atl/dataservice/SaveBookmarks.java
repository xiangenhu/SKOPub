package org.skoonline.atl.dataservice;


import java.io.IOException;
import java.util.Date;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.entities.SKOBookmarks;
import org.skoonline.atl.dataservice.utils.PMF;
@SuppressWarnings("serial")
public class SaveBookmarks extends HttpServlet {
	private static final Logger logg = Logger.getLogger(MyScriptsServlet.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String json_str = req.getParameter("json");

		JSONObject jObject=new JSONObject();
		try {
			jObject = new JSONObject(json_str);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String email="",guid="",bookmark="",notes="";
		try {
			email = jObject.getString("user");
			guid = jObject.getString("guid");
			bookmark = jObject.getString("bookmark");
			notes = jObject.getString("notes");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			Date datetime = new Date();			
			addBookmark(guid,email,bookmark,notes,datetime);
		}
		
		
	}
	
	private String  addBookmark(String guid, String email, String bookmark, String notes, Date datetime) {
		
	
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		SKOBookmarks skobookmarks = new SKOBookmarks();
		skobookmarks.setGuid(guid);
		skobookmarks.setEmail(email);
		skobookmarks.setBookmark(bookmark);
		skobookmarks.setTime(datetime);
		skobookmarks.setNotes(notes);
	
		
		try {
			pm.makePersistent(skobookmarks);
			return String.format(Constants.jsonMessageTemplate, "success", String.format("Created new log at %1$s", skobookmarks.getTime().toString()));
		} catch (Exception e) {
			return String.format(Constants.jsonMessageTemplate, "error", "Failed to create log");
		} finally {
			pm.close();
		}
	
	}
}