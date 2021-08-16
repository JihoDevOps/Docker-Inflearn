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

1.  `npx create-react-app frontend` 명령어로 프로젝트 생성
2.  frontend의 `App.js`에서 `input`과 `button` 생성
    ```html
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="container">
          <form className="example" onSubmit>
            <input
              type="text"
              placeholder="입력해주세요..."
            />
            <button type="submit">확인</button>
          </form>
        </div>
      </header>
    </div>
    ```
3.  `App.css`에 스타일 추가
    ```css
    .container {
        width: 375px;
    }

    form.example input {
        padding: 10px;
        font-size: 17px;
        border: 1px solid gray;
        float: left;
        width: 74%;
        background: #f1f1f1;
    }

    form.example button {
        float: left;
        width: 20%;
        padding: 10px;
        background: #2196F3;
        color: white;
        font-size: 17px;
        border: 1px solid gray;
        border-left: none;
        cursor: pointer;
    }

    form.example button:hover {
        background: #0b7dda;
    }

    form.example::after {
        content: "";
        clear: both;
        display: table;
    }
    ```
4.  데이터 흐름을 위한 State 생성
    ```js
    // useState를 사용하기 위해 react 라이브러리에서 받아옴
    import React, { useState } from "react";
    import axios from "axios";
    import logo from "./logo.svg";
    import "./App.css";

    function App() {
        // DB의 값을 가져와 화면에 보여주기 위해 State에 준비
        const [list, setList] = useState([]);
        // input 박스에 입력한 값이 이 state에 들어감
        const [value, setValue] = useState("");
        ...
    }
    ```
5.  DB에서 데이터를 가져오기 위해 useEffect 적용
    ```js
    import React, { useState, useEffect } from "react";
    ...
    function App() {
        const [list, setList] = useState([]);
        const [value, setValue] = useState("");
        // 여기서 DB에 있는 값을 읽는다.
        useEffect(() => {
            
        }, [])
    }
    ```
6.  기타 다른 부분 처리하기
    -   `/api/values`
        ```js
        useEffect(() => {
            axios.get("/api/values")
            .then(response => {
                console.log(response);
                setList(response.data);
            });
        }, [])
        ```
    -   `changeHandler`: input 박스에 입력할 때
        `onChange` 이벤트가 발생하면 value State를 변화시킴
        ```js
        const changeHandler = (event) => {
            setValue(event.currentTarget.value);
        };
        ```
        ```html
        <input
            type="text"
            placeholder="입력해주세요..."
            onChange={changeHandler}
        />
        ```
    -   `submitHandler`: input 박스에 입력이 되면...
        ```js
        const submitHandler = (event) => {
            event.preventDefault();
            axios.post("/api/value", {value: value})
                .then(response => {
                    if (response.data.success) {
                        console.log(response);
                        setList([...list, response.data]);
                        setValue("");
                    } else {
                        alert("데이터 DB 저장을 실패했습니다.")
                    }
                });
        };
        ```
        ```js
        // 확인 버튼 클릭 시 이벤트 호출
        <form className="example" onSubmit={submitHandler}>
        ```
    -   list 목록 렌더링
        ```js
        { list && list.map((tuple, index) => (
            <li key={index}>{tuple.value}</li>
        ))}
        ```
    -   input 박스 변수에 매핑
        ```js
        // onChange: 값 입력할 때마다 이벤트 발생
        // value: State의 value로 컨트롤
        <input
            type="text"
            placeholder="입력해주세요..."
            onChange={changeHandler}
            value={value}
        />
        ```

### 4. 리액트 앱을 위한 도커 파일 만들기

1.  frontend 폴더에 dockerfile 생성
2.  `dockerfile.dev`
    ```dockerfile
    # 베이스이미지를 도커허브에서 가져온다.
    FROM node:alpine
    # 해당 앱의 소스코드들이 위치하게 될 디렉토리
    WORKDIR /app
    # 소스코드가 바뀔 때마다 종속성까지 다시 복사하는 것을 막음
    COPY package.json .
    # 먼저 종속성을 다운받고 나머지 파일들을 복사
    RUN npm install
    # 종속성을 제외한 나머지 파일 복사
    COPY . .
    # 컨테이너 실행 시 사용할 명령어
    CMD ["npm", "run", "start"]
    ```
3.  `dockerfile`
    ```dockerfile
    # Nginx가 제공할 빌드된 파일들을 생성
    FROM node:alpine as builder
    WORKDIR /app
    COPY package.json .
    RUN npm install
    COPY . .
    RUN npm run build

    # Nginx로 위 stage에서 생성한 파일들을 제공
    # default.conf 설정을 Nginx 컨테이너 안에 복사하여 설정 변경
    FROM nginx
    EXPOSE 3000
    COPY ./nginx/default.conf /etc/nginx/conf.d/defalut.conf
    COPY --from=builder /app/build /usr/share/nginx/html
    ```

#### Nginx

현재 여기서 다루는 Nginx는 Proxy 서버가 아닌
React를 위한 Nginx 서버에 대한 설정이다.
`nginx/default.conf`에 대한 설명은 다음과 같다.

```bash
server {
  listen 3000;

  # "/" 요청으로 들어올 경우
  location / {
    # HTML 파일이 위치할 Root Directory 설정
    root /usr/share/nginx/html;
    # 사이트의 index 페이지로 설정할 파일명 설정
    index index.html index.htm;
    # React Router를 사용하여 페이지 간 이동 설정
    try_files $uri $uri/ /index.html;
  }
}
```

`try_files $uri $uri/ /index.html;`은 React를 위한 설정이다.
React는 SPA 기반의 FrontEnd Library로
index.html 하나의 정적 파일을 가진다.
만약 다른 uri로 접근 시도 시 nginx는 제대로 라우팅할 수 없다.
따라서 React에서 설정하지 않은 url 요청이 들어올 경우
예외 처리로 임의로 메인페이지로 이동하게 하는 설정이다.

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
