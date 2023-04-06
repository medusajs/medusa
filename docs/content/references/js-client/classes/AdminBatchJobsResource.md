# Class: AdminBatchJobsResource

## Hierarchy

- `default`

  ↳ **`AdminBatchJobsResource`**

## Methods

### cancel

▸ **cancel**(`batchJobId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Defined in

[medusa-js/src/resources/admin/batch-jobs.ts:35](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/batch-jobs.ts#L35)

___

### confirm

▸ **confirm**(`batchJobId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Defined in

[medusa-js/src/resources/admin/batch-jobs.ts:43](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/batch-jobs.ts#L43)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostBatchesReq`](internal-2.AdminPostBatchesReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Defined in

[medusa-js/src/resources/admin/batch-jobs.ts:13](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/batch-jobs.ts#L13)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobListRes`](../modules/internal-2.md#adminbatchjoblistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetBatchParams`](internal-2.AdminGetBatchParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobListRes`](../modules/internal-2.md#adminbatchjoblistres)\>

#### Defined in

[medusa-js/src/resources/admin/batch-jobs.ts:21](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/batch-jobs.ts#L21)

___

### retrieve

▸ **retrieve**(`batchJobId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminBatchJobRes`](../modules/internal-2.md#adminbatchjobres)\>

#### Defined in

[medusa-js/src/resources/admin/batch-jobs.ts:51](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/batch-jobs.ts#L51)
