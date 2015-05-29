# Modern Skylight
Modern Skylight은 동명의 사이트에서 사용중인 Mediawiki skin입니다. BSD-2 license로 코드와 디자인 모두 배포하고 있습니다. 사이트 내에 이 [github repo](https://github.com/wiki-chan/modern-skylight)의 주소를 볼 수 있도록 추가하는 조건 하에서, 사용과 재배포, 상업적 이용이 가능합니다. 자세한 내용은 LICENSE 파일이나 [FreeBSD License](http://www.freebsd.org/copyright/freebsd-doc-license.html)를 참고하시기 바랍니다.

샘플은 [위키쨩 사이트](http://wiki-chan.net)에서 확인할 수 있습니다.

## 설치 방법
Modern Skylight 스킨은 Mediawiki 1.19.2 버전에서 테스트하였습니다. 1.25.0버전 이상에서는 사용할 수 없습니다(호환성 작업중입니다).
Mediawiki가 설치된 폴더의 skins 폴더 안에 코드를 넣습니다. 또는, git 명령을 사용할 수 있다면 다음 명령을 수행합니다.

```
git clone https://github.com/wiki-chan/modern-skylight.git
```

그 다음, LocalSettings.php 안에 다음 코드를 추가합니다.

```php
require_once( "$IP/skins/modern-skylight/Modules.php" );
```
