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