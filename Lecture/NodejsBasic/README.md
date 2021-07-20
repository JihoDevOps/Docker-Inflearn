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
