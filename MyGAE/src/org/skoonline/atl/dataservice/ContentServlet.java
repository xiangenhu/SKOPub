package org.skoonline.atl.dataservice;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.skoonline.atl.dataservice.dal.SKOScriptHistoryDAL;
import org.skoonline.atl.dataservice.entities.SKOScriptHistory;
import org.skoonline.atl.dataservice.utils.Misc;

public class ContentServlet extends HttpServlet {
	private String hexChars = "0123456789abcdef";
	
	private String reverse(String s) {
		String s2 = "";
		for (char c : s.toCharArray())
			s2 = c + s2;
		return s2;
	}
	
	private int hexStringToInt(String h) {
		h = reverse(h.toLowerCase());
		int v = 0;
		for (int i = 0; i < h.length(); i++) {
			// the index of the character in the string will be the same as its decimal value
			v += hexChars.indexOf(h.charAt(i)) << (i * 4);
		}
		return v;
	}
	
	private String getUnicode(String s) {
		HashMap<String, String> matches = new HashMap<String, String>();
		String q = null;
		try {
			q = s;
			Pattern p = Pattern.compile("%u[0-9A-Fa-f]{4}");
			Matcher m = p.matcher(q);
			while (m.find()) {
				String hexString = m.group().substring(2);
				int decVal = hexStringToInt(hexString);
				char c = (char)decVal;
				if (!matches.containsKey(hexString))
					matches.put(m.group(), c + "");
			}
			for (String k : matches.keySet()) {
				q = q.replaceAll(k, matches.get(k));
			}
			p = Pattern.compile("%[0-9A-Fa-f]{2}");
			m = p.matcher(q);
			while (m.find()) {
				String hexString = m.group().substring(1);
				int decVal = hexStringToInt(hexString);
				char c = (char)decVal;
				if (!matches.containsKey(hexString))
					matches.put(m.group(), c + "");
			}
			for (String k : matches.keySet()) {
				q = q.replaceAll(k, matches.get(k));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return q;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			String guid = req.getParameter("guid");
			int decode = Integer.parseInt(req.getParameter("decode"), 10);
			int show_unicode = Integer.parseInt(req.getParameter("show_unicode"), 10);
			
			SKOScriptHistory recentHistory = SKOScriptHistoryDAL.getMostRecentHistory(guid);
			String content = recentHistory.getScriptContent().getValue();
			
			
			if (decode == 1) {
				if (show_unicode == 1)
					content = getUnicode(content);
				else
					content = URLDecoder.decode(Misc.sanitizeUnicode(content), "utf-8");
			}
			resp.setContentType("text/plain");
			resp.getWriter().write(content);
		} catch (Exception e) {
			resp.getWriter().write(e.getMessage());
		}
	}
}
