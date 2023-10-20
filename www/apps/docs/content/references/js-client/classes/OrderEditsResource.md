---
displayed_sidebar: jsClientSidebar
---

# Class: OrderEditsResource

## Hierarchy

- `default`

  ↳ **`OrderEditsResource`**

## Methods

### complete

▸ **complete**(`id`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa-js/src/resources/order-edits.ts:26](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/order-edits.ts#L26)

___

### decline

▸ **decline**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostOrderEditsOrderEditDecline`](internal-8.internal.StorePostOrderEditsOrderEditDecline.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa-js/src/resources/order-edits.ts:17](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/order-edits.ts#L17)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrderEditsRes`](../modules/internal-8.internal.md#storeordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrderEditsRes`](../modules/internal-8.internal.md#storeordereditsres)\>

#### Defined in

[packages/medusa-js/src/resources/order-edits.ts:9](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/order-edits.ts#L9)
