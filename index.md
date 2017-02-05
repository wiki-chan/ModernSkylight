# Modern Skylight
Modern Skylight은 [위키쨩](http://wiki-chan.net)에서 사용하기 위해 제작된 [Mediawiki](http://mediawiki.org/) skin입니다. Mediawiki 1.25.1 버전에서 테스트되었습니다.

Modern Skylight은 FreeBSD License로 코드와 디자인 모두 배포하고 있습니다. 사이트 내에 Modern Skylight의 [github 프로젝트 페이지](http://wiki-chan.github.io/ModernSkylight/)의 주소를 볼 수 있도록 추가하는 조건 하에서, 사용과 재배포, 상업적 이용이 가능합니다. 자세한 내용은 LICENSE 파일이나 [FreeBSD License](http://www.freebsd.org/copyright/freebsd-doc-license.html)를 참고하시기 바랍니다.

## 설치 방법
Mediawiki가 설치된 폴더의 skins 폴더 안에 코드를 넣습니다. 또는, git 명령을 사용할 수 있다면 다음 명령을 수행합니다.

```
git clone https://github.com/wiki-chan/ModernSkylight.git
```

그 다음, `LocalSettings.php` 안에 다음 코드를 추가합니다.

```php
wfLoadSkin( 'ModernSkylight' );
```

Modern Skylight은 Mediawiki 1.25+ 버전 이상에서 사용할 수 있습니다. 만약 사용하고 있는 미디어위키 버전이 낮다면, 위의 코드 대신 다음 코드를 추가해 보십시오.

```php
require_once 'skins/ModernSkylight/ModernSkylight-Legacy.php';
```

위 레거시 코드는 1.24 버전 이하와의 호환성을 위하여 유지하고 있지만, 정상 작동은 보장하지 않습니다. 만일 문제가 발생하면 [이슈 트래커](https://github.com/wiki-chan/ModernSkylight/issues)에 리포트해 주시기 바랍니다.

## 스킨 커스터마이징
스킨을 사이트의 특성에 맞게 커스터마이징 할 수 있습니다. 커스텀 extension을 사용해 우측 사이드바나 우상단 메뉴를 변경할 수 있고, 미디어위키 문서를 활용하여 상단 메뉴와 하단 푸터를 설정할 수 있습니다.

### 사용 가능한 Hook
사용할 수 있는 hook은 다음과 같은 것이 있습니다.
* ModernSkylightNavigation

  우측 상단의 내비게이션 메뉴를 수정할 수 있습니다. `$navi` 변수에 메뉴 정보가 배열로 들어 있습니다. 다음 코드로 Hook을 추가할 수 있습니다.
  ```php
public static function onNavigation( $namespace, &$navi ) { ... }
$wgHooks['ModernSkylightNavigation'][] = 'MyExtensionHooks::onNavigation';
```
* ModernSkylightUseRightSidebar

  오른쪽의 사이드바를 가릴 수 있습니다. `$use_sidebar` 변수에 사이드바 사용 여부를 나타내는 boolean 값을 사용할 수 있습니다. 다음 코드로 Hook을 추가할 수 있습니다.
  ```php
public static function onRightSidebar( $c_page, $c_namespace, $c_mainpage, &$use_sidebar ) { ... }
$wgHooks['ModernSkylightRightSidebar'][] = 'MyExtensionHooks::onRightSidebar';
```

### 상단 메뉴 설정하기
`미디어위키:ModernSkylightMenubar` 문서를 사용하여 메뉴를 만들 수 있습니다. 일반적으로 `텍스트 | 링크 | 옵션` 의 형식을 갖추고, `*` 기호로 목록을 만들면 됩니다. 하위 목록은 드롭다운으로 표시되며, 현재는 2단계 목록까지만 사용 가능합니다. 또한 `-` 기호로 구분선을 넣을 수 있습니다.

#### 옵션
다음과 같은 옵션을 사용할 수 있습니다.
* accesskey={key}<br>
  키보드 단축키를 지정합니다. 일반적으로 Alt + 단축키로 접근할 수 있습니다.
* shortcut={key}<br>
  키보드 단축키에 대한 안내를 표시합니다. accesskey가 같이 적용됩니다.
* backlink=yes<br>
  '여기를 가리키는 문서' 링크를 만들 수 있습니다. 링크 옵션을 무시합니다.
* admin=yes<br>
  관리자에게만 보이는 메뉴를 만듭니다.

옵션은 & 기호로 여러 옵션을 지정할 수 있습니다.
다음 예시를 참고하여 작성하시기 바랍니다.
```
* 대문으로 | 대문 | accesskey=z
* 랜덤 읽기 | 특수:임의문서 | accesskey=x
* 도구 | 특수:특수문서
** 모든 문서의 바뀜 | 특수:최근바뀜 | shortcut=r
** 주시 문서의 바뀜 | 특수:주시문서목록 | shortcut=l
** -
** 모든 회원 목록 | 특수:사용자
** -
** 여기를 가리키는 문서 | | shortcut=b&backlink=yes
** 계정 이름 변경 | 특수:이름바꾸기 | admin=yes
```

### 하단 푸터 설정하기
`미디어위키:ModernSkylightFooter` 문서를 사용하여 하단 푸터를 설정할 수 있습니다.  `column` class를 사용하여 3등분된 컬럼을 나눌 수 있으며, `column-head` class로 타이틀을, `column-body` class로 본문을 나타낼 수 있습니다. 본문 부분에는 `entry` class로 여러 내용을 적을 수 있습니다. 다음 예시를 참고하여 작성하시기 바랍니다.
```html
<div class="column">
	<div class="column-head">Title here</div>
	<div class="column-body">
		<div class="entry">
			[[Main page|Main link here]]
			<p>Description about your site</p>
		</div>
		<div class="entry">
			[[Page A|Another link here]]
			<p>Description about your site</p>
		</div>
	</div>
</div>
```
