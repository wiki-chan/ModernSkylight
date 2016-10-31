/*!
 * Wikichan: JavaScript
 * Used globally on http://wiki-chan.net
 * Refer to each section for license and author
 */

// On Document Ready ------------------------------

$(function() {

	// Activate main functions
	smoothScroll();
	scrollToTop();
	resizeToc();
	wikiTip();

	// Make all <pre> having "selectble" class easily selectable
	var selectable = document.getElementsByTagName("selectable");

	for ( var i = 0, j = selectable.length; i < j; i++ ) {
		var input = document.createElement("input");

		input.type = "button";
		input.value = "선택";
		input.addEventListener("click", function() {
			selectCode(input);
			return false;
		});

		selectable[i].insertBefore( input, selectable.firstChild );
	}

});

// MAIN FUNCTIONS ------------------------------

/**
 * Smooth Scroll
 * Author: 카페인러브
 * License: MIT and GPL licenses
 */
function smoothScroll() {
	// store related DOM elements into variable
	var $root = $("html, body");
	var $anchors = $("a[href^='#']");

	// add scroll event to all anchors
	$anchors.on("click", function(e) {

		e.preventDefault();

		var href = $(this).hash;

		// Change URL hash without page jump
		// Author: Lea Verou, 2011
		// http://lea.verou.me/2011/05/change-url-hash-without-page-jump/
		if (history.pushState) {
			history.pushState(null, null, href);
		} else {
			location.hash = href;
		}
		// end

		// insert escape(\\) before all dots
		// only required for non-alphabetic sites
		href = href.replace(/\./g, "\\.");

		$root.animate({
			scrollTop: $(href).offset().top
		}, 300);

	});
}

/**
 * Scroll To Top
 * Author: 카페인러브
 * License: MIT and GPL licenses
 */
function scrollToTop() {
	// if ( mw.config.get("wgNamespaceNumber") === 2 ) return;

	// Create ↑ button and append it to body
	var toTop = document.createElement("a");

	toTop.id = "toTop";
	toTop.appendChild( document.createTextNode("↑") );

	document.body.appendChild(toTop);

	// Toggle ↑ button on page scroll
	$(window).on("scroll", function() {
		if($(this).scrollTop() > 400) {
			$('#toTop').fadeIn();
		} else {
			$('#toTop').fadeOut();
		}
	});

	// Scroll to topmost position when user clicks on ↑ button
	var $root = $("body, html");

	$('#toTop').on("click", function() {
		$root.animate({ scrollTop: 0 }, 100);
	});
}

/**
 * Resize Table of Contents
 * Author: 카페인러브
 * License: MIT and GPL licenses
 */
function resizeToc(){
	if ( !$("#toc") ) return;

	var $toc = $("#toc");
	var windowHeight = window.innerHeight;
	
	if ( $toc.outerHeight() + 67 > windowHeight ) {
		$toc.children('ul').height( windowHeight - 105 );
	}
}

/**
 * Tooltip
 * Author: vertigo-project (vtip)
 * Arranged by: 카페인러브
 * License: MIT and GPL licenses
 */
function wikiTip() {
	var $targets = $(".tooltip");

	$targets.on("mouseenter", function() {
		$targets.find("a").removeAttr("title");

		this.t = this.title;
		this.title = "";

		var $offsets = $(this).offset();
		var $containerWidth = $(this).width();

		if ( $(this).is("[title]") ) {
 			$("body").append(
 				"<div id='tooltip'><div class='tooltip-arrow'></div><div class='tooltip-inner'>" + this.t + "</div></div>"
 			);
		}

		var $tipWidth = $("#tooltip").width();
		var $tipHeight = $("#tooltip").height();

		$("#tooltip")
			.css({
				"top": $offsets.top - ( $tipHeight + 6 ),
				"left": $offsets.left - ( $tipWidth - $containerWidth ) /2,
			})
			.fadeIn("fast");
	};

	$targets.on("mouseleave", function() {
		this.title = this.t;
		$("#tooltip").remove();
	});
}

/******************************
*	Select text in pre
*	Author: unknown
******************************/
function selectCode(trigger) {
	var e = trigger.parentNode.getElementsByTagName("pre")[0];

	if (window.getSelection) {
		var s = window.getSelection();
		if (s.setBaseAndExtent) {
			s.setBaseAndExtent(e, 0, e, e.innerText.length - 1);
		} else {
			var r = document.createRange();
			r.selectNodeContents(e);
			s.removeAllRanges();
			s.addRange(r);
		}
	} else if (document.getSelection) {
		var s = document.getSelection();
		var r = document.createRange();
		r.selectNodeContents(e);
		s.removeAllRanges();
		s.addRange(r);
	} else if (document.selection) {
		var r = document.body.createTextRange();
		r.moveToElementText(e);
		r.select();
	}
}


// HELPER FUNCTIONS ------------------------------

/**
 * Get element index as child
 * Author: mikemaccana, 2016
 * Reference: http://stackoverflow.com/questions/5913927/get-child-node-index
 * License: CC-BY-SA 3.0
 */
function getIndex(element) {
	return Array.prototype.indexOf.call(element.parentNode.children, element);
}

/**
 * Get horizontal/vertical offset of an element
 * Author: 카페인러브, 2016
 * License: MIT and GPL Licenses
 */
function getOffset(element) {
	var style = element.currentStyle || window.getComputedStyle(element);

	return {
		"top": element.getBoundingClientRect().top
			+ (document.documentElement.scrollTop || document.body.scrollTop)
			- parseInt(style.paddingTop)
			- parseInt(style.marginTop),
		"left": element.getBoundingClientRect().left
			+ (document.documentElement.scrollLeft || document.body.scrollLeft)
			- parseInt(style.paddingLeft)
			- parseInt(style.marginLeft)
	};
}