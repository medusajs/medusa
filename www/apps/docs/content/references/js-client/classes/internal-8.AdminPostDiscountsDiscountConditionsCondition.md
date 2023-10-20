---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDiscountsDiscountConditionsCondition

[internal](../modules/internal-8.md).AdminPostDiscountsDiscountConditionsCondition

**`Schema`**

AdminPostDiscountsDiscountConditionsCondition
type: object
properties:
  products:
     type: array
     description: list of product IDs if the condition's type is `products`.
     items:
       type: string
  product_types:
     type: array
     description: list of product type IDs if the condition's type is `product_types`.
     items:
       type: string
  product_collections:
     type: array
     description: list of product collection IDs if the condition's type is `product_collections`.
     items:
       type: string
  product_tags:
     type: array
     description: list of product tag IDs if the condition's type is `product_tags`
     items:
       type: string
  customer_groups:
     type: array
     description: list of customer group IDs if the condition's type is `customer_groups`.
     items:
       type: string

## Hierarchy

- [`AdminUpsertConditionsReq`](internal-8.AdminUpsertConditionsReq.md)

  ↳ **`AdminPostDiscountsDiscountConditionsCondition`**

## Properties

### customer\_groups

• `Optional` **customer\_groups**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[customer_groups](internal-8.AdminUpsertConditionsReq.md#customer_groups)

#### Defined in

packages/medusa/dist/types/discount.d.ts:21

___

### product\_collections

• `Optional` **product\_collections**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[product_collections](internal-8.AdminUpsertConditionsReq.md#product_collections)

#### Defined in

packages/medusa/dist/types/discount.d.ts:18

___

### product\_tags

• `Optional` **product\_tags**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[product_tags](internal-8.AdminUpsertConditionsReq.md#product_tags)

#### Defined in

packages/medusa/dist/types/discount.d.ts:20

___

### product\_types

• `Optional` **product\_types**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[product_types](internal-8.AdminUpsertConditionsReq.md#product_types)

#### Defined in

packages/medusa/dist/types/discount.d.ts:19

___

### products

• `Optional` **products**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[products](internal-8.AdminUpsertConditionsReq.md#products)

#### Defined in

packages/medusa/dist/types/discount.d.ts:17
