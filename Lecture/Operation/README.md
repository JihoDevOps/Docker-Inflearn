# 도커 클라이언트 명령어

## 도커 이미지 내부 파일 구조 보기

### 이미지 개념 복습

> #### ex) `docker run hello-world`
> #### => `docker run 이미지`

#### 작동 순서

1.  도커 클라이언트에 명령어 입력 후 도커 서버로 보냄
2.  도커 서버에서 컨테이너를 위한 이미지가 이미 캐시가 되어 있는지 확인
3.  없으면 도커 허브에서 다운 받아옴
4.  있으면 그 이미 가지고 있는 이미지로 컨테이너 생성

#### 이미지로 컨테이너 생성하는 순서

1.  먼저 파일 스냅샷되어 있는 것을 컨테이너의 하드 디스크 부분에 올린다.
2.  시작 커맨드를 이용하여 애플리케이션을 실행한다.

### 이미지 내부 파일 시스템 구조 보기

> #### `docker run 이미지 ls`

##### 실제 실행 결과

`hello-world` 이미지 안에는 `ls` 명령어를 실행할 수 있는 파일이 없어 에러가 난다.

```cmd
~>docker run alpine ls

Unable to find image 'alpine:latest' locally
latest: Pulling from library/alpine
5843afab3874: Pull complete
Digest: sha256:234cb88d3020898631af0ccbbcca9a66ae7306ecd30c9720690858c1b007d2a0
Status: Downloaded newer image for alpine:latest
bin
dev
etc
home
lib
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

---

## 컨테이너 나열하기

> ### `docker ps`

### 실습

1.  2개의 Terminal을 작동시킵니다.
2.  첫 번째 Terminal에서 Container 하나를 실행  
    (하지만 이때 컨테이너를 켰다가 바로 끄면 3번을 할 때
    이미 프로세스가 꺼져 있기 때문에 리스트에서 볼 수 없다.)
3.  그리고 두 번째 Terminal에서 docker ps로 확인
4.  그러면 꺼져 있는 Container도 확인하고 싶다면?

```cmd
Terminal 1> docker run alpine ping localhost
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.028 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.043 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.056 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.072 ms
...
```

### `docker ps` 실행 결과

```cmd
Terminal 2> docker ps
CONTAINER ID   IMAGE     COMMAND            CREATED              STATUS              PORTS     NAMES
90b6d15b03ae   alpine    "ping localhost"   About a minute ago   Up About a minute             angry_gauss
```

1.  `CONTAINER ID`
    : 컨테이너의 고유한 아이디 해시값. 실제로는 더 길지만 일부분만 표출
2.  `IMAGE`
    : 컨테이너 생성 시 사용한 도커 이미지
3.  `COMMAND`
    : 컨테이너 시작 시 실행될 명령어.
    대부분 이미지에 내장되어 있으므로 별도 설정이 필요 없음
4.  `CREATED`
    : 컨테이너가 생성된 시간
5.  `STATUS`
    : 컨테이너의 상태. 실행 중은 `Up`, 종료는 `Exited`, 일시정지 `Pause`
6.  `PORTS`
    : 컨테이너가 개방한 포트와 호스트에 연결한 포트.
    특별한 설정을 하지 않은 경우 출력되지 않는다.
    뒤에서 더 자세히 배울 예정
7.  `NAMES`
    : 컨테이너 고유한 이름.
    컨테이너 생성 시 `--name` 옵션으로 이름을 설정하지 않으면
    도커 엔진이 임의로 형용사와 명사를 조합해 설정.
    `id`와 마찬가지로 중복이 안 되고 `docker rename` 명령어로 수정 가능.  
    -> `docker rename original-name changed-name`

#### 원하는 항목만 보기

```cmd
Terminal 2> docker ps --format table{{.Names}}\t{{.Image}}
NAMES         IMAGE
angry_gauss   alpine
```

### 모든 컨테이너 나열

이전 기록들이 전부 표시된다.

#### `docker ps -a`

```cmd
Terminal> docker ps -a
CONTAINER ID   IMAGE         COMMAND            CREATED          STATUS                        PORTS     NAMES
90b6d15b03ae   alpine        "ping localhost"   22 minutes ago   Exited (137) 17 seconds ago             angry_gauss
9ac14115dfbf   hello-world   "ls"               33 minutes ago   Created                                 dreamy_pike
7f25d13f2ff7   alpine        "ls"               35 minutes ago   Exited (0) 35 minutes ago               nifty_matsumoto
5866913dfc45   hello-world   "/hello"           2 days ago       Exited (0) 2 days ago                   musing_allen
958f7f32e031   hello-world   "/hello"           2 days ago       Exited (0) 2 days ago                   nostalgic_montalcini
```

### `ps [OPTIONS]`

기타 다른 명령어는 여느 CLI 프로그램처럼 `--help` 또는 `-help`를 입력하자.

```cmd
Terminal > docker ps --help

Usage:  docker ps [OPTIONS]

List containers

Options:
  -a, --all             Show all containers (default shows just running)
  -f, --filter filter   Filter output based on conditions provided
      --format string   Pretty-print containers using a Go template
  -n, --last int        Show n last created containers (includes all
                        states) (default -1)
  -l, --latest          Show the latest created container (includes all
                        states)
      --no-trunc        Don't truncate output
  -q, --quiet           Only display container IDs
  -s, --size            Display total file sizes
```