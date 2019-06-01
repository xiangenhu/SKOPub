package org.skoonline.atl.dataservice;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.InvalidParameterException;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.zip.Deflater;
import java.util.zip.GZIPOutputStream;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOScriptHistoryDAL;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.PMF;

import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;


@SuppressWarnings("serial")
public class ATLDataSvcServlet extends HttpServlet {
	private static final Logger log = Logger.getLogger(ATLDataSvcServlet.class.getName());
	private String mostRecentGuid = "";

	/*@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//if (!loggedIn())
			//resp.sendRedirect(UserServiceFactory.getUserService().createLoginURL(req.getRequestURI()));

		String json = req.getParameter("json");
		try {
			JSONObject jsonObject = new JSONObject(json);
			String guid = URLDecoder.decode(jsonObject.getString("guid"), "utf-8");
			SKOScript scriptObject = getSKOScriptByGUID(guid);
			jsonObject = skoScriptToJSONObject(scriptObject);
			resp.getOutputStream().print(jsonObject.toString());
		} catch (JSONException e) {
			resp.getOutputStream().print("{\"error\":\"JSON Exception\"}");
		} catch (NullPointerException npe) {
			resp.getOutputStream().print("{\"error\":\"Invalid GUID\"}");
		}
	}*/

	@SuppressWarnings("unchecked")
	private SKOScript getSKOScriptByGUID(String id) {
		log.info("get Sko Script Object");
		PersistenceManager pm = PMF.get().getPersistenceManager(); //??????
		Query query = pm.newQuery(SKOScript.class); // ?????
		log.info("get Sko Script Object");
		query.setFilter("guid == id");
		query.declareParameters("String id");
		try {
			List<SKOScript> scripts = (List<SKOScript>)query.execute(id);
			if (scripts.size() > 0)
				return scripts.get(0);
			else
			{
				log.info("Script Size"+scripts.size());
				throw new NullPointerException();
			}
		} finally {
			log.info("get Sko Script Object");
			pm.close();
		}
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws IOException, ServletException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String json = req.getParameter("json");
		
		try {
			JSONObject jsonObject = new JSONObject(json);
			if (!loggedIn()) {
				
				String backupreq = jsonObject.getString("backupreq");
				//check if the request is from ccnu.x-in-y.com server to backup the SKO
				if(backupreq.equals("1")){
					log.info("This is a backup request.");
					String guid = jsonObject.getString("guid");
				
					String update = jsonObject.getString("update");
					if (update.equals("1"))
						updateScript(jsonObject);
					else
						createScript(jsonObject,guid);
				} else {
					log.info("This is internal CREATE request." + json);
					//this request is not to backup, do the authentication
					UserService userService = UserServiceFactory.getUserService();
					resp.getOutputStream().print("{\"loginUrl\":\"" + userService.createLoginURL(jsonObject.getString("returnUrl")) + "\"}");
				}
				
			} else {
				if (jsonObject.has("guid")) {
					String guid = jsonObject.getString("guid");
					log.info(guid);
					if (!guid.equals("")) {
						try {
							updateScript(jsonObject);
						} catch (InvalidParameterException ipe) {
							resp.getWriter().write("{\"error\":\"Must be collaborator to edit script\"}");
							resp.flushBuffer();
						}
					} else {
						createScript(jsonObject,guid);
					}
				} else {
					log.info("Does not have tag guid");
					createScript(jsonObject,"");
				}
				resp.getOutputStream().print("{\"guid\":\"" + mostRecentGuid + "\"}");
			}
		} catch (JSONException e) {
			@SuppressWarnings("unused")
			int a = 1;
		}
	}

	private void updateScript(JSONObject jsonObject) throws IOException {
		SKOScript scriptObject = null;
		
		log.info("Updating Script");
		try {
			User user = UserServiceFactory.getUserService().getCurrentUser();

			if (user == null)
			{
			//there is no browser session, request came from ccnu.x-in-y.com to do backup
			//now create the user
			user = new User(jsonObject.getString("createdBy"),"gmail.com");
			}
			
			String guid = jsonObject.getString("guid");
			try {
				scriptObject = getSKOScriptByGUID(guid);
			} catch (NullPointerException e) {
				log.info("Couldn't find script with guid; Creating New Scripts Here");
				createScript(jsonObject,guid);
				scriptObject = getSKOScriptByGUID(guid);
			}
			
			log.info("Get Script Object End"+ jsonObject.getString("title"));
			if (!PermissionManager.checkPermission(user.getNickname(), guid, PermissionConstants.COLLABORATOR)) {
				throw new InvalidParameterException();
			}
			log.info("Get Script Object End");
			scriptObject.setComponentType(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("componentType")));
			scriptObject.setNotes(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("notes")));
			scriptObject.setPublished(jsonObject.getBoolean("published"));
			scriptObject.setResourceLocation(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("resourceLocation")));
			scriptObject.setResourceType(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("resourceType")));

			//////////////////////////////////////////////////////////////////////////////

			//scriptObject.setScriptContent(new Text(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptContent")))); /// This line would be replaced by following block


			if(jsonObject.isNull("scriptContentBlob")){
				log.info("was not compressed");
			}
			else{
				log.info("Was Compressed");
			}


			String content = jsonObject.getString("scriptContent");
			//log.info(content);
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		    GZIPOutputStream gZipOutStream = new GZIPOutputStream(outStream);
		    gZipOutStream.write(content.getBytes());
		    gZipOutStream.close();
		    scriptObject.setScriptContentBlob(new Blob(outStream.toByteArray()));
		    //scriptObject.setScriptContent(new Text(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptContent"))));////////////

		    log.info("Compressed End"+ ((new Blob(outStream.toByteArray())).toString()).length() );


			scriptObject.setScriptType(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptType")));
			scriptObject.setTimestamp(new Date());
			scriptObject.setTitle(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("title")));



			SKOScriptHistoryDAL.addScriptHistory(scriptObject);

			// WARNING!  THE NEXT LINE IS A MESSY HACK!
			scriptObject.setScriptContent(null);
			scriptObject.setScriptContentBlob(null);

			mostRecentGuid = guid;
			PersistenceManager pm = PMF.get().getPersistenceManager();
			try {
				pm.makePersistent(scriptObject);
			} finally {
				pm.close();
			}

		} catch (JSONException e) {

		}
	}

	private String createScript(JSONObject jsonObject, String GUID) throws IOException {
		log.info("Creating New Script");
		
		SKOScript scriptObject = jsonObjectToSKOScript(jsonObject,GUID);
			
		log.info("ScriptObject "+scriptObject.toString());
		scriptObject.setInTrash(false);
		SKOScriptHistoryDAL.addScriptHistory(scriptObject);/////////////////////////
		log.info("History added");
		// EWWWWWWWWW!  MESSY HACK!
		scriptObject.setScriptContent(null);
		scriptObject.setScriptContentBlob(null);
		log.info("messy hack done");
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			if (jsonObject.getString("source").toLowerCase().equals("authoringtool"))
				{
		
				PermissionManager.grantPermission(scriptObject.getCreatedBy().getNickname(), 
						scriptObject.getGuid(),"baseURL", PermissionConstants.OWNER, true, false);
				log.info("PermissionManager executed property");
				}
			pm.makePersistent(scriptObject);
			log.info("MakePersistent done.......");
		} catch(JSONException e) {
			log.info("There is an exception at line 229: pm.makePersistent()");
		} finally {
			pm.close();
			return scriptObject.getGuid();
		}
	}

	/*
	private String getScriptContentFromJSON(JSONObject jsonObject) {
		try {
			return jsonObject.getString("scriptContent");
		} catch (JSONException e) {
			return "";
		}
	}
	*/

	private SKOScript jsonObjectToSKOScript(JSONObject jsonObject, String GUID) throws IOException {
		SKOScript scriptObject = new SKOScript();
		String uuid;
		
		try {
			scriptObject.setComponentType(jsonObject.getString("componentType"));
			User usr = getUser();
			if (usr == null)
				{
				//there is no browser session, request came from ccnu.x-in-y.com to do backup
				//now create the user
				usr = new User(jsonObject.getString("createdBy"),"gmail.com");
				}
			
			scriptObject.setCreatedBy(usr);
			
			if (GUID.equals(""))
			{
				uuid = UUID.randomUUID().toString();
			}else{
				uuid=GUID;
			}
			
			mostRecentGuid = uuid;
			scriptObject.setGuid(uuid);
			
			scriptObject.setNotes(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("notes")));
			scriptObject.setPublished(jsonObject.getBoolean("published"));
			scriptObject.setResourceLocation(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("resourceLocation")));
			scriptObject.setResourceType(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("resourceType")));
			//scriptObject.setScriptContent(new Text(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptContent"))));
			//scriptObject.setScriptContentBlob(new Blob((ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptContentBlob")).getBytes())));
			///
			String content = jsonObject.getString("scriptContent");
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		    GZIPOutputStream gZipOutStream = new GZIPOutputStream(outStream);
		    gZipOutStream.write(content.getBytes());
		    gZipOutStream.close();
		    scriptObject.setScriptContentBlob(new Blob(outStream.toByteArray()));
			////
			scriptObject.setScriptType(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("scriptType")));
			scriptObject.setTimestamp(new Date());
			scriptObject.setTitle(ATLGAEUtils.fixMSWordQuotes(jsonObject.getString("title")));
		} catch (InvalidParameterException ipe) {
			throw new InvalidParameterException(ipe.getMessage());
		} catch (NullPointerException npe) {
			throw new InvalidParameterException(npe.getMessage());
		} catch (JSONException e) {
			@SuppressWarnings("unused")
			int a = 1;
		}
		return scriptObject;
	}

	private String getJSONString(JSONObject o, String property) {
		if (o.has(property)) {
			try {
				return o.getString(property);
			} catch (JSONException e) {
				throw new InvalidParameterException(e.getMessage());
			}
		} else {
			throw new NullPointerException("Property " + property + " not found");
		}
	}

	private boolean getJSONBoolean(JSONObject o, String property) {
		if (o.has(property)) {
			try {
				return o.getBoolean(property);
			} catch (JSONException e) {
				throw new InvalidParameterException(e.getMessage());
			}
		} else {
			throw new NullPointerException("Property " + property + " not found");
		}
	}

	private User getUser() {
		UserService userService = UserServiceFactory.getUserService();
		return userService.getCurrentUser();
	}

	private Boolean loggedIn() {
		return !(getUser() == null);
	}

	private JSONObject skoScriptToJSONObject(SKOScript scriptObject) {
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("componentType", URLDecoder.decode(scriptObject.getComponentType(), "utf-8"));
			jsonObject.put("scriptType", URLDecoder.decode(scriptObject.getScriptType(), "utf-8"));
			jsonObject.put("resourceType", URLDecoder.decode(scriptObject.getResourceType(), "utf-8"));
			jsonObject.put("resourceLocation", URLDecoder.decode(scriptObject.getResourceLocation(), "utf-8"));
			jsonObject.put("title", URLDecoder.decode(scriptObject.getTitle(), "utf-8"));
			//jsonObject.put("scriptContent", URLDecoder.decode(scriptObject.getScriptContent().getValue(), "utf-8"));
			jsonObject.put("scriptContentBlob", URLDecoder.decode(new String(scriptObject.getScriptContentBlob().getBytes()), "utf-8"));
			jsonObject.put("notes", URLDecoder.decode(scriptObject.getNotes(), "utf-8"));
			jsonObject.put("guid", URLDecoder.decode(scriptObject.getGuid(), "utf-8"));
			jsonObject.put("timestamp", scriptObject.getTimestamp().toString());
			jsonObject.put("published", scriptObject.getPublished());
			if (scriptObject.getCreatedBy() == null)
				jsonObject.put("createdBy", "Anonymous - this should not happen");
			else
				jsonObject.put("createdBy", scriptObject.getCreatedBy().getNickname());
		} catch (JSONException e) {

		} catch (UnsupportedEncodingException e) {

		}
		return jsonObject;
	}

    public byte[] compressByteArray(byte[] bytes){

        ByteArrayOutputStream baos = null;
        Deflater dfl = new Deflater();
        dfl.setLevel(Deflater.BEST_COMPRESSION);
        dfl.setInput(bytes);
        dfl.finish();
        baos = new ByteArrayOutputStream();
        byte[] tmp = new byte[4*1024];
        try{
            while(!dfl.finished()){
                int size = dfl.deflate(tmp);
                baos.write(tmp, 0, size);
            }
        } catch (Exception ex){

        } finally {
            try{
                if(baos != null) baos.close();
            } catch(Exception ex){}
        }

        return baos.toByteArray();
    }
}
