---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostNotificationsNotificationResendReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostNotificationsNotificationResendReq

**`Schema`**

AdminPostNotificationsNotificationResendReq
type: object
properties:
  to:
    description: "A new address or user identifier that the Notification should be sent to. If not provided, the previous `to` field of the notification will be used."
    type: string

## Properties

### to

• `Optional` **to**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/notifications/resend-notification.d.ts:69
