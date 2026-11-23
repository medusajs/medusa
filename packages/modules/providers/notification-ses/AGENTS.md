# @medusajs/notification-ses

Notification Module provider that sends emails through Amazon SES (`@aws-sdk/client-sesv2`), using either SES templates or inline HTML and text content.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-ses",
            id: "ses",
            options: {
              channels: ["email"],
              from: process.env.SES_FROM,
              region: process.env.SES_REGION,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`SesNotificationServiceOptions`): `from` (default sender), `region`, `configuration_set_name`, `reply_to_addresses`, `credentials`. `channels` is read by the Notification Module.
- Send with `Modules.NOTIFICATION` `createNotifications({ to, channel: "email", template, data })`; `template` is the SES template name and `data` becomes the template data.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/notification
- Build a custom notification provider: https://docs.medusajs.com/resources/references/notification-provider-module.md

## Architecture

- `src/services/ses.ts`: `SesNotificationService extends AbstractNotificationProviderService`, `static identifier = "notification-ses"`. Implements only `send`.
- The `SESv2Client` is created once in the constructor; credentials come from the provider options, or from the AWS SDK's default chain, and the client is lazily resolved on first send.
- `packages/core/types/src/notification/providers/ses.ts` holds `SesNotificationServiceOptions`.
- `packages/medusa/src/modules/notification-ses.ts` re-exports the package for `@medusajs/medusa/notification-ses`.

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` mocks `@aws-sdk/client-sesv2` (no network, no AWS account).

## Gotchas

- If the notification has `content`, `content.subject` is required and `content.html` / `content.text` are sent; `template` is ignored (simple content can't mix with templates).
- `notification.from` overrides the configured `from` when non-empty.
- `provider_data.cc` and `provider_data.bcc` are string arrays passed to SES; anything else is ignored.
- Attachments are rejected with `INVALID_DATA`: SES simple content doesn't support them.
- Errors are rethrown as `UNEXPECTED_STATE` with `Failed to send email: {name} - {message}`; the notification is then marked failed.
- No options validation: a missing `from`, unverified sender, or missing AWS credentials only surface when sending.
- Only one provider per channel: don't also register `notification-local` for `email`.
