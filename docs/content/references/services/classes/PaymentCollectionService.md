# Class: PaymentCollectionService

## Hierarchy

- `TransactionBaseService`

  ↳ **`PaymentCollectionService`**

## Constructors

### constructor

• **new PaymentCollectionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/payment-collection.ts:46](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L46)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/payment-collection.ts:42](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L42)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/payment-collection.ts:40](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentCollectionRepository\_

• `Protected` `Readonly` **paymentCollectionRepository\_**: `Repository`<`PaymentCollection`\> & { `getPaymentCollectionIdByPaymentId`: (`paymentId`: `string`, `config`: `FindManyOptions`<`PaymentCollection`\>) => `Promise`<`PaymentCollection`\> ; `getPaymentCollectionIdBySessionId`: (`sessionId`: `string`, `config`: `FindManyOptions`<`PaymentCollection`\>) => `Promise`<`PaymentCollection`\>  }

#### Defined in

[medusa/src/services/payment-collection.ts:44](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L44)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/payment-collection.ts:41](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L41)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/payment-collection.ts:33](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L33)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePaymentSessions

▸ **authorizePaymentSessions**(`paymentCollectionId`, `sessionIds`, `context?`): `Promise`<`PaymentCollection`\>

Authorizes the payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionIds` | `string`[] | array of payment session ids to be authorized |
| `context` | `Record`<`string`, `unknown`\> | additional data required by payment providers |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection and its payment session.

#### Defined in

[medusa/src/services/payment-collection.ts:528](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L528)

___

### create

▸ **create**(`data`): `Promise`<`PaymentCollection`\>

Creates a new payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreatePaymentCollectionInput` | info to create the payment collection |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection created.

#### Defined in

[medusa/src/services/payment-collection.ts:103](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L103)

___

### delete

▸ **delete**(`paymentCollectionId`): `Promise`<`undefined` \| `PaymentCollection`\>

Deletes a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to be removed |

#### Returns

`Promise`<`undefined` \| `PaymentCollection`\>

the payment collection removed.

#### Defined in

[medusa/src/services/payment-collection.ts:172](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L172)

___

### isValidTotalAmount

▸ `Private` **isValidTotalAmount**(`total`, `sessionsInput`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `total` | `number` |
| `sessionsInput` | `PaymentCollectionsSessionsBatchInput`[] |

#### Returns

`boolean`

#### Defined in

[medusa/src/services/payment-collection.ts:210](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L210)

___

### markAsAuthorized

▸ **markAsAuthorized**(`paymentCollectionId`): `Promise`<`PaymentCollection`\>

Marks a payment collection as authorized bypassing the payment flow.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |

#### Returns

`Promise`<`PaymentCollection`\>

the payment session authorized.

#### Defined in

[medusa/src/services/payment-collection.ts:499](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L499)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`paymentCollectionId`, `sessionId`, `customerId`): `Promise`<`PaymentSession`\>

Removes and recreate a payment session of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionId` | `string` | the id of the payment session to be replaced |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<`PaymentSession`\>

the new payment session created.

#### Defined in

[medusa/src/services/payment-collection.ts:406](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L406)

___

### retrieve

▸ **retrieve**(`paymentCollectionId`, `config?`): `Promise`<`PaymentCollection`\>

Retrieves a payment collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `config` | `FindConfig`<`PaymentCollection`\> | the config to retrieve the payment collection |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection.

#### Defined in

[medusa/src/services/payment-collection.ts:67](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L67)

___

### setPaymentSession

▸ **setPaymentSession**(`paymentCollectionId`, `sessionInput`, `customerId`): `Promise`<`PaymentCollection`\>

Manages a single payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection |
| `sessionInput` | `PaymentCollectionsSessionsInput` | object containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection and its payment session.

#### Defined in

[medusa/src/services/payment-collection.ts:360](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L360)

___

### setPaymentSessionsBatch

▸ **setPaymentSessionsBatch**(`paymentCollectionOrId`, `sessionsInput`, `customerId`): `Promise`<`PaymentCollection`\>

Manages multiple payment sessions of a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionOrId` | `string` \| `PaymentCollection` | the id of the payment collection |
| `sessionsInput` | `PaymentCollectionsSessionsBatchInput`[] | array containing payment session info |
| `customerId` | `string` | the id of the customer |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection and its payment sessions.

#### Defined in

[medusa/src/services/payment-collection.ts:225](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L225)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`paymentCollectionId`, `data`): `Promise`<`PaymentCollection`\>

Updates a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to update |
| `data` | `DeepPartial`<`PaymentCollection`\> | info to be updated |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection updated.

#### Defined in

[medusa/src/services/payment-collection.ts:138](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/payment-collection.ts#L138)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentCollectionService`](PaymentCollectionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentCollectionService`](PaymentCollectionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
