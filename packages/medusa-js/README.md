# Medusa JS Client

[![Version](https://img.shields.io/npm/v/stripe.svg)](https://www.npmjs.org/package/@medusajs/medusa-js)

The Medusa JS Client provides easy access to the Medusa API from a client written in Typescript.

## Documentation

You can learn more about this client and how to use it [our documentation](https://docs.medusajs.com/js-client/overview).

To learn more about the API endpoints that this client allows you to access check out our [API reference](https://docs.medusajs.com/api/store).

## Installation

Install the package with:

```sh
npm install @medusajs/medusa-js
# or
yarn add @medusajs/medusa-js
```

## Usage

Import Medusa as a default import and initiate it:

```js
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa()

const { cart } = await medusa.carts.create({})
```

### Authentication

Authentication can be achieved in two ways using the `medusa-js` client, either by utilizing API keys or by using cookie based authentication, each with their own unique use case.

#### **Using API keys**

API keys can only be used for admin functionality in Medusa because only users of the admin system have api keys. To use API keys for authentication the key should be used when `medusa-js` is initialized with a config object as described below.

#### **Using cookies**

Authentication using cookies is done automatically by Axios when authenticating using the `auth` endpoints. After authentication all subsequent calls will be authenticated.

_note: Cookie based authentication cannot be used in plain `node.js` applications due to the limitations of axios and `useCredentials` not setting the `Cookie` request header when `set-cookie` is present in the response headers. For pure `node.js` applications use authentication with api keys(see above)_

## Configuration

### Initialize with config object

The package can be initialized with several options:

```js
const medusa = new Medusa({
  maxRetries: 3,
  baseUrl: "https://api.example.com",
})
```

| Option       | Default                   | Description                                               |
| ------------ | ------------------------- | --------------------------------------------------------- |
| `maxRetries` | `0`                       | The amount of times a request is retried.                 |
| `baseUrl`    | `'http://localhost:9000'` | The url to which requests are made to.                    |
| `apiKey`     | `''`                      | Optional api key used for authenticating admin requests . |
