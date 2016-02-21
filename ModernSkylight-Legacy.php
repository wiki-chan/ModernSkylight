<?php
/**
 * Modern Skylight - Modern skin for Mediawiki Engine
 * http://wiki-chan.net
 * 
 * @author Fenet (http://wiki-chan.net / stuff.ifenet@gmail.com)
 * @author cafeinlove (http://wiki-chan.net / cafeinlovekr@gmail.com)
 * @license http://www.freebsd.org/copyright/freebsd-doc-license.html BSD-2 license
 */

if( !defined( 'MEDIAWIKI' ) ) {
	die( -1 );
}

// credits
$wgExtensionCredits['skin'][] = array(
	'path' => __FILE__,
	'name' => 'Modern Skylight',
	'namemsg' => 'skinname-modern-skylight', // used since MW 1.24, see the section on "Localisation messages" below
	'version' => '1.0',
	'url' => 'https://github.com/wiki-chan/modern-skylight',
	'author' => array('Fenet', 'cafeinlove'),
	'descriptionmsg' => 'modern-skylight-desc', // see the section on "Localisation messages" below
	'license-name' => 'BSD-2',
);

// add skin
$wgValidSkinNames['modernskylight'] = 'ModernSkylight';

// autoload classes
$wgAutoloadClasses['SkinModernSkylight'] = __DIR__ . '/SkinModernSkylight.php';
$wgAutoloadClasses['ModernSkylightTemplate'] = __DIR__ . '/ModernSkylightTemplate.php';
$wgAutoloadClasses['ModernSkylightMenubar'] = __DIR__ . '/ModernSkylightMenubar.php';

// i18n setting
$wgMessagesDirs['ModernSkylight'] = __DIR__ . '/i18n';

##################################################################
# 위키 전역에서 사용되는 module
$wgResourceModules['skins.modern-skylight.js'] = array(
	'scripts' => array(
			"resources/modern-skylight.js",
			"resources/editWarning.js",
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
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);
$wgResourceModules['skins.modern-skylight.css'] = array(
	'styles' => array(
			"resources/font-awesome.css" => array('media' => 'screen'),
			"resources/modern-skylight.css" => array('media' => 'screen'),
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);

# 메인페이지에서만 적용되는 js와 css
$wgResourceModules['skins.modern-skylight.mainpage.js'] = array(
	'scripts' => array(
			"resources/modern-skylight.mainpage.js"
		),
	'dependencies' => array(
			'mediawiki.util',
			'jquery',
			'jquery.json',
			'skins.modern-skylight.sidebar'
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);
$wgResourceModules['skins.modern-skylight.mainpage.css'] = array(
	'styles' => array(
			"resources/modern-skylight.mainpage.css" => array('media' => 'screen'),
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);

# 일반 문서 페이지에서 작동
$wgResourceModules['skins.modern-skylight.article.js'] = array(
	'scripts' => array(
			"resources/modern-skylight.article.js"
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);
$wgResourceModules['skins.modern-skylight.article.css'] = array(
	'styles' => array(
			"resources/modern-skylight.article.css" => array('media' => 'screen'),
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);

# 카테고리에서만 작동
$wgResourceModules['skins.modern-skylight.catpage.css'] = array(
	'styles' => array(
			"resources/modern-skylight.catpage.css" => array('media' => 'screen'),
		),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);

# 심플서치용 모듈 (from Vector skin)
$wgResourceModules['skins.modern-skylight.simplesearch'] = array(
	'scripts' => 'resources/modern-skylight.simpleSearch.js',
	'dependencies' => array(
		'jquery.autoEllipsis',
		'jquery.client',
		'jquery.placeholder',
		'jquery.suggestions',
		'mediawiki.legacy.mwsuggest', // to ensure we disable it in proper order
	),
	'remoteSkinPath' => 'ModernSkylight',
	'localBasePath' => __DIR__
);
