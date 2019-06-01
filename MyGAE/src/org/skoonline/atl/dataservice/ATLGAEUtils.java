package org.skoonline.atl.dataservice;

import java.util.Hashtable;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

public class ATLGAEUtils {
	private static Hashtable<String, String> map = new Hashtable<String, String>();
	private static boolean init = false;
	private static Logger log = Logger.getLogger(ATLGAEUtils.class.getName());
	
	private static void initHashtable() {
		map.put("InforDelivery", "Information Delivery");
		map.put("ITSContent", "Essay");
		map.put("MultipleChoice", "Multiple Choice");
		map.put("Matching", "Matching");
		map.put("FillInBlank", "Fill in the Blank");
		map.put("Trialog", "Trialog");
		
		init = true;
	}
	
	public static String getPrettyScriptType(String st) {
		if (!init) {
			initHashtable();
		}
		
		if (map.containsKey(st))
			return map.get(st);
		return "Invalid script type";
	}
	
	public static String fixEmail(String n) {
		if (n.indexOf("@") == -1) 
			return n + "@gmail.com";
		return n;
	}
	
	public static String stripCDATA(String n) {
		String needle = "<![CDATA[";
		if (n.indexOf(needle) == -1)
			return n;
		String temp = n.substring(needle.length());
		return temp.substring(0, temp.length()-3);
	}
	
	@SuppressWarnings("unchecked")
	public static boolean isAdmin() {
		User user = UserServiceFactory.getUserService().getCurrentUser();
		if (user == null) {
			log.info("ATLGAEUtils.isAdmin(): user is NULL");
			return false;
		}
		if (user.getNickname().equals("xiangenhu"))
			return true;
		log.info("ATLGAEUtils.isAdmin(): user is " + user.getNickname());
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Superuser.class);
		query.setFilter("user == needle");
		query.declareParameters("String needle");
		List<Superuser> sus = (List<Superuser>)query.execute(user.getNickname().toLowerCase());
		if (sus.size() > 0) {
			log.info("ATLGAEUtils.isAdmin(): found user");
			return true;
		}
		log.info("ATLGAEUtils.isAdmin(): could not find user");
		return false;
		
	}
	
	public static String fixMSWordQuotes(String s) {
		String temp = "";
		for (char c : s.toCharArray()) {
			if ((int)c == 63) {
				temp += (char)0x27;
			} else {
				temp += c;
			}
		}
		return temp;
	}
}
