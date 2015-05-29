<?php

# 위키 전역에서 사용되는 module
$wgResourceModules['skins.modern-skylight'] = array(
	'scripts' => array(
			"modern-skylight.js",
			"editWarning.js"
		),
	'styles' => array(
			"modern-skylight.css" => array('screen')
		),
	'dependencies' => array(
			'mediawiki.util',
			'jquery',
			'jquery.async',
			'jquery.cookie',
			'jquery.json',
			'jquery.makeCollapsible',
			'jquery.mwExtension',
			'jquery.ui.tabs.js',
			'jquery.ui.widget.js',
			'skins.modern-skylight.simplesearch'
		),
	'messages' => array(
			'modern-skylight-editwarning',
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname( __FILE__ )
);

# 메인페이지의 우측 sidebar
$wgResourceModules['skins.modern-skylight.sidebar'] = array(
	'scripts' => array(
			"modern-skylight.sidebar.js"
		),
	'styles' => array(
			"modern-skylight.sidebar.css" => array('screen')
		),
	'dependencies' => array(
			'jquery'
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 메인페이지에서만 적용되는 js와 css
$wgResourceModules['skins.modern-skylight.mainpage'] = array(
	'scripts' => array(
			"modern-skylight.mainpage.js"
		),
	'styles' => array(
			"modern-skylight.mainpage.css" => array('screen')
		),
	'dependencies' => array(
			'mediawiki.util',
			'jquery',
			'jquery.json',
			'skins.modern-skylight.sidebar'
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 포탈 카테고리에서 작동
$wgResourceModules['skins.modern-skylight.portal'] = array(
	'scripts' => array(
			"modern-skylight.portal.js"
		),
	'styles' => array(
			"modern-skylight.portal.css" => array('screen')
		),
	'dependencies' => array(
			'mediawiki.util',
			'jquery',
			'jquery.json'
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 일반 문서 페이지에서 작동
$wgResourceModules['skins.modern-skylight.article'] = array(
	'scripts' => array(
			"modern-skylight.article.js"
		),
	'styles' => array(
			"modern-skylight.article.css" => array('screen')
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 유저 페이지(namespace == 2)에서 작동
$wgResourceModules['skins.modern-skylight.userpage'] = array(
	'scripts' => array(
		),
	'styles' => array(
			"modern-skylight.userpage.css" => array('screen')
		),
	'dependencies' => array(
			'mediawiki.util',
			'jquery',
			'jquery.json',
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 카테고리에서만 작동
$wgResourceModules['skins.modern-skylight.catpage'] = array(
	'styles' => array(
			"modern-skylight.catpage.css" => array('screen')
		),
	'remoteBasePath' => $wgStylePath,
	'remoteExtPath' => $wgStylePath,
	'localBasePath' => dirname(__FILE__)
);

# 심플서치용 모듈 (from Vector skin)
$wgResourceModules['skins.modern-skylight.simplesearch'] = array(
	'scripts' => dirname(__FILE__) . '/modern-skylight.simpleSearch.js',
	'dependencies' => array(
		'jquery.autoEllipsis',
		'jquery.client',
		'jquery.placeholder',
		'jquery.suggestions',
		'mediawiki.legacy.mwsuggest', // to ensure we disable it in proper order
	),
);