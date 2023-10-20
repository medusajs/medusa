---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Enumerations

- [BatchJobStatus](../enums/internal-2.BatchJobStatus.md)

## Classes

- [AdminGetBatchPaginationParams](../classes/internal-2.AdminGetBatchPaginationParams.md)
- [AdminGetBatchParams](../classes/internal-2.AdminGetBatchParams.md)
- [AdminPostBatchesReq](../classes/internal-2.AdminPostBatchesReq.md)
- [BatchJob](../classes/internal-2.BatchJob.md)
- [DateComparisonOperator](../classes/internal-2.DateComparisonOperator.md)

## Type Aliases

### AdminBatchJobListRes

Ƭ **AdminBatchJobListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `batch_jobs`: [`BatchJob`](../classes/internal-2.BatchJob.md)[]  }

**`Schema`**

AdminBatchJobListRes
type: object
required:
  - batch_jobs
  - count
  - offset
  - limit
properties:
  batch_jobs:
     type: array
     description: An array of batch job details.
     items:
       $ref: "#/components/schemas/BatchJob"
  count:
     type: integer
     description: The total number of items available
  offset:
     type: integer
     description: The number of batch jobs skipped when retrieving the batch jobs.
  limit:
     type: integer
     description: The number of items per page

#### Defined in

packages/medusa/dist/api/routes/admin/batch/index.d.ts:42

___

### AdminBatchJobRes

Ƭ **AdminBatchJobRes**: `Object`

**`Schema`**

AdminBatchJobRes
type: object
required:
  - batch_job
properties:
  batch_job:
    description: Batch job details.
    $ref: "#/components/schemas/BatchJob"

#### Type declaration

| Name | Type |
| :------ | :------ |
| `batch_job` | [`BatchJob`](../classes/internal-2.BatchJob.md) |

#### Defined in

packages/medusa/dist/api/routes/admin/batch/index.d.ts:15

___

### BatchJobResultError

Ƭ **BatchJobResultError**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `string` \| `number` |
| `message` | `string` |

#### Defined in

packages/medusa/dist/types/batch-job.d.ts:18

___

### BatchJobResultStatDescriptor

Ƭ **BatchJobResultStatDescriptor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `message` | `string` |
| `name` | `string` |

#### Defined in

packages/medusa/dist/types/batch-job.d.ts:23

___

### PaginatedResponse

Ƭ **PaginatedResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |
| `limit` | `number` |
| `offset` | `number` |

#### Defined in

packages/medusa/dist/types/common.d.ts:70
