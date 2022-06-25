
## Sinai Backend Challenge API

Tech Stack: [Node.js](https://nodejs.org/en/docs/), [Typescript](https://www.typescriptlang.org/docs/), [Nest.js](https://docs.nestjs.com/), [PostgreSQL](https://www.postgresql.org/docs/)

## Requirements

* Node v16.13.2 or higher
* Docker and docker compose


## Run Application Locally

```bash
$ git clone
```
```bash
$ npm install
```
```bash
$ docker compose up 
this will start postgres and adminer on local containers
adminer is lighwheight DBMS that runs on browser
```
```bash
-> access adminer on your localhost:8080

* server: db
* username: pgsql
* password: pgsql
* leave the database field empty
(you may change these values on docker-compose.yml following your preferences)

-> create a database with the name of your preference and leave it empty 
```

```bash
-> create a .env file on project root following .env.example model and fill
the placeholders with the same values above
```
```bash
$ node src/scripts/create-schema.js
this will create the database schema
```

```bash
-> paste a file named "data.csv" (with all data you want to load into the database) 
inside the folder src/scripts/load-db-data-from-csv and then run

$  node src/scripts/load-db-data-from-csv/load-db-data-from-csv.js

this will load all your data into the database
```
```bash
$ npm run start:dev
```
## API Docs
[Swagger] http://localhost:300/api-docs


## Tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Linter and formatting

```bash
# find problems
$ npm run lint

# find and fix problems automatically
$ npm run lint:fix

# format code
$ npm run format
```
## Folder Structure

```
> src
  > core                            (files that are used all over the API)
     > error                        (files to do the error handling and format API errors)
     > request-interceptor          (Nest.js interceptor to catch errors and do API logging)
     > sinai-api-validation.pipe.ts (Nest.js pipe to validate DTOs)
     > swagger-response.ts          (abstraction to add and reuse swagger responses)
  
  > modules
    > business-entity   (module, controller and service to perform operations on business entity)
    > database          (module and service to perform operations on database using pg lib)
    
  > querys              (contains all the SQL that can be executed on this API, used on modules)
  > scripts             (scripts to create schema and load data into the database)
  > typings             (contains all the API typings)
  
  > test
    > integration      (integration tests mocking the database)
    > mocks            (mocks used all over the tests using builder pattern)
    > unit             (unit tests)
    
  
  
```
