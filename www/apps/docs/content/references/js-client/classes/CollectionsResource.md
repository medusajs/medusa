---
displayed_sidebar: jsClientSidebar
---

# Class: CollectionsResource

## Hierarchy

- `default`

  ↳ **`CollectionsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal-8.internal.md#storecollectionslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`StoreGetCollectionsParams`](internal-8.internal.StoreGetCollectionsParams.md) | is optional. Can contain a limit and offset for the returned list |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreCollectionsListRes`](../modules/internal-8.internal.md#storecollectionslistres)\>

**`Description`**

Retrieves a list of collections

#### Defined in

[packages/medusa-js/src/resources/collections.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/collections.ts#L28)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal-8.internal.md#storecollectionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the collection |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreCollectionsRes`](../modules/internal-8.internal.md#storecollectionsres)\>

**`Description`**

Retrieves a single collection

#### Defined in

[packages/medusa-js/src/resources/collections.ts:17](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/collections.ts#L17)
