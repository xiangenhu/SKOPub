package org.skoonline.atl.dataservice.entities;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.jdo.annotations.IdGeneratorStrategy;

import com.google.appengine.api.users.User;
import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;


import java.util.Date;

@PersistenceCapable
public class SKOScriptHistory {
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey
	private Key key;
	
	@Persistent
	private String guid;
	
	@Persistent
	private Date timestamp;
	
	@Persistent
	private User lastUpdatedBy;
	
	@Persistent
	private Text scriptContent;

	@Persistent
	private Blob scriptContentBlob;



	@Persistent
	private String title;
	
	@Persistent
	private String notes;

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public User getLastUpdatedBy() {
		return lastUpdatedBy;
	}

	public void setLastUpdatedBy(User lastUpdatedBy) {
		this.lastUpdatedBy = lastUpdatedBy;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public Text getScriptContent() {
		return scriptContent;
	}

	public void setScriptContent(Text scriptContent) {
		this.scriptContent = scriptContent;
	}
	
	public Blob getScriptContentBlob() {/// Changes
		return scriptContentBlob;
	}

	public void setScriptContentBlob(Blob scriptContentBlob) {/// Changes
		this.scriptContentBlob = scriptContentBlob;
	}
	
	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Key getKey() {
		return key;
	}
}
