package org.skoonline.atl.dataservice.dal;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import java.util.List;
import java.util.logging.Logger;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.ATLDataSvcServlet;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PublishConstants;
import org.skoonline.atl.dataservice.utils.Emailer;

public class SKOScriptDAL {
	private static final Logger log = Logger.getLogger(ATLDataSvcServlet.class.getName());
	public static SKOScript getSKOByGuid(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("guid == id");
		query.declareParameters("String id");
		
		try {
			List<SKOScript> scripts = (List<SKOScript>)query.execute(guid);
			if (scripts.size() > 0)
				return scripts.get(0);
			else {
				log.warning(String.format("Could not find SKOScript with guid: %1$s", guid));
				throw new NullPointerException();
			}
		} finally {
			pm.close();
		}
	}
	
	public static void publish(String guid) {
		SKOScript script = getSKOByGuid(guid);
		script.setPublished(true);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			pm.makePersistent(script);
			sendEmails(guid);
		} finally {
			pm.close();
		}
	}
	
	public static void unpublish(String guid) {
		SKOScript script = getSKOByGuid(guid);
		script.setPublished(false);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			pm.makePersistent(script);
		} finally {
			pm.close();
		}
	}
	
	private static void sendEmails(String guid) {
		List<Permission> perms = PermissionManager.getPermissionsByGUID(guid);
		SKOScript script = SKOScriptDAL.getSKOByGuid(guid);
		for (Permission p : perms) {
			try {
			String messageBody = composeMessage(p, script);
			String subject = String.format("%1$s has been published", URLDecoder.decode(script.getTitle(), "utf-8"));
			Emailer.sendMessage(p.getUser(), "xiangenhu@gmail.com", messageBody, subject);
			} catch (UnsupportedEncodingException e) {
				
			}
		}
	}
	
	private static String composeMessage(Permission p, SKOScript script) {
		String messageBody = "";
		try {
			messageBody += String.format(PublishConstants.EMAIL_TEMPLATE_PUBLISH_HEADER, p.getUser());
			messageBody += String.format(PublishConstants.EMAIL_TEMPLATE_PUBLISH_BODY, script.getCreatedBy(), URLDecoder.decode(script.getTitle(), "utf-8"));
			messageBody += String.format(PublishConstants.EMAIL_TEMPLATE_PUBLISH_CLOSING);
		} catch (UnsupportedEncodingException e) {
			
		}
		return messageBody;
	}
}
