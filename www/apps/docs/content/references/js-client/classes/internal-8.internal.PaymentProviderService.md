---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentProviderService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PaymentProviderService

Helps retrieve payment providers

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`PaymentProviderService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### container\_

• `Protected` `Readonly` **container\_**: [`InjectedDependencies`](../modules/internal-8.md#injecteddependencies-22)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:33

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:39

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:41

___

### logger\_

• `Protected` `Readonly` **logger\_**: [`Logger`](../modules/internal-8.internal.md#logger)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:40

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<[`PaymentProvider`](internal-3.PaymentProvider.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:35

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:36

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: `Repository`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:34

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: `Repository`<[`Refund`](internal-3.Refund.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:38

___

### throwFromPaymentProcessorError

• `Private` **throwFromPaymentProcessorError**: `any`

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:154

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

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

___

### paymentService\_

• `Protected` `get` **paymentService_**(): [`PaymentService`](internal-8.PaymentService.md)

#### Returns

[`PaymentService`](internal-8.PaymentService.md)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:37

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### authorizePayment

▸ **authorizePayment**(`paymentSession`, `context`): `Promise`<`undefined` \| [`PaymentSession`](internal-3.PaymentSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |
| `context` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`undefined` \| [`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:110

___

### buildPaymentProcessorContext

▸ `Protected` **buildPaymentProcessorContext**(`cartOrData`): [`Cart`](internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext)

Build the create session context for both legacy and new API

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrData` | [`Cart`](internal-3.Cart.md) \| [`PaymentSessionInput`](../modules/internal-8.md#paymentsessioninput) |

#### Returns

[`Cart`](internal-3.Cart.md) & [`PaymentContext`](../modules/internal-8.internal.md#paymentcontext)

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:127

___

### cancelPayment

▸ **cancelPayment**(`paymentObj`): `Promise`<[`Payment`](internal-3.Payment.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | [`Partial`](../modules/internal-8.md#partial)<[`Payment`](internal-3.Payment.md)\> & { `id`: `string`  } |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:112

___

### capturePayment

▸ **capturePayment**(`paymentObj`): `Promise`<[`Payment`](internal-3.Payment.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | [`Partial`](../modules/internal-8.md#partial)<[`Payment`](internal-3.Payment.md)\> & { `id`: `string`  } |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:116

___

### createPayment

▸ **createPayment**(`data`): `Promise`<[`Payment`](internal-3.Payment.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreatePaymentInput`](../modules/internal-8.md#createpaymentinput) |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:105

___

### createSession

▸ **createSession**(`providerId`, `cart`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerId` | `string` |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

**`Deprecated`**

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:68

▸ **createSession**(`sessionInput`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Creates a payment session with the given provider.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionInput` | [`PaymentSessionInput`](../modules/internal-8.md#paymentsessioninput) |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:73

___

### deleteSession

▸ **deleteSession**(`paymentSession`): `Promise`<`undefined` \| [`PaymentSession`](internal-3.PaymentSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |

#### Returns

`Promise`<`undefined` \| [`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:98

___

### getStatus

▸ **getStatus**(`payment`): `Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](internal-3.Payment.md) |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:115

___

### list

▸ **list**(): `Promise`<[`PaymentProvider`](internal-3.PaymentProvider.md)[]\>

#### Returns

`Promise`<[`PaymentProvider`](internal-3.PaymentProvider.md)[]\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:44

___

### listPayments

▸ **listPayments**(`selector`, `config?`): `Promise`<[`Payment`](internal-3.Payment.md)[]\>

List all the payments according to the given selector and config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Payment`](internal-3.Payment.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Payment`](internal-3.Payment.md)\> |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)[]\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:56

___

### processUpdateRequestsData

▸ `Protected` **processUpdateRequestsData**(`data`, `paymentResponse`): `Promise`<`void`\>

Process the collected data. Can be used every time we need to process some collected data returned by the provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `undefined` \| { `customer?`: { `id?`: `string`  }  } |
| `paymentResponse` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| [`PaymentSessionResponse`](../modules/internal-8.internal.md#paymentsessionresponse) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:149

___

### refreshSession

▸ **refreshSession**(`paymentSession`, `sessionInput`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Refreshes a payment session with the given provider.
This means, that we delete the current one and create a new.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `Object` | the payment session object to update |
| `paymentSession.data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | - |
| `paymentSession.id` | `string` | - |
| `paymentSession.provider_id` | `string` | - |
| `sessionInput` | [`PaymentSessionInput`](../modules/internal-8.md#paymentsessioninput) |  |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

the payment session

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:82

___

### refundFromPayment

▸ **refundFromPayment**(`payment`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](internal-3.Refund.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`Payment`](internal-3.Payment.md) |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<[`Refund`](internal-3.Refund.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:120

___

### refundPayment

▸ **refundPayment**(`payObjs`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](internal-3.Refund.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payObjs` | [`Payment`](internal-3.Payment.md)[] |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<[`Refund`](internal-3.Refund.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:119

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providerIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:43

___

### retrievePayment

▸ **retrievePayment**(`paymentId`, `relations?`): `Promise`<[`Payment`](internal-3.Payment.md)\>

Retrieve a payment entity with the given id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:50

___

### retrieveProvider

▸ **retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md) ? [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md) : `TProvider` extends [`AbstractPaymentProcessor`](internal-8.internal.AbstractPaymentProcessor.md) ? [`AbstractPaymentProcessor`](internal-8.internal.AbstractPaymentProcessor.md) : `any`

Finds a provider given an id

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TProvider` | extends `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the id of the provider to get |

#### Returns

`TProvider` extends [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md) ? [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md) : `TProvider` extends [`AbstractPaymentProcessor`](internal-8.internal.AbstractPaymentProcessor.md) ? [`AbstractPaymentProcessor`](internal-8.internal.AbstractPaymentProcessor.md) : `any`

the payment provider

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:104

___

### retrieveRefund

▸ **retrieveRefund**(`id`, `config?`): `Promise`<[`Refund`](internal-3.Refund.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Refund`](internal-3.Refund.md)\> |

#### Returns

`Promise`<[`Refund`](internal-3.Refund.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:121

___

### retrieveSession

▸ **retrieveSession**(`paymentSessionId`, `relations?`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Return the payment session for the given id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSessionId` | `string` |
| `relations?` | `string`[] |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:62

___

### saveSession

▸ `Protected` **saveSession**(`providerId`, `data`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Create or update a Payment session data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerId` | `string` |
| `data` | `Object` |
| `data.amount?` | `number` |
| `data.cartId?` | `string` |
| `data.isInitiated?` | `boolean` |
| `data.isSelected?` | `boolean` |
| `data.payment_session_id?` | `string` |
| `data.sessionData` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |
| `data.status?` | [`PaymentSessionStatus`](../enums/internal-8.internal.PaymentSessionStatus.md) |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:134

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### updatePayment

▸ **updatePayment**(`paymentId`, `data`): `Promise`<[`Payment`](internal-3.Payment.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |
| `data` | `Object` |
| `data.order_id?` | `string` |
| `data.swap_id?` | `string` |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:106

___

### updateSession

▸ **updateSession**(`paymentSession`, `sessionInput`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Update a payment session with the given provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `Object` | The paymentSession to update |
| `paymentSession.data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | - |
| `paymentSession.id` | `string` | - |
| `paymentSession.provider_id` | `string` | - |
| `sessionInput` | [`Cart`](internal-3.Cart.md) \| [`PaymentSessionInput`](../modules/internal-8.md#paymentsessioninput) |  |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

the payment session

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:93

___

### updateSessionData

▸ **updateSessionData**(`paymentSession`, `data`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](internal-3.PaymentSession.md) |
| `data` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/payment-provider.d.ts:111

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
