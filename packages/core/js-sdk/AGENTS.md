# @medusajs/js-sdk

Typed HTTP client for Medusa's Store, Admin, and Auth API routes, used by storefronts, admin customizations, and the Medusa Admin dashboard itself (`packages/admin/dashboard/src/lib/client/client.ts`). Runs in browsers and Node (native `fetch`).

## Using this package

- Install `@medusajs/js-sdk` (and `@medusajs/types` for `HttpTypes`). Default export is the `Medusa` class.
- Docs: https://docs.medusajs.com/resources/js-sdk.md, auth: https://docs.medusajs.com/resources/js-sdk/auth/overview.md

```ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: { type: "session" },
})

const { products } = await sdk.store.product.list({ limit: 10 })
const { cart } = await sdk.store.cart.create({ region_id: "reg_123" })
```

- `Config` options (`src/types.ts`): `baseUrl`, `publishableKey`, `apiKey`, `globalHeaders`, `auth.type` (`"jwt" | "session"`), `auth.jwtTokenStorageKey` (default `medusa_auth_token`), `auth.jwtTokenStorageMethod` (`"local" | "session" | "memory" | "custom" | "nostore"`), `auth.storage` (custom storage with `getItem`/`setItem`/`removeItem`, sync or async), `auth.fetchCredentials`, `logger`, `debug`.
- `publishableKey` is sent as `x-publishable-api-key` on every request; store routes require it.
- `apiKey` (admin secret API key) is sent as `Authorization: Basic base64(apiKey + ":")`. Server-side only; never ship it to a browser.
- Namespaces: `sdk.store.*` (`region`, `collection`, `category`, `productOption`, `product`, `cart`, `fulfillment`, `payment`, `order`, `customer`, `locale`), `sdk.admin.*` (one class per resource in `src/admin/`, e.g. `sdk.admin.product`, `sdk.admin.order`), `sdk.auth.*`.

### Auth

```ts
const result = await sdk.auth.login("customer", "emailpass", {
  email,
  password,
})
if (typeof result !== "string") {
  // { location } for OAuth redirect, or mfa_required / verification_required
}
const { customer } = await sdk.store.customer.retrieve()
await sdk.auth.logout()
```

- `login(actor, method, payload)` returns the token string, `{ location }` (OAuth redirect), `{ mfa_required, mfa_challenge, token }`, or `{ verification_required, verification, token }`.
- `auth.type: "session"`: after login the SDK POSTs the token to `/auth/session` to get a cookie, sends no `Authorization` header, and uses `credentials: "include"` (overridable via `fetchCredentials`). Otherwise the token is stored and sent as `Bearer`.
- `register()` stores the token but does not start a session: the token has no actor yet. Create the actor (e.g. `sdk.store.customer.create`), then call `sdk.auth.login` again or `sdk.auth.refresh()`.
- OAuth: `sdk.auth.callback(actor, provider, queryParams)` then `sdk.auth.refresh()` once the actor exists.
- Also: `sdk.auth.resetPassword`, `updateProvider`, `listProviders`, `createUser`, `sdk.auth.mfa.*`, `sdk.auth.verification.*`.

### Custom routes

```ts
const data = await sdk.client.fetch<{ brands: Brand[] }>("/store/brands", {
  method: "POST",
  body: { name: "Acme" },
  query: { fields: "id,name" },
})
```

- `body` objects are JSON-stringified, `query` is serialized with `qs` (`skipNulls`), and auth / publishable-key / locale headers are added.
- Responses are parsed as JSON only when the request `accept` header contains `application/json` (the default). For files, set `headers: { accept: "application/pdf" }` and read the returned raw `Response`.
- Status `>= 300` throws `FetchError` with `status`, `statusText`, and `message` (from the JSON body's `message`).
- `sdk.client.fetchStream(path, init)` returns `{ stream, abort }` for server-sent events.
- `sdk.setLocale(locale)` stores the locale in `localStorage` and sends `x-medusa-locale`; it logs a warning on the server, where you must pass the header yourself.

## Architecture

- `src/index.ts`: `Medusa` class wiring `Client`, `Admin`, `Store`, `Auth`.
- `src/client.ts`: `Client` (`fetch`, `fetchStream`, `setToken`/`getToken`/`clearToken`, header merging, URL building relative to `baseUrl` path).
- `src/admin/<resource>.ts`: one class per admin resource, registered in `src/admin/index.ts`. `src/store/index.ts`: a single `Store` class with object namespaces. `src/auth/index.ts`: `Auth`.
- Method convention: `(id?, body?, query?, headers?)` calling `this.client.fetch<HttpTypes.XResponse>(path, { method, headers, body, query })`, with request/response types from `@medusajs/types` `HttpTypes`.

## Development

```bash
yarn workspace @medusajs/js-sdk build   # CJS (tsconfig.json) + ESM (tsconfig.esm.json)
yarn workspace @medusajs/js-sdk test
cd packages/core/js-sdk && ../../../node_modules/.bin/jest src/__tests__/client.spec.ts
```

- Tests in `src/__tests__/` mock the network with `msw` (`setupServer`), no backend needed.
- New methods need TSDoc with an `@example` (the JS SDK reference docs are generated from it; use the `writing-tsdocs` skill).

## Gotchas

- Relative imports in `src/` must end in `.js` (e.g. `from "../client.js"`); `src/__tests__/esm-import-specifiers.spec.ts` fails otherwise (the ESM build in `dist/esm` needs explicit extensions).
- Header values of `null` delete the header. File uploads rely on this: `admin/upload.ts` and `admin/product.ts` pass `"content-type": null` with a `FormData` body so `fetch` sets the multipart boundary.
- Header precedence: defaults (`content-type`, `accept`, API key, publishable key) < `globalHeaders` < JWT `Authorization` < per-call `headers`.
- Without `auth.jwtTokenStorageMethod`, the token goes to `localStorage` if available, else `nostore` (not persisted) on the server. `"local"`/`"session"` throw outside the browser; `"custom"` throws without `auth.storage`.
- `credentials` is only set when `Request.prototype` supports it (omitted on some server runtimes); for `jwt` it is `"omit"`.
- The Medusa Admin dashboard depends on this package, so changes to `Client`/`Auth` behavior affect it too.
