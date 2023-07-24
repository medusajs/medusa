---
description: 'Learn how to install the Medusa JS Client in a storefront. Medusa JS Client provides easy access to the Medusa API from a client written in TypeScript.'
---

# Medusa JS Client

The [Medusa JS Client](https://www.npmjs.com/package/@medusajs/medusa-js) provides easy access to the Medusa API from a client written in TypeScript. This reference guides you to learn what methods the client has and how you can use them.

This client can be use as an alternative to directly interacting with the [REST APIs](https://docs.medusajs.com/api/store).

## Installation

To install the Medusa JS Client run the following command:

```bash npm2yarn
npm install @medusajs/medusa-js
```

---

## Usage

Import Medusa as a default import and initiate it:

```ts
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa()
```

### Troubleshooting: Could not find a declaration file for module '@medusajs/medusa-js'

If you import `@medusajs/medusa-js` in your code and see the following TypeScript error:

```bash
Could not find a declaration file for module '@medusajs/medusa-js'
```

Make sure to set `moduleResolution` in your `tsconfig.json` to `nodenext` or `node`:

```json title=tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "nodenext",
    // ...
  },
  // ...
}
```

---

## How to Use this Reference

You'll find in the sidebar of this reference names of different resources. These resources are properties in the Medusa instance you initialize and you can access them directly using the instance. Then, you'll be able to access the methods or nested resources within those resources.

For example, to create a new customer you can access the [create](/references/js-client/classes/CustomerResource#create) method under the [customers](/references/js-client/classes/CustomerResource) property of your client:

```ts
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa()

// use method
medusa.customers.create({
  // data
})
```

The `customers` resource also has another resource `addresses` nested inside it with its own method that you can access similarly:

```ts
medusa.customers.addresses.addAddress({
  // data
})
```

---

## Authentication

Authentication can be achieved in two ways using the `medusa-js` client: either by utilizing API keys or by using cookie based authentication. Each method has its own unique use case.

### Using API keys

API keys can only be used for admin functionality in Medusa since only users of the admin system have API keys. Refer to the [Configuration](#configuration) section to learn how to add the API key to requests.

You can follow [this guide](/api/admin#section/Authentication/api_token) to learn how to create an API key for an admin user.

### Using cookies

Authentication using cookies is done automatically by Axios, which is used within the Medusa JS Client, when authenticating using the [auth](/references/js-client/classes/AuthResource) endpoints. After authentication, all subsequent calls will be authenticated.

---

## Configuration

### Initialize with config object

The package can be initialized with several options:

```ts
const medusa = new Medusa({
  maxRetries: 3,
  baseUrl: "https://api.example.com",
})
```

| Option              | Default                   | Description                                               |
| ------------------- | ------------------------- | --------------------------------------------------------- |
| `maxRetries`        | `0`                       | The amount of times a request is retried.                 |
| `baseUrl`           | `'http://localhost:9000'` | The url to which requests are made to.                    |
| `apiKey`            | `''`                      | Optional API key used for authenticating admin requests.  |
| `publishableApiKey` | `''`                      | Optional publishable API key used for storefront requests. You can create a publishable API key either using the [admin APIs](../development/publishable-api-keys/admin/manage-publishable-api-keys.mdx) or the [Medusa admin](../user-guide/settings/publishable-api-keys.mdx). |
