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

[packages/medusa/src/services/payment-collection.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L51)

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

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L47)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L45)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L43)

___

### paymentCollectionRepository\_

• `Protected` `Readonly` **paymentCollectionRepository\_**: typeof `PaymentCollectionRepository`

#### Defined in

[packages/medusa/src/services/payment-collection.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L49)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:46](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L46)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:44](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L44)

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

[packages/medusa/src/services/payment-collection.ts:36](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L36)

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

[packages/medusa/src/services/payment-collection.ts:535](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L535)

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

[packages/medusa/src/services/payment-collection.ts:111](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L111)

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

[packages/medusa/src/services/payment-collection.ts:180](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L180)

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

[packages/medusa/src/services/payment-collection.ts:218](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L218)

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

[packages/medusa/src/services/payment-collection.ts:506](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L506)

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

[packages/medusa/src/services/payment-collection.ts:414](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L414)

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

[packages/medusa/src/services/payment-collection.ts:74](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L74)

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

[packages/medusa/src/services/payment-collection.ts:368](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L368)

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

[packages/medusa/src/services/payment-collection.ts:233](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L233)

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

### update

▸ **update**(`paymentCollectionId`, `data`): `Promise`<`PaymentCollection`\>

Updates a payment collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentCollectionId` | `string` | the id of the payment collection to update |
| `data` | `Object` | info to be updated |
| `data.amount?` | `number` | - |
| `data.authorized_amount?` | ``null`` \| `number` | - |
| `data.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `data.created_by?` | `string` | - |
| `data.currency?` | { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } | - |
| `data.currency_code?` | `string` | - |
| `data.deleted_at?` | ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `data.description?` | ``null`` \| `string` | - |
| `data.id?` | `string` | - |
| `data.metadata?` | { [x: string]: unknown; } | - |
| `data.payment_sessions?` | (`undefined` \| { cart\_id?: string \| null \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated...)[] | - |
| `data.payments?` | (`undefined` \| { swap\_id?: string \| undefined; swap?: { fulfillment\_status?: SwapFulfillmentStatus \| undefined; payment\_status?: SwapPaymentStatus \| undefined; ... 21 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; })[] | - |
| `data.region?` | { name?: string \| undefined; currency\_code?: string \| undefined; currency?: { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } \| undefined; ... 15 more ...; updated\_at?: { ...; } \| undefined; } | - |
| `data.region_id?` | `string` | - |
| `data.status?` | `PaymentCollectionStatus` | - |
| `data.type?` | `ORDER_EDIT` | - |
| `data.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`Promise`<`PaymentCollection`\>

the payment collection updated.

#### Defined in

[packages/medusa/src/services/payment-collection.ts:146](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/payment-collection.ts#L146)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
