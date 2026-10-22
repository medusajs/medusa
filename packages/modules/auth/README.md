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
  @medusajs/auth
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

Auth Module for Medusa: manages auth identities, provider identities, password reset tokens, verifications, and multi-factor authentication (MFA) factors and recovery codes. It authenticates actors (such as admin users and customers) through pluggable Auth Module Providers. It ships with `@medusajs/medusa` and is registered by default, so you normally use it through the Medusa application rather than installing it directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/auth` |
| Type | Commerce Module |
| Module key | `Modules.AUTH` (`"auth"`) |
| Registered by default | Yes, with the `emailpass` provider |
| Import from | `@medusajs/medusa/auth` |

## Features

- Authenticate actors through Auth Module Providers. Official providers:
  - [`@medusajs/auth-emailpass`](../providers/auth-emailpass): email and password.
  - [`@medusajs/auth-github`](../providers/auth-github): GitHub OAuth.
  - [`@medusajs/auth-google`](../providers/auth-google): Google OAuth.
  - [`@medusajs/auth-oidc`](../providers/auth-oidc): OpenID Connect.
- Link multiple provider identities to one auth identity.
- Password reset tokens and token-based verifications.
- Built-in MFA with TOTP and recovery codes.

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by default with the `emailpass` provider and `mfa.encryption_key` set from the `AUTH_MFA_ENCRYPTION_KEY` environment variable.

## Usage

To add providers, register the module in `medusa-config.ts`:

```ts title="medusa-config.ts"
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
        ],
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, options?: Record<string, unknown> }[]` | Auth Module Providers to register. | `emailpass` provider |
| `mfa.encryption_key` | `string` | Key used to encrypt MFA secrets at rest. | `AUTH_MFA_ENCRYPTION_KEY` env var |
| `mfa.recovery_code_count` | `number` | Number of recovery codes generated for an auth identity. | `10` |
| `mfa.challenge_ttl_seconds` | `number` | Seconds an MFA challenge remains valid. | `300` |
| `mfa.challenge_max_attempts` | `number` | Failed verification attempts allowed per MFA challenge. | `5` |
| `mfa.disable_policy` | `"challenge" \| "session"` | Policy used when disabling MFA. | `"session"` |
| `mfa.providers` | `{ resolve?: string, id: string, options?: Record<string, unknown> }[]` | Additional MFA providers, or options for built-in ones such as `totp`. | - |
| `verification.providers` | `{ resolve?: string, id: string, options?: Record<string, unknown> }[]` | Additional verification providers, or options for the built-in `token` provider. | - |

## Resources

- [Auth Module](https://docs.medusajs.com/resources/commerce-modules/auth)
- [Auth Module options](https://docs.medusajs.com/resources/commerce-modules/auth/module-options)
- [Auth providers](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers)
- [Multi-factor authentication](https://docs.medusajs.com/resources/commerce-modules/auth/mfa)
- [Authentication flows](https://docs.medusajs.com/resources/commerce-modules/auth/auth-flows)
