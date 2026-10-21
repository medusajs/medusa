# @medusajs/notification

Notification Module (`Modules.NOTIFICATION`): infrastructure module that records notifications and sends them through the provider registered for each channel (e.g. `email`, `feed`, `sms`).

## Using this package

- Registered by default as `@medusajs/medusa/notification` with `@medusajs/medusa/notification-local` (id `local`, `channels: ["feed"]`). Other providers: `@medusajs/medusa/notification-sendgrid` (`packages/modules/providers/notification-*`).
- Options (`NotificationModuleOptions` in `src/types/index.ts`): `providers[]` of `{ resolve, id, options: { channels: string[], ...providerOptions } }`, plus private `cloud` (`api_key`, `endpoint`, `environment_handle`, `sandbox_handle`) injected by `defineConfig` on Medusa Cloud.

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

- Resolve: `container.resolve(Modules.NOTIFICATION)` (`INotificationModuleService`). In workflows use `sendNotificationsStep` from `@medusajs/medusa/core-flows`.

```ts
await notificationModuleService.createNotifications({
  to: "customer@example.com",
  channel: "email",
  template: "order-placed",
  data: { order_id: order.id },
})
```

**Data models**: `Notification` (`noti_`: `to`, `from`, `channel`, `template`, `data`, `provider_data`, `trigger_type`, `resource_id`, `resource_type`, `receiver_id`, `original_notification_id`, `idempotency_key` (unique), `external_id`, `status` pending / success / failure) and `NotificationProvider` (`id`, `handle`, `name`, `is_enabled`, `channels`). Only `Notification` gets generated `MedusaService` methods.

**Custom method**: `createNotifications(data | data[])` (overrides the generated one) creates, sends and updates status in one call. No custom events beyond the generated `notification.notification.*` ones; no module links.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/notification.md, https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification.md, https://docs.medusajs.com/resources/infrastructure-modules/notification/local.md, https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid.md

## Architecture

- `src/loaders/providers.ts`: registers each provider as `np_<id>` and syncs the `notification_provider` table (`id`/`handle`/`name` = config `id`, `channels` from `options.channels`); DB providers not in config are set `is_enabled: false`.
- If no configured provider declares the `email` channel and `cloud` has `api_key`, `endpoint` and an `environment_handle` or `sandbox_handle`, the Medusa Cloud email provider (`src/providers/medusa-cloud-email.ts`) is added with id `cloud` and `channels: ["email"]`.
- `src/services/notification-provider.ts` resolves the provider for each channel and calls its `send`.

## Development

```bash
cd packages/modules/notification
yarn build
yarn test
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/notification-module-service/index.spec.ts
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/notification-module-service/` (`index.spec.ts`, `medusa-cloud-email.spec.ts`).

## Gotchas

- Boot fails with "Multiple providers are configured for the same channel: <channel>" if two providers share a channel; a provider entry without `id` also throws.
- Idempotency: a notification whose `idempotency_key` already exists is skipped unless the existing one has `status: failure`, in which case it is re-sent (and updated, not re-created). Not race-safe (see TODO in `createNotifications`).
- Records are created before sending. If no enabled provider handles the channel, or `send` fails, the notification is saved with `status: failure` and the call throws (errors aggregated across the batch).
