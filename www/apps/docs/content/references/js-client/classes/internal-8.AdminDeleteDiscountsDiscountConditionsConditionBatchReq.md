---
displayed_sidebar: jsClientSidebar
---

# Class: AdminDeleteDiscountsDiscountConditionsConditionBatchReq

[internal](../modules/internal-8.md).AdminDeleteDiscountsDiscountConditionsConditionBatchReq

**`Schema`**

AdminDeleteDiscountsDiscountConditionsConditionBatchReq
type: object
required:
  - resources
properties:
  resources:
    description: The resources to be removed from the discount condition
    type: array
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: The id of the item
          type: string

## Properties

### resources

• **resources**: { `id`: `string`  }[]

#### Defined in

packages/medusa/dist/api/routes/admin/discounts/delete-resources-from-condition-batch.d.ts:92
