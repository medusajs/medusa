---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostNotesReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostNotesReq

**`Schema`**

AdminPostNotesReq
type: object
required:
  - resource_id
  - resource_type
  - value
properties:
  resource_id:
    type: string
    description: The ID of the resource which the Note relates to. For example, an order ID.
  resource_type:
    type: string
    description: The type of resource which the Note relates to. For example, `order`.
  value:
    type: string
    description: The content of the Note to create.

## Properties

### resource\_id

• **resource\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/notes/create-note.d.ts:88

___

### resource\_type

• **resource\_type**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/notes/create-note.d.ts:89

___

### value

• **value**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/notes/create-note.d.ts:90
