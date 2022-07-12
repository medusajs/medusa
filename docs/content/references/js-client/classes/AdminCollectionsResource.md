# Class: AdminCollectionsResource

## Hierarchy

- `default`

  ↳ **`AdminCollectionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

**`description`** Creates a collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostCollectionsReq`](internal.AdminPostCollectionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

Created collection.

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:20](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/collections.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** deletes a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of collection to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

Deleted response

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:50](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/collections.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal.md#admincollectionslistres)\>

**`description`** Lists collections matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetCollectionsParams`](internal.AdminGetCollectionsParams.md) | Query for searching collections |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsListRes`](../modules/internal.md#admincollectionslistres)\>

a list of collections matching the query.

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:72](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/collections.ts#L72)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

**`description`** get a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

the collection with the given id

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:61](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/collections.ts#L61)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

**`description`** Updates a collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection to update. |
| `payload` | [`AdminPostCollectionsCollectionReq`](internal.AdminPostCollectionsCollectionReq.md) | update to apply to collection. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminCollectionsRes`](../modules/internal.md#admincollectionsres)\>

the updated collection.

#### Defined in

[packages/medusa-js/src/resources/admin/collections.ts:35](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/collections.ts#L35)
