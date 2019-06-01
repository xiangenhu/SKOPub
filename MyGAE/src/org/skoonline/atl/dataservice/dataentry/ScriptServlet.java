package org.skoonline.atl.dataservice.dataentry;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletException;


import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.util.Date;

@SuppressWarnings("serial")
public class ScriptServlet extends HttpServlet {
	public void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		User currentUser = UserServiceFactory.getUserService().getCurrentUser();
		Date timestamp = new Date();
		String guid = request.getParameter("guid");
		String componentType = request.getParameter("componentType");
		String scriptType = request.getParameter("scriptType");
		String scriptContent = request.getParameter("scriptContent");
		Blob scriptContentBlob = new Blob(request.getParameter("scriptContentBlob").getBytes());/// Changes
		String resourceType = request.getParameter("resourceType");
		String resourceLocation = request.getParameter("resourceLocation");
		String title = request.getParameter("title");
		String notes = request.getParameter("notes");
		String[] published = request.getParameterValues("published");
		boolean isPublished = false;
		
		if (published != null) {
			if (published[0].equals("is_published"))
				isPublished = true;
		}
		
		SKOScript skoScript = new SKOScript();
		skoScript.setCreatedBy(currentUser);
		skoScript.setTimestamp(timestamp);
		skoScript.setGuid(guid);
		skoScript.setComponentType(componentType);
		skoScript.setScriptType(scriptType);
		skoScript.setScriptContent(new Text(scriptContent));
		skoScript.setScriptContentBlob(scriptContentBlob);
		skoScript.setResourceType(resourceType);
		skoScript.setResourceLocation(resourceLocation);
		skoScript.setTitle(title);
		skoScript.setNotes(notes);
		skoScript.setPublished(isPublished);
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		try {
			pm.makePersistent(skoScript);
		} finally {
			pm.close();
		}
		
		response.sendRedirect("/index.html");
	}
}
