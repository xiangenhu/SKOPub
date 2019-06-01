package org.skoonline.atl.dataservice.dal;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.script.ScriptEngine;

import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.entities.SKOScriptHistory;
import org.skoonline.atl.dataservice.entities.viewmodels.VCSViewModel;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

public class SKOScriptHistoryDAL {
	private static boolean isOwner(String guid) {
		String nickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
		return PermissionManager.checkPermission(nickname, guid, PermissionConstants.OWNER);
	}
	
	private static boolean isCollaborator(String guid) {
		String nickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
		return PermissionManager.checkPermission(nickname, guid, PermissionConstants.COLLABORATOR);
	}
	
	// need to have an annotation here to set which permissions can access this method something like:
	// @ATLPermissionRequired(permissionLevel = PermissionConstants.OWNER)
	public static List<SKOScriptHistory> getHistoryByGUID(String guid) {
		if (!isOwner(guid)) // need to figure out how to do this with annotations
			return null;
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(SKOScriptHistory.class);
			query.setFilter("guid == _guid");
			query.declareParameters("String _guid");
			query.setOrdering("timestamp descending");
			List<SKOScriptHistory> scripts = (List<SKOScriptHistory>)query.execute(guid);
			return scripts;
		} finally {
			pm.close();
		}
	}
	
	public static SKOScriptHistory getMostRecentHistory(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(SKOScriptHistory.class);
			query.setFilter("guid == _guid");
			query.declareParameters("String _guid");
			query.setOrdering("timestamp descending");
			List<SKOScriptHistory> scripts = (List<SKOScriptHistory>)query.execute(guid);
			return scripts.get(0);
		} finally {
			pm.close();
		}
	}
	
	public static List<VCSViewModel> getHistoryForVCS(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		List<VCSViewModel> history = new ArrayList<VCSViewModel>();
		try {
			Query query = pm.newQuery(SKOScriptHistory.class);
			query.setFilter("guid == _guid");
			query.declareParameters("String _guid");
			query.setOrdering("timestamp descending");
			List<SKOScriptHistory> scripts = (List<SKOScriptHistory>)query.execute(guid);
			for (SKOScriptHistory s : scripts) {
				Query query2 = pm.newQuery(SKOScript.class);
				query2.setFilter("guid == _guid");
				query2.declareParameters("String _guid");
				List<SKOScript> skos = (List<SKOScript>)query2.execute(s.getGuid());
				VCSViewModel vm = new VCSViewModel();
				vm.setMostRecentHistory(s);
				vm.setScript(skos.get(0));
				history.add(vm);
			}
			return history;
		} finally {
			pm.close();
		}
	}
	
	public static void addScriptHistory(SKOScript script) {
		User user = UserServiceFactory.getUserService().getCurrentUser();
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			SKOScriptHistory history = new SKOScriptHistory();
			history.setGuid(script.getGuid());
			//history.setScriptContent(script.getScriptContent());
			history.setScriptContent(null);
			history.setScriptContentBlob(script.getScriptContentBlob());/// Changes
			history.setTimestamp(new Date());
			history.setTitle(script.getTitle());
			history.setNotes(script.getNotes());
			if (user != null)
				history.setLastUpdatedBy(user);
			else
				history.setLastUpdatedBy(script.getCreatedBy());
			pm.makePersistent(history);
		} finally {
			pm.close();
		}
	}
	
	// @ATLPermissionRequired(permissionLevel = PermissionConstants.OWNER)
	public static void revertToPastScriptHistory(Key key) {
		// get the script history by key
		// check for ownership (is there someway to do this beforehand and save a datastore call?
		// set timestamp on this history to now
		// update
	}
}
