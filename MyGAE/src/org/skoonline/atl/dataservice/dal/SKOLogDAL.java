package org.skoonline.atl.dataservice.dal;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import java.util.List;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.entities.SKOLog;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PublishConstants;
import org.skoonline.atl.dataservice.utils.Emailer;

public class SKOLogDAL {
	public static List<SKOLog> getSKOLogsByGuid(String guid) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOLog.class);
		query.setFilter("guid == id");
		query.declareParameters("String id");
		try {
			List<SKOLog> logs = (List<SKOLog>)query.execute(guid);
			if (logs.size() > 0)
				return logs;
			else
				throw new NullPointerException();
		} finally {
			pm.close();
		}
	}
}
