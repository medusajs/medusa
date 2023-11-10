# PaymentCollectionService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`PaymentCollectionService`**

## Constructors

### constructor

**new PaymentCollectionService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-23.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:47](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L47)

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

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L43)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:41](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L41)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentCollectionRepository\_

 `Protected` `Readonly` **paymentCollectionRepository\_**: [`Repository`](Repository.md)<[`PaymentCollection`](PaymentCollection.md)\> & { `getPaymentCollectionIdByPaymentId`: Method getPaymentCollectionIdByPaymentId ; `getPaymentCollectionIdBySessionId`: Method getPaymentCollectionIdBySessionId  }

#### Defined in

[packages/medusa/src/services/payment-collection.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L45)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:42](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L42)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PAYMENT_AUTHORIZED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/payment-collection.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L34)

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

### authorizePaymentSessions

**authorizePaymentSessions**(`paymentCollectionId`, `sessionIds`, `context?`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Authorizes the payment sessions of a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionIds` | `string`[] | array of payment session ids to be authorized |
| `context` | Record<`string`, `unknown`\> | additional data required by payment providers |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection and its payment session.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:529](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L529)

___

### create

**create**(`data`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Creates a new payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreatePaymentCollectionInput`](../types/CreatePaymentCollectionInput.md) | info to create the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection created.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:104](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L104)

___

### delete

**delete**(`paymentCollectionId`): `Promise`<`undefined` \| [`PaymentCollection`](PaymentCollection.md)\>

Deletes a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to be removed |

#### Returns

`Promise`<`undefined` \| [`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection removed.
	-`undefined \| PaymentCollection`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:173](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L173)

___

### isValidTotalAmount

`Private` **isValidTotalAmount**(`total`, `sessionsInput`): `boolean`

#### Parameters

| Name |
| :------ |
| `total` | `number` |
| `sessionsInput` | [`PaymentCollectionsSessionsBatchInput`](../types/PaymentCollectionsSessionsBatchInput.md)[] |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:211](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L211)

___

### markAsAuthorized

**markAsAuthorized**(`paymentCollectionId`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Marks a payment collection as authorized bypassing the payment flow.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment session authorized.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:500](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L500)

___

### refreshPaymentSession

**refreshPaymentSession**(`paymentCollectionId`, `sessionId`, `customerId`): `Promise`<[`PaymentSession`](PaymentSession.md)\>

Removes and recreate a payment session of a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionId` | `string` | the id of the payment session to be replaced |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentSession`](PaymentSession.md)\>

-`Promise`: the new payment session created.
	-`PaymentSession`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:407](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L407)

___

### retrieve

**retrieve**(`paymentCollectionId`, `config?`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Retrieves a payment collection by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`PaymentCollection`](PaymentCollection.md)\> | the config to retrieve the payment collection |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L68)

___

### setPaymentSession

**setPaymentSession**(`paymentCollectionId`, `sessionInput`, `customerId`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Manages a single payment sessions of a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionInput` | [`PaymentCollectionsSessionsInput`](../types/PaymentCollectionsSessionsInput.md) | object containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection and its payment session.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:361](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L361)

___

### setPaymentSessionsBatch

**setPaymentSessionsBatch**(`paymentCollectionOrId`, `sessionsInput`, `customerId`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Manages multiple payment sessions of a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionOrId` | `string` \| [`PaymentCollection`](PaymentCollection.md) | the id of the payment collection |
| `sessionsInput` | [`PaymentCollectionsSessionsBatchInput`](../types/PaymentCollectionsSessionsBatchInput.md)[] | array containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection and its payment sessions.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:226](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L226)

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

### update

**update**(`paymentCollectionId`, `data`): `Promise`<[`PaymentCollection`](PaymentCollection.md)\>

Updates a payment collection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to update |
| `data` | [`DeepPartial`](../types/DeepPartial.md)<[`PaymentCollection`](PaymentCollection.md)\> | info to be updated |

#### Returns

`Promise`<[`PaymentCollection`](PaymentCollection.md)\>

-`Promise`: the payment collection updated.
	-`PaymentCollection`: 

#### Defined in

[packages/medusa/src/services/payment-collection.ts:139](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/payment-collection.ts#L139)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PaymentCollectionService`](PaymentCollectionService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`PaymentCollectionService`](PaymentCollectionService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
