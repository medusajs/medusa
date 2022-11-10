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

[packages/medusa/src/services/payment-provider.ts:47](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L47)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### container\_

• `Protected` `Readonly` **container\_**: `InjectedDependencies`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:40](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:38](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L38)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: typeof `PaymentProviderRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:43](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L43)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:44](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L44)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:41](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L41)

___

### refundRepository\_

• `Protected` `Readonly` **refundRepository\_**: typeof `RefundRepository`

#### Defined in

[packages/medusa/src/services/payment-provider.ts:45](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L45)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-provider.ts:39](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L39)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/payment-provider.ts:447](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L447)

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

[packages/medusa/src/services/payment-provider.ts:496](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L496)

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

[packages/medusa/src/services/payment-provider.ts:521](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L521)

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

[packages/medusa/src/services/payment-provider.ts:371](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L371)

___

### createPaymentNew

▸ **createPaymentNew**(`paymentInput`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentInput` | `Omit`<`PaymentProviderDataInput`, ``"customer"``\> |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:398](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L398)

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

[packages/medusa/src/services/payment-provider.ts:160](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L160)

___

### createSessionNew

▸ **createSessionNew**(`sessionInput`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionInput` | `PaymentProviderDataInput` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:183](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L183)

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

[packages/medusa/src/services/payment-provider.ts:317](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L317)

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

[packages/medusa/src/services/payment-provider.ts:516](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L516)

___

### list

▸ **list**(): `Promise`<`PaymentProvider`[]\>

#### Returns

`Promise`<`PaymentProvider`[]\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:77](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L77)

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

[packages/medusa/src/services/payment-provider.ts:112](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L112)

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

[packages/medusa/src/services/payment-provider.ts:218](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L218)

___

### refreshSessionNew

▸ **refreshSessionNew**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `PaymentSession` |
| `sessionInput` | `PaymentProviderDataInput` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:250](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L250)

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

[packages/medusa/src/services/payment-provider.ts:625](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L625)

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

[packages/medusa/src/services/payment-provider.ts:541](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L541)

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

[packages/medusa/src/services/payment-provider.ts:58](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L58)

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

[packages/medusa/src/services/payment-provider.ts:84](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L84)

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

[packages/medusa/src/services/payment-provider.ts:347](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L347)

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

[packages/medusa/src/services/payment-provider.ts:665](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L665)

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

[packages/medusa/src/services/payment-provider.ts:125](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L125)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/payment-provider.ts:425](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L425)

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

[packages/medusa/src/services/payment-provider.ts:277](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L277)

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

[packages/medusa/src/services/payment-provider.ts:475](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L475)

___

### updateSessionNew

▸ **updateSessionNew**(`paymentSession`, `sessionInput`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `PaymentSession` |
| `sessionInput` | `PaymentProviderDataInput` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-provider.ts:295](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/payment-provider.ts#L295)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
