---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostDiscountsDiscountConditionsConditionBatchReq

[internal](../modules/internal-8.md).AdminPostDiscountsDiscountConditionsConditionBatchReq

**`Schema`**

AdminPostDiscountsDiscountConditionsConditionBatchReq
type: object
required:
  - resources
properties:
  resources:
    description: The resources to be added to the discount condition
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

packages/medusa/dist/api/routes/admin/discounts/add-resources-to-condition-batch.d.ts:92
