# Environment vars

This project uses the following environment variables, Fill in these vars in .env order to run the project properly.

| Name             | Description                           | Default Value |
| ---------------- | ------------------------------------- | ------------- |
| PORT             | Port on which Node server will run    | 3001          |
| NODE_ENV         | Running environment                   | DEV           |
| MONGO_ATLAS_DEV  | MongoDB den env connection URL        | ""            |
| MONGO_ATLAS_LIVE | MongoDB production env connection url | ""            |
| JWT_SECRET       | JSON web token secret                 | ""            |

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version >=8.0.0

# Getting started

- Install dependencies

```
cd <project_name>
npm install
```

If you run into dependencies legacy errors try

```
npm install --legacy-peer-deps
```

- Build and run the project

```
npm start
```

Navigate to `http://localhost:3001`

- API endpoints

1: `api/user/adduser`

Creates a new user. Accepts three arguments in payload i.e "email"(unique), "name" and "passwprd".

2: `/api/user/login`

Logs in an existing user and returns a valid token in response. It accepts "emal" and "password" in the payload.

3: `api/dataset/follow`

Logged In user can follow datasets using this API, it accepts datasetId in payload and authentication token in header. It will return bad request if user is already following a dataset.

4: `api/dataset/unfollow`

Logged In user can un-follow datasets using this API, it accepts datasetId in payload and authentication token in header. It will return bad request if user is not following a dataset.

5: `api/dataset/get-category-assessment`

User can get category assessment of a dataset using this API. It accepts datasetId in payload and return its impact on basis of size.

6: `api/dataset/combine-and-cluster`

LoggedIn user can combine 2 or more datasets using this API. It accepts an array of valid datasetIds and then combines those datasets. It then makes use of k-means algorithm to cluster combined datasets and returns the impact i.e high or low.

## Project Structure

The folder structure of this app is explained below:

| Name | Description |
| **node_modules** | Contains all npm dependencies |
| **src** | Contains all the source code | |
| **src/controllers** | Controllers define functions to serve various express routes. |
| **src/helpers** | Helper functions used accross the app. |
| **src/authentication** | Authentication middlewares which process the incoming requests before handling them down to the routes |
| **src/routes** | Contain all express routes, separated by module/area of application |
| **src/models** | Models define schemas that will be used in storing and retrieving data from Application database |
| **src/tests** | Contains unit tests for the controllers, helpers, middlewares etc. |
| **src**/app.js | Entry point to express app |
| package.json | Contains npm dependencies as well as scripts |

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description                                          |
| ---------- | ---------------------------------------------------- |
| `start`    | Runs express server. It can be invoked by`npm start` |
| `test`     | Runs all the tests using jest                        |

## Testing

Unit tests are written in Jest.

### Running tests using NPM Scripts

```
npm run test

```

Test files are created under test folder.

# ESLint

TSLint is a code linter that helps catch minor code quality and style issues.

## ESLint rules

All rules are configured through `eslint.json`.

## Running TSLint

To run ESLint you can call the eslint script.

```
npm run lint
```

