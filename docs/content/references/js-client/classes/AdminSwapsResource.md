# Class: AdminSwapsResource

## Hierarchy

- `default`

  ↳ **`AdminSwapsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal.md#adminswapslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSwapsParams`](internal.AdminGetSwapsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal.md#adminswapslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/swaps.ts:16](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/swaps.ts#L16)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal.md#adminswapsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSwapsRes`](../modules/internal.md#adminswapsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/swaps.ts:11](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/swaps.ts#L11)
