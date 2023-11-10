# AbstractPaymentProcessor

Payment processor in charge of creating , managing and processing a payment

## Implements

- [`PaymentProcessor`](../interfaces/PaymentProcessor.md)

## Constructors

### constructor

`Protected` **new AbstractPaymentProcessor**(`container`, `config?`)

#### Parameters

| Name |
| :------ |
| `container` | [`MedusaContainer`](../index.md#medusacontainer) |
| `config?` | Record<`string`, `unknown`\> |

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:138](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L138)

## Properties

### config

 `Protected` `Optional` `Readonly` **config**: Record<`string`, `unknown`\>

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:140](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L140)

___

### container

 `Protected` `Readonly` **container**: [`MedusaContainer`](../index.md#medusacontainer)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:139](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L139)

___

### identifier

 `Static` **identifier**: `string`

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:143](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L143)

## Methods

### authorizePayment

`Abstract` **authorizePayment**(`paymentSessionData`, `context`): `Promise`<[`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

Authorize an existing session if it is not already authorized

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |
| `context` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

-`Promise`: 
	-`PaymentProcessorError \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[authorizePayment](../interfaces/PaymentProcessor.md#authorizepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:161](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L161)

___

### cancelPayment

`Abstract` **cancelPayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Cancel an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[cancelPayment](../interfaces/PaymentProcessor.md#cancelpayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:172](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L172)

___

### capturePayment

`Abstract` **capturePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Capture an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[capturePayment](../interfaces/PaymentProcessor.md#capturepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:155](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L155)

___

### deletePayment

`Abstract` **deletePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Delete an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[deletePayment](../interfaces/PaymentProcessor.md#deletepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:182](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L182)

___

### getIdentifier

**getIdentifier**(): `string`

Return a unique identifier to retrieve the payment plugin provider

#### Returns

`string`

-`string`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[getIdentifier](../interfaces/PaymentProcessor.md#getidentifier)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:145](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L145)

___

### getPaymentStatus

`Abstract` **getPaymentStatus**(`paymentSessionData`): `Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

Return the status of the session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

-`Promise`: 
	-`AUTHORIZED`: (optional) 
	-`CANCELED`: (optional) 
	-`ERROR`: (optional) 
	-`PENDING`: (optional) 
	-`REQUIRES_MORE`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[getPaymentStatus](../interfaces/PaymentProcessor.md#getpaymentstatus)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:188](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L188)

___

### initiatePayment

`Abstract` **initiatePayment**(`context`): `Promise`<[`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../index.md#paymentprocessorsessionresponse)\>

Initiate a payment session with the external provider

#### Parameters

| Name |
| :------ |
| `context` | [`PaymentProcessorContext`](../index.md#paymentprocessorcontext) |

#### Returns

`Promise`<[`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../index.md#paymentprocessorsessionresponse)\>

-`Promise`: 
	-`PaymentProcessorError \| PaymentProcessorSessionResponse`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[initiatePayment](../interfaces/PaymentProcessor.md#initiatepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:178](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L178)

___

### refundPayment

`Abstract` **refundPayment**(`paymentSessionData`, `refundAmount`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Refund an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |
| `refundAmount` | `number` |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[refundPayment](../interfaces/PaymentProcessor.md#refundpayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:192](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L192)

___

### retrievePayment

`Abstract` **retrievePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Retrieve an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[retrievePayment](../interfaces/PaymentProcessor.md#retrievepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:199](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L199)

___

### updatePayment

`Abstract` **updatePayment**(`context`): `Promise`<`void` \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../index.md#paymentprocessorsessionresponse)\>

Update an existing payment session

#### Parameters

| Name |
| :------ |
| `context` | [`PaymentProcessorContext`](../index.md#paymentprocessorcontext) |

#### Returns

`Promise`<`void` \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../index.md#paymentprocessorsessionresponse)\>

-`Promise`: 
	-`void \| PaymentProcessorError \| PaymentProcessorSessionResponse`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[updatePayment](../interfaces/PaymentProcessor.md#updatepayment)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:205](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L205)

___

### updatePaymentData

`Abstract` **updatePaymentData**(`sessionId`, `data`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

Update the session data for a payment session

#### Parameters

| Name |
| :------ |
| `sessionId` | `string` |
| `data` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Implementation of

[PaymentProcessor](../interfaces/PaymentProcessor.md).[updatePaymentData](../interfaces/PaymentProcessor.md#updatepaymentdata)

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:209](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-processor.ts#L209)
