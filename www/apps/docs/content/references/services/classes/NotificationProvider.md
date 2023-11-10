# NotificationProvider

A notification provider represents a notification service installed in the Medusa backend, either through a plugin or backend customizations. It holds the notification service's installation status.

## Constructors

### constructor

**new NotificationProvider**()

A notification provider represents a notification service installed in the Medusa backend, either through a plugin or backend customizations. It holds the notification service's installation status.

## Properties

### id

 **id**: `string`

The ID of the notification provider as given by the notification service.

#### Defined in

[packages/medusa/src/models/notification-provider.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/notification-provider.ts#L6)

___

### is\_installed

 **is\_installed**: `boolean` = `true`

Whether the notification service is installed in the current version. If a notification service is no longer installed, the `is_installed` attribute is set to `false`.

#### Defined in

[packages/medusa/src/models/notification-provider.ts:9](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/notification-provider.ts#L9)
