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

---

## 도커 컨테이너의 생명주기

1. 생성 create
2. 시작 start
3. 실행 running
4. 중지 stopped
5. 삭제 deleted

### 1. 생성 Create

```bash
docker create <image>
```

파일 스냅샷을 하드디스크에 생성한다.

### 2. 시작 Start

```bash
docker start <container id/name>
```

스냅샷마다 각자 실행될 명령어를 가지고 있는데,
그 명령어를 실행시킨다.
이때, 하드디스크에 스냅샷이 있어야 정상적으로 실행된다.

### 3. 실행 Running

실행 = 생성 + 시작

```bash
docker run <image>
```

### 4. 중지 Stopped

```bash
docker stop <image>
```

### 5. 삭제 Deleted

```bash
docker rm <container id/name>
```

### hello-world test

#### 1. create

```bash
> docker create hello-world
d597e3c3c70db5f5b6ae6ea3747bd8bddd99585917f915deb6e43da9759cb14a
```

image를 생성하면 해당 컨테이너의 ID 해시값을 얻을 수 있다.

#### 2. start

```bash
docker start -a <ID의 일부분>
```

```bash
> docker start -a d597e3c

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

위처럼 정상적으로 실행된 것을 확인할 수 있다.

`-a`는 attach 옵션이다. 설명은 다음과 같이 확인할 수 있다.

```bash
> docker start --help

Usage:  docker start [OPTIONS] CONTAINER [CONTAINER...]

Start one or more stopped containers

Options:
  -a, --attach               Attach STDOUT/STDERR and forward signals
      --detach-keys string   Override the key sequence for detaching a
                             container
  -i, --interactive          Attach container's STDIN
```

`-a` 옵션 없이 실행하면 다음과 같이 아무 일도 일어나지 않는 것처럼 보여진다.

```bash
> docker start d597e3c
d597e3c
```

`-a`는 `Attach STDOUT/STDERR and forward signals`와 같은 설명처럼
해당 이미지의 실행을 지켜보면서 출력할 일이 있으면 출력하는 것으로 생각하자.

---

## Docker `STOP`, Docker `KILL`.

```bash
docker stop <container id/name>
```

```bash
docker kill <container id/name>
```

두 명령어는 실행 중인 컨테이너를 중지시킨다.

### `stop`은 Gracefully하게 중지시킨다.

자비롭게 그 동안 하던 작업들을 완료하고 컨테이너를 중지시킨다.

```bash
> docker run alpine ping localhost

PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.153 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.099 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.103 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.098 ms
64 bytes from 127.0.0.1: seq=4 ttl=64 time=0.101 ms
...
```

```bash
> docker stop 70ae57474f4d

70ae57474f4d
```

약간의 딜레이가 있고 얼마 안 있고 alpine이 종료된다.

### `kill`은 어떠한 것도 기다리지 않고, 바로 컨테이너를 중지시킨다.

```bash
> docker run alpine ping localhost

PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.104 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.095 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.041 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.099 ms
64 bytes from 127.0.0.1: seq=4 ttl=64 time=0.098 ms
...
```

```bash
> docker kill fc42c1ae15c5
fc42c1ae15c5
```

alpine이 kill하자마자 중지되었다.

### STOP

1. `docker stop`
2. `SIGTERM` : Grace Period, 정리하는 시간
3. `SIGKILL`
4. Container의 Main Process 종료

### KILL

1. `docker kill`
2. `SIGKILL` : 정리하는 시간 없이 바로 종료
3. Container의 Main Process 종료

---

## 컨테이너 삭제하기

```bash
docker rm <container id/name>
```

실행 중인 컨테이너는 먼저 중지한 후에 삭제할 수 있다.

```bash
> docker ps -a
CONTAINER ID   IMAGE         COMMAND            CREATED          STATUS                        PORTS     NAMES
fc42c1ae15c5   alpine        "ping localhost"   10 minutes ago   Exited (137) 10 minutes ago             priceless_newton
70ae57474f4d   alpine        "ping localhost"   13 minutes ago   Exited (137) 12 minutes ago             cool_ellis
d597e3c3c70d   hello-world   "/hello"           28 minutes ago   Exited (0) 21 minutes ago               suspicious_archimedes
90b6d15b03ae   alpine        "ping localhost"   2 days ago       Exited (137) 2 days ago                 angry_gauss
9ac14115dfbf   hello-world   "ls"               2 days ago       Created                                 dreamy_pike
7f25d13f2ff7   alpine        "ls"               2 days ago       Exited (0) 2 days ago                   nifty_matsumoto
5866913dfc45   hello-world   "/hello"           4 days ago       Exited (0) 4 days ago                   musing_allen
958f7f32e031   hello-world   "/hello"           4 days ago       Exited (0) 4 days ago                   nostalgic_montalcini

> docker rm fc42c1ae15c5
fc42c1ae15c5

> docker ps -a
CONTAINER ID   IMAGE         COMMAND            CREATED          STATUS                        PORTS     NAMES
70ae57474f4d   alpine        "ping localhost"   13 minutes ago   Exited (137) 13 minutes ago             cool_ellis
d597e3c3c70d   hello-world   "/hello"           28 minutes ago   Exited (0) 22 minutes ago               suspicious_archimedes
90b6d15b03ae   alpine        "ping localhost"   2 days ago       Exited (137) 2 days ago                 angry_gauss
9ac14115dfbf   hello-world   "ls"               2 days ago       Created                                 dreamy_pike
7f25d13f2ff7   alpine        "ls"               2 days ago       Exited (0) 2 days ago                   nifty_matsumoto
5866913dfc45   hello-world   "/hello"           4 days ago       Exited (0) 4 days ago                   musing_allen
958f7f32e031   hello-world   "/hello"           4 days ago       Exited (0) 4 days ago                   nostalgic_montalcini
```

ID가 `fc42c1ae15c5`인 alpine container가 삭제된 것을 확인할 수 있다.

### 모든 컨테이너 삭제하기

모든 컨테이너를 삭제할 때는 다음과 같이 입력한다.

```bash
docker rm `docker ps -a -q`
docker rm $(docker ps -qa)
```

그런데 되지 않았다.

이유는 ***Windows Command***에서는 실행되지 않는다.
문법적인 충돌이 있는지 다른 이유는 모르겠다.

해결법은 cmd가 아닌 다른 터미널로 실행하는 것이다.
Git Bash로 실행한 결과는 다음과 같다.

```bash
$ docker rm `docker ps -qa`
70ae57474f4d
d597e3c3c70d
90b6d15b03ae
7f25d13f2ff7
5866913dfc45
958f7f32e031

$ docker ps -a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

```

정상적으로 전부 삭제된 것을 볼 수 있다.

docker를 초기화할 때는
[여기](https://gist.github.com/beeman/aca41f3ebd2bf5efbd9d7fef09eac54d)를 참고하자.
fork해서
[내 gist](https://gist.github.com/Jihogrammer/f3ca245be4b141b4f9880c03ed49574f)에도
간략하게 정리했다.

## 이미지 삭제하기

```bash
docker rmi <image id>
```

### 한 번에 컨테이너, 이미지, 네트워크 모두를 삭제 ⚠


```bash
docker system prune
```

-   도커를 쓰지 않을 때, 모두 정리하고 싶을 때 사용해주면 좋음
-   하지만 이것도 실행 중인 컨테이너에는 영향을 주지 않는다.
-   docker를 많이 쓰다 보면 보이지 않는 파일들이 계속 생성되기 때문에
    종종 해주면 좋다.

```bash
$ docker system prune

WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N] y
Deleted Containers:
86414f5dcaaaf69be6ec536de13455fb1bfd06a2e9e996617d3b3c5b1bcf39ab

Total reclaimed space: 0B
```

---

## 실행 중인 컨테이너에 명령어 전달하기

``` bash
docker exec <container id>
```

1.  먼저 터미널 2개를 실행합니다.
2.  첫 번째 터미널에서 컨테이너 하나를 실행합니다.
    > `docker run alpine ping localhost`
3.  두 번째 터미널에서 컨테이너가 잘 작동하고 있는지 확인하고,
    다른 명령어를 전달합니다.
    > `docker exec <container id> ls`

#### Terminal A

```bash
$ docker run alpine ping localhost
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.044 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.039 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.034 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.036 ms
64 bytes from 127.0.0.1: seq=4 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: seq=5 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: seq=6 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: seq=7 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: seq=8 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: seq=9 ttl=64 time=0.037 ms
...
```

#### Terminal B

```bash
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND            CREATED          STATUS          PORTS     NAMES
8cb4adb41550   alpine    "ping localhost"   19 seconds ago   Up 17 seconds             charming_mestorf

$ docker exec 8cb4adb41550 ls
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

$ docker stop 8cb4adb41550
8cb4adb41550
```

---

## 레디스를 이용한 컨테이너 이해

레디스 서버가 먼저 작동하고 있어야 한다.
그 후 레디스 클라이언트 실행 후 명령어를 레디스 서버에 전달한다.

```text
Redis Client  ------------------->     Redis Server
(redis-cli)    "set value1 hello"   (docker run redis)
```

위와 같이 먼저 레디스 서버를 실행 후,
레디스 클라이언트를 통해서 서버에 명령어를 전달한다.

1.  먼저 첫 번째 터미널 실행 후, 레디스 서버를 작동한다.
    > `docker run redis`
2.  두 번째 터미널에서 레디스 클라이언트를 작동한다.
    > `redis-cli`
3.  하지만 에러가 난다. 무엇이 잘못된 걸까?
    > 아니 맥 환경과 윈도우 환경이 다르다.
    > 우선 [레디스 설치](https://github.com/microsoftarchive/redis)가 필요하다.

### 현재 레디스 클라이언트와 서버 상황

```text
     Redis Client     ---- X --->   Container
   실행하려 하지만                      Redis Server
컨테이너 밖이라 불가능                      running...
```

Redis Client가 Redis Server가 있는 Container 외부에서 접근할 수 없다.
그래서 에러가 나는 원리지만,
Windows 10에서 Redis 설치하고 할 때는 에러가 발생하지 않았다.

에러가 난다는 가정 하에, 이 문제를 해결하기 위해서는
레디스 클라이언트도 컨테이너 안에서 실행한다.

1.  먼저 이전과 똑같이 첫 번째 터미널에서 레디스 서버를 작동한다.
    > `docker run redis`
2.  이제 이전에 배운 `exec` 명령어를 사용한다.
    이미 실행 중인 컨테이너에 명령어를 전달하여 레디스 클라이언트를 실행한다.
    > `docker exec -it <container id> redis-cli`

> 이때 Windows 10에서 redis를 지우고 실행했더니 잘 동작했다.
> 도커의 원리를 생각하면 당연했다.
> 애당초 docker가 하나의 운영체제 위에서 실행되고,
> docker에는 이미 `docker run redis`로 인해 redis가 있을 것이다.
> 그래서 위와 같은 방법으로 redis 설치 없이 redis-cli를 실행할 수 있다.

#### Terminal A

```bash
$ docker run redis
Unable to find image 'redis:latest' locally
latest: Pulling from library/redis
b4d181a07f80: Pull complete                                                        86e428f79bcb: Pull complete                                                        ba0d0a025810: Pull complete                                                        ba9292c6f77e: Pull complete                                                        b96c0d1da602: Pull complete                                                        5e4b46455da3: Pull complete                                                        Digest: sha256:b6a9fc3535388a6fc04f3bdb83fb4d9d0b4ffd85e7609a6ff2f0f731427823e3
Status: Downloaded newer image for redis:latest
1:C 17 Jul 2021 07:38:39.734 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 17 Jul 2021 07:38:39.734 # Redis version=6.2.4, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 17 Jul 2021 07:38:39.734 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
1:M 17 Jul 2021 07:38:39.734 * monotonic clock: POSIX clock_gettime
1:M 17 Jul 2021 07:38:39.735 * Running mode=standalone, port=6379.
1:M 17 Jul 2021 07:38:39.735 # Server initialized
1:M 17 Jul 2021 07:38:39.735 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 17 Jul 2021 07:38:39.735 * Ready to accept connections
```

#### Terminal B

```bash
$ docker exec --help

Usage:  docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

Run a command in a running container

Options:
  -d, --detach               Detached mode: run command in the background
      --detach-keys string   Override the key sequence for detaching a
                             container
  -e, --env list             Set environment variables
      --env-file list        Read in a file of environment variables
  -i, --interactive          Keep STDIN open even if not attached
      --privileged           Give extended privileges to the command
  -t, --tty                  Allocate a pseudo-TTY
  -u, --user string          Username or UID (format:
                             <name|uid>[:<group|gid>])
  -w, --workdir string       Working directory inside the container

$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS      NAMES
10756541a93a   redis     "docker-entrypoint.s…"   20 minutes ago   Up 20 minutes   6379/tcp   wonderful_hugle

$ docker exec -it 10756541a93a redis-cli
127.0.0.1:6379> (성공!)
```

---

## 실행 중인 컨테이너에서 터미널 생활 즐기기

지금까지 실행 중인 컨테이너에 명령어를 전달할 때 다음과 같이 사용했다.

```bash
docker exec -it <container id> <operation>
```

이 방법은 사실 피곤하다.
명령어 하나를 입력할 때마다 위 명령어를 계속 입력한다.

이러한 문제점을 해결하기 위해 컨테이너 안에
Shell이나 Terminal 환경으로 접속할 수 있다.

> ### `sh`

`bash`, `zsh`, `powershell` 등 실행할 수 있는 터미널의 종류가 많지만,
image에 종속되는 경우가 있어 일반적으로 `sh`를 사용한다.

```bash
docker exec -it <container id> sh
```

### 컨테이너를 Shell 환경으로 접근하기

1.  첫 번째 터미널에서 alpine 이미지를 이용하여 컨테이너를 실행한다.
    > `docker run alpine ping localhost`
2.  다른 터미널에서 Operation을 `sh`로 입력하여
    컨테이너 내부에서 터미널 환경을 실행한다.
    > `docker exec -it <container id> sh`
3.  그 안에서 여러 가지 터미널에서 원래 할 수 있는 작동들을 할 수 있다.
    > ``` bash
    > ls                container directory에 있는 내용 확인
    > touch <new-file>  파일 생성
    > export hello=hi   변수 생성
    > echo $hello       변수 출력
    > ```

#### Terminal A

```bash
$ docker run alpine ping localhost
PING localhost (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.027 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.036 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.037 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.042 ms
...
```

#### Terminal B

```bash
$ docker ps
CONTAINER ID   IMAGE     COMMAND            CREATED          STATUS          PORTS     NAMES
792899d2e746   alpine    "ping localhost"   23 seconds ago   Up 22 seconds             determined_ardinghelli

$ docker exec -it 792899 sh
/ #
```

Terminal B에서 `sh`를 빠져나오려면 `ctrl + D`로 빠져나올 수 있다.

### `exec` 대신 `run`으로도 가능하다

```bash
docker run -it <image name> sh
```
