/*======================
	아코디언 & 푸터 펼침
======================*/
$(function(){
    	var
    		accordionHead = $('.accordion > li > a'),
    		accordionBody = $('.accordion > li > .sub-menu');

    	// 로드 시점에서 첫번째 아코디언을 오픈
    	accordionHead.first().addClass('active').next().slideDown('normal');

    	// 클릭하면
    	accordionHead.on('click', function (event) {

    		// 아코디언 헤드의 링크가 바보가 되고
    		event.preventDefault();

    		// 토글이 작동함
    		if ( !$(this).hasClass('active') ) {
    			accordionBody.slideUp('normal');
    			$(this).next().stop(true, true).slideToggle('normal');
    			accordionHead.removeClass('active');
    			$(this).addClass('active');
    		}
    	});
});

/*================
	단축키 일람
=================*/
function viewShortcuts() {
	var root = $('body');
	var shortcuts = 
		'<div id="dialog">' + 
		'<div class="head">단축키 목록<button class="close">×</button></div>' +
		'<div class="body">'+
		'<table style="width:100%"><tr>' +
			'<td class="shortcut"><span>z</span></td><td class="shortcut-fn">대문으로</td>' +
			'<td class="shortcut"><span>shift+e</span></td><td class="shortcut-fn">편집</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="shortcut"><span>x</span></td><td class="shortcut-fn">랜덤 읽기</td>' +
			'<td class="shortcut"><span>shift+s</span></td><td class="shortcut-fn">저장</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="shortcut"><span>q</span></td><td class="shortcut-fn">연습장</td>' +
			'<td class="shortcut"><span>shift+p</span></td><td class="shortcut-fn">미리 보기</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="shortcut"><span>r</span></td><td class="shortcut-fn">모든 문서의 바뀜</td>' +
			'<td class="shortcut"><span>shift+v</span></td><td class="shortcut-fn">차이 보기</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="shortcut"><span>l</span></td><td class="shortcut-fn">주시 문서의 바뀜</td>' +
			'<td class="shortcut"><span>h</span></td><td class="shortcut-fn">역사</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="shortcut"><span>b</span></td><td class="shortcut-fn">여기를 가리키는 문서</td>' +
			'<td class="shortcut"><span>w</span></td><td class="shortcut-fn">주시</td>' +
		'</tr></table>' +
		'</div></div>';

	root.append('<div class="blackout"></div>');
	root.append(shortcuts);

	destroy = function(){
		$('.blackout').remove();
		$('#dialog').remove();
	}

	$('.blackout').on('click', function(){
		destroy();
	});
	$('#dialog .close').on('click', function(){
		destroy();
	});
}
$(function(){
	$('#view-shortcuts a').click(function(){
		$(this).toggleClass('active');
		viewShortcuts();
		return false;
	});
});

/*=====================
	새 문서 만들기 토글
=====================*/
$(function(){
	var trigger = $('.createform a');
	var target = $('.createform .hidden');

	trigger.on('click', function (event) {
		trigger.toggleClass('open');
		event.preventDefault();
		target.slideToggle();
	});
});