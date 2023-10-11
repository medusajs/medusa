---
displayed_sidebar: jsClientSidebar
---

# Class: AdminUpdatePaymentCollectionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminUpdatePaymentCollectionsReq

**`Schema`**

AdminUpdatePaymentCollectionsReq
type: object
properties:
  description:
    description: A description to create or update the payment collection.
    type: string
  metadata:
    description: A set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### description

• `Optional` **description**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/payment-collections/update-payment-collection.d.ts:81

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/payment-collections/update-payment-collection.d.ts:82
