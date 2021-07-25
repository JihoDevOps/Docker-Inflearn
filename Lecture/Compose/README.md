# Docker Compose

## Index

1. [Docker Compose란 무엇인가?](#1-docker-compose란-무엇인가)
2. [애플리케이션 소스 작성하기](#2-애플리케이션-소스-작성하기)
3. [Dockerfile 작성하기](#3-dockerfile-작성하기)
4. [Docker Containers 간 통신할 때 나타나는 에러](#4-docker-containers-간-통신할-때-나타나는-에러)
5. [Docker Compose 파일 작성하기](#5-docker-compose-파일-작성하기)
6. [Docker Compose로 컨테이너를 멈추기](#6-docker-compose로-컨테이너를-멈추기)

---

## 1. Docker Compose란 무엇인가?

Docker Compose는 다중 컨테이너 도커 애플리케이션을 정의하고 실행하기 위한 도구이다.

### Docker Compose로 애플리케이션 제작 개요

페이지를 리프레쉬했을 때 숫자 0부터 1씩 계속 올라가는 간단한 앱을 만들며 학습한다.

---

## 2. 애플리케이션 소스 작성하기

### Redis

>   Redis(REmote Dictionary Server)는 메모리 기반의
>   키-값 구조 데이터 관리 시스템이다.
>   모든 데이터를 메모리에 저장하고 빠르게 조회할 수 있는
>   비관계형 데이터베이스(NoSQL)이다.

#### 레디스를 쓰는 이유

>   메모리에 저장을 하기 떄문에 MySQL 같은 데이터베이스에 데이터를 저장하는 것과
>   데이터를 불러올 때 훨씬 빠르게 처리할 수 있다.
>   비록 메모리에 저장하지만 영속적으로도 보관이 가능하다.
>   그래서 서버를 재부팅해도 데이터를 유지할 수 있는 장점이 있다.

### Node.js 환경에서 Redis 사용 방법

-   먼저 redis-server를 작동한다.
-   redis 모듈을 다운받는다.
-   redis 모듈을 받은 후 redis client를 생성하기 위해
    Redis에서 제공하는 createClient() 함수를 이용하여
    redis.createClient로 레디스 클라이언트를 생성한다.
-   여기서 redis server가 작동하는 곳과 Node.js 앱이 작동하는 곳이 다르다면
    host 인자와 port 인자를 명시해야 한다.
-   ex)
    ```js
    const client = redis.createClient({
        host: "https://redis-server.com",
        port: 6379
    });
    ```
-   만약 redis server가 작동하는 곳이 `redis-server.com`이라면
    host 옵션을 위처럼 주면 된다.
-   레디스의 기본 포트는 `6379`번이다.

### 도커 환경에서 레디스 클라이언트 생성 시 주의사항

보통 도커를 사용하지 않는 환경에서는
Redis 서버가 작동하고 있는 곳의 host 옵션을 URL로 위처럼 주면 된다.
하지만 도커 Compose 환경에서는
host 옵션을 **`docker-compose.yml`에 명시한 Container 이름**으로 준다.

```js
const client = redis.createClient({
    host: "redis-server", // Container name
    port: 6379
});
```

### 실제로 노드 앱에 레디스로 간단한 기능 구현하기

>   페이지를 리프레시 했을 때 숫자 0부터 1씩 증가하는 기능

```js
// 숫자는 0부터 시작
client.set("number", 0);

app.get('/', (req, res) => {
    client("number", (err, number) => {
        // 현재 숫자를 가져온 후 1씩 증가
        client.set("number", parseInt(number) + 1);
        res.send("숫자가 1씩 증가한다. 숫자: " + number);
    })
})
```

---

## 3. Dockerfile 작성하기

Node.js를 위한 이미지를 만들기 위해 dockerfile을 작성한다.
저번에 만든 node basic app에서 작성한 것과 동일하게 작성한다.

##### 저번에 작성한 dockerfile

```dockerfile
# Base Image
FROM node

# Working Directory
WORKDIR /usr/src/app

# 우선 node module들을 다운받는다.
# 이때 종속성에 대한 변동사항이 없었다면,
# 캐시되어 있는 이미지로 인해 속도가 개선된다.
COPY package*.json ./

RUN npm install

# 현재 디렉토리에 있는 모든 파일들을 컨테이너에 복사한다.
COPY ./ ./

CMD ["node", "server.js"]
```

### dockerfile

```dockerfile
FROM    node:10
WORKDIR /usr/src/app
COPY    ./ ./
RUN     npm install
CMD     ["node", "server.js"]
```

---

## 4. Docker Containers 간 통신할 때 나타나는 에러

---

## 5. Docker Compose 파일 작성하기

---

## 6. Docker Compose로 컨테이너를 멈추기
