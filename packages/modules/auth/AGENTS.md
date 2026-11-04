# @medusajs/auth

Auth Module (`Modules.AUTH`). Manages auth identities, delegates authentication to Auth Module Providers (emailpass, Google, GitHub, OIDC, Medusa Cloud), and owns MFA (TOTP + recovery codes), verification tokens, and password reset tokens. It does not issue JWTs or sessions; the HTTP layer does that from the returned `authIdentity`.

## Using this package

- Registered by default via `defineConfig` as `@medusajs/medusa/auth` with the `emailpass` provider and `mfa.encryption_key` from `AUTH_MFA_ENCRYPTION_KEY`.
- Overriding the module replaces its default options entirely (last entry wins), so re-add `emailpass` if you still need it. Only the default `mfa` options (incl. `encryption_key` from `AUTH_MFA_ENCRYPTION_KEY`) are merged back in by `applyDefaultAuthMfaOptions`:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        mfa: { encryption_key: process.env.AUTH_MFA_ENCRYPTION_KEY },
        providers: [
          { resolve: "@medusajs/medusa/auth-emailpass", id: "emailpass" },
          {
            resolve: "@medusajs/medusa/auth-google",
            id: "google",
            options: { /* provider options */ },
          },
        ],
      },
    },
  ],
})
```

- Options (`AuthModuleOptions`, `src/types/index.ts`):
  - `providers: { resolve, id, options? }[]`: the `id` is the provider name used in `/auth/{actor_type}/{id}` routes and in `ProviderIdentity.provider`.
  - `mfa`: `encryption_key`, `recovery_code_count`, `challenge_ttl_seconds`, `challenge_max_attempts`, `disable_policy` (`"session"` default, or `"challenge"`), `providers` (extra or overridden MFA providers; `totp` options: `issuer`, `digits`, `period`, `window`).
  - `verification.providers`: extra verification providers; built-in `token` accepts `ttl_seconds` (default 900).
  - `cloud`: private; injected by `defineConfig` for Medusa Cloud.
- Custom providers extend `AbstractAuthModuleProvider` from `@medusajs/framework/utils`.
- Resolve: `container.resolve(Modules.AUTH)` (`IAuthModuleService`).

### Data models (`src/models`)

- `AuthIdentity` (`authid_`): `app_metadata` (holds actor links like `customer_id` / `user_id`); has many `ProviderIdentity`, `AuthMfaFactor`, `AuthMfaRecoveryCode`, `AuthVerification`, `AuthPasswordResetToken` (all cascade-deleted).
- `ProviderIdentity`: `entity_id`, `provider`, `user_metadata`, `provider_metadata`. Unique on (`entity_id`, `provider`).
- `AuthMfaFactor` (`authmfa_`): `provider`, `status`; at most one `pending`/`enabled` factor per identity + provider.
- `AuthMfaRecoveryCode` (`authmfarec_`), `AuthVerification` (`authver_`), `AuthPasswordResetToken` (`authprt_`, stores `token_hash`, `expires_at`).
- Only `AuthIdentity` and `ProviderIdentity` are exposed in the joiner config (queryable).

### Custom service methods (`src/services/auth-module.ts`)

- Provider flow: `register`, `authenticate`, `validateCallback`, `updateProvider`, `validateAuthIdentity`, `listAuthProviders`. These catch errors and return `{ success: false, error }` instead of throwing.
- MFA: `startAuthMfa`, `verifyAuthMfa`, `createAuthMfaChallenge`, `verifyAuthMfaChallenge`, `disableAuthMfa`, `retrieveAuthMfa`, `listAuthMfa`, `generateAuthMfaRecoveryCodes`, `useAuthMfaRecoveryCode`.
- Verification: `requestAuthVerification` (requires `code_provider`), `confirmAuthVerification` (defaults to `"token"`).
- Password reset: `createPasswordResetToken`, `consumePasswordResetToken`.
- Generated CRUD for `AuthIdentity` / `ProviderIdentity` (e.g. `createAuthIdentities`, `updateProviderIdentities`).

### Events and links

- The module defines no event constants. `auth.password_reset` and `auth.verification_requested` (`AuthWorkflowEvents`) are emitted by core-flows workflows (`generate-reset-password-token.ts`, `request-verification.ts`).
- No module links in `link-modules`; actors are associated through `app_metadata.<actor_type>_id`.

### Docs

- https://docs.medusajs.com/resources/commerce-modules/auth.md
- https://docs.medusajs.com/resources/commerce-modules/auth/module-options.md
- https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers.md
- https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types.md
- https://docs.medusajs.com/resources/commerce-modules/auth/mfa.md
- https://docs.medusajs.com/resources/commerce-modules/auth/email-verification.md

## Architecture

- `src/loaders/providers.ts` registers, in order: built-in MFA providers `totp` and `recovery_code` (`mfa_<id>`), custom `mfa.providers`, built-in `token` verification provider and custom `verification.providers` (`verif_<id>`), the `cloud` provider (only if `cloud` options validate and `disabled` is falsy), then `providers` (`au_<id>`).
- `AuthProviderService`, `AuthMfaProviderService`, `AuthVerificationProviderService` resolve providers by those prefixes.
- Providers receive an `AuthIdentityProviderService` (`getAuthIdentityProviderService(provider)`) with `retrieve`, `create`, `update`, `setState`, `getState`.
- `applyMfaRequirement_`: after a successful `register`/`authenticate`/`validateCallback`, if the identity has an enabled, verifiable factor, the response gets an `mfaChallenge` instead of being final.

## Development

```bash
yarn build
yarn test                  # src/**/__tests__ (loaders, mfa, totp, verification-token utils)
yarn test:integration      # integration-tests/__tests__/auth-module-service/*.spec.ts (Postgres)
yarn test:integration -t "<test name>"
yarn migration:create      # after any change to src/models; never hand-write migrations
```

- Fixture provider: `integration-tests/__fixtures__/providers/default-provider.ts`.

## Gotchas

- MFA challenges and OAuth state live in the Cache Module (`Modules.CACHE`), not the DB: challenge key `auth:mfa:challenge:<id>`; state defaults to a 1200s TTL and is deleted on first read (single-use). Without a cache dependency these paths throw `INVALID_ARGUMENT`.
- TOTP secrets are encrypted with `mfa.encryption_key`; missing it throws "MFA encryption key is required to use MFA methods" on enroll/verify.
- Custom MFA/verification providers without `resolve` are rejected unless their `id` is a built-in (`totp` / `token`), which only overrides options.
- MFA and verification providers must have a static `identifier` (loader throws otherwise); auth providers are keyed by config `id` instead.
- `retrieve`/`update` in the identity provider service throw `INVALID_DATA` if more than one `AuthIdentity` matches the `entity_id` + provider.
