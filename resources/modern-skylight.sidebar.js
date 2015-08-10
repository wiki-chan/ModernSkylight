/*=========================
	InfoWidgets (customized)
	© Peter Coester, 2012
=========================*/
$(function () {
	// 각 쿼리마다 쿼리 이름 설정 by 페네트-
	var recentChangesQuery = {
		name: '최근 편집된 문서',
		selector: '#infowidget-rc',
		url: '/api.php?action=query&format=json&list=recentchanges&rclimit=22&rcshow=!redirect|!bot&rcprop=title|flags&rcnamespace=0|6|12|14|100&rctoponly',
	};
	var watchlistQuery = {
		name: '주시중인 문서',
		selector: '#infowidget-wl',
		url: '/api.php?action=query&format=json&list=watchlist&wllimit=22&wlprop=title',
	};
 /*
	var newPagesQuery = {
		name: '새로 등록된 문서',
		selector: '#infowidget-new',
		url: '/api.php?action=query&format=json&list=recentchanges&rclimit=10&rctype=new&rcshow=!redirect&rcprop=title&rcnamespace=0|100',
	};
*/

	var queries = [recentChangesQuery, watchlistQuery];
	
	function queryWikiAPI(query) {
		if (!query.selector || !query.url) return;
		var container = jQuery(query.selector);
		if (!container.length) return;
		container.empty();
		query.list = /list=(\w+)\b/.exec(query.url)[1];
		if (!query.list) return;
		if (!query.maxResults || typeof query.maxResults != 'number') query.maxResults = 22;
		if (!query.format || typeof query.format != 'function') {
			query.format = function (dataset) {
				return '<a href="/index.php/' + encodeURI(dataset.title).split("?").join("%3F") + '" class="' + dataset.type + '">' + dataset.title + '</a>';
			}
		};
		jQuery.ajax({
			type: "GET",
			url: query.url,
			dataType: "json",
			async: true,
			cache: false,
			success: function (response, textStatus, jqXHR) {
				var data = response.query[query.list];
				var titles = new Array();
				var html = '';
				for (i = 0; i < data.length && titles.length < query.maxResults; i++) {
					if (-1 == jQuery.inArray(data[i].title, titles)) {
						titles.push(data[i].title);
						html += '<li>' + query.format(data[i]) + '</li>';
					}
				}
				container.append('<ul class="nolist">' + html + '</ul>');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert('error'+textStatus);
			}
		});
	}

	function performQueries(queries) {
		if (window.lastWidgetUpdate && Date.now() - window.lastWidgetUpdate < 61000) return;
		window.lastWidgetUpdate = Date.now();
		if (!window.widgetInterval) {
			window.widgetInterval = window.setInterval(
				function () {
					performQueries(queries);
				}, 20000);
		}
		for (var i = 0; i < queries.length; i++) {
			queryWikiAPI(queries[i]);
		}
	}

	performQueries(queries);
	jQuery(window).focus(function () {
		performQueries(queries);
	});
	jQuery(window).blur(function () {
		if (window.widgetInterval) window.clearInterval(window.widgetInterval);
		delete window.widgetInterval;
	});

	// 모든 문서, 주시한 문서 스위치
	$('.infowidget-switch li').click(function(){
		var rc = $('#infowidget-rc');
		var wl = $('#infowidget-wl');

		if ( !$(this).hasClass('active') ) {
			$(this).addClass('active').siblings().removeClass('active');

			if ( $(this).hasClass('rc') ){
				wl.hide();
				rc.fadeIn('300');
			}
			else if ( $(this).hasClass('wl') ) {
				rc.hide();
				wl.fadeIn('300');
			}
		}
	});

	// 로그인 상태가 아닐 경우 스위치를 숨김 (by 페네트-)
	if (!mw.config.wgUserName) $('.infowidget-switch').hide();
});