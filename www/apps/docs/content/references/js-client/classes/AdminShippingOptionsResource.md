---
displayed_sidebar: jsClientSidebar
---

# Class: AdminShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`AdminShippingOptionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingOptionsReq`](internal-8.internal.AdminPostShippingOptionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

created shipping option.

**`Description`**

creates a shipping option.

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:20](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-options.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of shipping option to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

deleted response

**`Description`**

deletes a shipping option

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-options.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal-8.internal.md#adminshippingoptionslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetShippingOptionsParams`](internal-8.internal.AdminGetShippingOptionsParams.md) | query for searching shipping options |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal-8.internal.md#adminshippingoptionslistres)\>

a list of shipping options matching the query.

**`Description`**

lists shipping options matching a query

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:78](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-options.ts#L78)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

the shipping option with the given id

**`Description`**

get a shipping option

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:64](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-options.ts#L64)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to update. |
| `payload` | [`AdminPostShippingOptionsOptionReq`](internal-8.internal.AdminPostShippingOptionsOptionReq.md) | update to apply to shipping option. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal-8.internal.md#adminshippingoptionsres)\>

the updated shipping option.

**`Description`**

updates a shipping option

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:35](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/shipping-options.ts#L35)
