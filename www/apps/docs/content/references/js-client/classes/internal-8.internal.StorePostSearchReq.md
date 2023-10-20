---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostSearchReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostSearchReq

**`Schema`**

StorePostSearchReq
type: object
properties:
 q:
   type: string
   description: The search query.
 offset:
   type: number
   description: The number of products to skip when retrieving the products.
 limit:
   type: number
   description: Limit the number of products returned.
 filter:
   description: Pass filters based on the search service.

## Properties

### filter

• `Optional` **filter**: `unknown`

#### Defined in

packages/medusa/dist/api/routes/store/products/search.d.ts:76

___

### limit

• `Optional` **limit**: `number`

#### Defined in

packages/medusa/dist/api/routes/store/products/search.d.ts:75

___

### offset

• `Optional` **offset**: `number`

#### Defined in

packages/medusa/dist/api/routes/store/products/search.d.ts:74

___

### q

• `Optional` **q**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/products/search.d.ts:73
