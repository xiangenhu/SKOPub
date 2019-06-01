package org.skoonline.atl.dataservice.entities;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.listener.StoreCallback;

import com.google.appengine.api.datastore.Key;

import org.json.*;

@PersistenceCapable
public class Permission {
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey
	private Key key;
	
	@Persistent
	private String guid;
	
	@Persistent
	private String user;
	
	@Persistent
	private int permission;
	
	@Persistent
	private boolean inTrash;

	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public int getPermission() {
		return permission;
	}

	public void setPermission(int permission) {
		this.permission = permission;
	}
	
	public boolean getInTrash() {
		return inTrash;
	}
	
	public void setInTrash(boolean inTrash) {
		this.inTrash = inTrash;
	}

	public Key getKey() {
		return key;
	}
	
	public String toJson() {
		try {
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("guid", this.guid);
			jsonObject.put("user", this.user);
			jsonObject.put("permission", this.permission);
			return jsonObject.toString();
		} catch (JSONException e) {
			return "{\"error\":\"" + e.getMessage() + "\"}";
		}
	}
}
