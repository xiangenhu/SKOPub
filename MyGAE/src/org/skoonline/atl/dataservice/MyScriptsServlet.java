package org.skoonline.atl.dataservice;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.utils.ScriptComparer;
import org.skoonline.atl.dataservice.utils.ScriptComparerTitle;
import org.skoonline.atl.dataservice.utils.ScriptComparerType;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;


@SuppressWarnings("serial")
public class MyScriptsServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(MyScriptsServlet.class.getName());
	private int pageSize = 10;
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		log.info((String)request.getParameter("BURL"));
		doPost(request, response);
	}
	
	private Query constructSKOQuery(String sortField, boolean sortDescending) {
		log.info("=======================");
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("guid == skoGuid");
		query.declareParameters("String skoGuid");
		String sortOrder = (sortDescending == true) ? "descending" : "ascending";
		if (sortField.equals("date"))
			sortField = "timestamp";
		else if (sortField.equals("scripttype"))
			sortField = "scriptType";
		else if (sortField.equals("title"))
			sortField = "title";
		
		sortField = "timestamp";
		
		query.setOrdering(sortField + " " + sortOrder);
		
		return query;
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		int permissionLevel = Integer.parseInt(request.getParameter("permissionLevel"));
		int currentPage = Integer.parseInt(request.getParameter("offset"));
		/*
		 * added code to support filtering
		 * */
		String search_title = request.getParameter("search_title");
		String search_type = request.getParameter("search_type");
		String search_date_start = request.getParameter("search_date_start");
		String search_date_end = request.getParameter("search_date_end");
		
		String sortField = request.getParameter("sortField");
		boolean sortDescending = Boolean.parseBoolean(request.getParameter("sortDescending"));
		if (!isLoggedIn()) {
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("loginUrl", UserServiceFactory.getUserService().createLoginURL("/myScripts.jsp"));
				response.getOutputStream().print(jsonObject.toString());
			} catch (JSONException e) {
				// pass
			}
		} else {
			PersistenceManager pm = PMF.get().getPersistenceManager();
			String currentUser = getLoggedInUser().getNickname().toLowerCase();
			Query permissionQuery = pm.newQuery(Permission.class);
			permissionQuery.setFilter("permission == permissionLevel && user == currentUser && inTrash == isInTrash");
			permissionQuery.declareParameters("int permissionLevel, String currentUser, boolean isInTrash");
			
			List<Permission> permissions = (List<Permission>)permissionQuery.executeWithArray(new Object[] {permissionLevel, currentUser, false});
			log.info(String.format("There were %1$s permissions for %2$s and permission level %3$s", permissions.size(), currentUser, permissionLevel));
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
			
			if (sortField.equals("scripttype"))
				Collections.sort(skoScripts, new ScriptComparerType());
			else if (sortField.equals("title"))
				Collections.sort(skoScripts, new ScriptComparerTitle());
			else
				Collections.sort(skoScripts, new ScriptComparer());
			if (sortDescending == true)
				Collections.reverse(skoScripts);
			
			
			
			
			
			
			/*
			 * Need to change here to filter the skos
			 * 
			 * 
			 * */
			
			//if(search_title.length()==0)
				search_title = ".*"+search_title+".*";
			//if(search_type.length()==0)
				search_type = ".*"+search_type+".*";
				
				
				if(search_date_start.length()==0){
					search_date_start = "01/01/1970";
					log.info(search_date_start);
				}
				else{
					log.info(search_date_start);
				}
				
				if(search_date_end.length()==0){
					search_date_end = "01/01/2020";
					log.info(search_date_end);
				}
				else{
					log.info(search_date_end);
				}
			
			
			for(int i=0; i< skoScripts.size(); i++){
				SKOScript mysko = skoScripts.get(i);
				
				is_date_between(search_date_start,search_date_end,mysko.getTimestamp());
				
				if(mysko.getTitle().toLowerCase().matches(search_title.toLowerCase())  && mysko.getScriptType().toLowerCase().matches(search_type.toLowerCase()) && is_date_between(search_date_start,search_date_end,mysko.getTimestamp()))
					log.info("Found");
				else
					log.info("Not Found");
				
				if( !( mysko.getTitle().toLowerCase().matches(search_title.toLowerCase())  && mysko.getScriptType().toLowerCase().matches(search_type.toLowerCase()) && is_date_between(search_date_start,search_date_end,mysko.getTimestamp()) )  ){
					skoScripts.remove(i);
					i--;
				}
			}
			int total_sko_count = skoScripts.size();
			
			////////////////////////////////////////////
			
			int pageCount = skoScripts.size() / pageSize;
			if (skoScripts.size() % pageSize != 0)
				++pageCount;
			
			int startIndex = (currentPage) * pageSize;
			if (startIndex > skoScripts.size()) startIndex -= pageSize;
			int finishIndex = startIndex + pageSize;
			if (finishIndex > skoScripts.size()) finishIndex = skoScripts.size();
			
			skoScripts = skoScripts.subList(startIndex, finishIndex);
			
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
				pageData.put("currentPage", currentPage);
				pageData.put("totalSko", total_sko_count);
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
	
	private Boolean is_date_between(String start, String end, Date date){
		log.info(start);
		log.info(end);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		//String dateInString = "07/06/2013";
	 
		try {
	 
			Date date_start = formatter.parse(start);
			Date date_end   = formatter.parse(end);
			
			Calendar c = Calendar.getInstance();
			c.setTime(date_end);
			c.add(Calendar.DATE, 1);
			date_end = c.getTime();
			
			
			log.info(date_start.toString());
			log.info(date_end.toString());
			log.info(date.toString());
			
			if(date.compareTo(date_start) >=0 && date.compareTo(date_end)<=0){
				log.info("Date is between");
				return true;
			}
			else
			{
				log.info("Date Not between");
				return false;
			}
			//System.out.println(date);
			
	 
		} catch (ParseException e) {
			
		}
		

		return true;
	}
}
