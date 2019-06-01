package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

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
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;


@SuppressWarnings("serial")
public class AdminScriptsServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(MyScriptsServlet.class.getName());
	public void doGet(HttpServletRequest request, HttpServletResponse response)throws IOException {
		doPost(request,response);
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response)throws IOException {
		
		String search_title = request.getParameter("title");
		String search_type = request.getParameter("type");
		String search_author = request.getParameter("author");
		String search_date_start = request.getParameter("start_date");
		String search_date_end = request.getParameter("end_date");
		
		
		if (!ATLGAEUtils.isAdmin()) {
			response.getWriter().write("error: You must be a superuser to access this page.  Please logout and log back in as a user with superuser permissions.");
			return;
		}
		UserService service = UserServiceFactory.getUserService();
		User user = service.getCurrentUser();
		response.setContentType("text/html");
		if (user == null) {
			response.getWriter().write("You must be logged in to use this service.  Please click the link below to be redirected to the login page.<br/>");
			response.getWriter().write("<a href=\"" + service.createLoginURL(request.getRequestURI()) + "\">Login</a>");
		} else {
		
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Query query = pm.newQuery(SKOScript.class);
			
			query.setOrdering("timestamp descending");
			query.declareParameters("User needle");
			query.declareImports("import com.google.appengine.api.users.User");
			
			JSONArray skos = new JSONArray();
			List<SKOScript> skoScripts = new ArrayList<SKOScript>();
			List<SKOScript> scripts = (List<SKOScript>)query.execute(user);
			if (scripts.size() > 0) {
				for(SKOScript script : scripts)
					skoScripts.add(script);
			}
			
			log.info("size"+skoScripts.size());
			
			search_title = ".*"+search_title+".*";

			search_type = ".*"+search_type+".*";
			search_author = ".*"+search_author+".*";
			
			
			
			
			if(search_date_start.length()==0){
				search_date_start = "01/01/1970";
			}
			else{
			}
			
			if(search_date_end.length()==0){
				search_date_end = "01/01/2020";

			}
			else{
			}
		
			log.info(search_title +"\n" + search_type );
		
		for(int i=0; i< skoScripts.size(); i++){
			SKOScript mysko = skoScripts.get(i);
			
			if(is_date_between(search_date_start,search_date_end,mysko.getTimestamp())){
				log.info("YES");
			}else{
				log.info("NO");
			}
			if( !(  mysko.getTitle().toLowerCase().matches(search_title.toLowerCase()) && mysko.getCreatedBy().getEmail().toLowerCase().matches(search_author.toLowerCase())  && mysko.getScriptType().toLowerCase().matches(search_type.toLowerCase()) && is_date_between(search_date_start,search_date_end,mysko.getTimestamp()) )  ){
				skoScripts.remove(i);
				i--;
				log.info("not match so removed");
			}
		}
			
			
			
			
			
			
			
			for (SKOScript script : skoScripts) {
				JSONObject sko = new JSONObject();
				try {
					sko.put("title", script.getTitle());
					sko.put("scriptType", script.getScriptType());
					sko.put("lastUpdated", script.getTimestamp().toString());
					sko.put("guid", script.getGuid());
					sko.put("published", script.getPublished());
					sko.put("createdBy", script.getCreatedBy());
					sko.put("notes", script.getNotes());
					skos.put(sko);
				} catch (JSONException e) {
					
				}
			}
			response.getWriter().write( skos.toString());
		}
	}
	
	
	private Boolean is_date_between(String start, String end, Date date){
		
		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		//String dateInString = "07/06/2013";
	 
		try {
	 
			Date date_start = formatter.parse(start);
			Date date_end   = formatter.parse(end);
			
			Calendar c = Calendar.getInstance();
			c.setTime(date_end);
			c.add(Calendar.DATE, 1);
			date_end = c.getTime();
			

			
			if(date.compareTo(date_start) >=0 && date.compareTo(date_end)<=0){
				return true;
			}
			else
			{
				return false;
			}
			
	 
		} catch (ParseException e) {
			
		}
		

		return true;
	}

}
