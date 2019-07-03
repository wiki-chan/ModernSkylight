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

class SkinModernSkylight extends SkinTemplate {

	var $skinname = 'modernskylight', $stylename = 'ModernSkylight',
		$template = 'ModernSkylightTemplate', $useHeadElement = true;

	/**
	 * Initializes output page and sets up skin-specific parameters
	 * @param $out OutputPage object to initialize
	 */
	public function initPage( OutputPage $out ) {
		global $wgLocalStylePath;

		parent::initPage( $out );

		// Append CSS which includes IE only behavior fixes for hover support -
		// this is better than including this in a CSS file since it doesn't
		// wait for the CSS file to load before fetching the HTC file.
		$min = $this->getRequest()->getFuzzyBool( 'debug' ) ? '' : '.min';
		$out->addHeadItem( 'csshover',
			'<!--[if lt IE 7]><style type="text/css">body{behavior:url("' .
				htmlspecialchars( $wgLocalStylePath ) .
				"/{$this->stylename}/csshover{$min}.htc\")}</style><![endif]-->");

		// tab-size가 듣지 않는 IE를 위해 글꼴 강제 수정
		$out->addHeadItem( 'fontoverride',
			'<!--[if IE]><style type="text/css">pre{font-family:굴림,Gulrim !important;}</style><![endif]-->'
		);

		$out->addModules( 'skins.modern-skylight.js' );
		if ($out->getTitle()->isMainPage()) {
			$out->addModules( 'skins.modern-skylight.mainpage.js' );
		}
	}

	function setupSkinUserCss( OutputPage $out ){
		global $wgStylePath;

		parent::setupSkinUserCss( $out );

		$out->addModuleStyles( 'skins.modern-skylight.css' );
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
