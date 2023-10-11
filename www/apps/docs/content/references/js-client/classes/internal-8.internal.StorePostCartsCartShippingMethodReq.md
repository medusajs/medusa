---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCartsCartShippingMethodReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCartsCartShippingMethodReq

**`Schema`**

StorePostCartsCartShippingMethodReq
type: object
required:
  - option_id
properties:
  option_id:
    type: string
    description: ID of the shipping option to create the method from.
  data:
    type: object
    description: Used to hold any data that the shipping method may need to process the fulfillment of the order. This depends on the fulfillment provider you're using.

## Properties

### data

• `Optional` **data**: [`Record`](../modules/internal.md#record)<`string`, `any`\>

#### Defined in

packages/medusa/dist/api/routes/store/carts/add-shipping-method.d.ts:72

___

### option\_id

• **option\_id**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/carts/add-shipping-method.d.ts:71
