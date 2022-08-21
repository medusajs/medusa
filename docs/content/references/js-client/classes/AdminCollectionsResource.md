# Class: AdminCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminCollectionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

**`Description`**

Creates a collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostCollectionsReq`](internal-3.AdminPostCollectionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

Created collection.

#### Defined in

[medusa-js/src/resources/admin/collections.ts:20](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/collections.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

deletes a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of collection to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

Deleted response

#### Defined in

[medusa-js/src/resources/admin/collections.ts:50](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/collections.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal-3.md#admincollectionslistres)\>

**`Description`**

Lists collections matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCollectionsParams`](internal-3.AdminGetCollectionsParams.md) | Query for searching collections |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal-3.md#admincollectionslistres)\>

a list of collections matching the query.

#### Defined in

[medusa-js/src/resources/admin/collections.ts:78](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/collections.ts#L78)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

**`Description`**

get a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

the collection with the given id

#### Defined in

[medusa-js/src/resources/admin/collections.ts:64](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/collections.ts#L64)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

**`Description`**

Updates a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to update. |
| `payload` | [`AdminPostCollectionsCollectionReq`](internal-3.AdminPostCollectionsCollectionReq.md) | update to apply to collection. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

the updated collection.

#### Defined in

[medusa-js/src/resources/admin/collections.ts:35](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/admin/collections.ts#L35)
