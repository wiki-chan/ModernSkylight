/**
 * Accordion Menu
 * Author: 카페인러브, 2016
 * License: GPL and MIT Licenses
 */
function accordionNav() {
	var $trigger = $("#accordion > li > a"),
		$content = $("#accordion > li > ul.sub-menu"),
		toggler = "active";

	// Expand first block on page load
	$trigger.first().addClass(toggler).next().slideDown();

	// Toggle on clicking
	$trigger.on("click", function(e) {
		// Prevent flickering
		e.preventDefault();

		var $t = $(this);

		if ( !$t.hasClass(toggler) ) {
			$content.slideUp();
			$trigger.not($t).removeClass(toggler);

			$t.next().stop(true, true).slideDown();
			$t.addClass(toggler);
		}
	});
}

/**
 * Toggle Create Form
 * Author: 카페인러브, 2016
 * License: GPL and MIT Licenses
 */
function toggleCreateForm() {
	if (!document.getElementById("create-control")) return;
	
	var select = document.getElementById("create-control").children,
		preload = document.querySelector("#create-form input[name='preload']"),
		placeholder = document.querySelector("#create-form input[name='title']"),
		data = [
			{ template:"", placeholder:"문서의 제목"},
			{ template:"틀:서식/작품", placeholder:"작품의 제목"},
			{ template:"틀:서식/캐릭터", placeholder:"캐릭터의 이름"},
			{ template:"틀:서식/성우", placeholder:"성우의 이름"},
			{ template:"틀:서식/가수", placeholder:"가수의 이름"},
			{ template:"틀:서식/제작사", placeholder:"제작사의 이름"}
		];

	var toggle = function(index) {
		for ( var i = 0; i < select.length; i++ ) {
			select[i].className = (i !== index) ? "" : "selected";
		}

		preload.value = data[index].template;
		placeholder.placeholder = data[index].placeholder + "을 입력하고 엔터를 눌러 주세요.";
	};

	Array.prototype.forEach.call(select, function(elem) {

		elem.addEventListener("click", function() {
			toggle( getIndex(elem) );
		});

	});
}

/* Call functions on DOM Ready */
(function(){
	// Activate accordion menu
	accordionNav();

	// Activate "createform" toggle
	toggleCreateForm();

	// Hack "Wikichan sort" Link
	document.getElementById("wikichan-sort").children[0].setAttribute("href", "/sort/");
})();