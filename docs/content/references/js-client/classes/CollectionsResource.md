# Class: CollectionsResource

## Hierarchy

- `default`

  ↳ **`CollectionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal-36.md#storecollectionslistres)\>

**`Description`**

Retrieves a list of collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetCollectionsParams`](internal-36.StoreGetCollectionsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal-36.md#storecollectionslistres)\>

#### Defined in

[medusa-js/src/resources/collections.ts:28](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/collections.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal-36.md#storecollectionsres)\>

**`Description`**

Retrieves a single collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal-36.md#storecollectionsres)\>

#### Defined in

[medusa-js/src/resources/collections.ts:17](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/collections.ts#L17)
