/*************************
 *	DOMReady Actions
 *************************/
$(function(){
	/************************
	 *	Accordion Menu
	 ************************/
		var
			ac_trigger = $('#accordion > li > a'),
			ac_target = $('#accordion > li > ul.sub-menu'),
			toggle_class = 'active';

		// 로드 시점에서 첫번째 아코디언을 오픈
		ac_trigger.first().addClass(toggle_class).next().slideDown();

		// 클릭하면
		ac_trigger.on('click', function (e) {
			e.preventDefault();

			// 토글한다
			var $t  = $(this);

			if ( !$t.hasClass(toggle_class) ) {
				ac_target.slideUp();
				$t.next().stop(true, true).slideToggle();
				ac_trigger.not($t).removeClass(toggle_class);
				$t.addClass(toggle_class);
			}
		});

	/********************
	 *	Create Form
	 ********************/
	var
		cf_trigger = $('#createformToggle'),
		cf_target = $('#createform-hidden');

	cf_trigger.on('click', function (e) {
		e.preventDefault();
		cf_trigger.toggleClass('open');
		cf_target.slideToggle();
	});
});