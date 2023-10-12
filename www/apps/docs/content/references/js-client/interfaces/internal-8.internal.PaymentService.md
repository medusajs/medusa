---
displayed_sidebar: jsClientSidebar
---

# Interface: PaymentService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PaymentService

This will be

**`Deprecated`**

in the near future use the new PaymentProcessor interface instead

## Hierarchy

- [`TransactionBaseService`](../classes/internal-8.internal.TransactionBaseService.md)

  ↳ **`PaymentService`**

## Implemented by

- [`AbstractPaymentService`](../classes/internal-8.internal.AbstractPaymentService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__configModule__](../classes/internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__container__](../classes/internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](../classes/internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[manager_](../classes/internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[transactionManager_](../classes/internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

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

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[atomicPhase_](../classes/internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### authorizePayment

▸ **authorizePayment**(`paymentSession`, `context`): `Promise`<{ `data`: [`Data`](../modules/internal-8.internal.md#data) ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](../classes/internal-3.PaymentSession.md) |
| `context` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<{ `data`: [`Data`](../modules/internal-8.internal.md#data) ; `status`: [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)  }\>

**`Deprecated`**

in the near future use PaymentProcessor.authorizePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:71

___

### cancelPayment

▸ **cancelPayment**(`payment`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](../classes/internal-3.Payment.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.cancelPayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:90

___

### capturePayment

▸ **capturePayment**(`payment`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](../classes/internal-3.Payment.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.capturePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:79

___

### createPayment

▸ **createPayment**(`context`): `Promise`<[`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

This will be

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Cart`](../classes/internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext) | The type of this argument is meant to be temporary and once the previous method signature will be removed, the type will only be PaymentContext instead of Cart & PaymentContext |

#### Returns

`Promise`<[`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

**`Deprecated`**

in the near future use PaymentProcessor.initiatePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:48

▸ **createPayment**(`cart`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](../classes/internal-3.Cart.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use createPayment(context: `Cart & PaymentContext): Promise<PaymentSessionResponse>` instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:53

___

### deletePayment

▸ **deletePayment**(`paymentSession`): `Promise`<`void`\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](../classes/internal-3.PaymentSession.md) |

#### Returns

`Promise`<`void`\>

**`Deprecated`**

in the near future use PaymentProcessor.cancelPayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:95

___

### getIdentifier

▸ **getIdentifier**(): `string`

#### Returns

`string`

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:31

___

### getPaymentData

▸ **getPaymentData**(`paymentSession`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](../classes/internal-3.PaymentSession.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.retrievePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:36

___

### getStatus

▸ **getStatus**(`data`): `Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

**`Deprecated`**

in the near future use PaymentProcessor.getPaymentStatus instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:105

___

### refundPayment

▸ **refundPayment**(`payment`, `refundAmount`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](../classes/internal-3.Payment.md) |
| `refundAmount` | `number` |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.refundPayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:85

___

### retrievePayment

▸ **retrievePayment**(`paymentData`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentData` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.retrievePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:58

___

### retrieveSavedMethods

▸ **retrieveSavedMethods**(`customer`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)[]\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `customer` | [`Customer`](../classes/internal-3.Customer.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)[]\>

**`Deprecated`**

in the near future use PaymentProcessor.getSavedMethods instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:100

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](../classes/internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### updatePayment

▸ **updatePayment**(`paymentSessionData`, `context`): `Promise`<[`Data`](../modules/internal-8.internal.md#data) \| [`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |
| `context` | [`Cart`](../classes/internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data) \| [`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse)\>

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:59

▸ **updatePayment**(`paymentSessionData`, `cart`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |
| `cart` | [`Cart`](../classes/internal-3.Cart.md) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.updatePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:65

___

### updatePaymentData

▸ **updatePaymentData**(`paymentSessionData`, `data`): `Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

This will be

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionData` | [`Data`](../modules/internal-8.internal.md#data) |
| `data` | [`Data`](../modules/internal-8.internal.md#data) |

#### Returns

`Promise`<[`Data`](../modules/internal-8.internal.md#data)\>

**`Deprecated`**

in the near future use PaymentProcessor.updatePayment instead

#### Defined in

packages/medusa/dist/interfaces/payment-service.d.ts:42

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentService`](internal-8.internal.PaymentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentService`](internal-8.internal.PaymentService.md)

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[withTransaction](../classes/internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
