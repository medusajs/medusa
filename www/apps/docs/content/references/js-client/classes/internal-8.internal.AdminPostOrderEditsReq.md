---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostOrderEditsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostOrderEditsReq

**`Schema`**

AdminPostOrderEditsReq
type: object
required:
  - order_id
properties:
  order_id:
    description: The ID of the order to create the edit for.
    type: string
  internal_note:
    description: An optional note to associate with the order edit.
    type: string

## Properties

### created\_by

• `Optional` **created\_by**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/create-order-edit.d.ts:77

___

### internal\_note

• `Optional` **internal\_note**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/create-order-edit.d.ts:76

___

### order\_id

• **order\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/order-edits/create-order-edit.d.ts:75
