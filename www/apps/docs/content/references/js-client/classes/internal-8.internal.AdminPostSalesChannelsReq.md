---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostSalesChannelsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostSalesChannelsReq

**`Schema`**

AdminPostSalesChannelsReq
type: object
required:
  - name
properties:
  name:
    description: The name of the Sales Channel
    type: string
  description:
    description: The description of the Sales Channel
    type: string
  is_disabled:
    description: Whether the Sales Channel is disabled.
    type: boolean

## Properties

### description

• **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/sales-channels/create-sales-channel.d.ts:84

___

### is\_disabled

• `Optional` **is\_disabled**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/sales-channels/create-sales-channel.d.ts:85

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/sales-channels/create-sales-channel.d.ts:83
