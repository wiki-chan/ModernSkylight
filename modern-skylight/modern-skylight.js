/************************
*	Smooth Scroll
*	Author: 카페인러브
************************/
$(function() {
	// 링크를 클릭했을 때 스무스 스크롤
	var $root = $('html, body');

	$('a[href^="#"]').click(function (e) {
		event.preventDefault();

		var href = $(this).attr('href');
		var h = href.replace(/\./g, '\\.');

		$root.animate({ scrollTop: $(h).offset().top }, 300);
		location.hash = href;
	});

	// 맨 위로 스크롤
	if (wgNamespaceNumber != 2) {
		$('body').append('<a id="toTop">↑</a>');
		$(window).scroll(function() {
			if($(this).scrollTop() > 400) {
				$('#toTop').fadeIn();
				$('#cactions').addClass('inactive');
			} else {
				$('#toTop').fadeOut();
				$('#cactions').removeClass('inactive');
			}
		});
 		$('#toTop').click(function() {
			$('body,html').animate({ scrollTop: 0 },100);
		});
	}
});

/*********************
*	Site Details
*	Author: 카페인러브
*********************/
function expandFooter() {
	$('.footer-collapse:visible').slideUp();
	$('.footer-expand:hidden').slideDown();
	// 먼저 stop()하고 animate를 한다 by 페네트-
	$('body, html').stop().animate({ scrollTop: $(document).height() }, 800 );
}

/******************************
*	Resize TOC to fit window
*	Author: 카페인러브
******************************/
if ( $('#toc') )
	var tocInitHeight = $('#toc').outerHeight();

function resizeToc(){
	if ( !$('#toc') ) return;
	var windowHeight = window.innerHeight;
	
	if ( tocInitHeight + 67 > windowHeight ) {
		$('#toc').find('ul:first').height(windowHeight - 105);
	}
}
$(document).on('ready', resizeToc);
/* $(window).on('resize', resizeToc); */

/******************************
*	Tooltip
*	Author: vertigo-project (vtip)
*	Arr by: 카페인러브
******************************/
this.tip = function() { 
	$('.tooltip').hover(function() {
		$('.tooltip').find('a').removeAttr('title'); // remove child elem's ajax tooltip

		this.t = this.title;
		this.title = '';
		var $containerWidth = $(this).width();
		var $offset = $(this).offset();

		if ( $(this).is('[title]') ){
 			$('body').append( '<div id="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner">' +this.t+ '</div></div>' );
		}
		var $tipWidth = $('#tooltip').width();
		var $tipHeight = $('#tooltip').height();

		$('#tooltip').css({
			'top': $offset.top - ($tipHeight  +6),
			'left': $offset.left - ($tipWidth - $containerWidth) /2,
		}).fadeIn('fast');
	},
	function() {
		this.title = this.t;
		$('div#tooltip').remove();
	});
};
$(document).ready(function(){ tip(); });

/******************************
*	Select text in pre
*	Author: unknown
******************************/
function selectCode(trigger) {
	var e = trigger.parentNode.getElementsByTagName('pre')[0];
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

$('.selectable').prepend('<input type="button" value="선택" onclick="selectCode(this); return false;" />');