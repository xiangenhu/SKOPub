package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOAccountDAL;
import org.skoonline.atl.dataservice.entities.SKOAccount;
import org.skoonline.atl.dataservice.utils.Misc;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class AccountServlet extends HttpServlet {
	private static final Logger logg = Logger.getLogger(MyScriptsServlet.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		logg.info("Account");
		String action= req.getParameter("action");
		String name = req.getParameter("name");
		String preference = req.getParameter("preference");
		String preferenceTitle = req.getParameter("preferenceTitle");
		String timestamp = req.getParameter("timestamp");
		String profile_id = req.getParameter("profileID");
		logg.info(action + name);
		
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		String nickname = "";
		if (currentUser != null) {
			nickname = currentUser.getNickname().toLowerCase();
			if (!nickname.contains("@"))
				nickname += "@gmail.com";
		}
		name = nickname;
		logg.info("NickName:"+name);
			if (!isLoggedIn()) {
			JSONObject jsonObject = new JSONObject();
			logg.info("NOT LOGGED IN");
			try {
				//jsonObject.put("loginUrl", UserServiceFactory.getUserService().createLoginURL("/myScripts.jsp"));
				//resp.getOutputStream().print(jsonObject.toString());
				resp.sendRedirect(UserServiceFactory.getUserService().createLoginURL("/account?&action="+action+"&preference="+preference+"&preferenceTitle="+preferenceTitle));
			} catch (Exception e) {
				// pass
			}
		}else{
				logg.info("LOGGED IN");
		
			if (action.toLowerCase().equals("create")){
				addEntry(name,preference, preferenceTitle, timestamp);
			}else if(action.toLowerCase().equals("update")){
				updateEntry(Long.parseLong(profile_id),name,preference, preferenceTitle);
			}
			else{
				resp.getWriter().write(getEntries(name));
			}
		}
	}
	
	private String addEntry(String name, String preference, String preferenceTitle, String timestamp) {
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		logg.info("AddEntry");
		SKOAccount account = new SKOAccount();
		
		account.setName(name);
		account.setPreference(preference);
		account.setPreferenceTitle(preferenceTitle);
		account.setTimestamp(new Date());
		
		try {
			pm.makePersistent(account);
			return String.format(Constants.jsonMessageTemplate, "success", String.format("Created new account at %1$s", account.getTimestamp().toString()));
		} catch (Exception e) {
			return String.format(Constants.jsonMessageTemplate, "error", "Failed to create account");
		} finally {
			pm.close();
		}
	}
	private void updateEntry(long id,String name, String preference, String preferenceTitle) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		logg.info("update Entry");
		SKOAccount account = new SKOAccount();
		account = pm.getObjectById(SKOAccount.class, id);
		account.setName(name);
		account.setPreference(preference);
		account.setPreferenceTitle(ATLGAEUtils.fixMSWordQuotes(preferenceTitle));//ATLGAEUtils.fixMSWordQuotes(preferenceTitle)
		account.setTimestamp(new Date());
		pm.makePersistent(account);
	}
	private String getEntries(String name) {
		logg.info("get entries");
		List<SKOAccount> accountList = SKOAccountDAL.getSKOAccountByName(name);
		logg.info("get entries>>"+ accountList);
		JSONObject accountObject = new JSONObject();
		
		if(accountList !=null)
		{
			for(SKOAccount account : accountList){
				
				try {
					accountObject.put("name", account.getName());
					accountObject.put("preference", account.getPreference());
					accountObject.put("preferenceTitle", Misc.unescape(account.getPreferenceTitle())  );
					accountObject.put("timestamp", account.getTimestamp());
					accountObject.put("ID", account.getId());
					logg.info(accountObject.toString());
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}else
		{
			try {
				accountObject.put("error","No Profile Found");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return accountObject.toString();
	}
	
	private User getLoggedInUser() {
		return UserServiceFactory.getUserService().getCurrentUser();
	}
	
	private Boolean isLoggedIn() {
		return !(getLoggedInUser() == null);
	}

}
