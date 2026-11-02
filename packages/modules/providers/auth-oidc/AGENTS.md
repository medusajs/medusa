# @medusajs/auth-oidc

Generic OpenID Connect Auth Module provider (since 2.19.0). Works with any spec-compliant IdP (Okta, Entra ID, Auth0, Keycloak, Google Workspace, ...) via discovery, PKCE (S256), nonce, and full ID-token validation, built on `openid-client` v5.

## Using this package

Register one entry per identity provider; each `id` becomes the route segment (`/auth/{actor_type}/{id}`):

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          // overriding `providers` drops the default emailpass provider, so re-add it
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "@medusajs/medusa/auth-oidc",
            id: "okta",
            options: {
              issuer: process.env.OKTA_ISSUER,
              client_id: process.env.OKTA_CLIENT_ID,
              client_secret: process.env.OKTA_CLIENT_SECRET,
              callback_url: process.env.OKTA_CALLBACK_URL,
              display_name: "Okta",
              allowed_callback_urls: [process.env.OKTA_CALLBACK_URL],
              allowed_email_domains: ["example.com"],
            },
          },
        ],
      },
    },
  ],
})
```

- Required: `issuer`, `client_id`, `callback_url`. `client_secret` is optional (public PKCE clients).
- Optional (`OidcAuthProviderOptions` in `packages/core/types/src/auth/providers/oidc.ts`): `allowed_callback_urls`, `scopes` (default `["openid", "email", "profile"]`), `authorization_endpoint`, `token_endpoint`, `jwks_uri`, `end_session_endpoint`, `claim_mappings` (default `{ entity_id: "sub", email: "email", name: "name" }`, extra keys copy custom claims into `user_metadata`), `require_verified_email` (default `true`), `allowed_email_domains`, `clock_tolerance_seconds` (default 5), `state_ttl_seconds` (default 600), `display_name`.
- Flow: `POST /auth/{actor_type}/{id}` returns `{ location }`; the IdP redirects to `callback_url`, which calls `POST /auth/{actor_type}/{id}/callback` forwarding all query params (`code`, `state`, `iss`, ...).
- Build a custom auth provider: https://docs.medusajs.com/resources/references/auth/provider.md

## Architecture

- `src/services/oidc.ts`: `OidcAuthService extends AbstractAuthModuleProvider`, `static identifier = "oidc"`. Implements `validateOptions`, `authenticate`, `validateCallback`; `register` throws `NOT_ALLOWED`. Overrides the `displayName` getter so each registration shows its own `display_name`.
- `src/engine/engine.ts`: `OidcEngine` (discovery, `buildAuthorizationUrl`, `exchangeCode`, `mapClaims`). Not exported from the package entry point.
- `src/utils/assert-secure-url.ts`: `issuer` and any endpoint override must be `https`; `http` is allowed only for `localhost`/`127.0.0.1`/`::1` outside production.
- `nonce` and `code_verifier` are stored in the auth state (`setState`) and replayed on callback.
- Injects an optional `cache` (`ICacheService`) to share discovery documents; without it, only the per-instance memoized client is used (discovery cache TTL 1 hour).

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` and `engine.spec.ts`.

## Gotchas

- Client errors are always the generic `"Authentication failed"`; the real cause is only logged server-side with the `[auth-oidc]` prefix. Check logs when debugging.
- `require_verified_email` defaults to `true`; IdPs or scope sets that don't return `email_verified: true` fail every login until it's set to `false`.
- Keep `openid` when overriding `scopes`, or no ID token is returned.
- `allowed_callback_urls` is opt-in; without it, any body `callback_url` override is accepted and only the IdP validates it.
- `entity_id` defaults to `sub` (never email). Unlike `auth-google`, `user_metadata` is refreshed from claims on every login.
