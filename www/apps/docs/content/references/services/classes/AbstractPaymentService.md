# AbstractPaymentService

This will be

**Deprecated**

in the near future use the AbstractPaymentProcessor instead

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`AbstractPaymentService`**

## Implements

- [`"medusa-interfaces"`](../index.md#"medusa-interfaces")

## Constructors

### constructor

`Protected` **new AbstractPaymentService**(`container`, `config?`)

#### Parameters

| Name |
| :------ |
| `container` | `unknown` |
| `config?` | Record<`string`, `unknown`\> |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:149](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L149)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Implementation of

PaymentService.\_\_configModule\_\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

PaymentService.\_\_container\_\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Implementation of

PaymentService.\_\_moduleDeclaration\_\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Implementation of

PaymentService.manager\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Implementation of

PaymentService.transactionManager\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### identifier

 `Static` **identifier**: `string`

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:153](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L153)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Implementation of

PaymentService.activeManager\_

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Implementation of

PaymentService.atomicPhase\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

`Abstract` **authorizePayment**(`paymentSession`, `context`): `Promise`<{ `data`: [`Data`](../index.md#data) ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |
| `context` | [`Data`](../index.md#data) |

#### Returns

`Promise`<{ `data`: [`Data`](../index.md#data) ; `status`: [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)  }\>

-`Promise`: 
	-``object``: (optional) 

**Deprecated**

#### Implementation of

PaymentService.authorizePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:220](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L220)

___

### cancelPayment

`Abstract` **cancelPayment**(`payment`): `Promise`<[`Data`](../index.md#data)\>

This will be

#### Parameters

| Name | Description |
| :------ | :------ |
| `payment` | [`Payment`](Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

in the near future

#### Implementation of

PaymentService.cancelPayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:241](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L241)

___

### capturePayment

`Abstract` **capturePayment**(`payment`): `Promise`<[`Data`](../index.md#data)\>

This will be

#### Parameters

| Name | Description |
| :------ | :------ |
| `payment` | [`Payment`](Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

in the near future

#### Implementation of

PaymentService.capturePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:228](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L228)

___

### createPayment

`Abstract` **createPayment**(`context`): `Promise`<[`PaymentSessionResponse`](../index.md#paymentsessionresponse)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `context` | [`Cart`](Cart.md) & [`PaymentContext`](../index.md#paymentcontext) | The type of this argument is meant to be temporary and once the previous method signature will be removed, the type will only be PaymentContext instead of Cart & PaymentContext |

#### Returns

`Promise`<[`PaymentSessionResponse`](../index.md#paymentsessionresponse)\>

-`Promise`: 
	-`PaymentSessionResponse`: 
		-`session_data`: 
		-`update_requests`: 

#### Implementation of

PaymentService.createPayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:181](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L181)

`Abstract` **createPayment**(`cart`): `Promise`<[`Data`](../index.md#data)\>

This will be

#### Parameters

| Name |
| :------ |
| `cart` | [`Cart`](Cart.md) |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

in the near future use `createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse>` instead

#### Implementation of

PaymentService.createPayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:189](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L189)

___

### deletePayment

`Abstract` **deletePayment**(`paymentSession`): `Promise`<`void`\>

This will be

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |

#### Returns

`Promise`<`void`\>

-`Promise`: 

**Deprecated**

in the near future

#### Implementation of

PaymentService.deletePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:246](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L246)

___

### getIdentifier

**getIdentifier**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Implementation of

PaymentService.getIdentifier

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:155](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L155)

___

### getPaymentData

`Abstract` **getPaymentData**(`paymentSession`): `Promise`<[`Data`](../index.md#data)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

#### Implementation of

PaymentService.getPaymentData

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:165](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L165)

___

### getStatus

`Abstract` **getStatus**(`data`): `Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

This will be

#### Parameters

| Name |
| :------ |
| `data` | [`Data`](../index.md#data) |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

-`Promise`: 
	-`AUTHORIZED`: (optional) 
	-`CANCELED`: (optional) 
	-`ERROR`: (optional) 
	-`PENDING`: (optional) 
	-`REQUIRES_MORE`: (optional) 

**Deprecated**

in the near future

#### Implementation of

PaymentService.getStatus

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:259](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L259)

___

### refundPayment

`Abstract` **refundPayment**(`payment`, `refundAmount`): `Promise`<[`Data`](../index.md#data)\>

This will be

#### Parameters

| Name | Description |
| :------ | :------ |
| `payment` | [`Payment`](Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |
| `refundAmount` | `number` |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

in the near future

#### Implementation of

PaymentService.refundPayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:233](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L233)

___

### retrievePayment

`Abstract` **retrievePayment**(`paymentData`): `Promise`<[`Data`](../index.md#data)\>

#### Parameters

| Name |
| :------ |
| `paymentData` | [`Data`](../index.md#data) |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

#### Implementation of

PaymentService.retrievePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:194](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L194)

___

### retrieveSavedMethods

**retrieveSavedMethods**(`customer`): `Promise`<[`Data`](../index.md#data)[]\>

This will be

#### Parameters

| Name | Description |
| :------ | :------ |
| `customer` | [`Customer`](Customer.md) | A customer can make purchases in your store and manage their profile. |

#### Returns

`Promise`<[`Data`](../index.md#data)[]\>

-`Promise`: 
	-`Data[]`: 
		-`Data`: 

**Deprecated**

in the near future

#### Implementation of

PaymentService.retrieveSavedMethods

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:252](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L252)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Implementation of

PaymentService.shouldRetryTransaction\_

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### updatePayment

`Abstract` **updatePayment**(`paymentSessionData`, `context`): `Promise`<Record<`string`, `unknown`\> \| [`PaymentSessionResponse`](../index.md#paymentsessionresponse)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../index.md#data) |
| `context` | [`Cart`](Cart.md) & [`PaymentContext`](../index.md#paymentcontext) | The type of this argument is meant to be temporary and once the previous method signature will be removed, the type will only be PaymentContext instead of Cart & PaymentContext |

#### Returns

`Promise`<Record<`string`, `unknown`\> \| [`PaymentSessionResponse`](../index.md#paymentsessionresponse)\>

-`Promise`: it return either a PaymentSessionResponse or PaymentSessionResponse["session_data"] to maintain backward compatibility
	-`Record<string, unknown\> \| PaymentSessionResponse`: (optional) 

#### Implementation of

PaymentService.updatePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:202](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L202)

`Abstract` **updatePayment**(`paymentSessionData`, `cart`): `Promise`<[`Data`](../index.md#data)\>

This will be

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | [`Data`](../index.md#data) |
| `cart` | [`Cart`](Cart.md) |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

in the near future use `updatePayment(paymentSessionData: PaymentSessionData, context: Cart & PaymentContext): Promise<PaymentSessionResponse>` instead

#### Implementation of

PaymentService.updatePayment

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:212](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L212)

___

### updatePaymentData

`Abstract` **updatePaymentData**(`paymentSessionData`, `data`): `Promise`<[`Data`](../index.md#data)\>

#### Parameters

| Name |
| :------ |
| `paymentSessionData` | [`Data`](../index.md#data) |
| `data` | [`Data`](../index.md#data) |

#### Returns

`Promise`<[`Data`](../index.md#data)\>

-`Promise`: 
	-`Data`: 

**Deprecated**

#### Implementation of

PaymentService.updatePaymentData

#### Defined in

[packages/medusa/src/interfaces/payment-service.ts:172](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/payment-service.ts#L172)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`AbstractPaymentService`](AbstractPaymentService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`AbstractPaymentService`](AbstractPaymentService.md)

-`AbstractPaymentService`: 

#### Implementation of

PaymentService.withTransaction

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
