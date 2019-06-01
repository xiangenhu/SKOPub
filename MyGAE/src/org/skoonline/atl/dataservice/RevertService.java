package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.util.Date;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.skoonline.atl.dataservice.entities.SKOScriptHistory;
import org.skoonline.atl.dataservice.utils.PMF;

public class RevertService extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		long historyId = Long.parseLong(req.getParameter("historyId"));
		PersistenceManager pm = PMF.get().getPersistenceManager();
		SKOScriptHistory history = (SKOScriptHistory)pm.getObjectById(SKOScriptHistory.class, historyId);
		history.setTimestamp(new Date());
		
		try {
			pm.makePersistent(history);
		} finally {
			pm.close();
		}
	}

}
