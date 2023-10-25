# PaymentProviderService

Helps retrieve payment providers

## Hierarchy

- `TransactionBaseService`

  ↳ **`PaymentProviderService`**

## Constructors

### constructor

**new PaymentProviderService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/payment-provider.ts:70](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L70)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

 `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[medusa/src/services/payment-provider.ts:55](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L55)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/payment-provider.ts:65](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L65)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/payment-provider.ts:68](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L68)

___

### logger\_

 `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[medusa/src/services/payment-provider.ts:66](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L66)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderRepository\_

 `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<`PaymentProvider`\>

#### Defined in

[medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L58)

___

### paymentRepository\_

 `Protected` `Readonly` **paymentRepository\_**: `Repository`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:59](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L59)

___

### paymentSessionRepository\_

 `Protected` `Readonly` **paymentSessionRepository\_**: `Repository`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:56](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L56)

___

### refundRepository\_

 `Protected` `Readonly` **refundRepository\_**: `Repository`<`Refund`\>

#### Defined in

[medusa/src/services/payment-provider.ts:64](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L64)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### paymentService\_

`Protected` `get` **paymentService_**(): [`PaymentService`](PaymentService.md)

#### Returns

[`PaymentService`](PaymentService.md)

-`default`: 

#### Defined in

[medusa/src/services/payment-provider.ts:60](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L60)

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
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

**authorizePayment**(`paymentSession`, `context`): `Promise`<`undefined` \| `PaymentSession`\>

#### Parameters

| Name |
| :------ |
| `paymentSession` | `PaymentSession` |
| `context` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<`undefined` \| `PaymentSession`\>

-`Promise`: 
	-`undefined \| PaymentSession`: (optional) 

#### Defined in

[medusa/src/services/payment-provider.ts:523](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L523)

___

### buildPaymentProcessorContext

`Protected` **buildPaymentProcessorContext**(`cartOrData`): `Cart` & `PaymentContext`

Build the create session context for both legacy and new API

#### Parameters

| Name |
| :------ |
| `cartOrData` | `Cart` \| `PaymentSessionInput` |

#### Returns

`Cart` & `PaymentContext`

-``Cart` & `PaymentContext``: (optional) 

#### Defined in

[medusa/src/services/payment-provider.ts:845](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L845)

___

### cancelPayment

**cancelPayment**(`paymentObj`): `Promise`<`Payment`\>

#### Parameters

| Name |
| :------ |
| `paymentObj` | `Partial`<`Payment`\> & { `id`: `string`  } |

#### Returns

`Promise`<`Payment`\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:602](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L602)

___

### capturePayment

**capturePayment**(`paymentObj`): `Promise`<`Payment`\>

#### Parameters

| Name |
| :------ |
| `paymentObj` | `Partial`<`Payment`\> & { `id`: `string`  } |

#### Returns

`Promise`<`Payment`\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:641](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L641)

___

### createPayment

**createPayment**(`data`): `Promise`<`Payment`\>

#### Parameters

| Name |
| :------ |
| `data` | `CreatePaymentInput` |

#### Returns

`Promise`<`Payment`\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:471](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L471)

___

### createSession

**createSession**(`providerId`, `cart`): `Promise`<`PaymentSession`\>

#### Parameters

| Name |
| :------ |
| `providerId` | `string` |
| `cart` | `Cart` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: 
	-`PaymentSession`: 

**Deprecated**

#### Defined in

[medusa/src/services/payment-provider.ts:205](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L205)

**createSession**(`sessionInput`): `Promise`<`PaymentSession`\>

Creates a payment session with the given provider.

#### Parameters

| Name |
| :------ |
| `sessionInput` | `PaymentSessionInput` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:211](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L211)

___

### deleteSession

**deleteSession**(`paymentSession`): `Promise`<`undefined` \| `PaymentSession`\>

#### Parameters

| Name |
| :------ |
| `paymentSession` | `PaymentSession` |

#### Returns

`Promise`<`undefined` \| `PaymentSession`\>

-`Promise`: 
	-`undefined \| PaymentSession`: (optional) 

#### Defined in

[medusa/src/services/payment-provider.ts:402](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L402)

___

### getStatus

**getStatus**(`payment`): `Promise`<`PaymentSessionStatus`\>

#### Parameters

| Name |
| :------ |
| `payment` | `Payment` |

#### Returns

`Promise`<`PaymentSessionStatus`\>

-`Promise`: 

#### Defined in

[medusa/src/services/payment-provider.ts:630](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L630)

___

### list

**list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

-`Promise`: 
	-`PaymentProvider[]`: 
		-`PaymentProvider`: 

#### Defined in

[medusa/src/services/payment-provider.ts:102](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L102)

___

### listPayments

**listPayments**(`selector`, `config?`): `Promise`<`Payment`[]\>

List all the payments according to the given selector and config.

#### Parameters

| Name |
| :------ |
| `selector` | `Selector`<`Payment`\> |
| `config` | `FindConfig`<`Payment`\> |

#### Returns

`Promise`<`Payment`[]\>

-`Promise`: 
	-`Payment[]`: 
		-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:154](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L154)

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
| `paymentResponse` | Record<`string`, `unknown`\> \| `PaymentSessionResponse` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/payment-provider.ts:935](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L935)

___

### refreshSession

**refreshSession**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

Refreshes a payment session with the given provider.
This means, that we delete the current one and create a new.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | `object` | the payment session object to update |
| `paymentSession.data` | Record<`string`, `unknown`\> |
| `paymentSession.id` | `string` |
| `paymentSession.provider_id` | `string` |
| `sessionInput` | `PaymentSessionInput` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: the payment session
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:301](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L301)

___

### refundFromPayment

**refundFromPayment**(`payment`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name |
| :------ |
| `payment` | `Payment` |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[medusa/src/services/payment-provider.ts:771](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L771)

___

### refundPayment

**refundPayment**(`payObjs`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name |
| :------ |
| `payObjs` | `Payment`[] |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[medusa/src/services/payment-provider.ts:672](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L672)

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

[medusa/src/services/payment-provider.ts:83](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L83)

___

### retrievePayment

**retrievePayment**(`paymentId`, `relations?`): `Promise`<`Payment`\>

Retrieve a payment entity with the given id.

#### Parameters

| Name | Default value |
| :------ | :------ |
| `paymentId` | `string` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`Payment`\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:114](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L114)

___

### retrieveProvider

**retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `TProvider` extends `AbstractPaymentProcessor` ? `AbstractPaymentProcessor` : `any`

Finds a provider given an id

| Name | Type |
| :------ | :------ |
| `TProvider` | `unknown` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `providerId` | `string` | the id of the provider to get |

#### Returns

`TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `TProvider` extends `AbstractPaymentProcessor` ? `AbstractPaymentProcessor` : `any`

-``TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `TProvider` extends `AbstractPaymentProcessor` ? `AbstractPaymentProcessor` : `any``: (optional) the payment provider

#### Defined in

[medusa/src/services/payment-provider.ts:442](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L442)

___

### retrieveRefund

**retrieveRefund**(`id`, `config?`): `Promise`<`Refund`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `config` | `FindConfig`<`Refund`\> |

#### Returns

`Promise`<`Refund`\>

-`Promise`: 
	-`Refund`: 

#### Defined in

[medusa/src/services/payment-provider.ts:822](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L822)

___

### retrieveSession

**retrieveSession**(`paymentSessionId`, `relations?`): `Promise`<`PaymentSession`\>

Return the payment session for the given id.

#### Parameters

| Name | Default value |
| :------ | :------ |
| `paymentSessionId` | `string` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:172](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L172)

___

### saveSession

`Protected` **saveSession**(`providerId`, `data`): `Promise`<`PaymentSession`\>

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
| `data.status?` | `PaymentSessionStatus` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:887](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L887)

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

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### throwFromPaymentProcessorError

`Private` **throwFromPaymentProcessorError**(`errObj`): `void`

#### Parameters

| Name |
| :------ |
| `errObj` | `PaymentProcessorError` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[medusa/src/services/payment-provider.ts:954](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L954)

___

### updatePayment

**updatePayment**(`paymentId`, `data`): `Promise`<`Payment`\>

#### Parameters

| Name |
| :------ |
| `paymentId` | `string` |
| `data` | `object` |
| `data.order_id?` | `string` |
| `data.swap_id?` | `string` |

#### Returns

`Promise`<`Payment`\>

-`Promise`: 
	-`Payment`: 

#### Defined in

[medusa/src/services/payment-provider.ts:512](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L512)

___

### updateSession

**updateSession**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

Update a payment session with the given provider.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentSession` | `object` | The paymentSession to update |
| `paymentSession.data` | Record<`string`, `unknown`\> |
| `paymentSession.id` | `string` |
| `paymentSession.provider_id` | `string` |
| `sessionInput` | `Cart` \| `PaymentSessionInput` |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: the payment session
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:342](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L342)

___

### updateSessionData

**updateSessionData**(`paymentSession`, `data`): `Promise`<`PaymentSession`\>

#### Parameters

| Name |
| :------ |
| `paymentSession` | `PaymentSession` |
| `data` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<`PaymentSession`\>

-`Promise`: 
	-`PaymentSession`: 

#### Defined in

[medusa/src/services/payment-provider.ts:569](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/payment-provider.ts#L569)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PaymentProviderService`](PaymentProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentProviderService`](PaymentProviderService.md)

-`default`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
