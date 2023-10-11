---
displayed_sidebar: jsClientSidebar
---

# Interface: PaymentProcessor

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PaymentProcessor

The new payment service plugin interface
This work is still experimental and can be changed until it becomes stable

## Implemented by

- [`AbstractPaymentProcessor`](../classes/internal-8.internal.AbstractPaymentProcessor.md)

## Methods

### authorizePayment

▸ **authorizePayment**(`paymentSessionData`, `context`): `Promise`<[`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| { `data`: [`Record`](../modules/internal.md#record)<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

Authorize an existing session if it is not already authorized

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `context` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| { `data`: [`Record`](../modules/internal.md#record)<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:53

___

### cancelPayment

▸ **cancelPayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Cancel an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:73

___

### capturePayment

▸ **capturePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Capture an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:61

___

### deletePayment

▸ **deletePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Delete an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:65

___

### getIdentifier

▸ **getIdentifier**(): `string`

Return a unique identifier to retrieve the payment plugin provider

#### Returns

`string`

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:32

___

### getPaymentStatus

▸ **getPaymentStatus**(`paymentSessionData`): `Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

Return the status of the session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:77

___

### initiatePayment

▸ **initiatePayment**(`context`): `Promise`<[`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

Initiate a payment session with the external provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`PaymentProcessorContext`](../modules/internal-8.internal.md#paymentprocessorcontext) |

#### Returns

`Promise`<[`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:36

___

### refundPayment

▸ **refundPayment**(`paymentSessionData`, `refundAmount`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Refund an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `refundAmount` | `number` |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:47

___

### retrievePayment

▸ **retrievePayment**(`paymentSessionData`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Retrieve an existing session

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:69

___

### updatePayment

▸ **updatePayment**(`context`): `Promise`<`void` \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

Update an existing payment session

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`PaymentProcessorContext`](../modules/internal-8.internal.md#paymentprocessorcontext) |

#### Returns

`Promise`<`void` \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../modules/internal-8.internal.md#paymentprocessorsessionresponse)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:41

___

### updatePaymentData

▸ **updatePaymentData**(`sessionId`, `data`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

Update the session data for a payment session

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentProcessorError`](internal-8.internal.PaymentProcessorError.md)\>

#### Defined in

packages/medusa/dist/interfaces/payment-processor.d.ts:81
