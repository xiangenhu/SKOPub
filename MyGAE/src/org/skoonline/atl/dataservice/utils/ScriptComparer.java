package org.skoonline.atl.dataservice.utils;

import java.util.Comparator;

import org.skoonline.atl.dataservice.SKOScript;

public class ScriptComparer implements Comparator<SKOScript> {

	@Override
	public int compare(SKOScript o1, SKOScript o2) {
		if (o1.getTimestamp().before(o2.getTimestamp()))
			return -1;
		else if(o1.getTimestamp().after(o2.getTimestamp()))
			return 1;
		else
			return 0;
	}
}
