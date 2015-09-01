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

		// 여기는 구 Vector에서 그대로 가져옴
		// Build additional attributes for navigation urls
		$nav = $this->data['content_navigation'];

		$xmlID = '';
		foreach ( $nav as $section => $links ) {
			foreach ( $links as $key => $link ) {
				if ( $section == 'views' && !( isset( $link['primary'] ) && $link['primary'] ) ) {
					$link['class'] = rtrim( 'collapsible ' . $link['class'], ' ' );
				}

				$xmlID = isset( $link['id'] ) ? $link['id'] : 'ca-' . $xmlID;
				$nav[$section][$key]['attributes'] =
					' id="' . Sanitizer::escapeId( $xmlID ) . '"';
				if ( $link['class'] ) {
					$nav[$section][$key]['attributes'] .=
						' class="' . htmlspecialchars( $link['class'] ) . '"';
					unset( $nav[$section][$key]['class'] );
				}
				if ( isset( $link['tooltiponly'] ) && $link['tooltiponly'] ) {
					$nav[$section][$key]['key'] =
						Linker::tooltip( $xmlID );
				} else {
					$nav[$section][$key]['key'] =
						Xml::expandAttributes( Linker::tooltipAndAccesskeyAttribs( $xmlID ) );
				}
			}
		}
		$this->data['namespace_urls'] = $nav['namespaces'];
		$this->data['view_urls'] = $nav['views'];
		$this->data['action_urls'] = $nav['actions'];
		$this->data['variant_urls'] = $nav['variants'];

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
		$hook_args = array( $c_page, $c_namespace, $c_mainpage, &$use_sidebar);
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
					<?php $this->renderMenubar($this->data['menubar']); ?>
				</div>
				<!-- account -->
				<div id="header-account" role="navigation">
					<ul class="top-menu nolist clear">
						<?php if ($skin->loggedin) : ?>
							<li class="dropdown">
								<a href="<?php echo $PersonalTools['userpage']['links'][0]['href'] ?>">
									<?php echo $PersonalTools['userpage']['links'][0]['text'] ?>
									<span id="alarm-container"></span>
								</a>
								<ul class="dropdown-menu righted">
								<?php
									echo $this->makeListItem( "preferences", $PersonalTools["preferences"]);
									echo $this->makeListItem( "sandbox", $PersonalTools["sandbox"]);
									echo $this->makeListItem( "logout", $PersonalTools["logout"]);
								?>
								</ul>
							</li>
						<?php else : ?>
							<li id="pt-createaccount"><a href="<?php echo $PersonalTools['login']['links'][0]['href']; ?>&#38;type=signup">회원가입</a></li>
							<li id="pt-login"><a href="<?php echo $PersonalTools['login']['links'][0]['href']; ?>">로그인</a></li>
						<?php endif; ?>	
					</ul>
				</div>
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

					<!-- debughtml -->
					<?php $this->html( 'debughtml' ); ?>
					<!-- /debughtml -->

				</div>
				<!-- /bodyContent -->
			</div>
			
			<!-- sidemenu -->
			<?php if ( $this->data['useRightSidebar'] ) : ?>
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
			<?php endif; ?>
			<!-- /sidemenu -->
		</div>
		<div class="footer<?php if ($c_page->getNamespace() == 0 && !$c_page->isMainPage()) echo ' collapsed'; ?>" role="contentinfo" onclick="expandFooter()">
			<div class="footer-collapse holder center">클릭하면 안내문이 나타납니다.</div>
			<div class="footer-expand">
				<div class="holder clear">
					<div class="column">
						<div class="column-head">Head Here</div>
						<div class="column-body">
							<div class="entry">
								<a href="<?=$this->getUrl("대문")?>" class="page">Title Here</a>
								<p>Lorem ipsum dolor sit amet, at vim prima nominati. Has augue repudiare urbanitas cu, ne pro appareat expetenda intellegebat.</p>
							</div>
							<div class="entry">
								<a href="<?=$this->getUrl("Link")?>" class="page">Title Here</a>
								<p>Vidisse equidem copiosae eum ad, ludus delectus sea eu, in sit liber facilisis.</p>
							</div>
						</div>
					</div>
					<div class="column">
						<div class="column-head">Head Here</div>
						<div class="column-body">
							<div class="entry">
								<a href="<?=$this->getUrl("Link")?>" class="page">Title Here</a>
								<p>Vidit hendrerit tincidunt vis ei, mel reprehendunt concludaturque et.</p>
							</div>
							<div class="entry">
								<a href="<?=$this->getUrl("Link")?>" class="page">Title Here</a>
								<p>Id cum semper timeam, quo ei simul utinam, dicunt eripuit mediocrem ei mel.</p>
							</div>
						</div>
					</div>
					<div class="column">
						<div class="column-head">Head Here</div>
						<div class="column-body">
							<div class="entry">
								<a href="<?=$this->getUrl("Link")?>" class="page">Title Here</a>
								<p>Has augue repudiare urbanitas cu, ne pro appareat expetenda intellegebat. Usu cu purto iuvaret deleniti.</p>
							</div>
							<div class="entry">
								<p>Eum alienum adversarium in. Tantas suavitate maiestatis nec no, cibo facer eruditi ut sed.</p>
							</div>
						</div>
					</div>
				</div>
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
		if ( isset($this->data['view_urls']) && $this->data['view_urls']['view'] != NULL) $this->data['view_urls']['view']['key'] = 'title="문서를 읽습니다."';
?>
		<?php
		// 읽기, 편집, 역사, 섹션 추가(+)
		foreach ( $this->data['view_urls'] as $link ): ?>
			<li<?php echo $link['attributes'] ?>><a href="<?php echo htmlspecialchars( $link['href'] ) ?>" <?php echo $link['key'] ?>><?php echo htmlspecialchars( $link['text'] ) ?></a></li>
		<?php endforeach; ?>

		<?php
		// 삭제, 이동, 보호, 주시
		foreach ( $this->data['action_urls'] as $link ): ?>
			<li<?php echo $link['attributes'] ?>><a href="<?php echo htmlspecialchars( $link['href'] ) ?>" <?php echo $link['key'] ?>><?php echo htmlspecialchars( $link['text'] ) ?></a></li>
		<?php endforeach; ?>
		<?php
		// 새로고침
		?>
		<? if ($namespace != NS_SPECIAL) : ?>
			<li id="ca-purge">
				<a href="<?php echo $this->data['skin']->getTitle()->getFullURL('action=purge'); ?>" accesskey="p" title="페이지를 새로 읽어들입니다. [p]">갱신</a>
			</li>
		<? endif; ?>
<?php
	}

}