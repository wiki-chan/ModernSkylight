<?php

if ( function_exists( 'wfLoadSkin' ) ) {
	wfLoadSkin( 'ModernSkylight' );
	// Keep i18n globals so mergeMessageFileList.php doesn't break
	$wgMessagesDirs['ModernSkylight'] = __DIR__ . '/i18n';
	
	if ( function_exists( 'wfWarn' ) ) {
		wfWarn(
			'Deprecated PHP entry point used for Vector skin. Please use wfLoadSkin instead, ' .
			'see https://www.mediawiki.org/wiki/Extension_registration for more details.'
		);
	}
	return true;
} else {
	die( 'This version of the Vector skin requires MediaWiki 1.25+' );
}
