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
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[medusa-js/src/resources/order-edits.ts:26](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/order-edits.ts#L26)

___

### decline

▸ **decline**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`StorePostOrderEditsOrderEditDecline`](internal-37.StorePostOrderEditsOrderEditDecline.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[medusa-js/src/resources/order-edits.ts:17](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/order-edits.ts#L17)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrderEditsRes`](../modules/internal-37.md#storeordereditsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrderEditsRes`](../modules/internal-37.md#storeordereditsres)\>

#### Defined in

[medusa-js/src/resources/order-edits.ts:9](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/order-edits.ts#L9)
