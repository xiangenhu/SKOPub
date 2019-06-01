package org.skoonline.atl.dataservice.dal;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import java.util.List;
import java.util.logging.Logger;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.entities.SKOLogNew;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;
import org.skoonline.atl.dataservice.MyScriptsServlet;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PublishConstants;
import org.skoonline.atl.dataservice.utils.Emailer;

public class SKOLogNewDAL {
	private static final Logger logg = Logger.getLogger(MyScriptsServlet.class.getName());
	public static List<SKOLogNew> getSKOLogsByGuid(String guid, String sid, String srt, String user) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOLogNew.class);
		
		logg.info("user"+user);
		logg.info("SID"+sid);
		logg.info("SRT"+srt);
		logg.info("guid"+guid);
		
		if(user.length()>0)
		{
			if(sid.length()>0 && guid.length()>0 && srt.length()>0){
				logg.info("1");
				query.setFilter("guid == '"+guid+"' && SID == '"+sid+"' && SRT == '"+srt+"' && user == '"+user+"' ");
			}
			else if (sid.length()>0 && guid.length()>0 && srt.length()==0)
			{
				logg.info("2");
				query.setFilter("guid == '"+guid+"' && SID == '"+sid+"' && user == '"+user+"' ");	
			}
			else if (sid.length()>0 && guid.length()==0 && srt.length()>0)
			{
				logg.info("3");
				query.setFilter("SRT == '"+srt+"' && SID == '"+sid+"' && user == '"+user+"' ");
			}
			else if (sid.length()==0 && guid.length()>0 && srt.length()>0)
			{
				logg.info("4");
				query.setFilter("guid == '"+guid+"' && SRT == '"+srt+"' && user == '"+user+"' ");
			}
			else if (sid.length()>0 && guid.length()==0 && srt.length()==0)
			{
				logg.info("5");
				query.setFilter("SID == '"+sid+"' && user == '"+user+"' ");
			}
			else if (sid.length()==0 && guid.length()>0 && srt.length()==0)
			{
				logg.info("6");
				query.setFilter("guid == '"+guid+"' && user == '"+user+"' ");
			}
			else if (sid.length()==0 && guid.length()==0 && srt.length()>0)
			{
				logg.info("7");
				query.setFilter("SRT == '"+srt+"' && user == '"+user+"' ");
			}else {
				logg.info("8");
				query.setFilter("user == '"+user+"'");
			}
		}
		else
		{

				if(sid.length()>0 && guid.length()>0 && srt.length()>0){
					logg.info("1");
					query.setFilter("guid == '"+guid+"' && SID == '"+sid+"' && SRT == '"+srt+"'");
				}
				else if (sid.length()>0 && guid.length()>0 && srt.length()==0)
				{
					logg.info("2");
					query.setFilter("guid == '"+guid+"' && SID == '"+sid+"'");	
				}
				else if (sid.length()>0 && guid.length()==0 && srt.length()>0)
				{
					logg.info("3");
					query.setFilter("SRT == '"+srt+"' && SID == '"+sid+"'");
				}
				else if (sid.length()==0 && guid.length()>0 && srt.length()>0)
				{
					logg.info("4");
					query.setFilter("guid == '"+guid+"' && SRT == '"+srt+"'");
				}
				else if (sid.length()>0 && guid.length()==0 && srt.length()==0)
				{
					logg.info("5");
					query.setFilter("SID == '"+sid+"'");
				}
				else if (sid.length()==0 && guid.length()>0 && srt.length()==0)
				{
					logg.info("6");
					query.setFilter("guid == '"+guid+"'");
				}
				else if (sid.length()==0 && guid.length()==0 && srt.length()>0)
				{
					logg.info("7");
					query.setFilter("SRT == '"+srt+"'");
				}	
		}

		
		query.setRange(0, 1000);
//		if(sid.length()>0 && srt.length()>0)
//			query.setFilter("SRT == '"+srt+"' && SID == '"+sid+"'");
//		else{
//			if(sid.length()>0)
//				query.setFilter("SID == '"+sid+"'");
//			else
//				if(srt.length()>0)
//					query.setFilter("SRT == '"+srt+"'");
//		}

	//	query.declareParameters("String id");
		try {
			List<SKOLogNew> logs = (List<SKOLogNew>)query.execute(guid);
			if (logs.size() > 0)
				return logs;
			else{
				//throw new NullPointerException();
				return null;
			}
		} finally {
			pm.close();
		}
	}
}
