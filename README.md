## Description

[Nest](https://github.com/nestjs/nest) backend repository.

Click to ckech the [Frontend asociated microservice](https://github.com/Gustavo-Ennes/medicCont-test-frontend).

Database scripts in ```init.sql```

Too see schemas and resolvers, follow the steps and access the [GraphQl Playground](http://localhost:8080/graphql) when system runs.

## Project setup

Install postgres and get your mailtrap api key.

Execute init.sql script in main folder.

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# tests by file path
$ npm run test:path fileName

# e2e tests
$ npm run test:e2e

# tests by file path
$ npm run test:path:e2e fileName

# test coverage
$ npm run test:cov
```

## 🛠️ Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Sequelize**: A powerful ORM for managing relational databases.
- **PostgreSQL**: The primary database used for both development and testing.
- **Apollo GraphQL**: For building and querying a flexible GraphQL API.
- **JWT (JSON Web Tokens)**: For secure authentication and authorization.
- **Mailtrap**: To handle email services during development and testing.
- **2FA (Two-Factor Authentication)**: To ensure secure login and signup processes.
- **Jest**: For unit and end-to-end (e2e) testing.

## Before you begin, ensure you have the following:

- **Node.js** (version 18.x or higher recommended)
- **npm** (comes with Node.js) or **Yarn** (optional)
- **PostgreSQL** (two databases: one for development and one for testing)
- **Mailtrap token api** (go to mailtrap and get your api key)

---

1. **Clone the repository:**

```bash
git clone https://github.com/Gustavo-Ennes/medicCont-test-frontend.git
cd backend-project
```

2. **Install dependencies with npm:**

```bash
  npm install
```

3. **Configure environment variables**

Create a .env file in the project root based on the .env.example file. Ensure the VITE_API_URL variable is set to the correct backend URL.

Example .env file:

```bash
    POSTGRES_HOST=a
    POSTGRES_PORT=s
    POSTGRES_DATABASE=d
    POSTGRES_TEST_DATABASE=f
    POSTGRES_USER=a
    POSTGRES_PASSWORD=d
    JWT_SECRET=a
    MAILTRAP_API_TOKEN=d
```

### Development

To start the development server, use:

```bash
  npm run start:dev
```

This will start the development server at http://localhost:5173.

### Tests

To test all resolvers, use:

```bash
  npm run test
  npm run test:e2e
  npm run test:path
  npm run test:path:e2e
```

To test a single file, depending on the test type:

```bash
  npm run test:path fileName
  npm run test:path:e2e fileName
```

This will start the development server at http://localhost:5173.

## Project structure

The application is divided into two main modules for better separation of concerns:

1. Application Module: Handles core application logic, configuration, and external dependencies like Mailtrap.
2. Domain Module: Encapsulates the business logic and database models.

## Email Service

The project uses Mailtrap for email handling during development and testing.
Emails are sent for the following scenarios:

- Account creation confirmation
- Two-factor authentication (2FA) verification

Note: You must provide a valid MAILTRAP_API_KEY in your .env files to enable email services.
