# Class: AdminTaxRatesResource

## Hierarchy

- `default`

  ↳ **`AdminTaxRatesResource`**

## Methods

### addProductTypes

▸ **addProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostTaxRatesTaxRateProductTypesReq` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:100](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L100)

___

### addProducts

▸ **addProducts**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostTaxRatesTaxRateProductsReq` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:84](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L84)

___

### addShippingOptions

▸ **addShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostTaxRatesTaxRateShippingOptionsReq` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:116](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L116)

___

### create

▸ **create**(`payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostTaxRatesReq` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:53](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L53)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

#### Defined in

[admin/tax-rates.ts:180](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L180)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetTaxRatesParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesListRes`\>

#### Defined in

[admin/tax-rates.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L39)

___

### removeProductTypes

▸ **removeProductTypes**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminDeleteTaxRatesTaxRateProductTypesReq` |
| `query?` | `AdminDeleteTaxRatesTaxRateProductTypesParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:148](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L148)

___

### removeProducts

▸ **removeProducts**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminDeleteTaxRatesTaxRateProductsReq` |
| `query?` | `AdminDeleteTaxRatesTaxRateProductsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:132](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L132)

___

### removeShippingOptions

▸ **removeShippingOptions**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminDeleteTaxRatesTaxRateShippingOptionsReq` |
| `query?` | `AdminDeleteTaxRatesTaxRateShippingOptionsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:164](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L164)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:24](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L24)

___

### update

▸ **update**(`id`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminTaxRatesRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostTaxRatesTaxRateReq` |
| `query?` | `AdminGetTaxRatesTaxRateParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminTaxRatesRes`\>

#### Defined in

[admin/tax-rates.ts:68](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/tax-rates.ts#L68)
