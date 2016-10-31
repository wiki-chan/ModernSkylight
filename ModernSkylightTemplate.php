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

// 네임스페이스 체크
if( !defined( 'NS_BOARD' ) ) {
	define('NS_BOARD', -10000);
}

if( !defined( 'NS_PORTAL' ) ) {
	define('NS_PORTAL', -10000);
}

class ModernSkylightTemplate extends BaseTemplate {

	// Functions
	private function getUrl($pagename) {
		global $wgArticlePath;
		return str_replace("$1", $pagename, $wgArticlePath);
	}

	private function getData($data) {

	}

	// 전체 화면을 구성함
	public function execute() {
		global $wgArticlePath;

		$skin = $this->data['skin'];

		$useDebugInfo = false;

		# Check using right sidebar
		$c_page = $skin->getTitle();
		$c_namespace = $c_page->getNamespace();
		$c_mainpage = Title::newMainPage();

		$use_sidebar = false;
		if (   ( $c_namespace >= 0 )
			&& ( $c_namespace != NS_USER ) // User
			&& ( $c_namespace != NS_FILE ) // File
			&& ( $c_namespace != NS_MEDIAWIKI ) // MediaWiki
			&& ( !isset($_GET["action"]) || $_GET["action"] == "submit" )
			&& ( !$c_page->isMainPage() ) // Main Page
			|| ( $c_page->getBaseText() == 'EditWatchlist' && $c_namespace == -1 ) // Speiclal:EditWatchlist
			) $use_sidebar = true;

		// check other extensions
		$hook_args = array( $c_page, $c_namespace, $c_mainpage, &$use_sidebar );
		Hooks::run( 'ModernSkylightUseRightSidebar', $hook_args );

		$this->data['useRightSidebar'] = $use_sidebar;

		# Check hide h1 tag, toolbar
		if ($c_namespace == NS_USER || $c_namespace == NS_BOARD) $this->data['hideH1Toolbar'] = true;
		else $this->data['hideH1Toolbar'] = false;

		# Make custom Notice
		global $wgWikichanCustomNotice;
		if (isset($wgWikichanCustomNotice)) $this->data['customNotice'] = "<p>" . $wgWikichanCustomNotice . "</p>";
		else $this->data['customNotice'] = '';

		# 로그인 부분 컨트롤
		$PersonalTools = $this->getPersonalTools();

		# 회원가입 텍스트 변경 (TEMP. 너즁애 wfMessage로 변경할 것)
		$PersonalTools['createaccount']['links'][0]['text'] = "회원가입";

		//로그인 안한 상태에서 로그인 주소에 접근하지 못하는 버그 fix
		if (!isset($PersonalTools['login']) && isset($PersonalTools['anonlogin'])) $PersonalTools['login'] = $PersonalTools['anonlogin'];

		# 개인 연습장 만들기
		if ($skin->loggedin) {
			$PersonalTools['sandbox']['links'][0]['href'] = $this->getUrl("연습장:" . $skin->getUser()->mName);
			$PersonalTools['sandbox']['links'][0]['text'] = "연습장";
			$PersonalTools['sandbox']['id'] = 'pt-sandbox';
		}

		# 커스텀 카테고리 리스트
		$this->data['catlinks'] = str_replace("catlinks' class='", "catlinks' class='clear ", $this->data['catlinks']);
		//$this->data['catlinks'] = str_replace("</a>:", "</a>://", $this->data['catlinks']);
		$this->data['catlinks'] = str_replace("</a>: ", "</a>", $this->data['catlinks']);
		if (strpos($this->data['catlinks'], "<a") !== false)
			$this->data['catlinks'] = substr($this->data['catlinks'], 0, strpos($this->data['catlinks'], '<a') ) . substr($this->data['catlinks'], strpos($this->data['catlinks'], "</a>") + 4);		
		//$this->data['catlinks'] = str_replace("</li><li", "</li> / <li", $this->data['catlinks']);
		//$this->data['catlinks'] = str_replace("</li></ul>", "</li> / </ul>", $this->data['catlinks']);

		# 메뉴를 위한 툴 리스트 받기
		$toolList = $this->getToolbox();

		# 대문 네임스페이스에서 제목에서 '대문:' 자 빼기
		if ($c_namespace == NS_PORTAL && strpos($this->data['title'], ':') !== false)
			$this->data['title'] = substr($this->data['title'], strpos($this->data['title'], ':') + 1 );

		# 현재 유저가 어드민 그룹에 속해있는지 검사
		if ( in_array('sysop', $skin->getUser()->getEffectiveGroups() ) )
			$this->data['isadmin'] = true;
		else
			$this->data['isadmin'] = false;

		# 메뉴바 데이터 가져오기
		$this->data['menubar'] = ModernSkylightMenubar::getMenubar();
?>
		<?php $this->html( 'headelement' ); ?>

		<div id="header" role="header">
			<div class="holder clear">
				<!-- menubar -->
				<div id="header-tools" role="navigation">
					<ul class="top-menu nolist clear">
						<?php $this->renderMenubar( $this->data['menubar'] ); ?>
					</ul>
				</div>
				<!-- account -->
				<div id="header-account" role="navigation">
					<ul class="top-menu nolist clear">
						<?php
						if ($skin->loggedin) :
							echo '<li class="dropdown">';
							echo 	$this->makeLink( "userpage", $PersonalTools['userpage']['links'][0] );
							echo 	'<ul class="dropdown-menu righted">';
							echo		$this->makeListItem( "preferences", $PersonalTools["preferences"] );
							echo		$this->makeListItem( "sandbox", $PersonalTools["sandbox"] );
							echo		$this->makeListItem( "logout", $PersonalTools["logout"] );
							echo	'</ul>';
							echo '</li>';
						else :
							echo $this->makeListItem( "createaccount", $PersonalTools['createaccount'] );
							echo $this->makeListItem( "login", $PersonalTools['login'] );
						endif;
						?>
					</ul>
				</div>
				<?php if (array_key_exists('notifications', $PersonalTools)) : ?>
				<!-- notification -->
					<div id="header-notification">
						<ul class="top-menu nolist clear">
							<li>
							<?php echo $this->makeLink( "notifications", $PersonalTools['notifications']['links'][0]); ?>
							</li>
						</ul>
					</div>
				<?php endif; ?>
				<!-- search -->
				<div id="header-search" role="search">
					<form action="<?php $this->text( 'wgScript' ) ?>" id="searchform">
						<div id="simpleSearch">
							<?php echo $this->makeSearchInput( array( 'id' => 'searchInput', 'type' => 'text' ) ); ?>
							<?php echo $this->makeSearchButton( 'go', array( 'id' => 'searchButton' ) ); ?>
							<input type='hidden' name="title" value="<?php $this->text( 'searchtitle' ) ?>"/>
						</div>
					</form>
				</div>

			</div>
		</div>
		<div class="content clear" role="main">
			<div class="article<?php if ( !$this->data['useRightSidebar'] ) echo ' alpha'; ?>">
				<div id="mw-js-message" style="display:none;"></div>

				<?php if ( $this->data['catlinks'] ): ?>
				<!-- catlinks -->
				<?php $this->html( 'catlinks' ); ?>
				<!-- /catlinks -->
				<?php endif; ?>

				<!-- firstHeading -->
				<h1 id="firstheading" class="firstheading"<?php if($this->data['hideH1Toolbar']) echo " style=\"display:none;\""; ?>><?php $this->html( 'title' ) ?></h1>
				<!-- /firstHeading -->

				<?php if (!$this->data['hideH1Toolbar']) : ?>
				<!-- actions -->
				<ul id="cactions" class="cactions nolist clear"><?php $this->renderNavigations($c_namespace); ?></ul>
				<!-- /actions -->
				<?php endif; ?>

				<?php if ( $this->data['undelete'] ): ?>
				<!-- undelete -->
				<div id="contentSub2"><?php $this->html( 'undelete' ) ?></div>
				<!-- /undelete -->
				<?php endif; ?>
				
				<?php if ( $this->data['sitenotice'] || $this->data['customNotice']): ?>
				<!-- sitenotice -->
				<div id="siteNotice"><?php $this->html( 'sitenotice' ) ?><?php echo $this->data['customNotice']; ?></div>
				<!-- /sitenotice -->
				<?php endif; ?>

				<!-- bodyContent -->
				<div id="bodyContent">
					<!-- subtitle -->
					<div id="contentSub"<?php $this->html( 'userlangattributes' ) ?>><?php $this->html( 'subtitle' ) ?></div>
					<!-- /subtitle -->

					<!-- bodycontent -->
					<?php $this->html( 'bodycontent' ) ?>
					<!-- /bodycontent -->

					<!-- printfooter -->
					<div class="printfooter">
					<?php $this->html( 'printfooter' ); ?>
					</div>
					<!-- /printfooter -->

					<?php if ( $this->data['dataAfterContent'] ): ?>
					<!-- dataAfterContent -->
					<?php $this->html( 'dataAfterContent' ); ?>
					<!-- /dataAfterContent -->
					<?php endif; ?>

					<div class="visualClear"></div>

					<?php if ($useDebugInfo) : ?>
					<!-- debughtml -->
					<?php $this->html( 'debughtml' ); ?>
					<!-- /debughtml -->
					<?php endif; ?>
				</div>
				<!-- /bodyContent -->
			</div>
			
			<?php if ( $this->data['useRightSidebar'] ) : ?>
			<!-- sidemenu -->
			<div class="sidebar">
				<div class="sidetoc"></div>
				<div class="sidesearch">
					<form action="<?php $this->text( 'wgScript' ) ?>" id="searchform">
						<div id="simpleSearch">
							<?php echo $this->makeSearchInput( array( 'id' => 'searchInput', 'type' => 'text' ) ); ?>
							<?php echo $this->makeSearchButton( 'go', array( 'id' => 'searchButton' ) ); ?>
							<input type='hidden' name="title" value="<?php $this->text( 'searchtitle' ) ?>"/>
						</div>
					</form>
				</div>
			</div>
			<!-- /sidemenu -->
			<?php endif; ?>
		</div>
		<div class="footer<?php if ($c_page->getNamespace() == 0 && !$c_page->isMainPage()) echo ' collapsed'; ?>" role="contentinfo" onclick="expandFooter()">
			<div class="holder clear">
				<?=wfMessage( 'ModernSkylightFooter' )->parse()?>
			</div>
		</div>
		<?php $this->printTrail(); ?>
	</body>
</html>
<?php
	}

	private function renderMenubar($items) {
		foreach ($items as $menu) {
			// 구분선 출력
			if ( isset($menu["delimiter"]) && $menu["delimiter"] ) {
				echo "<hr>";
				continue;
			}

			// admin이 아니라면 건너뜀
			if ( isset($menu["admin"]) && $menu["admin"] && !$this->data['isadmin'] ) continue;

			// 드롭다운 여부 체크
			$use_dropdown = false;
			if ( isset($menu["child"]) && count($menu["child"]) != 0 ) {
				$use_dropdown = true;
			}

			// li 목록 만들기
			if ( $use_dropdown ) {
				echo '<li class="dropdown">';
			} else {
				echo '<li>';
			}

			// 링크 텍스트 생성
			$accesskey = '';
			if (isset($menu["accesskey"])) $accesskey = ' accesskey="' . $menu["accesskey"] . '"';
			$text = $menu["text"];
			if (isset($menu["shortcut"])) $text .= ' <span class="shortcut">' . $menu["shortcut"] . "</span>";

			// 링크 항목 출력
			echo "<a href=\"{$menu["href"]}\"{$accesskey}>{$text}</a>";

			// 하위 목록 출력
			if ( $use_dropdown ) {
				echo '<ul class="dropdown-menu lefted">' . "\n";
				$this->renderMenubar($menu["child"]);
				echo '</ul>' . "\n";
			}

			echo '</li>';
		}
	}

	private function renderNavigations($namespace) {
		$navi = array_merge($this->data['content_navigation']['views'], $this->data['content_navigation']['actions']);

		// check other extensions
		Hooks::run( 'ModernSkylightNavigation', array( $namespace, &$navi ) );

		foreach( $navi as $link ) {
			if (!isset($link['key'])) $link['key'] = Xml::expandAttributes( Linker::tooltipAndAccesskeyAttribs( $link['id'] ) );
			$link['attributes'] = " id=\"{$link['id']}\"";
			if ($link['class'] != false && $link['class'] != "")
				$link['attributes'] .= " class=\"{$link['class']}\"";
			?>
				<li<?=$link['attributes']?>><a href="<?=$link['href']?>" <?=$link['key']?>><?=htmlspecialchars( $link['text'] )?></a></li>
			<?php
		}
	}
}
