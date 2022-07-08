# Class: CollectionsResource

## Hierarchy

- `default`

  ↳ **`CollectionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal.md#storecollectionslistres)\>

**`description`** Retrieves a list of collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetCollectionsParams`](internal.StoreGetCollectionsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal.md#storecollectionslistres)\>

#### Defined in

[packages/medusa-js/src/resources/collections.ts:28](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/collections.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal.md#storecollectionsres)\>

**`description`** Retrieves a single collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal.md#storecollectionsres)\>

#### Defined in

[packages/medusa-js/src/resources/collections.ts:17](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/collections.ts#L17)
