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

[packages/medusa/src/services/payment-provider.ts:65](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L65)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:54](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L54)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:60](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L60)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:63](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L63)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:61](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L61)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:52](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L52)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: typeof `PaymentProviderRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:57](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L57)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L58)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:55](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L55)

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: typeof `RefundRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:59](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L59)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:53](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L53)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

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

[packages/medusa/src/services/payment-provider.ts:394](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L394)

___

### buildPaymentContext

▸ `Protected` **buildPaymentContext**(`cartOrData`): `Cart` & `PaymentContext`

Build the create session context for both legacy and new API

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrData` | `Cart` \| `PaymentSessionInput` |

#### Returns

`Cart` & `PaymentContext`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:643](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L643)

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

[packages/medusa/src/services/payment-provider.ts:450](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L450)

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

[packages/medusa/src/services/payment-provider.ts:475](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L475)

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

[packages/medusa/src/services/payment-provider.ts:356](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L356)

___

### createSession

▸ **createSession**<`TInput`\>(`providerIdOrSessionInput`, ...`cart`): `Promise`<`PaymentSession`\>

Creates a payment session with the given provider.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TInput` | extends `string` \| `PaymentSessionInput` = `string` \| `PaymentSessionInput` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerIdOrSessionInput` | `TInput` | the id of the provider to create payment with or the input data |
| `...cart` | `TInput` extends `string` ? [`Cart`] : [undefined?] | a cart object used to calculate the amount, etc. from |

#### Returns

`Promise`<`PaymentSession`\>

the payment session

#### Defined in

[packages/medusa/src/services/payment-provider.ts:181](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L181)

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

[packages/medusa/src/services/payment-provider.ts:302](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L302)

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

[packages/medusa/src/services/payment-provider.ts:470](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L470)

___

### list

▸ **list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:98](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L98)

___

### listPayments

▸ **listPayments**(`selector`, `config?`): `Promise`<`Payment`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`Payment`\> |
| `config` | `FindConfig`<`Payment`\> |

#### Returns

`Promise`<`Payment`[]\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:133](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L133)

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

[packages/medusa/src/services/payment-provider.ts:736](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L736)

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

[packages/medusa/src/services/payment-provider.ts:241](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L241)

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

[packages/medusa/src/services/payment-provider.ts:580](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L580)

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

[packages/medusa/src/services/payment-provider.ts:495](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L495)

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

[packages/medusa/src/services/payment-provider.ts:79](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L79)

___

### retrievePayment

▸ **retrievePayment**(`id`, `relations?`): `Promise`<`Payment`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:105](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L105)

___

### retrieveProvider

▸ **retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `any`

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

`TProvider` extends `AbstractPaymentService` ? `AbstractPaymentService` : `any`

the payment provider

#### Defined in

[packages/medusa/src/services/payment-provider.ts:332](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L332)

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

[packages/medusa/src/services/payment-provider.ts:620](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L620)

___

### retrieveSession

▸ **retrieveSession**(`id`, `relations?`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `relations` | `string`[] | `[]` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:146](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L146)

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
| `data.isSelected?` | `boolean` |
| `data.payment_session_id?` | `string` |
| `data.sessionData` | `Record`<`string`, `unknown`\> |
| `data.status?` | `PaymentSessionStatus` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:682](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L682)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

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

[packages/medusa/src/services/payment-provider.ts:382](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L382)

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

[packages/medusa/src/services/payment-provider.ts:271](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L271)

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

[packages/medusa/src/services/payment-provider.ts:429](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/payment-provider.ts#L429)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
