---
displayed_sidebar: jsClientSidebar
---

# Class: AdminCustomResource

## Hierarchy

- `default`

  ↳ **`AdminCustomResource`**

## Methods

### delete

▸ **delete**<`TResponse`\>(`path`, `options?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | [`RequestOptions`](../interfaces/internal-5.RequestOptions.md) |
| `customHeaders?` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Defined in

[packages/medusa-js/src/resources/admin/custom.ts:47](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/custom.ts#L47)

___

### get

▸ **get**<`TQuery`, `TResponse`\>(`path`, `query?`, `options?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TQuery` | extends [`Record`](../modules/internal.md#record)<`string`, `any`\> |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `query?` | `TQuery` |
| `options?` | [`RequestOptions`](../interfaces/internal-5.RequestOptions.md) |
| `customHeaders?` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Defined in

[packages/medusa-js/src/resources/admin/custom.ts:8](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/custom.ts#L8)

___

### post

▸ **post**<`TPayload`, `TResponse`\>(`path`, `payload?`, `options?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TPayload` | extends [`Record`](../modules/internal.md#record)<`string`, `any`\> |
| `TResponse` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `payload?` | `TPayload` |
| `options?` | [`RequestOptions`](../interfaces/internal-5.RequestOptions.md) |
| `customHeaders?` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`TResponse`\>

#### Defined in

[packages/medusa-js/src/resources/admin/custom.ts:30](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/custom.ts#L30)
