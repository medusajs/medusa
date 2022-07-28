# Class: SystemPaymentProviderService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`SystemPaymentProviderService`**

## Constructors

### constructor

• **new SystemPaymentProviderService**(`_`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Overrides

BaseService.constructor

#### Defined in

[services/system-payment-provider.js:6](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L6)

## Properties

### identifier

▪ `Static` **identifier**: `string` = `"system"`

#### Defined in

[services/system-payment-provider.js:4](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L4)

## Methods

### authorizePayment

▸ **authorizePayment**(`_`): `Promise`<{ `data`: {} = {}; `status`: `string` = "authorized" }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{ `data`: {} = {}; `status`: `string` = "authorized" }\>

#### Defined in

[services/system-payment-provider.js:22](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L22)

___

### cancelPayment

▸ **cancelPayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L46)

___

### capturePayment

▸ **capturePayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L38)

___

### createPayment

▸ **createPayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:10](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L10)

___

### deletePayment

▸ **deletePayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L34)

___

### getPaymentData

▸ **getPaymentData**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:18](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L18)

___

### getStatus

▸ **getStatus**(`_`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<`string`\>

#### Defined in

[services/system-payment-provider.js:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L14)

___

### refundPayment

▸ **refundPayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L42)

___

### updatePayment

▸ **updatePayment**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L30)

___

### updatePaymentData

▸ **updatePaymentData**(`_`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `any` |

#### Returns

`Promise`<{}\>

#### Defined in

[services/system-payment-provider.js:26](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/system-payment-provider.js#L26)
