---
displayed_sidebar: jsClientSidebar
---

# Class: AdminTaxRatesResource

## Hierarchy

- `default`

  ↳ **`AdminTaxRatesResource`**

## Methods

### addProductTypes

▸ **addProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateProductTypesReq`](internal-8.internal.AdminPostTaxRatesTaxRateProductTypesReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:100](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L100)

___

### addProducts

▸ **addProducts**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateProductsReq`](internal-8.internal.AdminPostTaxRatesTaxRateProductsReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:84](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L84)

___

### addShippingOptions

▸ **addShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateShippingOptionsReq`](internal-8.internal.AdminPostTaxRatesTaxRateShippingOptionsReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:116](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L116)

___

### create

▸ **create**(`payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostTaxRatesReq`](internal-8.internal.AdminPostTaxRatesReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:53](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L53)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:180](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L180)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesListRes`](../modules/internal-8.internal.md#admintaxrateslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetTaxRatesParams`](internal-8.internal.AdminGetTaxRatesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesListRes`](../modules/internal-8.internal.md#admintaxrateslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L39)

___

### removeProductTypes

▸ **removeProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateProductTypesReq`](internal-8.internal.AdminDeleteTaxRatesTaxRateProductTypesReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateProductTypesParams`](internal-8.internal.AdminDeleteTaxRatesTaxRateProductTypesParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:148](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L148)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateProductsReq`](internal-8.internal.AdminDeleteTaxRatesTaxRateProductsReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateProductsParams`](internal-8.internal.AdminDeleteTaxRatesTaxRateProductsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:132](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L132)

___

### removeShippingOptions

▸ **removeShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateShippingOptionsReq`](internal-8.internal.AdminDeleteTaxRatesTaxRateShippingOptionsReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateShippingOptionsParams`](internal-8.internal.AdminDeleteTaxRatesTaxRateShippingOptionsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:164](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L164)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:24](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L24)

___

### update

▸ **update**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateReq`](internal-8.internal.AdminPostTaxRatesTaxRateReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-8.internal.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-8.internal.md#admintaxratesres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/tax-rates.ts:68](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/tax-rates.ts#L68)
