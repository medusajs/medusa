# @medusajs/auth-emailpass

Auth Module provider for email/password authentication. Passwords are hashed with `scrypt-kdf` and stored in the provider identity's `provider_metadata`. Registered by default by `defineConfig`.

## Using this package

Registered automatically with `id: "emailpass"`. If you override the Auth Module's `providers`, you must list it again:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // optional scrypt params, defaults shown
              hashConfig: { logN: 15, r: 8, p: 1 },
            },
          },
        ],
      },
    },
  ],
})
```

- Routes: `POST /auth/{actor_type}/emailpass/register`, `POST /auth/{actor_type}/emailpass` (body `{ email, password }`), `POST /auth/{actor_type}/emailpass/update` for password reset.
- The actor type must allow the provider in `projectConfig.http.authMethodsPerActor` if you restrict it.
- Docs: https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/emailpass.md
- Build a custom auth provider: https://docs.medusajs.com/resources/references/auth/provider.md

## Architecture

- `src/services/emailpass.ts`: `EmailPassAuthService extends AbstractAuthModuleProvider` (from `@medusajs/framework/utils`), `static identifier = "emailpass"`, `DISPLAY_NAME = "Email/Password Authentication"`.
- Implements `register`, `authenticate`, `update`. No `validateCallback` (no redirect flow).
- `entity_id` of the auth identity is the email. Every returned identity is passed through `sanitizeAuthIdentity_`, which strips `provider_metadata.password`.
- Reference for a custom direct (non-redirect) auth provider.

## Development

- `yarn build`, `yarn test`
- `yarn test:integration` runs `integration-tests/__tests__/services.spec.ts` (mocked `AuthIdentityProviderService`, no DB needed).

## Gotchas

- Keep `id: "emailpass"`. Provider identities are stored under the registration `id`, but the service looks up its password hash by its static identifier (`this.provider` = `"emailpass"`), so any other `id` makes every login fail.
- `register` succeeds (returns the existing identity) if the email already exists, the password matches, and the identity has no `app_metadata` (not yet linked to an actor). This lets one email register as a second actor type.
- `authenticate` returns `"Invalid email or password"` for both unknown email and wrong password (no user enumeration).
- `update` with a missing or non-string `password` returns `{ success: true }` without changing anything.
- Lowering `hashConfig.logN` speeds up tests but weakens hashes; existing hashes still verify because scrypt-kdf stores params in the hash.
