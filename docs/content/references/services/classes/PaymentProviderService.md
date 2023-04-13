# Class: PaymentProviderService

Helps retrieve payment providers

## Hierarchy

- `TransactionBaseService`

  ↳ **`PaymentProviderService`**

## Constructors

### constructor

• **new PaymentProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/payment-provider.ts:70](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L70)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[medusa/src/services/payment-provider.ts:55](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L55)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/payment-provider.ts:65](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L65)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/payment-provider.ts:68](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L68)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[medusa/src/services/payment-provider.ts:66](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L66)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<`PaymentProvider`\>

#### Defined in

[medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L58)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:59](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L59)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: `Repository`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L56)

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: `Repository`<`Refund`\>

#### Defined in

[medusa/src/services/payment-provider.ts:64](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L64)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### paymentService\_

• `Protected` `get` **paymentService_**(): [`PaymentService`](PaymentService.md)

#### Returns

[`PaymentService`](PaymentService.md)

#### Defined in

[medusa/src/services/payment-provider.ts:60](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L60)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

▸ **authorizePayment**(`paymentSession`, `context`): `Promise`<`undefined` \| `PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `PaymentSession` |
| `context` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`undefined` \| `PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:523](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L523)

___

### buildPaymentProcessorContext

▸ `Protected` **buildPaymentProcessorContext**(`cartOrData`): `Cart` & `PaymentContext`

Build the create session context for both legacy and new API

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrData` | `Cart` \| `PaymentSessionInput` |

#### Returns

`Cart` & `PaymentContext`

#### Defined in

[medusa/src/services/payment-provider.ts:840](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L840)

___

### cancelPayment

▸ **cancelPayment**(`paymentObj`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | `Partial`<`Payment`\> & { `id`: `string`  } |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:597](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L597)

___

### capturePayment

▸ **capturePayment**(`paymentObj`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | `Partial`<`Payment`\> & { `id`: `string`  } |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:636](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L636)

___

### createPayment

▸ **createPayment**(`data`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreatePaymentInput` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:471](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L471)

___

### createSession

▸ **createSession**(`providerId`, `cart`): `Promise`<`PaymentSession`\>

**`Deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerId` | `string` |
| `cart` | `Cart` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:205](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L205)

▸ **createSession**(`sessionInput`): `Promise`<`PaymentSession`\>

Creates a payment session with the given provider.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionInput` | `PaymentSessionInput` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:211](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L211)

___

### deleteSession

▸ **deleteSession**(`paymentSession`): `Promise`<`undefined` \| `PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `PaymentSession` |

#### Returns

`Promise`<`undefined` \| `PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:402](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L402)

___

### getStatus

▸ **getStatus**(`payment`): `Promise`<`PaymentSessionStatus`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | `Payment` |

#### Returns

`Promise`<`PaymentSessionStatus`\>

#### Defined in

[medusa/src/services/payment-provider.ts:625](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L625)

___

### list

▸ **list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

#### Defined in

[medusa/src/services/payment-provider.ts:102](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L102)

___

### listPayments

▸ **listPayments**(`selector`, `config?`): `Promise`<`Payment`[]\>

List all the payments according to the given selector and config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`Payment`\> |
| `config` | `FindConfig`<`Payment`\> |

#### Returns

`Promise`<`Payment`[]\>

#### Defined in

[medusa/src/services/payment-provider.ts:154](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L154)

___

### processUpdateRequestsData

▸ `Protected` **processUpdateRequestsData**(`data?`, `paymentResponse`): `Promise`<`void`\>

Process the collected data. Can be used every time we need to process some collected data returned by the provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.customer?` | `Object` |
| `data.customer.id?` | `string` |
| `paymentResponse` | `Record`<`string`, `unknown`\> \| `PaymentSessionResponse` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/payment-provider.ts:930](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L930)

___

### refreshSession

▸ **refreshSession**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

Refreshes a payment session with the given provider.
This means, that we delete the current one and create a new.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `Object` | the payment session object to    update |
| `paymentSession.data` | `Record`<`string`, `unknown`\> | - |
| `paymentSession.id` | `string` | - |
| `paymentSession.provider_id` | `string` | - |
| `sessionInput` | `PaymentSessionInput` |  |

#### Returns

`Promise`<`PaymentSession`\>

the payment session

#### Defined in

[medusa/src/services/payment-provider.ts:301](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L301)

___

### refundFromPayment

▸ **refundFromPayment**(`payment`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | `Payment` |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[medusa/src/services/payment-provider.ts:766](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L766)

___

### refundPayment

▸ **refundPayment**(`payObjs`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payObjs` | `Payment`[] |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[medusa/src/services/payment-provider.ts:667](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L667)

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

[medusa/src/services/payment-provider.ts:83](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L83)

___

### retrievePayment

▸ **retrievePayment**(`paymentId`, `relations?`): `Promise`<`Payment`\>

Retrieve a payment entity with the given id.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `paymentId` | `string` | `undefined` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:114](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L114)

___

### retrieveProvider

▸ **retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `TProvider` extends `AbstractPaymentProcessor` ? `AbstractPaymentProcessor` : `any`

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

`TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `TProvider` extends `AbstractPaymentProcessor` ? `AbstractPaymentProcessor` : `any`

the payment provider

#### Defined in

[medusa/src/services/payment-provider.ts:442](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L442)

___

### retrieveRefund

▸ **retrieveRefund**(`id`, `config?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | `FindConfig`<`Refund`\> |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[medusa/src/services/payment-provider.ts:817](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L817)

___

### retrieveSession

▸ **retrieveSession**(`paymentSessionId`, `relations?`): `Promise`<`PaymentSession`\>

Return the payment session for the given id.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `paymentSessionId` | `string` | `undefined` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:172](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L172)

___

### saveSession

▸ `Protected` **saveSession**(`providerId`, `data`): `Promise`<`PaymentSession`\>

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
| `data.sessionData` | `Record`<`string`, `unknown`\> |
| `data.status?` | `PaymentSessionStatus` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:882](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L882)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### throwFromPaymentProcessorError

▸ `Private` **throwFromPaymentProcessorError**(`errObj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errObj` | `PaymentProcessorError` |

#### Returns

`void`

#### Defined in

[medusa/src/services/payment-provider.ts:949](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L949)

___

### updatePayment

▸ **updatePayment**(`paymentId`, `data`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |
| `data` | `Object` |
| `data.order_id?` | `string` |
| `data.swap_id?` | `string` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[medusa/src/services/payment-provider.ts:512](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L512)

___

### updateSession

▸ **updateSession**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

Update a payment session with the given provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `Object` | The paymentSession to update |
| `paymentSession.data` | `Record`<`string`, `unknown`\> | - |
| `paymentSession.id` | `string` | - |
| `paymentSession.provider_id` | `string` | - |
| `sessionInput` | `Cart` \| `PaymentSessionInput` |  |

#### Returns

`Promise`<`PaymentSession`\>

the payment session

#### Defined in

[medusa/src/services/payment-provider.ts:342](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L342)

___

### updateSessionData

▸ **updateSessionData**(`paymentSession`, `data`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `PaymentSession` |
| `data` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[medusa/src/services/payment-provider.ts:569](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/payment-provider.ts#L569)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentProviderService`](PaymentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentProviderService`](PaymentProviderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
