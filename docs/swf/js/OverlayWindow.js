(function (namespace, undefined) {
	"use strict";
	var HAS_OVERLAY = false,
		DEFAULT_PAGE = "http://www.w3schools.com",
		OVERLAY_NAME = "overlay",
		OVERLAY_CONTENT_NAME = 'overlay_content_frame';

	function showOverlay(link) {
		// create overlay and append to page
		link = typeof link !== 'undefined' ? link : DEFAULT_PAGE;
		var overlay = document.createElement("div");
		overlay.setAttribute("id", OVERLAY_NAME);
		overlay.setAttribute("class", OVERLAY_NAME);
		document.body.appendChild(overlay);
		$('body').append('<iframe id="' + OVERLAY_CONTENT_NAME + '" src=' + link + '></iframe>');
		$("#" + OVERLAY_CONTENT_NAME).css({
			left: ($(window).width() - $("#" + OVERLAY_CONTENT_NAME).outerWidth()) * 0.4,
			top: ($(window).height() - $("#" + OVERLAY_CONTENT_NAME).outerHeight()) / 2
		});
		HAS_OVERLAY = true;
	}
	// restore page to normal

	function hideOverlay() {
		$("#" + OVERLAY_CONTENT_NAME).remove();
		$("#" + OVERLAY_NAME).remove();
		HAS_OVERLAY = false;
	}

	// Exposing Accessors
	namespace.showOverlay = showOverlay;
	namespace.hideOverlay = hideOverlay;
})(window.overlayWindow = window.overlayWindow || {});
