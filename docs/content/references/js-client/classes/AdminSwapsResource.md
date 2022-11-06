# Class: AdminSwapsResource

## Hierarchy

- `default`

  ↳ **`AdminSwapsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-26.md#adminswapslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSwapsParams`](internal-26.AdminGetSwapsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-26.md#adminswapslistres)\>

#### Defined in

[medusa-js/src/resources/admin/swaps.ts:19](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa-js/src/resources/admin/swaps.ts#L19)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-26.md#adminswapsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-26.md#adminswapsres)\>

#### Defined in

[medusa-js/src/resources/admin/swaps.ts:11](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa-js/src/resources/admin/swaps.ts#L11)
