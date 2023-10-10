---
displayed_sidebar: jsClientSidebar
---

# Class: ReturnReasonsResource

## Hierarchy

- `default`

  ↳ **`ReturnReasonsResource`**

## Methods

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal-8.internal.md#storereturnreasonslistres)\>

Lists return reasons defined in Medusa Admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnReasonsListRes`](../modules/internal-8.internal.md#storereturnreasonslistres)\>

#### Defined in

[packages/medusa-js/src/resources/return-reasons.ts:25](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/return-reasons.ts#L25)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal-8.internal.md#storereturnreasonsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreReturnReasonsRes`](../modules/internal-8.internal.md#storereturnreasonsres)\>

**`Description`**

Retrieves a single Return Reason

#### Defined in

[packages/medusa-js/src/resources/return-reasons.ts:15](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/return-reasons.ts#L15)
