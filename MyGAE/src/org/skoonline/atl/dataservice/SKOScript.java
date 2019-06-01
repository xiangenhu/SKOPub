package org.skoonline.atl.dataservice;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;

@PersistenceCapable
public class SKOScript {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	@Persistent
	private User createdBy;
	
	@Persistent
	private Date timestamp;
	
	@Persistent
	private String guid;
	
	@Persistent
	private String componentType;
	
	@Persistent
	private String scriptType;
	
	@Persistent
	private Text scriptContent;

	@Persistent
	private Blob scriptContentBlob;/// Changes

	

	@Persistent
	private String resourceType;
	
	@Persistent
	private String resourceLocation;
	
	@Persistent
	private String title;
	
	@Persistent
	private Boolean published;
	
	@Persistent
	private String notes;
	
	@Persistent
	private Boolean inTrash;
	
	



	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getComponentType() {
		return componentType;
	}

	public void setComponentType(String componentType) {
		this.componentType = componentType;
	}

	public String getScriptType() {
		return scriptType;
	}

	public void setScriptType(String scriptType) {
		this.scriptType = scriptType;
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
	public String getResourceType() {
		return resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public String getResourceLocation() {
		return resourceLocation;
	}

	public void setResourceLocation(String resourceLocation) {
		this.resourceLocation = resourceLocation;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Boolean getPublished() {
		return published;
	}

	public void setPublished(Boolean published) {
		this.published = published;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
	
	public Boolean getInTrash() {
		return inTrash;
	}

	public void setInTrash(Boolean inTrash) {
		this.inTrash = inTrash;
	}
/*
	public Boolean getIsCompressed() {
		return isCompressed;
	}

	public void setIsCompressed(Boolean isCompressed) {
		this.isCompressed = isCompressed;
	}*/
	public Key getKey() {
		return key;
	}
}
