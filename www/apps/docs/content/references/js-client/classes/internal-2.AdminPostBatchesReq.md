---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostBatchesReq

[internal](../modules/internal-2.md).AdminPostBatchesReq

**`Schema`**

AdminPostBatchesReq
type: object
required:
  - type
  - context
properties:
  type:
    type: string
    description: The type of batch job to start, which is defined by the `batchType` property of the associated batch job strategy.
    example: product-export
  context:
    type: object
    description: Additional infomration regarding the batch to be used for processing.
    example:
      shape:
        prices:
          - region: null
            currency_code: "eur"
        dynamicImageColumnCount: 4
        dynamicOptionColumnCount: 2
      list_config:
        skip: 0
        take: 50
        order:
          created_at: "DESC"
        relations:
          - variants
          - variant.prices
          - images
  dry_run:
    type: boolean
    description: Set a batch job in dry_run mode, which would delay executing the batch job until it's confirmed.
    default: false

## Properties

### context

• **context**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/batch/create-batch-job.d.ts:108

___

### dry\_run

• **dry\_run**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/batch/create-batch-job.d.ts:109

___

### type

• **type**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/batch/create-batch-job.d.ts:107
