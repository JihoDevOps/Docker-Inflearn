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