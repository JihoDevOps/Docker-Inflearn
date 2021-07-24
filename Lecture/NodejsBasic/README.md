# 도커를 이용한 간단한 Node.js 어플 만들기

1. [Node.js 앱 만들기](#1-nodejs-앱-만들기)
2. [Dockerfile 작성하기](#2-dockerfile-작성하기)
3. [Package.json 파일이 없다고 나오는 이유](#3-packagejson-파일이-없다고-나오는-이유)
4. [생성된 이미지로 어플리케이션 실행 시 접근이 안 되는 이유](#4-생성된-이미지로-어플리케이션-실행-시-접근이-안-되는-이유)
5. [Working Directory 명시해주기](#5-working-directory-명시해주기)
6. [어플리케이션 소스 변경으로 다시 빌드하는 것에 대한 문제점](#6-어플리케이션-소스-변경으로-다시-빌드하는-것에-대한-문제점)
7. [어플리케이션 소스 변경으로 재빌드 시 효율적으로 하는 법](#7-어플리케이션-소스-변경으로-재빌드-시-효율적으로-하는-법)
8. [Docker Volume에 대하여](#8-docker-volume에-대하여)

---

## 1. Node.js 앱 만들기

### `package.json`

프로젝트의 정보와 프로젝트에서 사용 중인 패키지의 의존성을 관리하는 곳

### `server.js`

시작점(Entry Point)으로서 가장 먼저 시작되는 파일

### `package.json` 만들기

```bash
npm init
```

-   생성한 [`pakage.json`](../nodejs-docker-app-basic/package.json)
    ```json
    {
      "name": "nodejs-docker-app-basic",
      "version": "1.0.0",
      "description": "Docker를 이용한 간단한 Node App",
      "main": "server.js",
      "scripts": {
        "test": "node server.js"
      },
      "dependencies": {
        "express":"4.17.1"
      },
      "author": "jihogrammer",
      "license": "ISC"
    }
    ```

-   생성한 [`server.js`](../nodejs-docker-app-basic/server.js)
    ```js
    const express = require('express');

    const PORT = 8080;

    // App
    const app = express();

    app.get('/', (req, res) => {
        res.send("Hello World");
    });

    // Run
    app.listen(PORT);
    ```

---

## 2. Dockerfile 작성하기

### docker node app image 생성 과정

1.  dockerfile 생성
2.  docker image 생성
3.  임시 container 생성
4.  container에 node app 탑재
5.  container를 image로 빌드

### frame

```dockerfile
FROM    node:10
RUN     npm install
CMD     ["node", "server.js"]
```

#### 왜 저번에는 alpine 베이스 이미지를 썼는데 이번엔 node 이미지를 쓰나요?

먼저 한 번 베이스 이미지를 alpine으로 해서 dockerfile build를 시도하면
`npm not found`에러가 발생한다.
그 이유는 alpine 이미지는 가장 최소한의 경량화된 파일들이 들어있기에
npm을 위한 파일이 들어짔지 않아서 `RUN` 부분에 `npm install`을 할 수 없다.
alpine 이미지의 사이즈는 5 MB 정도 밖에 안 된다.
그러하기에 npm이 들어있는 베이스 이미지를 찾아야 하는데
그것들 중 하나가 node 이미지입니다.

#### `npm install`은 무엇인가요?

-   npm은 Node.js로 만들어진 모듈을 웹에서 받아서 설치하고 관리하는 프로그램이다.
-   `npm install`은 `package.json`에 적혀 있는 종속성을
    웹에서 자동으로 다운받아서 설치해주는 명령어이다.
-   결론적으로는 현재 노드 JS 앱을 만들 때
    필요한 모듈들을 다운받아 설치하는 열할을 한다.

#### `node`, `server`는 무엇인가요?

노드 웹 서버를 작동시키려면 `node + 엔트리 파일`을 입력한다.

> 현재 빌드까지는 성공하지만, 실행에서 에러가 난다.

---

## 3. package.json 파일이 없다고 나오는 이유

> `Node`(Base Image)로 임시 컨테이너를 생성한다.
> 그때 파일 스냅샷들이 임시 컨테이너의 하드디스크 영역으로 복사된다.
> `dockerfile`에서 `npm install` 명령어를 `RUN` 한다.
> 이때 `package.json`이 없다고
> 오류가 발생한다(현재 나는 그런 오류는 없으나 image 실행은 안 되는 상태).
> 이 상황에서 `package.json`이 컨테이너 내부가 아닌 밖에 위치한다.
> 따라서 `npm install`이라는 명령어는 `package.json`이 없다고 오류를 발생시킨다.
> `Node` 이미지 자체에는 `package.json`을 포함하지 않는다.
> `package.json`은 Node Project의 구성파일이지 `Node` 이미지의 파일이 아니다.

### `npm install` 수행 시 에러가 발생하는 이유

-   어플리케이션에 필요한 종속성을 다운받는다.
-   이렇게 다운 시 먼저 `package.json`을 보고,
    그곳에 명시된 종속성(i.e. express)들을 다운받아 설치한다.
-   하지만 `package.json`이 컨테이너 안에 없어 찾을 수 없다는 에러가 발생한다.

### 해결: `COPY`를 이용해 `package.json`을 컨테이너 안으로 넣는다.

```dockerfile
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
```

#### `COPY package.json ./`

-   로컬에 있는 이 파일을 도커 컨테이너의 지정된 장소(`./`)에 복사한다.
-   복사할 파일, 컨테이너 내 파일이 복사될 경로

### Dockerfile 수정

#### 기존

```dockerfile
FROM    node:10
RUN     npm install
CMD     ["node", "server.js"]
```

#### 수정

```dockerfile
FROM    node:10
COPY    package.json ./         # COPY 추가
RUN     npm install
CMD     ["node", "server.js"]
```

#### 빌드

```bash
$ docker build -t jiho/nodejs ./
[+] Building 8.8s (9/9) FINISHED
 => [internal] load build definition from Dockerfile                                                                                    0.0s 
 => => transferring dockerfile: 135B                                                                                                    0.0s 
 => [internal] load .dockerignore                                                                                                       0.0s 
 => => transferring context: 2B                                                                                                         0.0s 
 => [internal] load metadata for docker.io/library/node:10                                                                              2.5s 
 => [auth] library/node:pull token for registry-1.docker.io                                                                             0.0s 
 => [internal] load build context                                                                                                       0.0s 
 => => transferring context: 329B                                                                                                       0.0s 
 => CACHED [1/3] FROM docker.io/library/node:10@sha256:59531d2835edd5161c8f9512f9e095b1836f7a1fcb0ab73e005ec46047384911                 0.0s 
 => [2/3] COPY package.json ./                                                                                                          0.1s 
 => [3/3] RUN npm install                                                                                                               5.9s 
 => exporting to image                                                                                                                  0.2s 
 => => exporting layers                                                                                                                 0.1s 
 => => writing image sha256:e4ee7245b5d599382ed10e25a07e4f250872b93e6e8ba54155b1eac6fc1e70f5                                            0.0s 
 => => naming to docker.io/jiho/nodejs                                                                                                  0.0s 
```

#### 실행

> 여기서도 에러가 발생한다.
> 왜냐하면 `server.js` 파일이 없기 때문이다.

```bash
$ docker run jiho/nodejs
internal/modules/cjs/loader.js:638
    throw err;
    ^

Error: Cannot find module '/server.js'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:636:15)
    at Function.Module._load (internal/modules/cjs/loader.js:562:25)
    at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:623:3)
```

### 해결

우선 server가 실행되는지 확인하기 위해 server.js 수정

```js
const express = require('express');

const PORT = 8080;

// App
const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
});

// Run
app.listen(PORT);
console.log("Server is running..."); // ADD !!!
```

그 후 dockerfile `COPY` 부분 수정

```dockerfile
# Base Image
FROM node:10

# 현재 디렉토리에 있는 모든 파일들을 컨테이너에 복사한다.
COPY ./ ./

RUN npm install

CMD ["node", "server.js"]
```

빌드

```bash
$ docker build -t jiho/nodejs
...(생략)
```

실행

```bash
$ docker run jiho/nodejs
Server is running...
```

하지만, 실제로 `localhost:8080`으로 접속하더라도 제대로 동작하지 않는다.
이유는 다음에 나온다.

---

## 4. 생성된 이미지로 어플리케이션 실행 시 접근이 안 되는 이유

---

## 5. Working Directory 명시해주기

---

## 6. 어플리케이션 소스 변경으로 다시 빌드하는 것에 대한 문제점

---

## 7. 어플리케이션 소스 변경으로 재빌드 시 효율적으로 하는 법

---

## 8. Docker Volume에 대하여

---