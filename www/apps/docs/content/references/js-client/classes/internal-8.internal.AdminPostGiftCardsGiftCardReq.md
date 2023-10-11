---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostGiftCardsGiftCardReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostGiftCardsGiftCardReq

**`Schema`**

AdminPostGiftCardsGiftCardReq
type: object
properties:
  balance:
    type: integer
    description: The value (excluding VAT) that the Gift Card should represent.
  is_disabled:
    type: boolean
    description: Whether the Gift Card is disabled on creation. If set to `true`, the gift card will not be available for customers.
  ends_at:
    type: string
    format: date-time
    description: The date and time at which the Gift Card should no longer be available.
  region_id:
    description: The ID of the Region in which the Gift Card can be used.
    type: string
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### balance

• `Optional` **balance**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/gift-cards/update-gift-card.d.ts:91

___

### ends\_at

• `Optional` **ends\_at**: ``null`` \| `Date`

#### Defined in

packages/medusa/dist/api/routes/admin/gift-cards/update-gift-card.d.ts:93

___

### is\_disabled

• `Optional` **is\_disabled**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/gift-cards/update-gift-card.d.ts:92

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/gift-cards/update-gift-card.d.ts:95

___

### region\_id

• `Optional` **region\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/gift-cards/update-gift-card.d.ts:94
