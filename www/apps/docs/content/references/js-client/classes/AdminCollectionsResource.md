---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminCollectionsResource`**

## Methods

### addProducts

▸ **addProducts**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | [`AdminPostProductsToCollectionReq`](internal-3.AdminPostProductsToCollectionReq.md) | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

**`Description`**

Updates products associated with a Product Collection

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:101](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L101)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostCollectionsReq`](internal-3.AdminPostCollectionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

Created collection.

**`Description`**

Creates a collection.

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:23](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L23)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of collection to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Deleted response

**`Description`**

deletes a collection

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:53](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L53)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal-3.md#admincollectionslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCollectionsParams`](internal-3.AdminGetCollectionsParams.md) | Query for searching collections |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal-3.md#admincollectionslistres)\>

a list of collections matching the query.

**`Description`**

Lists collections matching a query

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:81](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L81)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDeleteProductsFromCollectionRes`](../modules/internal-3.md#admindeleteproductsfromcollectionres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | [`AdminDeleteProductsFromCollectionReq`](internal-3.AdminDeleteProductsFromCollectionReq.md) | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminDeleteProductsFromCollectionRes`](../modules/internal-3.md#admindeleteproductsfromcollectionres)\>

**`Description`**

Removes products associated with a Product Collection

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:116](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L116)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

the collection with the given id

**`Description`**

get a collection

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:67](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L67)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to update. |
| `payload` | [`AdminPostCollectionsCollectionReq`](internal-3.AdminPostCollectionsCollectionReq.md) | update to apply to collection. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal-3.md#admincollectionsres)\>

the updated collection.

**`Description`**

Updates a collection

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:38](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/collections.ts#L38)
