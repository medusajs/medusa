---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractPaymentProcessor

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractPaymentProcessor

Payment processor in charge of creating , managing and processing a payment

## Implements

- [`PaymentProcessor`](../interfaces/internal-8.internal.PaymentProcessor.md)

## Properties

### config

• `Protected` `Optional` `Readonly` **config**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:88

___

### container

• `Protected` `Readonly` **container**: [`MedusaContainer`](../modules/internal-8.md#medusacontainer-1)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:87

___

### identifier

▪ `Static` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:90

## Methods

### authorizePayment

▸ `Abstract` **authorizePayment**(`paymentSessionData`, `context`): `Promise`<[`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| { `data`: [`Record`](../modules/internal.md#record)<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

Authorize an existing session if it is not already authorized

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `context` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| { `data`: [`Record`](../modules/internal.md#record)<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[authorizePayment](../interfaces/internal-8.internal.PaymentProcessor.md#authorizepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:93

___

### cancelPayment

▸ `Abstract` **cancelPayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Cancel an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[cancelPayment](../interfaces/internal-8.internal.PaymentProcessor.md#cancelpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:97

___

### capturePayment

▸ `Abstract` **capturePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Capture an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[capturePayment](../interfaces/internal-8.internal.PaymentProcessor.md#capturepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:92

___

### deletePayment

▸ `Abstract` **deletePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Delete an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[deletePayment](../interfaces/internal-8.internal.PaymentProcessor.md#deletepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:99

___

### getIdentifier

▸ **getIdentifier**(): `string`

Return a unique identifier to retrieve the payment plugin provider

#### Returns

`string`

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[getIdentifier](../interfaces/internal-8.internal.PaymentProcessor.md#getidentifier)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:91

___

### getPaymentStatus

▸ `Abstract` **getPaymentStatus**(`paymentSessionData`): `Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

Return the status of the session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[getPaymentStatus](../interfaces/internal-8.internal.PaymentProcessor.md#getpaymentstatus)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:100

___

### initiatePayment

▸ `Abstract` **initiatePayment**(`context`): `Promise`<[`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

Initiate a payment session with the external provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`PaymentProcessorContext`](../modules/internal-8.internal.md#paymentprocessorcontext) |

#### Returns

`Promise`<[`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[initiatePayment](../interfaces/internal-8.internal.PaymentProcessor.md#initiatepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:98

___

### refundPayment

▸ `Abstract` **refundPayment**(`paymentSessionData`, `refundAmount`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Refund an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `refundAmount` | `number` |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[refundPayment](../interfaces/internal-8.internal.PaymentProcessor.md#refundpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:101

___

### retrievePayment

▸ `Abstract` **retrievePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Retrieve an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[retrievePayment](../interfaces/internal-8.internal.PaymentProcessor.md#retrievepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:102

___

### updatePayment

▸ `Abstract` **updatePayment**(`context`): `Promise`<`void` \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

Update an existing payment session

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`PaymentProcessorContext`](../modules/internal-8.internal.md#paymentprocessorcontext) |

#### Returns

`Promise`<`void` \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[updatePayment](../interfaces/internal-8.internal.PaymentProcessor.md#updatepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:103

___

### updatePaymentData

▸ `Abstract` **updatePaymentData**(`sessionId`, `data`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

Update the session data for a payment session

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/internal-8.internal.PaymentProcessorError.md)\>

#### Implementation of

[PaymentProcessor](../interfaces/internal-8.internal.PaymentProcessor.md).[updatePaymentData](../interfaces/internal-8.internal.PaymentProcessor.md#updatepaymentdata)

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:104
