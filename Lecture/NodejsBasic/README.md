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
