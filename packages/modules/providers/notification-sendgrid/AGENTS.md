# @medusajs/notification-sendgrid

Notification Module provider that sends emails through SendGrid (`@sendgrid/mail`), using either SendGrid dynamic templates or inline HTML.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`SendgridNotificationServiceOptions`): `api_key`, `from` (default sender). `channels` is read by the Notification Module.
- Send with `Modules.NOTIFICATION` `createNotifications({ to, channel: "email", template, data })`; `template` is the SendGrid dynamic template ID and `data` becomes `dynamicTemplateData`.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid.md
- Build a custom notification provider: https://docs.medusajs.com/resources/references/notification-provider-module.md

## Architecture

- `src/services/sendgrid.ts`: `SendgridNotificationService extends AbstractNotificationProviderService`, `static identifier = "notification-sendgrid"`. Implements only `send`.
- `sendgrid.setApiKey` is called in the constructor; `@sendgrid/mail` is a module-level singleton.
- Reference for a custom email notification provider (attachments, per-notification `from`, `provider_data`).

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` mocks `@sendgrid/mail` (no network).

## Gotchas

- If the notification has `content`, `content.subject` and `content.html` are sent and `template` is ignored (SendGrid can't mix HTML and templates). `content.text` is never sent.
- `notification.from` overrides the configured `from` when non-empty.
- `provider_data.personalizations` is passed straight to SendGrid and replaces the top-level `to`, so include recipients inside it.
- Attachments: `content` must be base64; `disposition` defaults to `"attachment"`.
- Errors are rethrown as `UNEXPECTED_STATE` with `Failed to send email: {code} - {SendGrid message}`; the notification is then marked failed.
- No options validation: a missing `api_key` only surfaces when sending.
- Only one provider per channel: don't also register `notification-local` for `email`.
