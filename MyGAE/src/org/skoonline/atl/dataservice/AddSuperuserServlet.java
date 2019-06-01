package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.skoonline.atl.dataservice.utils.PMF;

@SuppressWarnings("serial")
public class AddSuperuserServlet extends HttpServlet {
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws IOException {
		String username = request.getParameter("username");
		String[] deletedUsers = request.getParameterValues("deletedUsernames");
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		try {
			if (username != "") {
				Superuser su = new Superuser();
				su.setUser(username);
				pm.makePersistent(su);
			}
			if (deletedUsers != null) {
				for (String user : deletedUsers)
					deleteUser(user);
			}
		} finally {
			pm.close();
		}
		response.sendRedirect("/manageSuperuser.jsp");
	}
	
	private void deleteUser(String user) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(Superuser.class);
		query.setFilter("user == needle");
		query.declareParameters("String needle");
		List<Superuser> superusers = (List<Superuser>)query.execute(user);
		try {
			pm.deletePersistent(superusers.get(0));
		} finally {
			pm.close();
		}
	}
}
