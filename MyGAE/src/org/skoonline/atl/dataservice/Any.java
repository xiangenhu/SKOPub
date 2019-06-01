package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.utils.PMF;

@SuppressWarnings("serial")
public class Any extends HttpServlet {
	private static final Logger log = Logger.getLogger(MyScriptsServlet.class.getName());
	private int pageSize = 10;
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		//int offset = Integer.parseInt(request.getParameter("offset"));
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Permission.class);
		List<Permission> permissions = (List<Permission>)query.execute();
		
		try {
			for (Permission p : permissions) {
				log.info(p.getGuid());
				p.setInTrash(false);
				pm.makePersistent(p);
			}
		} finally {
			pm.close();
		}
	}
	
	
	
	
}
