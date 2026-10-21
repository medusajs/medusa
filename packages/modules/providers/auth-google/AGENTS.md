# @medusajs/auth-google

Auth Module provider for "Sign in with Google" using the OAuth 2 authorization-code flow with ID-token verification.

## Using this package

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
            resolve: "@medusajs/medusa/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`GoogleAuthProviderOptions`): `clientId`, `clientSecret`, `callbackUrl`, all required (`validateOptions` throws at boot).
- Flow: `POST /auth/{actor_type}/google` returns `{ location }`; Google redirects to `callbackUrl`, which calls `POST /auth/{actor_type}/google/callback` forwarding the `code` and `state` query params.
- Docs: https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/google.md
- Build a custom auth provider: https://docs.medusajs.com/resources/references/auth/provider.md

## Architecture

- `src/services/google.ts`: `GoogleAuthService extends AbstractAuthModuleProvider`, `static identifier = "google"`.
- Implements `validateOptions`, `authenticate`, `validateCallback`; `register` throws `NOT_ALLOWED`.
- The `id_token` from the token endpoint is verified with `jsonwebtoken` against Google's JWKS (`jwks-rsa`, cached): `RS256`, `aud = clientId`, `iss` in `accounts.google.com` / `https://accounts.google.com`.
- Requested scopes are fixed: `email profile openid`.

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` mocks Google token and JWKS endpoints with `msw`.

## Gotchas

- `entity_id` is the `sub` claim, not the email. `user_metadata` (`name`, `email`, `picture`, `given_name`, `family_name`) is only written when the identity is first created; later logins don't refresh it.
- Login is rejected unless `email_verified` is true in the ID token.
- Tokens aren't stored (no `provider_metadata`), unlike `auth-github`.
- A body `callback_url` overrides `callbackUrl` per request with no allowlist; it must also be registered as a redirect URI in Google Cloud.
- For Google Workspace SSO with domain restrictions, `@medusajs/auth-oidc` (`allowed_email_domains`) is the better fit.
