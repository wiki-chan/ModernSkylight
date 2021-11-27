<?php
/**
 * Modern Skylight - Modern skin for Mediawiki Engine
 * http://wiki-chan.net
 * 
 * @author Fenet (http://wiki-chan.net / stuff.ifenet@gmail.com)
 * @author cafeinlove (http://wiki-chan.net / cafeinlovekr@gmail.com)
 */

if( !defined( 'MEDIAWIKI' ) ) {
	die( -1 );
}

class ModernSkylightHooks {
	/**
	 * Initializes output page and sets up skin-specific parameters
	 * @param $out OutputPage object to initialize
	 */
	public static function onBeforePageDisplay( OutputPage $out, &$skin ) {
		global $wgLocalStylePath;
		if ( $skin->getSkinName() !== 'modernskylight' ) {
			return;
		}

		// Append CSS which includes IE only behavior fixes for hover support -
		// this is better than including this in a CSS file since it doesn't
		// wait for the CSS file to load before fetching the HTC file.
		$min = $out->getRequest()->getFuzzyBool( 'debug' ) ? '' : '.min';
		$out->addHeadItem( 'csshover',
			'<!--[if lt IE 7]><style type="text/css">body{behavior:url("' .
				htmlspecialchars( $wgLocalStylePath ) .
				"/ModernSkylight/csshover{$min}.htc\")}</style><![endif]-->");

		// tab-size가 듣지 않는 IE를 위해 글꼴 강제 수정
		$out->addHeadItem( 'fontoverride',
			'<!--[if IE]><style type="text/css">pre{font-family:굴림,Gulrim !important;}</style><![endif]-->'
		);

		if ($out->getTitle()->isMainPage()) {
			$out->addModules( 'skins.modern-skylight.mainpage.js' );
		}

		if ($out->getTitle()->isMainPage()) {
			$out->addModuleStyles( 'skins.modern-skylight.mainpage.css' );
		}

		switch ($out->getTitle()->getNamespace()) {
			case NS_CATEGORY:
				$out->addModuleStyles( 'skins.modern-skylight.catpage.css' );
				break;
		}
	}
}
