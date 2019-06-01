package org.skoonline.atl.dataservice.dal;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import java.util.List;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.entities.SKOBookmarks;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PublishConstants;
import org.skoonline.atl.dataservice.utils.Emailer;

public class SKOBookmarksDAL {
	
	public static List<SKOBookmarks> getSKOBookmarksByGuid(String guid, String email) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOBookmarks.class);
		query.setFilter("guid == '"+guid+"' && email == '"+email+"'");
		
		query.declareParameters("String id");
		try {
			List<SKOBookmarks> bookmarks = (List<SKOBookmarks>)query.execute(guid);
			if (bookmarks.size() > 0)
				return bookmarks;
			else{
				return null;
			}
				//throw new NullPointerException();
		} finally {
			pm.close();
		}
	}
}
