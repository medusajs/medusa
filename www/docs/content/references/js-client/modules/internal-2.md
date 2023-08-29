# Namespace: internal

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

#### Defined in

medusa/dist/api/routes/admin/batch/index.d.ts:9

___

### AdminBatchJobRes

Ƭ **AdminBatchJobRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `batch_job` | [`BatchJob`](../classes/internal-2.BatchJob.md) |

#### Defined in

medusa/dist/api/routes/admin/batch/index.d.ts:5

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

medusa/dist/types/batch-job.d.ts:18

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

medusa/dist/types/batch-job.d.ts:23

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

medusa/dist/types/common.d.ts:60
