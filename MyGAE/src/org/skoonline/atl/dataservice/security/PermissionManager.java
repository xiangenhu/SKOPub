package org.skoonline.atl.dataservice.security;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import com.google.appengine.api.users.UserServiceFactory;

import org.skoonline.atl.dataservice.ATLGAEUtils;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.utils.Emailer;
import org.skoonline.atl.dataservice.utils.Misc;
import org.skoonline.atl.dataservice.dal.SKOScriptDAL;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

public class PermissionManager {
	public static final Logger log = Logger.getLogger(PermissionManager.class.getName());
	
	public static boolean grantPermission(String nickname, String guid, String baseURL, int permission, boolean isAuthoringTool, boolean sendEmail) {
		boolean complete = false;
		if (isAuthoringTool) {
			return createPermission(nickname, guid, PermissionConstants.CREATOR);
		}
		String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
		boolean isOwner = checkPermission(currentNickname, guid, PermissionConstants.OWNER);
		if (!isOwner)
			return false;
		boolean permsExist = permissionExists(nickname, guid);
		if (permsExist) {
			complete = addPermission(nickname, guid, permission);
		} else {
			complete = createPermission(nickname, guid, permission);
		}
		if (complete && sendEmail) {
			String skoTitle = "";
			
			try {
				SKOScript s = SKOScriptDAL.getSKOByGuid(guid);
				skoTitle = URLDecoder.decode(s.getTitle(), "utf-8");
			} catch (NullPointerException e) {
				log.severe(PermissionManager.class.getName() + " - " + e.getClass().getName() + " - " + e.getMessage());
				skoTitle = "not found"; // this should not happen
			} catch (UnsupportedEncodingException e) {
				log.severe(PermissionManager.class.getName() + " - " + e.getClass().getName() + " - " + e.getMessage());
			}
			String message = composeEmail(baseURL,permission, nickname, currentNickname, skoTitle, guid);
			boolean emailSent = Emailer.sendMessage(Misc.checkEmail(nickname), "xiangenhu@gmail.com", message, "Invitation from ATLite");
			if (emailSent) {
				log.info("Email invite sent to: " + nickname);
			} else {
				log.warning("Failed to send email invite to: " + nickname);
			}
		}
		return complete;
	}
	
	public static boolean revokePermission(String nickname, String guid, int permission) {
		String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname().toLowerCase();
		boolean isOwner = checkPermission(currentNickname, guid, PermissionConstants.OWNER);
		if (!isOwner)
			return false;
		boolean permsExist = permissionExists(nickname, guid);
		if (permsExist) {
			if (!checkPermission(nickname, guid, permission))
				return false;
			return removePermission(nickname, guid, permission);
		} else {
			return false;
		}
	}
	
	private static boolean removePermission(String nickname, String guid,
			int permission) {
		Permission p = getPermission(nickname, guid);
		if (p == null)
			return false;
		p.setPermission(0);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			//pm.deletePersistent(p);
			pm.makePersistent(p);
			return true;
		} finally {
			pm.close();
		}
	}

	private static boolean addPermission(String nickname, String guid, int permission) {
		Permission p = getPermission(nickname, guid);
		if (p == null) 
			return false;
		p.setPermission(permission);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			pm.makePersistent(p);
			return true;
		} finally {
			pm.close();
		}
	}
	
	private static Permission getPermission(String nickname, String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("user == _nickname && guid == _guid");
			query.declareParameters("String _nickname, String _guid");
			List<Permission> perms = (List<Permission>)query.execute(nickname.toLowerCase(), guid);
			if (perms.size() > 0)
				return perms.get(0);
			return null;
		} finally {
			pm.close();
		}
	}
	
	private static boolean permissionExists(String nickname, String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("user == _nickname && guid == _guid");
			query.declareParameters("String _nickname, String _guid");
			List<Permission> permList = (List<Permission>)query.execute(nickname.toLowerCase(), guid);
			if (permList.size() > 0)
				return true;
			return false;
		} finally {
			pm.close();
		}
	}
	
	private static boolean createPermission(String nickname, String guid, int permission) {
		if (permissionExists(nickname, guid)) 
			return false;
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Permission perm = new Permission();
			perm.setGuid(guid);
			perm.setUser(nickname.toLowerCase());
			perm.setPermission(permission);
			perm.setInTrash(false);
			pm.makePersistent(perm);
			return true;
		} finally {
			pm.close();
		}
	}

	public static boolean checkPermission(String nickname, String guid,
			int permission) {
		if (ATLGAEUtils.isAdmin())
			return true;
		if (!permissionExists(nickname, guid))
			return false;
		Permission p = getPermission(nickname, guid);
		int currentPermission = p.getPermission();
		return currentPermission >= permission;
	}
	
	public static int getPermissionLevel(String nickname, String guid) {
		if (!permissionExists(nickname, guid))
			return 0;
		Permission p = getPermission(nickname, guid);
		return p.getPermission();
	}
	
	public static List<Permission> getPermissionsForCurrentUser() {
		String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
		return getPermissionsByNickname(currentNickname);
		/*PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("user == _nickname");
			query.declareParameters("String _nickname");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute();
			return perms;
		} finally {
			pm.close();
		}*/
	}
	
	public static List<Permission> getPermissionsByNickname(String nickname) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("user == _nickname");
			query.declareParameters("String _nickname");
			List<Permission> perms = (List<Permission>)query.execute(nickname.toLowerCase());
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}
	
	public static List<Permission> getPermissionsByGUID(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == _guid");
			query.declareParameters("String _guid");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute(guid);
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}

	public static List<Permission> getPermissionsByGUID8(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == _guid && permission==8");
			query.declareParameters("String _guid");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute(guid);
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}

	public static List<Permission> getPermissionsByGUID4(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == _guid && permission==4");
			query.declareParameters("String _guid");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute(guid);
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}
	

	public static List<Permission> getPermissionsByGUID2(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == _guid && permission==2");
			query.declareParameters("String _guid");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute(guid);
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}
	


	public static List<Permission> getPermissionsByGUID1(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Permission.class);
			query.setFilter("guid == _guid && permission==1");
			query.declareParameters("String _guid");
			query.setOrdering("permission descending");
			List<Permission> perms = (List<Permission>)query.execute(guid);
			ArrayList<Permission> pList = new ArrayList<Permission>(perms);
			return pList;
		} finally {
			pm.close();
		}
	}
	
	private static String composeEmail(String baseURL,int permission, String nickname, String currentNickname, String skoTitle, String guid) {
		String messageBody = String.format(PermissionConstants.EMAIL_TEMPLATE_INVITATION_HEADER, nickname, currentNickname, skoTitle);
		messageBody += String.format(PermissionConstants.EMAIL_TEMPLATE_INVITATION_VIEWER, baseURL,guid);
		if (permission > PermissionConstants.VIEWER) {
			messageBody += String.format(PermissionConstants.EMAIL_TEMPLATE_INVITATION_COLLABORATOR,baseURL, guid);
		}
		messageBody += String.format(PermissionConstants.EMAIL_TEMPLATE_INVITATION_CLOSING,	guid);
		return messageBody;
	}
}
