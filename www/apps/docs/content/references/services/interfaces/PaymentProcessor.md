# PaymentProcessor

The new payment service plugin interface
This work is still experimental and can be changed until it becomes stable

## Implemented by

- [`AbstractPaymentProcessor`](../classes/AbstractPaymentProcessor.md)

## Methods

### authorizePayment

**authorizePayment**(`paymentSessionData`, `context`): `Promise`<[`PaymentProcessorError`](PaymentProcessorError.md) \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

Authorize an existing session if it is not already authorized

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |
| `context` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentProcessorError`](PaymentProcessorError.md) \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

-`Promise`: 
	-`PaymentProcessorError \| { `data`: Record<`string`, `unknown`\> ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L68)

___

### cancelPayment

**cancelPayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Cancel an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:110](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L110)

___

### capturePayment

**capturePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Capture an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:83](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L83)

___

### deletePayment

**deletePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Delete an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:92](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L92)

___

### getIdentifier

**getIdentifier**(): `string`

Return a unique identifier to retrieve the payment plugin provider

#### Returns

`string`

-`string`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L34)

___

### getPaymentStatus

**getPaymentStatus**(`paymentSessionData`): `Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

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

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:119](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L119)

___

### initiatePayment

**initiatePayment**(`context`): `Promise`<[`PaymentProcessorError`](PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../types/PaymentProcessorSessionResponse.md)\>

Initiate a payment session with the external provider

#### Parameters

| Name |
| :------ |
| `context` | [`PaymentProcessorContext`](../types/PaymentProcessorContext.md) |

#### Returns

`Promise`<[`PaymentProcessorError`](PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../types/PaymentProcessorSessionResponse.md)\>

-`Promise`: 
	-`PaymentProcessorError \| PaymentProcessorSessionResponse`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:39](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L39)

___

### refundPayment

**refundPayment**(`paymentSessionData`, `refundAmount`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Refund an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |
| `refundAmount` | `number` |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L56)

___

### retrievePayment

**retrievePayment**(`paymentSessionData`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Retrieve an existing session

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:101](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L101)

___

### updatePayment

**updatePayment**(`context`): `Promise`<`void` \| [`PaymentProcessorError`](PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../types/PaymentProcessorSessionResponse.md)\>

Update an existing payment session

#### Parameters

| Name |
| :------ |
| `context` | [`PaymentProcessorContext`](../types/PaymentProcessorContext.md) |

#### Returns

`Promise`<`void` \| [`PaymentProcessorError`](PaymentProcessorError.md) \| [`PaymentProcessorSessionResponse`](../types/PaymentProcessorSessionResponse.md)\>

-`Promise`: 
	-`void \| PaymentProcessorError \| PaymentProcessorSessionResponse`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:47](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L47)

___

### updatePaymentData

**updatePaymentData**(`sessionId`, `data`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

Update the session data for a payment session

#### Parameters

| Name |
| :------ |
| `sessionId` | `string` |
| `data` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentProcessorError`](PaymentProcessorError.md)\>

-`Promise`: 
	-`Record<string, unknown\> \| PaymentProcessorError`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/payment-processor.ts:126](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/payment-processor.ts#L126)
