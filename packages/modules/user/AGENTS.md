# @medusajs/user

Commerce module for admin users and user invites, including signing and validating JWT invite tokens. Authentication itself lives in the Auth Module. Registered as `Modules.USER` (`"user"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/user`), which passes the options from `projectConfig.http` (`jwtSecret` or `JWT_SECRET`, `jwtOptions`, `jwtVerifyOptions`, `jwtPublicKey`). Override only to change invite behavior:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/user",
      options: {
        jwt_secret: process.env.JWT_SECRET,
        valid_duration: 60 * 60 * 24, // invite TTL in seconds
      },
    },
  ],
})
```

- Options read by the service constructor: `jwt_secret` (required, the module throws `INVALID_DATA` without it), `jwt_public_key`, `jwt_options` (jsonwebtoken `SignOptions`), `jwt_verify_options`, `valid_duration` (seconds; falls back to `jwt_options.expiresIn`, then 24 hours).
- In apps, prefer the core-flows workflows: `createUsersWorkflow`, `updateUsersWorkflow`, `deleteUsersWorkflow`, `createUserAccountWorkflow`, `removeUserAccountWorkflow`, `createInvitesWorkflow`, `acceptInviteWorkflow`, `refreshInviteTokensWorkflow`, `deleteInvitesWorkflow`, and RBAC ones (`assignUserRolesWorkflow`, `removeUserRolesWorkflow`).

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IUserModuleService } from "@medusajs/framework/types"

const userModuleService: IUserModuleService = container.resolve(Modules.USER)
const invite = await userModuleService.validateInviteToken(token)
```

### Data models (`src/models`)

- `User` (`user_`): `first_name`, `last_name`, `email` (unique among non-deleted), `avatar_url`, `metadata`.
- `Invite` (`invite_`): `email` (unique among non-deleted), `accepted`, `token`, `expires_at`, `metadata`.

### Service methods (`src/services/user-module.ts`)

Generated CRUD for both models, plus:

- `validateInviteToken(token)`: verifies the JWT, loads the invite, and checks the token matches the stored one and is not expired.
- `refreshInviteTokens(inviteIds)`: issues new tokens and `expires_at`.
- Overridden `createUsers`, `updateUsers`, `createInvites` (generates token and expiry), `updateInvites`.

### Events and links

- Internal CRUD events plus `user.user.invite.token_generated` (`UserEvents.INVITE_TOKEN_GENERATED` from `@medusajs/framework/utils`), emitted by `createInvites`, `updateInvites`, and `refreshInviteTokens`.
- Workflow events: `user.created|updated|deleted` (`UserWorkflowEvents`) and `invite.created|accepted|deleted|resent` (`InviteWorkflowEvents`).
- Module links: `user-rbac-role` (`user_rbac_role`) and `invite-rbac-role` (`invite_rbac_role`) to the RBAC Module.

Docs: https://docs.medusajs.com/resources/commerce-modules/user.md, https://docs.medusajs.com/resources/commerce-modules/user/module-options.md, https://docs.medusajs.com/resources/commerce-modules/user/user-creation-flows.md, https://docs.medusajs.com/resources/commerce-modules/user/invite-user-subscriber.md

## Architecture

- Tokens are signed in `generateToken` with `jwt_secret` and `jwt_options` (a random `jwtid` per token unless set). Verification uses `jwt_public_key ?? jwt_secret` and `jwt_verify_options ?? jwt_options`; a single `algorithm` option is converted to `algorithms` for verification.
- `getExpiresAt` in `src/utils/utils.ts` accepts seconds (number) or a timespan string.

## Development

```bash
cd packages/modules/user
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/{user,invite}.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- The constructor's second parameter is named `moduleDeclaration` but holds the module options; option keys are snake_case.
- A refreshed (resent) invite invalidates earlier tokens: `validateInviteToken` rejects any token not equal to the stored `invite.token`.
- `createInvites` throws `INVALID_DATA` when a user with the email already exists.
- `updateInvites` emits `INVITE_TOKEN_GENERATED` on every update, even when the token didn't change.
