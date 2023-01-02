# Class: AdminSwapsResource

## Hierarchy

- `default`

  ↳ **`AdminSwapsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-29.md#adminswapslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSwapsParams`](internal-29.AdminGetSwapsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-29.md#adminswapslistres)\>

#### Defined in

[medusa-js/src/resources/admin/swaps.ts:19](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/swaps.ts#L19)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-29.md#adminswapsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-29.md#adminswapsres)\>

#### Defined in

[medusa-js/src/resources/admin/swaps.ts:11](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/swaps.ts#L11)
