package org.skoonline.atl.dataservice.dataentry;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletException;

import org.skoonline.atl.dataservice.entities.Permission;
import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.util.Date;

@SuppressWarnings("serial")
public class PermissionServlet extends HttpServlet {
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		String guid = request.getParameter("guid");
		String user = request.getParameter("user");
		String[] perms = request.getParameterValues("permission");
		int permission = 0;
		
		if (perms != null) {
			for (String p : perms) {
				if (p.equals("owner"))
					permission += 4;
				else if (p.equals("collaborator"))
					permission += 2;
				else if (p.equals("viewer"))
					permission += 1;
			}
		}
		
		Permission p = new Permission();
		p.setGuid(guid);
		p.setUser(user);
		p.setPermission(permission);
		p.setInTrash(false);
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		try {
			pm.makePersistent(p);
		} finally {
			pm.close();
		}
		
		response.sendRedirect("/index.html");
 	}
}
