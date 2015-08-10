/*=================
	NAVIGATION
==================*/
$(function(){
	var menu = $('#rsp-header');
	var self = $(this);
	var x = $('#rsp-tools');
	var y = $('#rsp-search');
	var z = $('#rsp-account');

	$('#r-tools').on('click', function(){
		self.toggleClass('active');
		x.slideToggle();
		y.hide();
		z.hide();
	});
	$('#r-search').on('click', function(){
		self.toggleClass('active');
		x.hide();
		y.toggle();
		z.hide();
	});
	$('#r-account').on('click', function(){
		self.toggleClass('active');
		x.hide();
		y.hide();
		z.slideToggle();
	});

	$('.r-submenu').click(function(){
		var s = $('.rsp-submenu');
		var t = $(this).next();
		s.not(t).slideUp();
		t.slideToggle();
	});

	$(window).resize(function(){
		var w = $(window).width();
		if(w > 480 && menu.is(':hidden')) {
			x.hide();
			y.hide();
			z.hide();
		}
	});
});