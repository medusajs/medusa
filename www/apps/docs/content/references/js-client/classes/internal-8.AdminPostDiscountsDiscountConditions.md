---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDiscountsDiscountConditions

[internal](../modules/internal-8.md).AdminPostDiscountsDiscountConditions

**`Schema`**

AdminPostDiscountsDiscountConditions
type: object
required:
  - operator
properties:
  operator:
     description: "Operator of the condition. `in` indicates that discountable resources are within the specified resources. `not_in` indicates that
      discountable resources are everything but the specified resources."
     type: string
     enum: [in, not_in]
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
     description: list of product tag IDs if the condition's type is `product_tags`.
     items:
       type: string
  customer_groups:
     type: array
     description: list of customer group IDs if the condition's type is `customer_groups`.
     items:
       type: string

## Hierarchy

- [`AdminUpsertConditionsReq`](internal-8.AdminUpsertConditionsReq.md)

  ↳ **`AdminPostDiscountsDiscountConditions`**

## Properties

### customer\_groups

• `Optional` **customer\_groups**: `string`[]

#### Inherited from

[AdminUpsertConditionsReq](internal-8.AdminUpsertConditionsReq.md).[customer_groups](internal-8.AdminUpsertConditionsReq.md#customer_groups)

#### Defined in

packages/medusa/dist/types/discount.d.ts:21

___

### operator

• **operator**: [`DiscountConditionOperator`](../enums/internal-3.DiscountConditionOperator.md)

#### Defined in

packages/medusa/dist/api/routes/admin/discounts/create-condition.d.ts:113

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
