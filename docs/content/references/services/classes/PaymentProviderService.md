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

[packages/medusa/src/services/payment-provider.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L64)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:53](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L53)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-provider.ts:59](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L59)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L62)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:60](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L60)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L51)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: typeof `PaymentProviderRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:56](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L56)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L57)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:54](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L54)

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: typeof `RefundRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L58)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:52](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L52)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/payment-provider.ts:395](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L395)

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

[packages/medusa/src/services/payment-provider.ts:641](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L641)

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

[packages/medusa/src/services/payment-provider.ts:448](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L448)

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

[packages/medusa/src/services/payment-provider.ts:473](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L473)

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

[packages/medusa/src/services/payment-provider.ts:357](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L357)

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

[packages/medusa/src/services/payment-provider.ts:180](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L180)

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

[packages/medusa/src/services/payment-provider.ts:303](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L303)

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

[packages/medusa/src/services/payment-provider.ts:468](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L468)

___

### list

▸ **list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:97](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L97)

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

[packages/medusa/src/services/payment-provider.ts:132](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L132)

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

[packages/medusa/src/services/payment-provider.ts:731](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L731)

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

[packages/medusa/src/services/payment-provider.ts:238](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L238)

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

[packages/medusa/src/services/payment-provider.ts:578](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L578)

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

[packages/medusa/src/services/payment-provider.ts:493](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L493)

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

[packages/medusa/src/services/payment-provider.ts:78](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L78)

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

[packages/medusa/src/services/payment-provider.ts:104](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L104)

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

[packages/medusa/src/services/payment-provider.ts:333](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L333)

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

[packages/medusa/src/services/payment-provider.ts:618](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L618)

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

[packages/medusa/src/services/payment-provider.ts:145](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L145)

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

[packages/medusa/src/services/payment-provider.ts:681](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L681)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/payment-provider.ts:383](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L383)

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

[packages/medusa/src/services/payment-provider.ts:268](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L268)

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

[packages/medusa/src/services/payment-provider.ts:427](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-provider.ts#L427)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
