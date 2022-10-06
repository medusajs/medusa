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

[packages/medusa/src/services/payment-provider.ts:45](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L45)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:39](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L39)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:37](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L37)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: typeof `PaymentProviderRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:41](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L41)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:42](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L42)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:40](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L40)

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: typeof `RefundRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:43](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L43)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:38](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L38)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/payment-provider.ts:349](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L349)

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

[packages/medusa/src/services/payment-provider.ts:398](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L398)

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

[packages/medusa/src/services/payment-provider.ts:423](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L423)

___

### createPayment

▸ **createPayment**(`cart`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` & { `payment_session`: `PaymentSession`  } |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:300](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L300)

___

### createSession

▸ **createSession**(`providerId`, `cart`): `Promise`<`PaymentSession`\>

Creates a payment session with the given provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` | the id of the provider to create payment with |
| `cart` | `Cart` | a cart object used to calculate the amount, etc. from |

#### Returns

`Promise`<`PaymentSession`\>

the payment session

#### Defined in

[packages/medusa/src/services/payment-provider.ts:158](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L158)

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

[packages/medusa/src/services/payment-provider.ts:246](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L246)

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

[packages/medusa/src/services/payment-provider.ts:418](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L418)

___

### list

▸ **list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:75](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L75)

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

[packages/medusa/src/services/payment-provider.ts:110](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L110)

___

### refreshSession

▸ **refreshSession**(`paymentSession`, `cart`): `Promise`<`PaymentSession`\>

Refreshes a payment session with the given provider.
This means, that we delete the current one and create a new.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `PaymentSession` | the payment session object to    update |
| `cart` | `Cart` | a cart object used to calculate the amount, etc. from |

#### Returns

`Promise`<`PaymentSession`\>

the payment session

#### Defined in

[packages/medusa/src/services/payment-provider.ts:189](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L189)

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

[packages/medusa/src/services/payment-provider.ts:443](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L443)

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

[packages/medusa/src/services/payment-provider.ts:56](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L56)

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

[packages/medusa/src/services/payment-provider.ts:82](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L82)

___

### retrieveProvider

▸ **retrieveProvider**<`TProvider`\>(`providerId`): `TProvider` extends `AbstractPaymentService`<`never`\> ? `AbstractPaymentService`<`never`\> : `any`

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

`TProvider` extends `AbstractPaymentService`<`never`\> ? `AbstractPaymentService`<`never`\> : `any`

the payment provider

#### Defined in

[packages/medusa/src/services/payment-provider.ts:276](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L276)

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

[packages/medusa/src/services/payment-provider.ts:527](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L527)

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

[packages/medusa/src/services/payment-provider.ts:123](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L123)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/payment-provider.ts:327](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L327)

___

### updateSession

▸ **updateSession**(`paymentSession`, `cart`): `Promise`<`PaymentSession`\>

Updates an existing payment session.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `PaymentSession` | the payment session object to    update |
| `cart` | `Cart` | the cart object to update for |

#### Returns

`Promise`<`PaymentSession`\>

the updated payment session

#### Defined in

[packages/medusa/src/services/payment-provider.ts:228](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L228)

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

[packages/medusa/src/services/payment-provider.ts:377](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/payment-provider.ts#L377)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
