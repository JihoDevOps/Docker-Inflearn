# 직접 도커 이미를 만들어 보기

1. [도커 이미지 생성하는 순서](#1-도커-이미지-생성하는-순서)
2. [Dockerfile 만들기](#2-dockerfile-만들기)
3. [도커 파일로 도커 이미지 만들기](#3-도커-파일로-도커-이미지-만들기)
4. [내가 만든 이미지 기억하기 쉬운 이름 주기](#4-내가-만든-이미지-기억하기-쉬운-이름-주기)

---

## 1. 도커 이미지 생성하는 순서

> 현재까지 도커 이미지를 항상 도커 허브에 있는 것을 사용했다.
> 하지만 직접 도커 이미지를 만들어서 사용할 수 있고,
> 직접 만든 도커 이미지를 도커 허브에 올려서 공유할 수 있다.
> 그래서 어떻게 직접 이미지를 만들 수 있는지 알아보자.

### 간단하게 도커 이미지 다시 복습하기

1.  도커 이미지는 컨테이너를 만들기 위해 필요한 설정이나 종속성들을 갖고 있는
    소프트웨어 패키지다.
2.  지금까지 해왔듯이 도커 이미지는 Docker Hub에
    이미 다른 사람들이 만들어 놓은 것을 이용할 수도 있으며,
    직접 도커 이미지를 만들어 사용할 수도 있고,
    직접 만든 것을 Docker Hub에 업로드도 할 수 있다.

```bash
docker create <image name>
```

### 도커 이미지 생성하는 순서

1.  Dockerfile 작성
    > Dockerfile이란 Docker Image를 만들기 위한 설정 파일이다.
    > 컨테이너가 어떻게 행동해야 하는지 설정들을 정의한다.
2.  도커 클라이언트
    > 도커 파일에 입력된 것들이 도커 클라이언트에 전달된다.
3.  도커 서버
    > 도커 클라이언트에 전달된 모든 중요한 작업을 하는 곳이다.
4.  이미지 생성

---

## 2. Dockerfile 만들기

### Dockerfile이란?

도커 이미지를 만들기 위한 설정 파일이며,
컨테이너가 어떻게 행동해야 하는지 설정들을 정의한다.

### Dockerfile 만드는 순서

> ###### 도커 이미지가 필요한 것이 무엇인지 생각하기

1.  베이스 이미지를 명시한다(파일 스냅샷에 해당).
2.  추가적으로 필요한 파일을 다운받기 위한
    몇 가지 명령어를 명시한다(파일 스냅샷에 해당).
3.  컨테이너 시작 시 실행될 명령어를 명시한다(시작 시 실행될 명령어에 해당).

-   Docker Image
    -   시작 시 실행될 명령어
        > `run kakaotalk`
    -   파일 스냅샷(카카오톡 파일)

### 베이스 이미지는 무엇인가?

도커 이미지는 여러 개의 레이어로 되어 있다.
그 중에서 베이스 이미지는 이 이미지의 기반이 되는 부분이다.

레이어는 중간 단계의 이미지라고 생각하면 된다.

```bash
IMAGE-------------+   만약 이미지에 무엇을 추가한다면?
| +-------------+ |   아래 레이어가 추가 된다. -> 레이어 캐싱
| |    Layer    | |       +----------+
| +-------------+ | <---- |   Layer  |
| +-------------+ |       +----------+
| |    Layer    | |
| +-------------+ |
| +-------------+ |
| | Base  Image | | : OS라고 생각하면 된다.
| +-------------+ |   Windows, MacOS, Linux 등
+-----------------+
```

### 실제로 만들면서 배우기

#### 목표 : "Hello"  출력하기

#### 순서

1.  도커 파일을 만들 폴더 하나 생성한다(i.e. dockerfile-folder).
2.  도커 파일 폴더를 에디터를 이용해 실행한다(VSCODE 추천).
3.  파일 하나 생성, 이름은 dockerfile로 한다.
4.  그 안에 먼저 어떻게 진행해 나갈지 기본 토대를 명시한다.
5.  이제 베이스 이미지부터 실제 값으로 추가한다.
6.  베이스 이미지는 ubuntu를 써도 되고 centos 등을 사용해도 되지만,
    hello를 출력하는 기능은 굳이 사이즈가 큰 베이스 이미지를 쓸 필요가 없으므로
    사이즈가 작은 alpine 베이스 이미지를 사용한다.
7.  hello 문자를 출력하기 위해 `echo`를 사용한다.
    이미 alpine 안에 echo 사용이 가능한 파일이 존재하므로 `RUN` 부분은 생략한다.
8.  마지막으로 컨테이너 시작 시 실행될 명령어 `echo hello`를 작성한다.

#### dockerfile

> ###### 다음은 dockerfile의 기본적인 뼈대이다.

```dockerfile
# 베이스 이미지를 명시한다.
FROM baseImage

# 추가적으로 필요한 파일들을 다운로드 한다.
RUN command

# 컨테이너 시작 시 실행 될 명령어를 명시한다.
CMD ["executable"]
```

#### Operation

1.  `FROM`
    > 이미지 생성 시 기반이 되는 이미지 레이어이다.  
    > `<이미지 이름>ㅣ<:태그>` 형식으로 작성한다.
    > 태그(version)를 안 붙이면 자동적으로 가장 최신 것으로 다운로드한다.
    >
    > i.e. `ubuntu:14.04`
2.  `RUN`
    > 도커 이미지가 생성되기 전에 수행할 Shell 명령어
3.  `CMD`
    > 컨테이너가 시작할 때 실행할 실행 파일 또는 Shell 스크립트이다.
    > 해당 명령어는 dockerfile 내 1번만 사용한다.

#### [dockerfile](dockerfile-folder/dockerfile)

```dockerfile
# Base Image는 간단하게 alpine으로 수행한다.
FROM alpine

# alpine에 필요한 기능이 준비되어 있으므로 생략한다.
# RUN command

# "hello"를 출력한다.
CMD ["echo", "hello"]
```

---

## 3. 도커 파일로 도커 이미지 만들기

### dockerfile을 Image로 생성하는 과정

1. dockerfile
2. docker client
3. docker server
4. image

도커 파일에 입력된 것들이 도커 클라이언트에 전달되어서 도커 서버가 인식하게 한다.
이를 위해 `docker build ./` 또는 `docker build .` 명령어로 빌드한다.

### `Build`

-   해당 디렉토리 내 dockerfile을 찾아 도커 클라이언트에 전달한다.
-   `docker build` 뒤에는 dockerfile 경로를 명시한다.

### 빌드 과정

1.  Alpine 이미지를 가져온다.
    > 여러 레이어가 존재한다.
    > 시작 시 실행될 명령어, 파일 스냅샷 등
2.  임시 컨테이너를 생성한다.
    > 아직 시작 시 실행할 명령어가 없다.
    > 하드디스크에 파일 시스템 스냅샷(이미지 레이어에 있던)을 추가한다.
3.  임시 컨테이너에서 시작 시 실행될 명령어를 생성한다.
    > 이 시점에서 임시 컨테이너는 완성이 된다.
4.  임시 컨테이너로 이미지를 생성하고, 임시 컨테이너는 삭제한다.

### 빌드 진행

```bash
$ docker build .
[+] Building 0.1s (5/5) FINISHED
 => [internal] load build definition from Dockerfile                                                0.0s
 => => transferring dockerfile: 32B                                                                 0.0s
 => [internal] load .dockerignore                                                                   0.0s
 => => transferring context: 2B                                                                     0.0s
 => [internal] load metadata for docker.io/library/alpine:latest                                    0.0s
 => CACHED [1/1] FROM docker.io/library/alpine                                                      0.0s
 => exporting to image                                                                              0.0s
 => => exporting layers                                                                             0.0s
 => => writing image sha256:700d6646badf50c893acf603ca95fcc2a57017d8cf0823e802ffdb7304f41788        0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

> 이유는 모르겠으나 강의에서와 인터넷에서 빌드 과정 로그가 많이 다르다.
> 뭐가 잘못됐나 생각했으나, `docker images`를 입력해서 이미지가 생성을 확인했다.
> 원인은 모르겠지만, 우선 image 생성 원리를 이해하고 넘어가자.

docker의 실행 순서를 생각했을 때, Image가 있어야 Container를 생성할 수 있다.
그러나 `build`에서는 순서가 반대다.
우선 생성하고자 하는 이미지의 토대가 되는 Base Image를 임시 Container에 올린다.
그 다음 생성하고자 하는 Image 파일(dockerfile)을 Container에 올린다.
그 후 임시 Container를 역으로 Image로 생성한다.

> 이 맥락이 맞는지 확실하지는 않지만, 현재까지 이해한 바로는 그렇다.

### 결론

Base Image에서 다른 종속성이나 새로운 커맨드를 추가할 때,
임시 Container 생성 후 그 Container를 토대로 새로운 Image를 만든다.
그리고 그 임시 컨테이너는 지운다.

```bash
Base Image ----->   Intermediate Container   -----> New Image
             add (new command, new file snapshot)
```

---

## 4. 내가 만든 이미지 기억하기 쉬운 이름 주기

```bash
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
redis         latest    08502081bff6   3 weeks ago    105MB
alpine        latest    d4ff818577bc   4 weeks ago    5.6MB
<none>        <none>    700d6646badf   4 weeks ago    5.6MB
hello-world   latest    d1165f221234   4 months ago   13.3kB

$ docker run -it 700d6646badf
hello
```

위 처럼 잘 실행된 것을 볼 수 있다. 하지만 이미지에 이름을 주고 싶다.
그럴 경우 다음과 같이 `build`를 진행한다.

```bash
docker build -t <my-id>/<repo/pjt name>:<tag/version> .(dir)

# i.e.
docker build -t jiho/hello:0.1 .
```

```bash
$ docker build -h
Flag shorthand -h has been deprecated, please use --help

Usage:  docker build [OPTIONS] PATH | URL | -

Build an image from a Dockerfile

Options:
      --add-host list           Add a custom host-to-IP mapping (host:ip)
      --build-arg list          Set build-time variables
      --cache-from strings      Images to consider as cache sources
      --disable-content-trust   Skip image verification (default true)
  -f, --file string             Name of the Dockerfile (Default is
                                'PATH/Dockerfile')
      --iidfile string          Write the image ID to the file
      --isolation string        Container isolation technology
      --label list              Set metadata for an image
      --network string          Set the networking mode for the RUN
                                instructions during build (default "default")
      --no-cache                Do not use cache when building the image
  -o, --output stringArray      Output destination (format:
                                type=local,dest=path)
      --platform string         Set platform if server is multi-platform
                                capable
      --progress string         Set type of progress output (auto, plain,
                                tty). Use plain to show container output
                                (default "auto")
      --pull                    Always attempt to pull a newer version of
                                the image
  -q, --quiet                   Suppress the build output and print image
                                ID on success
      --secret stringArray      Secret file to expose to the build (only
                                if BuildKit enabled):
                                id=mysecret,src=/local/secret
      --ssh stringArray         SSH agent socket or keys to expose to the
                                build (only if BuildKit enabled) (format:
                                default|<id>[=<socket>|<key>[,<key>]])
  -t, --tag list                Name and optionally a tag in the
                                'name:tag' format
      --target string           Set the target build stage to build.
```

build 옵션을 살펴보면 `-t`는 태그를 의미하는 것을 알 수 있다.
tag(version)를 입력하는데, 이름을 붙일 수 있다는 설명이다.

### Naming Build

```bash
$ docker build -t jiho/hello:latest .
[+] Building 0.1s (5/5) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                                                          0.0s
 => => transferring dockerfile: 32B                                                                                                                                                                           0.0s
 => [internal] load .dockerignore                                                                                                                                                                             0.0s
 => => transferring context: 2B                                                                                                                                                                               0.0s
 => [internal] load metadata for docker.io/library/alpine:latest                                                                                                                                              0.0s
 => CACHED [1/1] FROM docker.io/library/alpine                                                                                                                                                                0.0s
 => exporting to image                                                                                                                                                                                        0.0s
 => => exporting layers                                                                                                                                                                                       0.0s
 => => writing image sha256:700d6646badf50c893acf603ca95fcc2a57017d8cf0823e802ffdb7304f41788                                                                                                                  0.0s
 => => naming to docker.io/jiho/hello:latest
```

#### 실행 결과

```bash
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
redis         latest    08502081bff6   3 weeks ago    105MB
jiho/hello    latest    700d6646badf   4 weeks ago    5.6MB
alpine        latest    d4ff818577bc   4 weeks ago    5.6MB
hello-world   latest    d1165f221234   4 months ago   13.3kB

$ docker run jiho/hello
hello
```

위와 같이 잘 실행된 것을 확인할 수 있다.

---

docker를 학습하면서 CLI 환경에서 엄청난 걸 하고 있는데,
Linux 명령어 등을 이제는 배우고 싶다는 생각이 든다.

현재까지 제일 드는 생각은 docker에 windows를 올려두고,
MacOS에서 Windows 파일을 실행할 수 있을지가 제일 궁금하다.
Mac에서 포켓몬스터를 돌린다거나, VSCODE를 돌린다거나.
가능하다면, Docker Hub에 내 Docker Image를 올리고,
웹과 같은 환경에서 IDE를 돌릴 수 있을까?