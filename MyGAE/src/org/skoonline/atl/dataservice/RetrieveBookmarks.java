package org.skoonline.atl.dataservice;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOBookmarksDAL;
import org.skoonline.atl.dataservice.entities.SKOBookmarks;
@SuppressWarnings("serial")
public class RetrieveBookmarks extends HttpServlet {
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
		
		String email="",guid="";
		int numberOfBookmark=20;
		try {
			email = jObject.getString("user");
			guid = jObject.getString("guid");
			numberOfBookmark = Integer.parseInt( jObject.getString("x"));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			numberOfBookmark=20;
		}finally{
			resp.getWriter().write(getEntries(guid,email, numberOfBookmark));
		}
		
		
	}
	
	@SuppressWarnings("finally")
	private String getEntries(String guid,String email,int numberOfBookmarks) {
		JSONObject jsonObject = new JSONObject();
		List<SKOBookmarks> bookmarks = SKOBookmarksDAL.getSKOBookmarksByGuid(guid,email);
		
		if(bookmarks==null){
			try {
				jsonObject.put("error", "No Record Found with this search");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}finally{
				return jsonObject.toString();
			}
		}
		else{
			
			// order bookmark here:
			List<SKOBookmarks> logs = new ArrayList<SKOBookmarks>();
			for(int i=0; i<bookmarks.size();i++ ){
				logs.add(bookmarks.get(i));
			}
			for(int i=0; i<logs.size(); i++){
				for(int j=i+1; j<logs.size(); j++){
					if(is_date_large(logs.get(i).getTime(),logs.get(j).getTime())){
						SKOBookmarks temp = logs.get(i);
						logs.set(i, logs.get(j));
						logs.set(j, temp);
					}
				}
			}
			//JSONArray jsonArray = new JSONArray();
			JSONObject retJObj = new JSONObject();
			int i=1;
			for (SKOBookmarks log : logs) {
				JSONObject logObject = new JSONObject();
				try {
					logObject.put("guid", log.getGuid());
					logObject.put("datetime", log.getTime().toString());
					logObject.put("email", log.getEmail());
					logObject.put("bookmark", log.getBookmark());
					logObject.put("notes", log.getNotes());
					String key = "bkm"+i; 
					//jsonArray.put(logObject);
					retJObj.put(key, logObject);
					i++;
					if(i>numberOfBookmarks){
						break;
					}
				} catch (JSONException e) {
					
				}
			}
				
			return retJObj.toString();
		}
//	}
	//logg.info(jsonObject.toString());
	
	}
	
	private Boolean is_date_large(Date s1, Date s2){
		
		if(s2.compareTo(s1)>0)
			return true;
		else
			return false;
		
	}
	
}