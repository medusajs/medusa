# Class: AdminCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminCollectionsResource`**

## Methods

### addProducts

▸ **addProducts**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCollectionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | `AdminPostProductsToCollectionReq` | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCollectionsRes`\>

**`Description`**

Updates products associated with a Product Collection

#### Defined in

[admin/collections.ts:101](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L101)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminCollectionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostCollectionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminCollectionsRes`\>

Created collection.

**`Description`**

Creates a collection.

#### Defined in

[admin/collections.ts:23](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L23)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of collection to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

Deleted response

**`Description`**

deletes a collection

#### Defined in

[admin/collections.ts:53](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L53)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminCollectionsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetCollectionsParams` | Query for searching collections |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCollectionsListRes`\>

a list of collections matching the query.

**`Description`**

Lists collections matching a query

#### Defined in

[admin/collections.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L81)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminDeleteProductsFromCollectionRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Collection |
| `payload` | `AdminDeleteProductsFromCollectionReq` | an object which contains an array of Product IDs to add to the Product Collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminDeleteProductsFromCollectionRes`\>

**`Description`**

Removes products associated with a Product Collection

#### Defined in

[admin/collections.ts:116](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L116)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminCollectionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCollectionsRes`\>

the collection with the given id

**`Description`**

get a collection

#### Defined in

[admin/collections.ts:67](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L67)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminCollectionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to update. |
| `payload` | `AdminPostCollectionsCollectionReq` | update to apply to collection. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminCollectionsRes`\>

the updated collection.

**`Description`**

Updates a collection

#### Defined in

[admin/collections.ts:38](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/collections.ts#L38)
