# 복잡한 어플을 실제로 배포해보기

## Index

A. [개발 환경 부분](#a-개발-환경-부분)

1.  [섹션 설명](#1-섹션-설명)
2.  [Node JS 구성하기](#2-node-js-구성하기)
3.  [React JS 구성하기](#3-react-js-구성하기)
4.  [리액트 앱을 위한 도커 파일 만들기](#4-리액트-앱을-위한-도커-파일-만들기)
5.  [노드 앱을 위한 도커 파일 만들기](#5-노드-앱을-위한-도커-파일-만들기)
6.  [DB에 관해서](#6-db에-관해서)
7.  [MySQL을 위한 도커 파일 만들기](#7-mysql을-위한-도커-파일-만들기)
8.  [Nginx를 위한 도커 파일 만들기](#8-nginx를-위한-도커-파일-만들기)
9.  [Docker Compose 파일 작성하기](#9-docker-compose-파일-작성하기)
10. [Docker Volume을 이용한 데이터 베이스 데이터 유지하기](#10-docker-volume을-이용한-데이터-베이스-데이터-유지하기)

B. [테스트 배포 부분](#b-테스트-배포-부분)

1.  [섹션 설명 (테스트 배포)](#1-섹션-설명-테스트-배포)
2.  [도커 환경의 MySQL 부분 정리하기](#2-도커-환경의-mysql-부분-정리하기)
3.  [GitHub에 소스 코드 올리기](#3-github에-소스-코드-올리기)
4.  [Travis CI Steps](#4-travis-ci-steps)
5.  [travis yml 파일 작성하기](#5-travis-yml-파일-작성하기)
6.  [Dockerrun.aws.json에 대하여](#6-dockerrun-aws-json에-대하여)
7.  [Dockerrun.aws.json 파일 작성하기](#7-dockerrun-aws-json-파일-작성하기)
8.  [다중 컨테이너 앱을 위한 Elastic Beanstalk 환경 생성](#8-다중-컨테이너-앱을-위한-elastic-beanstalk-환경-생성)
9.  [VPC 설정하기](#9-vpc-설정하기)
10. [MySQL을 위한 AWS RDS 생성하기](#10-mysql을-위한-aws-rds-생성하기)
11. [Security Group 생성하기](#11-security-group-생성하기)
12. [Security Group 적용하기](#12-security-group-적용하기)
13. [EB와 RDS 소통을 위한 환경 변수 설정하기](#13-eb와-rds-소통을-위한-환경-변수-설정하기)
14. [travis.yml 파일 작성하기 (배포 부분)](#14-travis-yml-파일-작성하기-배포-부분)
15. [Travis CI의 AWS 접근을 위한 API Key 생성](#15-travis-ci의-aws-접근을-위한-api-key-생성)

---

## A. 개발 환경 부분

### 1. 섹션 설명

이전에 React 하나로 개발했다.
이제 React뿐만 아니라
Node.js, MySQL 및 Nginx를 적용한 애플리케이션을 작성한다.

Nginx의 Proxy 기능을 사용하여 설계한다.
단순 정적 파일로 제공하고 포트 분할을 통해 제작하는 간단한 방법이 있으나,
그 방법은 단순하고 지금이라도 할 수 있을 것이다.
Nginx의 Proxy를 사용하면서 Apache Tomcat과의 차이점도 생각하자.

Client와 Application 사이에 Proxy Nginx(port 80)을 두어,
Client의 요청은 Proxy 서버가 받아 로드 밸런싱과 유사한 기능을 구현한다.
이 경우 port 매핑을 따로 해줄 필요가 없다.
하지만 Proxy 서버를 사용한다는 것부터 환경 설정이 다소 복잡하다.

### 2. Node JS 구성하기

1.  `npm init`으로 backend 폴더에 Project를 생성한다.
2.  `package.json` 파일을 수정한다.
    ```json
    {
      "name": "backend",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node server.js",
        // nodemon을 이용하여 express 서버를 시작할 떄 사용
        "dev": "nodemon server.js"
      },
      "author": "jihogrammer",
      "license": "ISC",
      "dependencies": {
        "express": "^4.16.3",
        "mysql": "^2.16.0",
        "nodemon": "^1.18.3",
        // Client에서 오는 요청의 본문을 해석하는 미들웨어
        "body-parser": "^1.19.0"
      }
    }
    ```
3.  `server.js` 작성
    ```js
    // 필요한 모듈들을 가져오기
    const expresss = require("express");
    const bodyParser = require("body-parser");

    // express 서버 생성
    const app = expresss();

    // JSON 형태로 오는 요청의 본문을 해석할 수 있게 설정
    app.use(bodyParser.json());

    app.listen(5000, () => {
        console.log("애플리케이션이 5000번 포트에서 시작되었습니다.");
    });
    ```
4.  `db.js` 작성하고 `server.js`에 등록
    ```js
    const mysql = require("mysql");
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: "mysql",
        user: "root",
        password: "1234",
        database: "myapp"
    });

    exports.pool = pool;
    ```
    ```js
    ...
    const bodyParser = require("body-parser");

    const db = require("./db");

    const app = expresss();
    ...
    ```
5.  애플리케이션에 필요한 두 가지 API 작성
    ```js
    // DB list 테이블에 있는 모든 데이터를 프론트에 보낸다.
    app.get("/api/values", function (req, res) {
        // DB에서 모든 정보 가져오기
        db.pool.query("SELECT * FROM list;",
            (err, results, fields) => {
                if (err) return res.status(500).send(err);
                return res.json(results)
            })
    });

    // Client에서 입력한 값을 DB에 Insert
    app.post("/api/value", (req, res, next) => {
        db.pool.query(`INSERT INTO list (value) VALUES("${req.body.value}")`,
            (err, results, fields) => {
                if (err) return res.status(500).send(err);
                return res.json({ success: true, value: req.body.value });
            })
    });
    ```

### 3. React JS 구성하기
### 4. 리액트 앱을 위한 도커 파일 만들기
### 5. 노드 앱을 위한 도커 파일 만들기
### 6. DB에 관해서
### 7. MySQL을 위한 도커 파일 만들기
### 8. Nginx를 위한 도커 파일 만들기
### 9. Docker Compose 파일 작성하기
### 10. Docker Volume을 이용한 데이터 베이스 데이터 유지하기

---

## B. 테스트 배포 부분

### 1. 섹션 설명 (테스트 배포)
### 2. 도커 환경의 MySQL 부분 정리하기
### 3. GitHub에 소스 코드 올리기
### 4. Travis CI Steps
### 5. travis yml 파일 작성하기
### 6. Dockerrun aws json에 대하여
### 7. Dockerrun aws json 파일 작성하기
### 8. 다중 컨테이너 앱을 위한 Elastic Beanstalk 환경 생성
### 9. VPC 설정하기
### 10. MySQL을 위한 AWS RDS 생성하기
### 11. Security Group 생성하기
### 12. Security Group 적용하기
### 13. EB와 RDS 소통을 위한 환경 변수 설정하기
### 14. travis yml 파일 작성하기 (배포 부분)
### 15. Travis CI의 AWS 접근을 위한 API Key 생성
