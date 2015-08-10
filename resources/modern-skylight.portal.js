////////////////////////////////////////////////////////////////
// leanModal
// @Author: Ray Stone, http://finelysliced.com.au
// @Customization: 카페인러브
(function($) {
	$.fn.extend({
		openModal: function(options) {
			var defaults = {
				type: null,
				selector: '#modal'
			};
			options = $.extend(defaults, options);
			
			return this.each(function() {
				var o = options;

				$(this).click(function(e) {
					$(o.selector).click(function(e) {
						e.stopPropagation();
					});
					$('div.modal-container, span.modal-close').click(function() {
						closeModal(o.selector, o.type);
					});
					$(document).bind('keyup', function(e) {
						if (e.keyCode == 27) closeModal(o.selector, o.type);
					});

					if (o.type == 'info') {
						$(this).children('div.detail').clone().appendTo(o.selector);
					}

					$(o.selector).parent().css('display', 'block');

					if (o.type !== 'filter') {
						adjustModal(o.selector);
						$(window).resize(function() { adjustModal(o.selector); });
					}

					$('div.modal-overlay').css({
						'display': 'block',
						'opacity': 0
					}).fadeTo(200, 0.8);
					$(o.selector).fadeTo(200, 1);
					$('body').addClass('modal-open');

					e.preventDefault();
				});
			});

			function adjustModal(modal) {
				var height = $(modal).outerHeight(),
					windowHeight = $(window).height();
				$(modal).css('margin-top', (windowHeight - height) / 2);
			}

			function closeModal(modal, type) {
				$('div.modal-overlay').fadeOut(200);
				$(modal).fadeOut(200).parent().css('display', 'none');
				if (type == 'info') {
					$(modal).find('.detail').remove();
				}
				$('body').removeClass('modal-open');
			}

			function initContent(modal, image) {
				$(this).children('div.detail').clone().appendTo(o.selector);

			}
		}
	});
})(jQuery);

// Toggle by Categories
function toggleCategories(trigger, target) {
	if ( trigger.hasClass('checked') ) {
		trigger.removeClass('checked');
		target.hide();
	} else {
		trigger.addClass('checked');
		target.show();
	}
}

function assembleDetails(source, table) {
	var len = source.length, rows = '';

	source.each(function(i){
		var c = $(this).html();
		rows += ( i==0 || i%2==0 ? '<tr><td>' : '<td>' ) + c +  ( i%2==0 && i!==len-1 ? '</td>' : '</td></tr>' );
	});
	table.html(rows);
}

function anitableCurrentDay(index) {
	var c = (!index) ? ((new Date()).getDay()) : index,
		d = '#day' + c,
		cur = 'current';

	if ($(d).hasClass(cur)) return;
	$(d).addClass(cur).siblings().removeClass(cur).find('div.item-thumb').empty();

	$(d + ' img').each(function(){
		var tar = $(this).closest('div.item').children('div.item-thumb');
		$(this).clone().removeAttr('width height').appendTo(tar);
	});
}

////////////////////////// DOMREADY FUNCTIONS

// Common variables
window.$games = {
	otome : $('div.item.otome'),
	bl : $('div.item.bl'),
	all_ages : $('div.item.all-ages'),
	mature : $('div.item.mature')
};

$(function() {
	// 애니 방영표
	if ($('#anitable').length) {
		// 현재 요일을 하이라이트
		anitableCurrentDay();

		// 요일을 클릭하면 요일 체인지
		$('li[id^=day] > div.heading').click(function(){
			var index = $(this).parent().attr('id').substring(3,4);
			anitableCurrentDay(index);
		});

		// 작품을 클릭하면 상세정보를 띄움
		$('#anitable div.item').openModal({ type: 'info', selector: '#individual' });

		// 신작정보만 모아서 보기
		$('#filter-new a').one('click', function(){
			assembleDetails($('#anitable div.item.new div.detail'), $('#whole-season'));
		});
		$('#filter-new a').openModal({ type: 'filter', selector: '#whole-season' });
	}

	// 게임 발매표
	if ($('#gametable').length) {
		// 현재 월을 하이라이트
		var month = ((new Date()).getMonth());
		$('#gametable div.month').eq(month).addClass('current');

		// 카테고리의 크기 표시
		$('#filter-otome span.num')
			.text($games.otome.length);
		$('#filter-bl span.num')
			.text($games.bl.length);
		$('#filter-all-ages span.num')
			.text($games.all_ages.length);
		$('#filter-mature span.num')
			.text($games.mature.length);

		// 카테고리를 클릭하면 장르별 토글
		$('#filter-otome').click(function(){
			toggleCategories($(this), $games.otome);
		});
		$('#filter-bl').click(function(){
			toggleCategories($(this), $games.bl);
		});
		$('#filter-all-ages').click(function(){
			toggleCategories($(this), $games.all_ages);
		});
		$('#filter-mature').click(function(){
			toggleCategories($(this), $games.mature);
		});

		// 작품을 클릭하면 상세정보를 띄움
		$('#gametable div.item').openModal({ type: 'info', selector: '#individual' });

		// 연간 정보 모아서 보기
		assembleDetails($('#gametable div.detail'), $('#whole-year'));
		$('#view-all a').openModal({ type: 'filter', selector: '#whole-year' });

		// 월별 정보 보기
		$('#gametable span.more').click(function() {
			var source = $(this).parent().siblings('div.item').children('div.detail');
			assembleDetails(source, $('#by-month'));
		});
		$('#gametable span.more').openModal({ type: 'filter', selector: '#by-month' });
	}
});

////////////////////////////////////////////////
// 성우 생일 캘린더
if ( $('#calendar').length ) {
	var
		calendar = $('.calendar'),
		container = $('#calendar'),
		containerWidth = container.width(),
		prev_next = $('#calendar-prev, #calendar-next'),
		editButton = $('#ca-edit a');

	$(document).ready(function() {
		var
			today = $('.today');
			todayWidth = today.outerWidth(),
			todayPos = today.position().left,
			scrollToToday = (containerWidth - todayWidth)/2 - todayPos;

		// 페이지를 불러올 때 오늘 날짜까지 스크롤을 옮김
		calendar.stop().animate({ left: scrollToToday });

		var currentMonth = calendar.attr('id');
		var currentTemp = '/index.php?title=%EB%8C%80%EB%AC%B8:%EC%84%B1%EC%9A%B0_%EC%83%9D%EC%9D%BC_%EC%BA%98%EB%A6%B0%EB%8D%94/' + currentMonth + '%EC%9B%94&action=edit';

		// 편집 버튼을 현재 월로 향하게
		editButton.attr('href', currentTemp);
	});

	// 날짜를 클릭하면 캘린더가 움직임
	$('.days li').on('click', function(){
		var
			items = $(this).parent().children(),
			index = items.index(this),
			target = $('.day').eq(index),
			targetWidth = target.outerWidth(),
			targetPos = target.position().left,
			scrollPos = (containerWidth - targetWidth)/2 - targetPos,
			calendar = $('.calendar');

		calendar.stop().animate({ left: scrollPos });
	});

	// 왼쪽 이동
	$('#calendar-prev').on('click', function(){
		var
			calendar = $('.calendar'),
			posX = calendar.position().left,
			posPrev = posX + containerWidth,
			firstWidth = $('.day').first().outerWidth(),
			scrollToFirst = (containerWidth - firstWidth)/2;

		if ( posPrev > scrollToFirst ) {
			calendar.animate({ left: scrollToFirst });
		} else {
			calendar.animate({ left: posPrev });
		}
	});

	// 오른쪽 이동
	$('#calendar-next').on('click', function(){
		var
			calendar = $('.calendar'),
			posX = calendar.position().left,
			posNext = posX - containerWidth,
			children = $('.day'),
			childrenWidth = 0;

		children.each(function(){
			childrenWidth += $(this).outerWidth();
		});
		var
			lastWidth = children.last().outerWidth(),
			scrollToLast = (containerWidth + lastWidth)/2 - childrenWidth;

		if ( posNext < scrollToLast ) {
			calendar.animate({ left: scrollToLast });
		} else {
			calendar.animate({ left: posNext });
		}
	});

	// 캘린더 간의 스위치
	$('.navi-menu > li').click(function(){
		if ( !$(this).hasClass('selected') ) {
			var
				index = $(this).index(),
				month = index + 1,
				targetPage = '/index.php?title=%EB%8C%80%EB%AC%B8:%EC%84%B1%EC%9A%B0_%EC%83%9D%EC%9D%BC_%EC%BA%98%EB%A6%B0%EB%8D%94/' + month + '%EC%9B%94';

			// 클릭한 버튼에만 selected 클래스 부여
			$(this).addClass('selected').siblings('li').removeClass('selected');

			container.empty();

	 		// 스위치함 (ajax)
			jQuery.ajax({
				type: 'GET',
				url: targetPage,
				data: { action: 'render' },
				success: function(data){
					container.html(data);
				}
			});

			container.ajaxComplete(function(){
				var
					firstDayWidth = $('.day').first().outerWidth(),
					scrollToFirst = (containerWidth - firstDayWidth)/2;

				$('.calendar').stop().animate({ left: scrollToFirst }, 'fast');
			});

			// 편집 버튼을 현재 달의 템플릿으로 향하게
			editButton.attr('href', targetPage + '&action=edit');
		}
	});

	// 슬라이드 쇼 & 플레인 모드 스위치
	$('.calendar-mode').click(function(){
		if ( $(this).hasClass('slideshow') ) {
			$(this).removeClass('slideshow').addClass('plain');
			container.addClass('plain');
			prev_next.fadeOut();
		} else {
			$(this).removeClass('plain').addClass('slideshow');
			container.removeClass('plain');
			prev_next.fadeIn();
		}
	});
}