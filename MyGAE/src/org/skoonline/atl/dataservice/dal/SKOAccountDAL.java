package org.skoonline.atl.dataservice.dal;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import java.util.List;

import org.skoonline.atl.dataservice.entities.SKOAccount;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.search.SortExpression.SortDirection;

public class SKOAccountDAL {
	@SuppressWarnings("unchecked")
	public static List<SKOAccount> getSKOAccountByName(String name) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOAccount.class);
		query.setFilter("name == '"+name+"'");
		query.setOrdering("timestamp desc");
		query.setRange(0, 1);
		try {
			List<SKOAccount> account = (List<SKOAccount>)query.execute();
			if (account.size() > 0)
				return account;
			else
				return null;
				//throw new NullPointerException();
		} finally {
			pm.close();
		}
	}
}
