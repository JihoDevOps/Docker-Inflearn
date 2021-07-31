#   간단한 어플을 실제로 배포해보기

## Index

A. [개발 환경 부분](#a-개발-환경-부분)

1. [섹션 설명](#1-섹션-설명)
2. [리액트 앱 설치하기](#2-리액트-앱-설치하기)
3. [도커를 이용하여 리액트 앱 실행하기](#3-도커를-이용하여-리액트-앱-실행하기)
4. [생성된 도커 이미지로 리액트 앱 실행하기](#4-생성된-도커-이미지로-리액트-앱-실행하기)
5. [도커 볼륨을 이용한 소스 코드 변경](#5-도커-볼륨을-이용한-소스-코드-변경)
6. [도커 컴포즈로 좀 더 간단하게 앱 실행하기](#6-도커-컴포즈로-좀-더-간단하게-앱-실행하기)
7. [리액트 앱 테스트하기](#7-리액트-앱-테스트하기)
8. [운영환경을 위한 Nginx](#8-운영환경을-위한-nginx)
9. [운영환경 도커 이미지를 위한 Dockerfile 작성하기](#9-운영환경-도커-이미지를-위한-Dockerfile-작성하기)

B. [테스트 배포 부분](#b-테스트-배포-부분)

1. [섹션 설명 및 Github에 소스 코드 올리기](#1-섹션-설명-및-github에-소스-코드-올리기)
2. [Travis CI 설명](#2-travis-ci-설명)
3. [Travis CI 이용 순서](#3-travis-ci-이용-순서)
4. [travis yml 파일 작성하기 (테스트)](#4-travis-yml-파일-작성하기-테스트)
5. [AWS 알아보기](#5-aws-알아보기)
6. [Elastic Beanstalk 환경 구성하기](#6-elastic-beanstalk-환경-구성하기)
7. [travis yml 파일 작성하기 (배포)](#7-travis-yml-파일-작성하기-배포)
8. [Travis CI의 AWS 접근을 위한 API 생성](#8-travis-ci의-aws-접근을-위한-api-생성)

---

## A. 개발 환경 부분

### 1. 섹션 설명

#### Flow

1.  Develop
2.  Test
3.  Production

---

#### 1. Develop

##### A. React App Develop

1.  React.js 앱 개발
2.  Dockerfile 작성
3.  Docker Compose 파일 작성

##### B. Github Push

1.  Github에 소스를 Push
2.  Feature Branch
3.  Merge Request → Master Branch

---

#### 2. Test

1.  Travis CI에서 Master Branch에 Push된 코드를 가져감
2.  개발된 소스가 잘 작동하는지 Test

---

#### 3. Production

1.  Hosting site(AWS, Azure, Google, ...)

---

### 2. 리액트 앱 설치하기

#### React 설치

```bash
$ npx create-react-app ./
```

#### React 실행

```bash
$ npm run start
```

#### React 테스트

```bash
$ npm run test
```

#### React 빌드

```bash
$ npm run build
```

>   큰 어려움은 없는 부분이다.
>   리액트를 사용하기 위해서는 NodeJS가 설치되어 있어야 한다.
>   `npx create-react-app` 명령어 때문이라고 생각된다.
>   하나씩 입력해보면서 진행하면 되고, 리액트 설치 오래걸린다.

---

### 3. 도커를 이용하여 리액트 앱 실행하기

#### Dockerfile의 종류

이전까지 dockerfile 하나로 진행했다.
하지만 실제 개발 환경에서는 `개발 환경`과 `배포 환경`을 구분한다.
따라서 개발 단계에서는 `dockerfile.dev`를 작성한다.
내용은 기존과 동일하게 작성하면 된다.

```dockerfile
# dockerfile.dev
FROM node:alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "start"]
```

위처럼 작성하고 빌드하면 다음과 같은 메시지가 출력된다.

```bash
$ docker build ./
unable to prepare context: unable to evaluate symlinks in Dockerfile path: CreateFile C:\Dev\Workspace\Inflearn\Docker-Inflearn\single-container-app\Dockerfile: The 
system cannot find the file specified.
```

#### unable to evaluate symlink ...

해당 에러가 발생하는 이유는
이미지를 빌드할 때 해당 디렉터리만 지정하면
dockerfile을 자동으로 찾아서 빌드한다.
하지만 현재 dockerfile은 없고, dockerfile.dev만 존재한다.
즉, 자동으로 dockerfile을 찾지 못해 발생하는 에러다.

해결책은 임의로 빌드 시 어떤 파일을 참조하는지 지정하면 된다.
아래처럼 입력하면 된다.

```bash
$ docker build -f dockerfile.dev .
```

#### tip

Local에는 node_modules 디렉토리가 필요 없다.
그냥 과감히 node_modules 폴더를 지워도 도커에서는 잘 돌아간다.

---

### 4. 생성된 도커 이미지로 리액트 앱 실행하기

---

### 5. 도커 볼륨을 이용한 소스 코드 변경

---

### 6. 도커 컴포즈로 좀 더 간단하게 앱 실행하기

---

### 7. 리액트 앱 테스트하기

---

### 8. 운영환경을 위한 Nginx

---

### 9. 운영환경 도커 이미지를 위한 Dockerfile 작성하기

---

## B. 테스트 배포 부분

### 1. 섹션 설명 및 Github에 소스 코드 올리기
### 2. Travis CI 설명
### 3. Travis CI 이용 순서
### 4. travis yml 파일 작성하기 (테스트)
### 5. AWS 알아보기
### 6. Elastic Beanstalk 환경 구성하기
### 7. travis yml 파일 작성하기 (배포)
### 8. Travis CI의 AWS 접근을 위한 API 생성