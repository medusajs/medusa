# Custom subscribers

Subscribers handle events emitted in the Medusa application.

This plugin currently includes:

- `user-invited.ts` — sends invite emails on `invite.created` and `invite.resent`
- `password-reset.ts` — sends password reset emails on `auth.password_reset`

Both subscribers always attempt to send through the `email` channel.
