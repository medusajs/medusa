---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractPaymentService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractPaymentService

This will be

**`Deprecated`**

in the near future use the AbstractPaymentProcessor instead

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AbstractPaymentService`**

## Implements

- [`PaymentService`](../interfaces/internal-8.internal.PaymentService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[__configModule__](../interfaces/internal-8.internal.PaymentService.md#__configmodule__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[__container__](../interfaces/internal-8.internal.PaymentService.md#__container__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[__moduleDeclaration__](../interfaces/internal-8.internal.PaymentService.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[manager_](../interfaces/internal-8.internal.PaymentService.md#manager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[transactionManager_](../interfaces/internal-8.internal.PaymentService.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### identifier

▪ `Static` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:112

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Implementation of

PaymentService.activeManager\_

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[atomicPhase_](../interfaces/internal-8.internal.PaymentService.md#atomicphase_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### authorizePayment

▸ `Abstract` **authorizePayment**(`paymentSession`, `context`): `Promise`<{ `data`: [`Data`](../modules/internal-8.internal.md#data) ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |
| `context` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<{ `data`: [`Data`](../modules/internal-8.internal.md#data) ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

**`Deprecated`**

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[authorizePayment](../interfaces/internal-8.internal.PaymentService.md#authorizepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:152

___

### cancelPayment

▸ `Abstract` **cancelPayment**(`payment`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](internal-3.Payment.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[cancelPayment](../interfaces/internal-8.internal.PaymentService.md#cancelpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:167

___

### capturePayment

▸ `Abstract` **capturePayment**(`payment`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](internal-3.Payment.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[capturePayment](../interfaces/internal-8.internal.PaymentService.md#capturepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:159

___

### createPayment

▸ `Abstract` **createPayment**(`context`): `Promise`<[`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Cart`](internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext) | The type of this argument is meant to be temporary and once the previous method signature will be removed, the type will only be PaymentContext instead of Cart & PaymentContext |

#### Returns

`Promise`<[`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[createPayment](../interfaces/internal-8.internal.PaymentService.md#createpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:126

▸ `Abstract` **createPayment**(`cart`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use `createPayment(context: Cart & PaymentContext): Promise<PaymentSessionResponse>` instead

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[createPayment](../interfaces/internal-8.internal.PaymentService.md#createpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:131

___

### deletePayment

▸ `Abstract` **deletePayment**(`paymentSession`): `Promise`<`void`\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |

#### Returns

`Promise`<`void`\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[deletePayment](../interfaces/internal-8.internal.PaymentService.md#deletepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:171

___

### getIdentifier

▸ **getIdentifier**(): `string`

#### Returns

`string`

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[getIdentifier](../interfaces/internal-8.internal.PaymentService.md#getidentifier)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:113

___

### getPaymentData

▸ `Abstract` **getPaymentData**(`paymentSession`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[getPaymentData](../interfaces/internal-8.internal.PaymentService.md#getpaymentdata)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:117

___

### getStatus

▸ `Abstract` **getStatus**(`data`): `Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[getStatus](../interfaces/internal-8.internal.PaymentService.md#getstatus)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:179

___

### refundPayment

▸ `Abstract` **refundPayment**(`payment`, `refundAmount`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](internal-3.Payment.md) |
| `refundAmount` | `number` |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[refundPayment](../interfaces/internal-8.internal.PaymentService.md#refundpayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:163

___

### retrievePayment

▸ `Abstract` **retrievePayment**(`paymentData`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentData` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[retrievePayment](../interfaces/internal-8.internal.PaymentService.md#retrievepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:135

___

### retrieveSavedMethods

▸ **retrieveSavedMethods**(`customer`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)[]\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `customer` | [`Customer`](internal-3.Customer.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)[]\>

**`Deprecated`**

in the near future

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[retrieveSavedMethods](../interfaces/internal-8.internal.PaymentService.md#retrievesavedmethods)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:175

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[shouldRetryTransaction_](../interfaces/internal-8.internal.PaymentService.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### updatePayment

▸ `Abstract` **updatePayment**(`paymentSessionData`, `context`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |  |
| `context` | [`Cart`](internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext) | The type of this argument is meant to be temporary and once the previous method signature will be removed, the type will only be PaymentContext instead of Cart & PaymentContext |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

it return either a PaymentSessionResponse or PaymentSessionResponse["session_data"] to maintain backward compatibility

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[updatePayment](../interfaces/internal-8.internal.PaymentService.md#updatepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:142

▸ `Abstract` **updatePayment**(`paymentSessionData`, `cart`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use `updatePayment(paymentSessionData: PaymentSessionData, context: Cart & PaymentContext): Promise<PaymentSessionResponse>` instead

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[updatePayment](../interfaces/internal-8.internal.PaymentService.md#updatepayment)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:148

___

### updatePaymentData

▸ `Abstract` **updatePaymentData**(`paymentSessionData`, `data`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |
| `data` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[updatePaymentData](../interfaces/internal-8.internal.PaymentService.md#updatepaymentdata)

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:121

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md)

#### Implementation of

[PaymentService](../interfaces/internal-8.internal.PaymentService.md).[withTransaction](../interfaces/internal-8.internal.PaymentService.md#withtransaction)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
