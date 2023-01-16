# Class: AdminCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminCollectionsResource`**

## Methods

### addProducts

▸ **addProducts**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

**`Description`**

Updates products associated with a Product Collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | [`AdminPostProductsToCollectionReq`](internal-3.AdminPostProductsToCollectionReq.md) | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

#### Defined in

[medusa-js/src/resources/admin/collections.ts:100](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L100)

___

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

[medusa-js/src/resources/admin/collections.ts:22](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L22)

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

[medusa-js/src/resources/admin/collections.ts:52](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L52)

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

[medusa-js/src/resources/admin/collections.ts:80](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L80)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

Removes products associated with a Product Collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | [`AdminDeleteProductsFromCollectionReq`](internal-3.AdminDeleteProductsFromCollectionReq.md) | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/collections.ts:115](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L115)

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

[medusa-js/src/resources/admin/collections.ts:66](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L66)

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

[medusa-js/src/resources/admin/collections.ts:37](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/collections.ts#L37)
