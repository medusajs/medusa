# @medusajs/auth-github

Auth Module provider for "Sign in with GitHub" using the OAuth 2 authorization-code flow.

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
            resolve: "@medusajs/medusa/auth-github",
            id: "github",
            options: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
              callbackUrl: process.env.GITHUB_CALLBACK_URL,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`GithubAuthProviderOptions`): `clientId`, `clientSecret`, `callbackUrl`, all required (`validateOptions` throws at boot).
- Flow: `POST /auth/{actor_type}/github` returns `{ location }` to redirect the browser to; GitHub redirects to your `callbackUrl` (a storefront/admin page), which calls `POST /auth/{actor_type}/github/callback` with the `code` and `state` query params.
- Docs: https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/github.md
- Build a custom auth provider: https://docs.medusajs.com/resources/references/auth/provider.md

## Architecture

- `src/services/github.ts`: `GithubAuthService extends AbstractAuthModuleProvider`, `static identifier = "github"`.
- Implements `validateOptions`, `authenticate` (stores a random state key via `authIdentityService.setState` and returns the GitHub authorize URL), `validateCallback` (exchanges the code, fetches `https://api.github.com/user`, upserts the identity). `register` throws `NOT_ALLOWED`.
- Reference for a custom OAuth redirect provider.

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` mocks GitHub with `msw`.

## Gotchas

- `entity_id` is the GitHub numeric user ID (as a string), not the email. `user_metadata` holds `email`, `name`, `avatar`, `profile_url`, `company`, `two_factor_authentication`, copied from the GitHub `/user` response.
- Tokens (`access_token`, `refresh_token`, expiry timestamps) are saved in `provider_metadata` and overwritten on every login.
- A request body `callback_url` overrides the configured `callbackUrl` for that flow; it's stored in state and reused in the token exchange. There is no allowlist (unlike `auth-oidc`).
- The callback must carry the `state` query param issued by `authenticate`; if it's missing or no longer stored, it returns `"No state provided, or session expired"`.
