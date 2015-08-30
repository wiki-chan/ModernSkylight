<?php

class ModernSkylightMenubar {
	public static function getMenubar() {
		$rawtext = wfMessage( 'ModernSkylightMenubar' )->inContentLanguage()->plain();
		$menubar = array();

		$lines = explode("\n", $rawtext);
		$heading = null;

		// original code from Skin.php : addToSidebarPlain
		foreach ($lines as $line) {
			if ( strpos( $line, '*' ) !== 0 ) {
				continue;
			}

			$line = rtrim( $line, "\r" ); // for Windows compat

			// 1st level menu
			if ( strpos( $line, '**' ) !== 0 ) {
				$item = ModernSkylightMenubar::getItem($line);
				$item['child'] = array();

				$heading = &$item['child'];
				$menubar[] = $item;
			} else {
				$item = ModernSkylightMenubar::getItem($line);
				$heading[] = $item;
			}
		}
		unset($heading);

		return $menubar;
	}

	private static function getItem( $line ) {
		$line = trim( $line, '* ' );
		$line = array_map( 'trim', explode( '|', $line, 3 ) );

		$item = array();

		if ($line[0] === '-') {
			$item['delimiter'] = true;
			return $item;
		}

		$item['text'] = $line[0];
		if ( !isset($line[1]) ) $line[1] = $line[0];
		$title = Title::newFromText($line[1]);
		if ($title !== null) $item['href'] = $title->getInternalURL();
		else $item['href'] = $line[1];

		if ( isset($line[2]) ) {
			$options = array_map( 'trim', explode('&', $line[2]) );
			foreach ($options as $option) {
				$value = array_map( 'trim', explode('=', $option, 2) );

				switch ($value[0]) {
					case 'shortcut':
						$item['shortcut'] = $value[1];
						$item['accesskey'] = $value[1];
						break;
					case 'admin':
						$item['admin'] = $value[1] == 'yes' ? true : false;
						break;
					case 'accesskey':
						$item['accesskey'] = $value[1];
						break;
					case 'backlink':
						$item['href'] = Title::newFromText('특수:가리키는문서')->getInternalURL() . '/';
						$item['backlink'] = true;
						break;
				}
			}
		}

		return $item;
	}
}