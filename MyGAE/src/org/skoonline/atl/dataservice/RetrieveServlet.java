package org.skoonline.atl.dataservice;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.logging.Logger;
import java.util.zip.GZIPInputStream;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.JSONException;
import org.json.JSONObject;
import org.skoonline.atl.dataservice.dal.SKOScriptHistoryDAL;
import org.skoonline.atl.dataservice.entities.SKOScriptHistory;
import org.skoonline.atl.dataservice.security.PermissionConstants;
import org.skoonline.atl.dataservice.security.PermissionManager;
import org.skoonline.atl.dataservice.utils.Misc;
import org.skoonline.atl.dataservice.utils.PMF;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.UserServiceFactory;



@SuppressWarnings("serial")





public class RetrieveServlet extends HttpServlet {
	boolean wascompressed=false;
	
	private static final Logger log = Logger.getLogger(RetrieveServlet.class.getName());
	
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@SuppressWarnings("null")
	@Override
	
	
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//if (!loggedIn())
			//resp.sendRedirect(UserServiceFactory.getUserService().createLoginURL(req.getRequestURI()));
		resp.addHeader("Access-Control-Allow-Origin", "*");
		resp.addHeader("Content-Type", "text/csv");
	
		
		String json = req.getParameter("json");
		log.info("Retrieve:"+ json);
		try {
			JSONObject jsonObject = new JSONObject(json);
			String guid = URLDecoder.decode(Misc.sanitizeUnicode(jsonObject.getString("guid")), "utf-8");
			
			
			String source = URLDecoder.decode(Misc.sanitizeUnicode(jsonObject.getString("source")), "utf-8");
			
			
			if (source.equals("authoringtool")) {
				// this is an edit, check for permissions
				String currentNickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
				if (!PermissionManager.checkPermission(currentNickname, guid, PermissionConstants.COLLABORATOR)) {
					resp.getWriter().write("{\"error\":\"No edit permissions\"}");
					resp.flushBuffer();
				}
			}
			
			SKOScript scriptObject = getSKOScriptByGUID(guid);
			log.info("Script Object:\n"+"Script Title:"+ scriptObject.getTitle());
			
			//log.info("Script Object:\n"+"Script Title:"+ URLDecoder.decode(scriptObject.getTitle(), "UTF-8") );
			 
			SKOScriptHistory mostRecentHistory = SKOScriptHistoryDAL.getMostRecentHistory(guid);
			
			
			
			
			
		//	scriptObject.setScriptContent(mostRecentHistory.getScriptContent());// This would be replaced by unzip Text
			
			/////////////////////////////////////

			if(mostRecentHistory.getScriptContentBlob() == null){
				//log.info("Was Not Decompressed");
				wascompressed=false;
				scriptObject.setScriptContent(mostRecentHistory.getScriptContent());// This would be replaced by unzip Text
			}
			else
			{
				//log.info("Was Decompressed");
				wascompressed=true;
				
				ByteArrayInputStream byteStream = new ByteArrayInputStream(mostRecentHistory.getScriptContentBlob().getBytes());
				GZIPInputStream gZipInStream = new GZIPInputStream(byteStream);
				InputStreamReader inReader = new InputStreamReader(gZipInStream);
				BufferedReader bufReader = new BufferedReader(inReader);
				
				String line;
				String content="";
				while ((line = bufReader.readLine()) != null)
				{
					content = content+line;
				}
					scriptObject.setScriptContent(new Text(content));
			}
			/////////////////////////////////////
	
		
			
			
			
			//resp.getOutputStream().print(jsonObject.toString());

			if (source.equals("ScriptOnly")) {
				
				String TagName = URLDecoder.decode(Misc.sanitizeUnicode(jsonObject.getString("TagName")), "utf-8");
				jsonObject = skoScriptToJSONObject0(scriptObject);
				
				String XMLString=jsonObject.getString("scriptContent");
				
				if (TagName.equals(""))
				{
					TagName="SKOConfig";
				}
			
				try {
					    DocumentBuilder db = DocumentBuilderFactory.newInstance().newDocumentBuilder();
					    InputSource is = new InputSource();
					    is.setCharacterStream(new StringReader(XMLString.toString()));
					    Document doc = db.parse(is);
					    
					    
					    

					    Transformer transformer=TransformerFactory.newInstance().newTransformer();
					    transformer.setOutputProperty(OutputKeys.INDENT,"yes");
					    transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,"yes");
					    transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount","2");
					    StreamResult result=new StreamResult(new StringWriter());
					    
					    DOMSource xmlfile;
					    
					    if (TagName.equals("Entire Scripts"))
					    {
					    	 xmlfile=new DOMSource(doc);
					    }else
					    {
						    NodeList nodes = doc.getElementsByTagName(TagName);
						    xmlfile=new DOMSource(nodes.item(0));
					    }
					    
					    transformer.transform(xmlfile,result);
					    String xmlString=result.getWriter().toString();
					    
					    
					    log.info("ScriptsLOM:"+xmlString);
					    
					    resp.getOutputStream().write(xmlString.getBytes("UTF-16"));
				}
				catch (Exception e) {
				       e.printStackTrace();
				}
				
			}else
			{

				jsonObject = skoScriptToJSONObject(scriptObject);
				resp.getOutputStream().write((jsonObject.toString()).getBytes("UTF-16"));
			}

		} catch (JSONException e) {
			resp.getOutputStream().print("{\"error\":\"JSON Exception\"}");
		} catch (NullPointerException npe) {
			resp.getOutputStream().print("{\"error\":\"GUID not found\"}");
		} catch (IllegalArgumentException iae) {
			log.warning(iae.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	private SKOScript getSKOScriptByGUID(String id) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(SKOScript.class);
		query.setFilter("guid == id");
		query.declareParameters("String id");
		try {
			List<SKOScript> scripts = (List<SKOScript>)query.execute(id);
			if (scripts.size() > 0)
				return scripts.get(0);
			else
				throw new NullPointerException();
		} finally {
			pm.close();
		}
	}
	
	private JSONObject skoScriptToJSONObject(SKOScript scriptObject) {
		JSONObject jsonObject = new JSONObject();
		try 
			{
				jsonObject.put("scriptContent", (Misc.unescape(scriptObject.getScriptContent().getValue())));
				jsonObject.put("componentType", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getComponentType()), "utf-8"));
			
				jsonObject.put("scriptType", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getScriptType()), "utf-8"));
				jsonObject.put("resourceType", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getResourceType()), "utf-8"));
				jsonObject.put("resourceLocation", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getResourceLocation()), "utf-8"));
				
				jsonObject.put("title", Misc.unescape(scriptObject.getTitle()));
				
				
				
				jsonObject.put("notes", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getNotes()), "utf-8"));
				jsonObject.put("guid", URLDecoder.decode(Misc.sanitizeUnicode(scriptObject.getGuid()), "utf-8"));
				jsonObject.put("timestamp", scriptObject.getTimestamp().toString());
				jsonObject.put("published", scriptObject.getPublished());
			
			if (scriptObject.getCreatedBy() == null)
				jsonObject.put("createdBy", "Anonymous - this should not happen");
			else
				jsonObject.put("createdBy", scriptObject.getCreatedBy().getNickname());
		} catch (JSONException e) {
			log.warning(e.getMessage());
		} catch (UnsupportedEncodingException e) {
			log.warning(e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warning(e.getMessage());
		}
		
		
		return jsonObject;
	}
	
	private JSONObject skoScriptToJSONObject0(SKOScript scriptObject) {
		JSONObject jsonObject = new JSONObject();
		try 
			{
				jsonObject.put("scriptContent", (Misc.unescape(scriptObject.getScriptContent().getValue())));
			
			if (scriptObject.getCreatedBy() == null)
				jsonObject.put("createdBy", "Anonymous - this should not happen");
			else
				jsonObject.put("createdBy", scriptObject.getCreatedBy().getNickname());
		} catch (JSONException e) {
			log.warning(e.getMessage());
		} catch (UnsupportedEncodingException e) {
			log.warning(e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warning(e.getMessage());
		}
		
		
		return jsonObject;
	}

}
