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
  @medusajs/auth-oidc
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

OpenID Connect (OIDC) Auth Module Provider for Medusa: lets users and customers log in through any spec-compliant OIDC identity provider, such as Okta, Microsoft Entra ID, Auth0, Keycloak, or Google Workspace. Use it for single sign-on (SSO) when a dedicated provider like `auth-google` doesn't fit. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/auth-oidc` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/auth-oidc` |
| Type | Module Provider (Auth Module) |
| Provider ID | `oidc` |
| Registered by default | No |
| Import from | `@medusajs/medusa/auth-oidc` |

## Features

- Resolves endpoints from the issuer's discovery document (`{issuer}/.well-known/openid-configuration`), with optional explicit overrides.
- Supports confidential clients and public clients using PKCE only (no client secret).
- Validates ID tokens, with configurable clock tolerance.
- Maps ID token claims to the auth identity, including custom claims stored in `user_metadata`.
- Optional allowlists for callback URLs and email domains, and an optional verified-email requirement.

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the Auth Module's `providers` array in `medusa-config.ts`. Passing `providers` replaces the default list, so keep `emailpass` if you still need email/password login. You can register the provider more than once with different `id` values to connect several identity providers.

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "@medusajs/medusa/auth-oidc",
            id: "oidc",
            options: {
              issuer: process.env.OIDC_ISSUER,
              client_id: process.env.OIDC_CLIENT_ID,
              client_secret: process.env.OIDC_CLIENT_SECRET,
              callback_url: process.env.OIDC_CALLBACK_URL,
            },
          },
        ],
      },
    },
  ],
})
```

The environment variable names above are examples; the provider doesn't read any environment variables itself.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `issuer` | `string` | Required. The identity provider's issuer URL. Must be `https`, except `localhost` outside production. | - |
| `client_id` | `string` | Required. The OAuth 2 client ID. | - |
| `client_secret` | `string` | The OAuth 2 client secret. Omit it for a public client using PKCE only. | - |
| `callback_url` | `string` | Required. The default redirect URI after authentication. | - |
| `allowed_callback_urls` | `string[]` | Exact-match allowlist for callback URLs passed in a request's `callback_url` body field. If unset, any callback URL is accepted. | - |
| `scopes` | `string[]` | Scopes to request. Always include `openid`. | `["openid", "email", "profile"]` |
| `authorization_endpoint` | `string` | Overrides the discovery document's authorization endpoint. | - |
| `token_endpoint` | `string` | Overrides the discovery document's token endpoint. | - |
| `jwks_uri` | `string` | Overrides the discovery document's JWKS URI. | - |
| `end_session_endpoint` | `string` | Overrides the discovery document's end-session endpoint. | - |
| `claim_mappings` | `Record<string, string>` | Maps auth identity fields to ID token claims. Extra keys are stored in `user_metadata`. | `{ entity_id: "sub", email: "email", name: "name" }` |
| `require_verified_email` | `boolean` | Require the `email_verified` claim to be true. | `true` |
| `allowed_email_domains` | `string[]` | Only allow users whose email domain is in this list. | - |
| `clock_tolerance_seconds` | `number` | Allowed clock skew when validating `exp`, `iat`, and `nbf`. | `5` |
| `state_ttl_seconds` | `number` | Lifetime of the single-use `state` value. | `600` |
| `display_name` | `string` | The provider's display name. | `"OpenID Connect"` |

## Resources

- [Auth Providers](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers)
- [Auth Module](https://docs.medusajs.com/resources/commerce-modules/auth)
