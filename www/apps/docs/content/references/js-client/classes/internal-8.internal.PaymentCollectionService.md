---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentCollectionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PaymentCollectionService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`PaymentCollectionService`**

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

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:25

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:23

___

### isValidTotalAmount

• `Private` **isValidTotalAmount**: `any`

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:54

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### paymentCollectionRepository\_

• `Protected` `Readonly` **paymentCollectionRepository\_**: `Repository`<[`PaymentCollection`](internal-3.PaymentCollection.md)\> & { `getPaymentCollectionIdByPaymentId`: (`paymentId`: `string`, `config?`: `FindManyOptions`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>) => `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\> ; `getPaymentCollectionIdBySessionId`: (`sessionId`: `string`, `config?`: `FindManyOptions`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>) => `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>  }

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:26

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:24

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PAYMENT_AUTHORIZED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:17

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### authorizePaymentSessions

▸ **authorizePaymentSessions**(`paymentCollectionId`, `sessionIds`, `context?`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Authorizes the payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionIds` | `string`[] | array of payment session ids to be authorized |
| `context?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | additional data required by payment providers |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection and its payment session.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:92

___

### create

▸ **create**(`data`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Creates a new payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreatePaymentCollectionInput`](../modules/internal-8.md#createpaymentcollectioninput) | info to create the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection created.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:40

___

### delete

▸ **delete**(`paymentCollectionId`): `Promise`<`undefined` \| [`PaymentCollection`](internal-3.PaymentCollection.md)\>

Deletes a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to be removed |

#### Returns

`Promise`<`undefined` \| [`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection removed.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:53

___

### markAsAuthorized

▸ **markAsAuthorized**(`paymentCollectionId`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Marks a payment collection as authorized bypassing the payment flow.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment session authorized.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:84

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`paymentCollectionId`, `sessionId`, `customerId`): `Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

Removes and recreate a payment session of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionId` | `string` | the id of the payment session to be replaced |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentSession`](internal-3.PaymentSession.md)\>

the new payment session created.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:78

___

### retrieve

▸ **retrieve**(`paymentCollectionId`, `config?`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Retrieves a payment collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`PaymentCollection`](internal-3.PaymentCollection.md)\> | the config to retrieve the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:34

___

### setPaymentSession

▸ **setPaymentSession**(`paymentCollectionId`, `sessionInput`, `customerId`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Manages a single payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionInput` | [`PaymentCollectionsSessionsInput`](../modules/internal-8.md#paymentcollectionssessionsinput) | object containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection and its payment session.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:70

___

### setPaymentSessionsBatch

▸ **setPaymentSessionsBatch**(`paymentCollectionOrId`, `sessionsInput`, `customerId`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Manages multiple payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionOrId` | `string` \| [`PaymentCollection`](internal-3.PaymentCollection.md) | the id of the payment collection |
| `sessionsInput` | [`PaymentCollectionsSessionsBatchInput`](../modules/internal-8.md#paymentcollectionssessionsbatchinput)[] | array containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection and its payment sessions.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:62

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

### update

▸ **update**(`paymentCollectionId`, `data`): `Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

Updates a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to update |
| `data` | `DeepPartial`<[`PaymentCollection`](internal-3.PaymentCollection.md)\> | info to be updated |

#### Returns

`Promise`<[`PaymentCollection`](internal-3.PaymentCollection.md)\>

the payment collection updated.

#### Defined in

packages/medusa/dist/services/payment-collection.d.ts:47

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentCollectionService`](internal-8.internal.PaymentCollectionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentCollectionService`](internal-8.internal.PaymentCollectionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
