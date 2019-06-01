package org.skoonline.atl.dataservice.utils;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import java.util.logging.Logger;

public class Emailer {
	public static final Logger log = Logger.getLogger(Emailer.class.getName());
	
	public static boolean sendMessage(String to, String from, String message, String subject) {
		log.warning(String.format("Trying to send message from %1$s to %2$s", from , to));
		Properties properties = new Properties();
		Session session = Session.getDefaultInstance(properties, null);
		
		try {
			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress("xiangenhu@gmail.com", "Xiangen Hu"));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to, "You"));
			msg.setSubject(subject);
			msg.setText(message);
			Transport.send(msg);
			return true;
		} catch (AddressException e) {
			log.severe(Emailer.class.getName() + " - " + e.getClass().getName() + " - " + e.getMessage());
			return false;
		} catch (MessagingException e) {
			log.severe(Emailer.class.getName() + " - " + e.getClass().getName() + " - " + e.getMessage());
			return false;
		} catch (UnsupportedEncodingException e) {
			log.severe(Emailer.class.getName() + " - " + e.getClass().getName() + " - " + e.getMessage());
			return false;
		}
	}
}
