package org.skoonline.atl.dataservice.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Comparator;
import java.util.List;
import java.util.Vector;
import java.util.logging.Logger;

import org.mortbay.log.Log;
import org.skoonline.atl.dataservice.RetrieveServlet;
import org.skoonline.atl.dataservice.SKOScript;

//import sun.misc.Compare;

public class Misc {
	private static final Logger log = Logger.getLogger(Misc.class.getName());
	public static String checkEmail(String nickname) {
		if (nickname.indexOf("@") > -1)
			return nickname;
		return nickname + "@gmail.com";
	}
	
	public static String decodeString(String s) {
		try {
			return URLDecoder.decode(s, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return s;
		} catch (Exception e){
			return s;
		}
	}
	
	public static String sanitizeUnicode(String s) {
		String content = s;
		content = content.replace("%u201C", "%22");
		content = content.replace("%u201D", "%22");
		content = content.replace("%u2019", "%27");
		content = content.replaceAll("%u.{4}", "");
		return content;
	}
	
	static public String unescape(String escaped) throws UnsupportedEncodingException
	{
		//return sanitizeUnicode(escaped);
	
//		log.info(escaped);
		
		String str = escaped.replaceAll("%0", "%u000");
		str = str.replaceAll("%1", "%u001");
		str = str.replaceAll("%2", "%u002");
		str = str.replaceAll("%3", "%u003");
		str = str.replaceAll("%4", "%u004");
		str = str.replaceAll("%5", "%u005");
		str = str.replaceAll("%6", "%u006");
		str = str.replaceAll("%7", "%u007");
		str = str.replaceAll("%8", "%u008");
		str = str.replaceAll("%9", "%u009");
		str = str.replaceAll("%A", "%u00A");
		str = str.replaceAll("%B", "%u00B");
		str = str.replaceAll("%C", "%u00C");
		str = str.replaceAll("%D", "%u00D");
		str = str.replaceAll("%E", "%u00E");
		str = str.replaceAll("%F", "%u00F");

		str = str.replaceAll("%u(.{2})(.{2})","%$1%$2");

		log.info(URLDecoder.decode(str,"UTF-16"));
			
	
	        // Here we return the decoded string
		return URLDecoder.decode(str,"UTF-16");
		
	}

}
