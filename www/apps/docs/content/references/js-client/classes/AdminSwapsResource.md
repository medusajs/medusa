---
displayed_sidebar: jsClientSidebar
---

# Class: AdminSwapsResource

## Hierarchy

- `default`

  ↳ **`AdminSwapsResource`**

## Methods

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-8.internal.md#adminswapslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSwapsParams`](internal-8.internal.AdminGetSwapsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSwapsListRes`](../modules/internal-8.internal.md#adminswapslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/swaps.ts:19](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/swaps.ts#L19)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-8.internal.md#adminswapsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSwapsRes`](../modules/internal-8.internal.md#adminswapsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/swaps.ts:11](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/swaps.ts#L11)
