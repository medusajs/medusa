# Class: AdminTaxRatesResource

## Hierarchy

- `default`

  ↳ **`AdminTaxRatesResource`**

## Methods

### addProductTypes

▸ **addProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateProductTypesReq`](internal-30.AdminPostTaxRatesTaxRateProductTypesReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:100](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L100)

___

### addProducts

▸ **addProducts**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateProductsReq`](internal-30.AdminPostTaxRatesTaxRateProductsReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:84](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L84)

___

### addShippingOptions

▸ **addShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateShippingOptionsReq`](internal-30.AdminPostTaxRatesTaxRateShippingOptionsReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:116](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L116)

___

### create

▸ **create**(`payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostTaxRatesReq`](internal-30.AdminPostTaxRatesReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:53](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L53)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:180](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L180)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesListRes`](../modules/internal-30.md#admintaxrateslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetTaxRatesParams`](internal-30.AdminGetTaxRatesParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesListRes`](../modules/internal-30.md#admintaxrateslistres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L39)

___

### removeProductTypes

▸ **removeProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateProductTypesReq`](internal-30.AdminDeleteTaxRatesTaxRateProductTypesReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateProductTypesParams`](internal-30.AdminDeleteTaxRatesTaxRateProductTypesParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:148](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L148)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateProductsReq`](internal-30.AdminDeleteTaxRatesTaxRateProductsReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateProductsParams`](internal-30.AdminDeleteTaxRatesTaxRateProductsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:132](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L132)

___

### removeShippingOptions

▸ **removeShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminDeleteTaxRatesTaxRateShippingOptionsReq`](internal-30.AdminDeleteTaxRatesTaxRateShippingOptionsReq.md) |
| `query?` | [`AdminDeleteTaxRatesTaxRateShippingOptionsParams`](internal-30.AdminDeleteTaxRatesTaxRateShippingOptionsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:164](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L164)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:24](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L24)

___

### update

▸ **update**(`id`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostTaxRatesTaxRateReq`](internal-30.AdminPostTaxRatesTaxRateReq.md) |
| `query?` | [`AdminGetTaxRatesTaxRateParams`](internal-30.AdminGetTaxRatesTaxRateParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminTaxRatesRes`](../modules/internal-30.md#admintaxratesres)\>

#### Defined in

[medusa-js/src/resources/admin/tax-rates.ts:68](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/tax-rates.ts#L68)
