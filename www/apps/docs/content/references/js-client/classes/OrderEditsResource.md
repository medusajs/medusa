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

[order-edits.ts:26](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/order-edits.ts#L26)

___

### decline

▸ **decline**(`id`, `payload`, `customHeaders?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `StorePostOrderEditsOrderEditDecline` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[order-edits.ts:17](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/order-edits.ts#L17)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreOrderEditsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`StoreOrderEditsRes`\>

#### Defined in

[order-edits.ts:9](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/order-edits.ts#L9)
