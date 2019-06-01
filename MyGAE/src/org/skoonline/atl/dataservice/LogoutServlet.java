package org.skoonline.atl.dataservice;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class LogoutServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		String json = request.getParameter("json");
		JSONObject jsonObjectBody = new JSONObject();
		try {
			jsonObjectBody = new JSONObject(json);
		} catch (JSONException e) {
			
		}
		
		
		try {
			String logoutUrl = UserServiceFactory.getUserService().createLogoutURL(jsonObjectBody.getString("returnUrl"));
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("logoutUrl", logoutUrl);
			response.getOutputStream().print(jsonObject.toString());
		} catch (JSONException e) {
			
		}
		
	}
}
