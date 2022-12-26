## Currency Conversion API

Tech Stack: [Node.js](https://nodejs.org/en/docs/), [Typescript](https://www.typescriptlang.org/docs/), [Nest.js](https://docs.nestjs.com/), [MongoDB](https://www.mongodb.com/docs/)

## Endpoints

**POST/ currency** -> create currencies

**DELETE/ currency/{symbol}** -> remove currencies

**GET/ currency-conversion** -> execute conversion between various currencies

## Requirements

- Node v16.13.2 or higher
- Docker and docker compose

## Run Application Locally

```bash
$ git clone
```

```bash
$ npm install
```

```bash
$ docker compose up mongodb

- this will start the database on local container
- use your preferred DBMS (ex.: MongoDB Compass) or command line to create a database called "currencies". It is not necessary to create any collection, this will happen automatically on application start.
```

```bash
-> create a .env file on project root. Copy values from .env.example file. The value for CONVERSION_API_KEY will be sent by email.
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

The API design follows the basic Nest.js structure with modules, controllers and services. Clients are used to interact with external APIs. Nest.js interceptors are used to monitor the request flow, catch errors and log operations. Nest.js validation pipes are used to validate input to API endpoints.

This project was created from a [boilerplate](https://github.com/hpsmatheus/nestjs-boilerplate), made by the same author: [hpsmatheus](https://github.com/hpsmatheus). The boilerplate contains error handling & logging structure, input validation structure, swagger config, linting config, pre-commit actions, basic test mocks and project configurations in general.

```
> src
  > clients                         (clients to interact with external APIs)
  > core                            (files that are used all over the API)
     > error                        (files to do the error handling and format API errors)
     > request-interceptor          (Nest.js interceptor to catch errors and do API logging)
     > api-validation.pipe.ts       (Nest.js pipe to validate DTOs)
     > swagger-response.ts          (abstraction to add and reuse swagger responses)

  > modules                         (the modules of the application separated by domain, ex.: currency)


  > typings                         (contains all the API typings)
  > main.ts                         (application entrypoint)

> test
  > integration                     (integration tests mocking db and external APIs)
  > mocks                           (mocks used all over the tests)
  > unit                            (unit tests)

```

## Currency Conversion

This project uses [CryptoCompare](https://min-api.cryptocompare.com/documentation) public API to execute conversions between currencies. It is necessary to have an API Key to perform operations against this api. This key will be send by e-mail and should be placed under the CONVERSION_API_KEY environment variable in the .env file.

Conversions can't be executed if the currency is not registered in the application, even if it's a real and valid currency.

Conversions with fictious currencies use a conversion to USD as an intermediate, for that it's necessary to fill `quotationUSDToCurrency` and `quotationCurrencyToUSD` fields when creating a new currency. The quotation values will be use in the calculation to find the corresponding value in the destination currency. In the feature this values can be automatically updated in the database.
