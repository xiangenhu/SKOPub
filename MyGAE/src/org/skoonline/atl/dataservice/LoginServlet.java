package org.skoonline.atl.dataservice;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		String json = request.getParameter("json");
		JSONObject jsonObjectBody = new JSONObject();
		try {
			jsonObjectBody = new JSONObject(json);
		} catch (JSONException e) {
			
		}
		
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		if (user == null) {
			try {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("error", "No user logged in");
				jsonObject.put("loginUrl", userService.createLoginURL(jsonObjectBody.getString("returnUrl")));
				response.getOutputStream().print(jsonObject.toString());
			} catch (JSONException e) {
				
			}
		} else {
			try {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("nickname", user.getNickname());
				response.getOutputStream().print(jsonObject.toString());
			} catch (JSONException e) {
				
			}
		}
	}
}
