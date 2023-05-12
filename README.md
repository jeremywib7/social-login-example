# Social Login Example
This project demonstrates the implementation of security using NextJS 13.3.0 and Spring Boot 3.0. It includes the following features:

## Features
* User registration and login with JWT authentication, Google and Facebook
* Password encryption using BCrypt
* Role-based authorization with Spring Security
* Customized access denied handling
* Logout mechanism


## Configuration Files
Create .env file in social-login-portal/.env

```
NEXTAUTH_SECRET=yoursecretkey
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=yourrecaptchasitekey
NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=yourrecaptchasecretkey
NEXT_PUBLIC_GOOGLE_ID=yourgoogleid
NEXT_PUBLIC_GOOGLE_SECRET=GOCSPX-yourgooglesecret
NEXT_PUBLIC_FACEBOOK_ID=yourfacebookid
NEXT_PUBLIC_FACEBOOK_SECRET=yourfacebooksecret
```
Create application.yaml file in social-login-demo/src/main/resources/application.yml
```
production: false
google-client-id: YOUR_GOOGLE_CLIENT_ID
facebook:
  app:
    id: YOUR_FACEBOOK_ID
    secret: YOUR_FACEBOOK_SECRET

spring:
  config:
    import: optional:secret.properties
  datasource:
    url: jdbc:postgresql://localhost:7777/social-login
    username: YOUR_DATABASE_USERNAME
    password: YOUR_DATABASE_PASSWORD
    hikari:
      max-lifetime: 1800000
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    database: postgresql
    database-platform: org.hibernate.dialect.PostgreSQLDialect

  mail:
    frontend-verify-page: "email-verify"
    username: YOUR_MAILDEV_USERNAME
    password: YOUR_MAILDEV_PASSWORD
    port: YOUR_MAILDEV_PORT (DEFAULT: 1025)
    host: localhost
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

recaptcha:
  enable: false
  verify-url: https://www.google.com/recaptcha/api/siteverify
  secret-key: YOUR_RECAPTCHA_SECRET_KEY

application:
  security:
    jwt:
      secret-key: YOUR_SECRET_KEY
      expiration: 60000 # 86400000 # a day
      refresh-token:
        expiration: 604800000 # 7 days


```

## Technologies
* Spring Boot 3.0
* Spring Security
* JSON Web Tokens (JWT)
* BCrypt
* Maven
* NextJS 13.3.0
* Recaptcha 3
* Primereact
* NextAuthJS 4.22.1
 
## Getting Started
To get started with this project, you will need to have the following installed on your local machine:

* JDK 17+
* Maven 3+
* NodeJS 16+

To build and run the project, follow these steps:

* Clone the repository: `git clone https://github.com/ali-bouali/spring-boot-3-jwt-security.git`
* Navigate to the project directory: cd spring-boot-security-jwt
* Build the project: mvn clean install
* Run the project: mvn spring-boot:run 

-> The application will be available at http://localhost:8080.
