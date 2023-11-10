# PaymentProviderService

Helps retrieve payment providers

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`PaymentProviderService`**

## Constructors

### constructor

**new PaymentProviderService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | [`InjectedDependencies`](../types/InjectedDependencies-24.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L70)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

 `Protected` `Readonly` **container\_**: [`InjectedDependencies`](../types/InjectedDependencies-24.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L55)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:65](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L65)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L68)

___

### logger\_

 `Protected` `Readonly` **logger\_**: [`Logger`](../types/Logger-2.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L66)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderRepository\_

 `Protected` `Readonly` **paymentProviderRepository\_**: [`Repository`](Repository.md)<[`PaymentProvider`](PaymentProvider.md)\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L58)

___

### paymentRepository\_

 `Protected` `Readonly` **paymentRepository\_**: [`Repository`](Repository.md)<[`Payment`](Payment.md)\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:59](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L59)

___

### paymentSessionRepository\_

 `Protected` `Readonly` **paymentSessionRepository\_**: [`Repository`](Repository.md)<[`PaymentSession`](PaymentSession.md)\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L56)

___

### refundRepository\_

 `Protected` `Readonly` **refundRepository\_**: [`Repository`](Repository.md)<[`Refund`](Refund.md)\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:64](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L64)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### paymentService\_

`Protected` `get` **paymentService_**(): [`PaymentService`](PaymentService.md)

#### Returns

[`PaymentService`](PaymentService.md)

-`default`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:60](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L60)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

**authorizePayment**(`paymentSession`, `context`): `Promise`<`undefined` \| [`PaymentSession`](PaymentSession.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |
| `context` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<`undefined` \| [`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`undefined \| PaymentSession`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:523](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L523)

___

### buildPaymentProcessorContext

`Protected` **buildPaymentProcessorContext**(`cartOrData`): [`Cart`](Cart.md) & [`PaymentContext`](../types/PaymentContext.md)

Build the create session context for both legacy and new API

#### Parameters

| Name |
| :------ |
| `cartOrData` | [`Cart`](Cart.md) \| [`PaymentSessionInput`](../types/PaymentSessionInput.md) |

#### Returns

[`Cart`](Cart.md) & [`PaymentContext`](../types/PaymentContext.md)

-`[`Cart`](Cart.md) & [`PaymentContext`](../types/PaymentContext.md)`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:845](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L845)

___

### cancelPayment

**cancelPayment**(`paymentObj`): `Promise`<[`Payment`](Payment.md)\>

#### Parameters

| Name |
| :------ |
| `paymentObj` | [`Partial`](../types/Partial.md)<[`Payment`](Payment.md)\> & { `id`: `string`  } |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:602](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L602)

___

### capturePayment

**capturePayment**(`paymentObj`): `Promise`<[`Payment`](Payment.md)\>

#### Parameters

| Name |
| :------ |
| `paymentObj` | [`Partial`](../types/Partial.md)<[`Payment`](Payment.md)\> & { `id`: `string`  } |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:641](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L641)

___

### createPayment

**createPayment**(`data`): `Promise`<[`Payment`](Payment.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreatePaymentInput`](../types/CreatePaymentInput.md) |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:471](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L471)

___

### createSession

**createSession**(`providerId`, `cart`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

#### Parameters

| Name |
| :------ |
| `providerId` | `string` |
| `cart` | [`Cart`](Cart.md) |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`PaymentSession`: 

**Deprecated**

#### Defined in

[packages/medusa/src/services/payment-provider.ts:205](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L205)

**createSession**(`sessionInput`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Creates a payment session with the given provider.

#### Parameters

| Name |
| :------ |
| `sessionInput` | [`PaymentSessionInput`](../types/PaymentSessionInput.md) |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:211](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L211)

___

### deleteSession

**deleteSession**(`paymentSession`): `Promise`<`undefined` \| [`PaymentSession`](PaymentSession.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |

#### Returns

`Promise`<`undefined` \| [`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`undefined \| PaymentSession`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:402](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L402)

___

### getStatus

**getStatus**(`payment`): `Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `payment` | [`Payment`](Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |

#### Returns

`Promise`<[`PaymentSessionStatus`](../enums/PaymentSessionStatus.md)\>

-`Promise`: 
	-`AUTHORIZED`: (optional) 
	-`CANCELED`: (optional) 
	-`ERROR`: (optional) 
	-`PENDING`: (optional) 
	-`REQUIRES_MORE`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:630](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L630)

___

### list

**list**(): `Promise`<[`PaymentProvider`](PaymentProvider.md)[]\>

#### Returns

`Promise`<[`PaymentProvider`](PaymentProvider.md)[]\>

-`Promise`: 
	-`PaymentProvider[]`: 
		-`PaymentProvider`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:102](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L102)

___

### listPayments

**listPayments**(`selector`, `config?`): `Promise`<[`Payment`](Payment.md)[]\>

List all the payments according to the given selector and config.

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`Payment`](Payment.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Payment`](Payment.md)\> |

#### Returns

`Promise`<[`Payment`](Payment.md)[]\>

-`Promise`: 
	-`Payment[]`: 
		-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:154](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L154)

___

### processUpdateRequestsData

`Protected` **processUpdateRequestsData**(`data?`, `paymentResponse`): `Promise`<`void`\>

Process the collected data. Can be used every time we need to process some collected data returned by the provider

#### Parameters

| Name |
| :------ |
| `data` | `object` |
| `data.customer?` | `object` |
| `data.customer.id?` | `string` |
| `paymentResponse` | Record<`string`, `unknown`\> \| [`PaymentSessionResponse`](../types/PaymentSessionResponse.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:935](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L935)

___

### refreshSession

**refreshSession**(`paymentSession`, `sessionInput`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Refreshes a payment session with the given provider.
This means, that we delete the current one and create a new.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | `object` | the payment session object to update |
| `paymentSession.data` | Record<`string`, `unknown`\> |
| `paymentSession.id` | `string` |
| `paymentSession.provider_id` | `string` |
| `sessionInput` | [`PaymentSessionInput`](../types/PaymentSessionInput.md) |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: the payment session
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:301](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L301)

___

### refundFromPayment

**refundFromPayment**(`payment`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](Refund.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `payment` | [`Payment`](Payment.md) | A payment is originally created from a payment session. Once a payment session is authorized, the payment is created to represent the authorized amount with a given payment method. Payments can be captured, canceled or refunded. Payments can be made towards orders, swaps, order edits, or other resources. |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<[`Refund`](Refund.md)\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:771](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L771)

___

### refundPayment

**refundPayment**(`payObjs`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](Refund.md)\>

#### Parameters

| Name |
| :------ |
| `payObjs` | [`Payment`](Payment.md)[] |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<[`Refund`](Refund.md)\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:672](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L672)

___

### registerInstalledProviders

**registerInstalledProviders**(`providerIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `providerIds` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:83](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L83)

___

### retrievePayment

**retrievePayment**(`paymentId`, `relations?`): `Promise`<[`Payment`](Payment.md)\>

Retrieve a payment entity with the given id.

#### Parameters

| Name | Default value |
| :------ | :------ |
| `paymentId` | `string` |
| `relations` | `string`[] | [] |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:114](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L114)

___

### retrieveProvider

**retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends [`AbstractPaymentService`](AbstractPaymentService.md) ? [`AbstractPaymentService`](AbstractPaymentService.md) : `TProvider` extends [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) ? [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) : `any`

Finds a provider given an id

| Name | Type |
| :------ | :------ |
| `TProvider` | `unknown` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `providerId` | `string` | the id of the provider to get |

#### Returns

`TProvider` extends [`AbstractPaymentService`](AbstractPaymentService.md) ? [`AbstractPaymentService`](AbstractPaymentService.md) : `TProvider` extends [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) ? [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) : `any`

-``TProvider` extends [`AbstractPaymentService`](AbstractPaymentService.md) ? [`AbstractPaymentService`](AbstractPaymentService.md) : `TProvider` extends [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) ? [`AbstractPaymentProcessor`](AbstractPaymentProcessor.md) : `any``: (optional) the payment provider

#### Defined in

[packages/medusa/src/services/payment-provider.ts:442](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L442)

___

### retrieveRefund

**retrieveRefund**(`id`, `config?`): `Promise`<[`Refund`](Refund.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Refund`](Refund.md)\> |

#### Returns

`Promise`<[`Refund`](Refund.md)\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:822](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L822)

___

### retrieveSession

**retrieveSession**(`paymentSessionId`, `relations?`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Return the payment session for the given id.

#### Parameters

| Name | Default value |
| :------ | :------ |
| `paymentSessionId` | `string` |
| `relations` | `string`[] | [] |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:172](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L172)

___

### saveSession

`Protected` **saveSession**(`providerId`, `data`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Create or update a Payment session data.

#### Parameters

| Name |
| :------ |
| `providerId` | `string` |
| `data` | `object` |
| `data.amount?` | `number` |
| `data.cartId?` | `string` |
| `data.isInitiated?` | `boolean` |
| `data.isSelected?` | `boolean` |
| `data.payment_session_id?` | `string` |
| `data.sessionData` | Record<`string`, `unknown`\> |
| `data.status?` | [`PaymentSessionStatus`](../enums/PaymentSessionStatus.md) |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:887](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L887)

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

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### throwFromPaymentProcessorError

`Private` **throwFromPaymentProcessorError**(`errObj`): `void`

#### Parameters

| Name |
| :------ |
| `errObj` | [`PaymentProcessorError`](../interfaces/PaymentProcessorError.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:954](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L954)

___

### updatePayment

**updatePayment**(`paymentId`, `data`): `Promise`<[`Payment`](Payment.md)\>

#### Parameters

| Name |
| :------ |
| `paymentId` | `string` |
| `data` | `object` |
| `data.order_id?` | `string` |
| `data.swap_id?` | `string` |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:512](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L512)

___

### updateSession

**updateSession**(`paymentSession`, `sessionInput`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Update a payment session with the given provider.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | `object` | The paymentSession to update |
| `paymentSession.data` | Record<`string`, `unknown`\> |
| `paymentSession.id` | `string` |
| `paymentSession.provider_id` | `string` |
| `sessionInput` | [`Cart`](Cart.md) \| [`PaymentSessionInput`](../types/PaymentSessionInput.md) |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: the payment session
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:342](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L342)

___

### updateSessionData

**updateSessionData**(`paymentSession`, `data`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | [`PaymentSession`](PaymentSession.md) | A Payment Session is created when a Customer initilizes the checkout flow, and can be used to hold the state of a payment flow. Each Payment Session is controlled by a Payment Provider, which is responsible for the communication with external payment services. Authorized Payment Sessions will eventually get promoted to Payments to indicate that they are authorized for payment processing such as capture or refund. Payment sessions can also be used as part of payment collections. |
| `data` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-provider.ts:569](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-provider.ts#L569)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PaymentProviderService`](PaymentProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`PaymentProviderService`](PaymentProviderService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
