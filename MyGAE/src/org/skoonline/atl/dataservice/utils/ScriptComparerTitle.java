package org.skoonline.atl.dataservice.utils;

import java.util.Comparator;

import org.skoonline.atl.dataservice.SKOScript;

public class ScriptComparerTitle implements Comparator<SKOScript> {

	@Override
	public int compare(SKOScript o1, SKOScript o2) {
		int compareResult = o1.getTitle().compareTo(o2.getTitle());
		
		if (compareResult < 0)
			return -1;
		else if(compareResult > 0)
			return 1;
		else
			return 0;
	}
}
