# Class: AdminBatchJobsResource

## Hierarchy

- `default`

  ↳ **`AdminBatchJobsResource`**

## Methods

### cancel

▸ **cancel**(`batchJobId`, `customHeaders?`): `ResponsePromise`<`AdminBatchJobRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBatchJobRes`\>

#### Defined in

[admin/batch-jobs.ts:35](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/batch-jobs.ts#L35)

___

### confirm

▸ **confirm**(`batchJobId`, `customHeaders?`): `ResponsePromise`<`AdminBatchJobRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBatchJobRes`\>

#### Defined in

[admin/batch-jobs.ts:43](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/batch-jobs.ts#L43)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminBatchJobRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostBatchesReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBatchJobRes`\>

#### Defined in

[admin/batch-jobs.ts:13](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/batch-jobs.ts#L13)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminBatchJobListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetBatchParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBatchJobListRes`\>

#### Defined in

[admin/batch-jobs.ts:21](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/batch-jobs.ts#L21)

___

### retrieve

▸ **retrieve**(`batchJobId`, `customHeaders?`): `ResponsePromise`<`AdminBatchJobRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBatchJobRes`\>

#### Defined in

[admin/batch-jobs.ts:51](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/batch-jobs.ts#L51)
