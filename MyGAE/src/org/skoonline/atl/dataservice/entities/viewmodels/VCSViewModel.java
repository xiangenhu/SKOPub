package org.skoonline.atl.dataservice.entities.viewmodels;

import org.skoonline.atl.dataservice.SKOScript;
import org.skoonline.atl.dataservice.entities.SKOScriptHistory;

public class VCSViewModel {
	private SKOScript script;
	private SKOScriptHistory mostRecentHistory;
	
	public SKOScript getScript() {
		return script;
	}
	public void setScript(SKOScript script) {
		this.script = script;
	}
	public SKOScriptHistory getMostRecentHistory() {
		return mostRecentHistory;
	}
	public void setMostRecentHistory(SKOScriptHistory mostRecentHistory) {
		this.mostRecentHistory = mostRecentHistory;
	}
}
