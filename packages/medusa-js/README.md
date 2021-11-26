# Medusa JS Client

[![Version](https://img.shields.io/npm/v/stripe.svg)](https://www.npmjs.org/package/@medusajs/medusa-js)

The Medusa JS Client provides easy access to the Medusa API from a client written in Typescript.

## Documentation

See our [API reference](https://docs.medusa-commerce.com/api/store).

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
import Medusa from '@medusajs/medusa-js';

const medusa = new Medusa();

const { cart } = await medusa.carts.create({});
```

## Configuration

### Initialize with config object

The package can be initialized with several options:

```js
const medusa = new Medusa({
  maxRetries: 3,
  baseUrl: 'https://api.example.com',
});
```

| Option       | Default                             | Description                               |
| ------------ | ----------------------------------- | ----------------------------------------- |
| `maxRetries` | `0`                                 | The amount of times a request is retried. |
| `baseUrl`    | `'http://localhost:9000'`           | The url to which requests are made to     |
