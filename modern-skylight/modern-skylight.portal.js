/*=================
	타임라인 툴팁
	by 카페인러브
   =================*/
$(document).ready(function ($) {
	$('.timeline').each(function(){
		closeTooltip = function(){
			$('.tooltip-active').fadeOut('100').removeClass('tooltip-active');
		}

		$(this).click(function(e){
			e.stopPropagation();

			var
				$tooltip = $(this).children('.timeline-tooltip'),
				table = $('.timetable');
			var
				offset = $(this).offset(),
				height = $(this).outerHeight(),
				width = $(this).outerWidth(),
				tooltipWidth = $tooltip.outerWidth(),
				tooltipHeight = $tooltip.outerHeight(),
				windowWidth = window.innerWidth,
				windowHeight = window.innerHeight,
				windowScrollTop = document.body.scrollTop;

			// 툴팁이 가로로 잘리나 확인
			if ( offset.left + width + tooltipWidth > windowWidth ){
				$tooltip.addClass('flipped-x');
			} else {
				$tooltip.removeClass('flipped-x');
			}

 			// 툴팁이 세로로 잘리나 확인 (+툴팁이 화면의 위쪽에 잘리지 않도록 함)
			if ( offset.top - windowScrollTop + tooltipHeight > windowHeight && offset.top - windowScrollTop - tooltipHeight > 0 ){
				$tooltip.addClass('flipped-y');
				$tooltip.css('bottom', height );
			} else {
				$tooltip.removeClass('flipped-y');
				$tooltip.css('bottom', 'auto');
			}

			// 클릭한 위치의 툴팁을 띄우고, 다른 툴팁이 켜져 있으면 닫음
			if ( !$tooltip.hasClass('tooltip-active') ) {
				$('.timeline-tooltip').not($tooltip).fadeOut();
				$tooltip.fadeIn(300).addClass('tooltip-active');
			}
		});

		// 툴팁 이외의 다른 아무 곳이나 클릭하면 툴팁이 사라짐
		$(document).click(function (e){
			if ( e.target !== $('.tooltip-active')[0] ) {
				closeTooltip();
			}
		});
	});
});

/*===================
	애니메이션 편성표
	by 카페인러브
   ===================*/
$(document).ready(function ($) {
	if ( $('.timetable').length ){
		// 야간 애니만 보기
		var wgArticleId = (window.mediaWiki && window.mediaWiki.config && window.mediaWiki.config.get('wgArticleId')) || window.wgArticleId;
		var setting = localStorage.getItem('aniota');

		if ( setting == wgArticleId ) {
			$('.timetable').addClass('otaku-friendly');
			$('li.otaku-friendly').addClass('triggered');
		}

		$('.otaku-friendly').on('click', function(){
			var self = $(this);
			var target = $('.timetable .day');

			if ( !self.hasClass('triggered') ) {
				self.addClass('triggered');
				target.fadeOut('fast');
				localStorage.setItem('aniota', wgArticleId);
			} else {
				self.removeClass('triggered');
				target.fadeIn('fast');
				localStorage.removeItem('aniota', wgArticleId);
			}
		});

		// 신작 애니만 보기
		$('.show-profiles').click(function(){
			var $this = $(this),
				clickNum = $this.data('clickNum');

			if ( !clickNum ) clickNum = 1;

			// 처음에 클릭할 때 프로필을 종합함
			if ( clickNum == 1 ) {
				// 툴팁을 복사해 #new-items에 붙여넣음
				$('.timeline.new').children('.timeline-tooltip').each(function(){
					$(this).clone().appendTo('.profiles');
				});

				// 툴팁 -> 프로필로 서식 변경
				$('.profiles>div').removeClass().addClass('profile clear').show();
				// $('.profiles').append('<input type="button" value="클릭한 작품만 보이기" class="selected-only" style="float:right" /><input type="button" value="초기화" class="select-reset" style="float:right" />');

				// 시간표를 감추고 프로필을 나타나게 함
				$('.timetable').hide();
				$('.profiles').fadeIn(200);

				// 프로필의 왼쪽 오른쪽 칼럼 높이를 맞춤
				adjustHeight();

				// 텍스트 토글
				$(this).text('시간표 보기');
			}
			// 그 다음부턴 그냥 토글
			else if ( $('.profiles').is(':visible') ) {
				$('.profiles').hide();
				$('.timetable').fadeIn(200);
				$(this).text('신작 애니 정보');
			}
			else {
				$('.timetable').hide();
				$('.profiles').fadeIn(200);
				$(this).text('시간표 보기');
			}
			// 클릭 횟수 카운트
			$this.data('clickNum', ++clickNum);
		});

		// 신작 소거하기
		$('.profile .close').live('click', function(){
			// X를 누르면 닫힘
			$(this).parent().removeClass('valid').fadeOut('fast', function(){

				// 프로필의 왼쪽 오른쪽 칼럼 높이를 다시 맞춤
				var targets = $('.profiles .profile:visible');
				targets.css('height', '');

				targets.each(function(index){
					if ( index % 2 === 0 ) {
						var
							left = $(this),
							leftHeight = left.height(),
							leftIndex = targets.index(left),
							right = targets.eq(leftIndex+1),
							rightHeight = right.height();
							maxHeight = Math.max(leftHeight, rightHeight);

						left.height(maxHeight);
						right.height(maxHeight);
					}
				});
			});
		});

		/* 마킹한 작품만 보이기
		$('.selected-only').live('click', function(){
			// 작품 갯수 세기
			var n = $('.profile.valid').length;
			var list = $('.profile.valid .title').map(function(){
				return $(this).text();
			}).get().join(", ");
			var result = '<input type="text" id="selected-items" size="50" value="' + list + ' (' + n + '작품)">';
			var clicks = 0;

			if ( clicks == 0 ) {
				$('.profiles').append(result);
			}
			else {
				$('#selected-items').attr('value', list + ' (' + n + '작품)');
			}
			$('#selected-items').select();

			++clicks;
		});

		// 마킹 리셋하기
		$('.select-reset').live('click', function(){
			$('.profile').height('auto').show().removeClass('selected');
			$('#selected-items').remove();
			adjustHeight();
		});
		*/

		$('.show-others').on('click', function(){
			var root = $('body');
			var links = 
				'<div id="dialog">' + 
				'<div class="head">단축키 목록<button class="close">×</button></div>' +
				'<div class="body">'+

			root.append('<div class="blackout"></div>');
			root.append(links);
		});
	}
});

// 프로필의 왼쪽 오른쪽 칼럼 높이를 맞춤
function adjustHeight(){
	var targets = $('.profiles .profile');

	targets.each(function(index){
		if ( index % 2 === 0 ) {
			var
				left = $(this),
				leftHeight = left.height(),
				leftIndex = targets.index(left),
				right = targets.eq(leftIndex+1),
				rightHeight = right.height(),
				maxHeight = Math.max(leftHeight, rightHeight);

			left.height(maxHeight);
			right.height(maxHeight);
		}
	});
}

/*================
	게임 발매표
	by 카페인러브
   ================*/
$(document).ready(function ($) {
	if ( $('.release-chart').length ) {

		// 체크박스 메뉴에 각 아이템의 갯수를 표시함
		var
			items = $('.list')
			otome = $('.list.otome'),
			bl = $('.list.bl'),
			allages = $('.list.allages'),
			mature = $('.list.mature'),
			num_otome = otome.length,
			num_bl = bl.length,
			num_allages = allages.length,
			num_mature = mature.length;

		$('.toggle-otome .num').text(num_otome);
		$('.toggle-bl .num').text(num_bl);
		$('.toggle-allages .num').text(num_allages);
		$('.toggle-mature .num').text(num_mature);

		// 체크박스 버튼을 누르면 알맞게 토글 
		$('.checkbox-menu li').click(function(){
			if ( !$(this).hasClass('checked') ) {
				$(this).addClass('checked');

				if ( $(this).hasClass('toggle-otome') ) {
					items.removeClass('hide-otome');
				}
				else if ( $(this).hasClass('toggle-bl') ) {
					items.removeClass('hide-bl');
				}
				else if ( $(this).hasClass('toggle-allages') ) {
					items.removeClass('hide-allages');
				}
				else if ( $(this).hasClass('toggle-mature') ) {
					items.removeClass('hide-mature');
				}
			} else {
				$(this).removeClass('checked')

				if ( $(this).hasClass('toggle-otome') ) {
					items.addClass('hide-otome');
				}
				else if ( $(this).hasClass('toggle-bl') ) {
					items.addClass('hide-bl');
				}
				else if ( $(this).hasClass('toggle-allages') ) {
					items.addClass('hide-allages');
				}
				else if ( $(this).hasClass('toggle-mature') ) {
					items.addClass('hide-mature');
				}
			}
		});

		// + 표시를 클릭하면 그 달의 발매작들을 펼쳐 보여줌
		$('.more').on('click', function(){
			var
				cells = $('.release-chart .month'),
				target = $(this).parent().parent(),
				profiles = target.find('.profile'),
				links = target.find('.link');

			if ( !target.hasClass('profiles') ) {
				target.addClass('profiles');
				cells.not(target).hide();
				profiles.fadeIn('300');
				links.hide();
				adjustHeight();
			} else {
				target.removeClass('profiles');
				profiles.hide();
				links.fadeIn('300');
				cells.not(target).fadeIn('300');
			}
		});

		$('.show-all').on('click', function(){
			var
				chart = $('.release-chart'),
				profile = $('.profile'),
				profiles = $('.profiles'),
				checkbox = $('.checkbox-menu');

			if ( $(this).hasClass('unbind') ) {
				profile.each(function(){
					$(this).clone().appendTo(profiles).show();
				});

				// 달력을 감추고 프로필을 나타나게 함
				chart.hide();
				profiles.show();
				checkbox.hide();

				// 양쪽 칼럼을 맞춤
				adjustHeight();

				// 2번째 클릭부터는 토글만
				$(this).removeClass('unbind').text('캘린더로 돌아가기');	
			} else {
				chart.toggle();
				profiles.toggle();
				checkbox.toggle();

				if ( $(this).text() == '모두 펼치기' )
					$(this).text('캘린더로 돌아가기');
				else
					$(this).text('모두 펼치기');
			}
		});
	}
});

/*==================
	성우 생일 캘린더
	by 카페인러브
   ==================*/
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