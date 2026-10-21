<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/js-sdk
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

Medusa JS SDK: a JavaScript/TypeScript client for the Medusa Store and Admin API routes. Use it in storefronts, admin customizations, or any JavaScript app that sends requests to a Medusa application, including your custom API routes.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/js-sdk` |
| Type | Core library |
| Import from | `@medusajs/js-sdk` (default export `Medusa`) |
| Entry points | ESM (`import`) and CommonJS (`require`) builds |

## Features

- `sdk.store` methods for the Store API routes, such as products, carts, and customers.
- `sdk.admin` methods for the Admin API routes.
- `sdk.auth` methods to register, log in, log out, and reset passwords for any actor type, such as `customer` or `user`.
- `sdk.client.fetch` to send requests to custom API routes with the configured headers and authentication.
- `sdk.setLocale` to send the `x-medusa-locale` header with every request.

## Installation

```bash
npm install @medusajs/js-sdk @medusajs/types
```

`@medusajs/types` is optional and provides the request and response types.

## Usage

```ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const { products } = await sdk.store.product.list()
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `baseUrl` | `string` | URL of the Medusa application. Required. | - |
| `publishableKey` | `string` | Publishable API key, sent in the `x-publishable-api-key` header. Required for Store API routes. | - |
| `apiKey` | `string` | Secret API key, sent as Basic authentication. Use only on the server for Admin API routes. | - |
| `globalHeaders` | `ClientHeaders` | Headers to send with every request. | - |
| `auth.type` | `"jwt" \| "session"` | How to authenticate. See [Authentication types](#authentication-types). | `"jwt"` |
| `auth.jwtTokenStorageMethod` | `"local" \| "session" \| "memory" \| "custom" \| "nostore"` | Where to store the JWT token. | `"local"` in browsers, `"nostore"` otherwise |
| `auth.jwtTokenStorageKey` | `string` | Storage key of the JWT token. | `"medusa_auth_token"` |
| `auth.storage` | `CustomStorage` | Object with `getItem`, `setItem`, and `removeItem` methods. Required when `jwtTokenStorageMethod` is `"custom"`. | - |
| `auth.fetchCredentials` | `"include" \| "omit" \| "same-origin"` | `credentials` of fetch requests when `auth.type` is `"session"`. | `"include"` |
| `logger` | `Logger` | Logger with `error`, `warn`, `info`, and `debug` methods. | `console` |
| `debug` | `boolean` | Whether to log debug messages. | `false` |

### Authentication types

- `"jwt"` (default): after login, the SDK stores the JWT token based on `auth.jwtTokenStorageMethod` and sends it in the `Authorization: Bearer` header. Fetch requests use `credentials: "omit"`.
- `"session"`: after login, the SDK exchanges the JWT token for a cookie session using the `/auth/session` API route, and sends requests with `auth.fetchCredentials`. Logging out deletes the session. Use it for the Medusa Admin and admin customizations.

## Resources

- [JS SDK](https://docs.medusajs.com/resources/js-sdk)
- [JS SDK authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview)
