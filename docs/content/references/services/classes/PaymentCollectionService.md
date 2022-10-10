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

[packages/medusa/src/services/payment-collection.ts:32](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L32)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:28](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L28)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:26](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L26)

___

### paymentCollectionRepository\_

• `Protected` `Readonly` **paymentCollectionRepository\_**: typeof `PaymentCollectionRepository`

#### Defined in

[packages/medusa/src/services/payment-collection.ts:30](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L30)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:27](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L27)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/payment-collection.ts:20](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L20)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`data`): `Promise`<`PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreatePaymentCollectionInput` |

#### Returns

`Promise`<`PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:67](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L67)

___

### delete

▸ **delete**(`paymentCollectionId`): `Promise`<`undefined` \| `PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |

#### Returns

`Promise`<`undefined` \| `PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:126](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L126)

___

### retrieve

▸ **retrieve**(`paymentCollectionId`, `config?`): `Promise`<`PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `config` | `FindConfig`<`PaymentCollection`\> |

#### Returns

`Promise`<`PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:45](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L45)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`paymentCollectionId`, `data`): `Promise`<`PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `data` | `Object` |
| `data.amount?` | `number` |
| `data.authorized_amount?` | `number` |
| `data.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.created_by?` | `string` |
| `data.currency?` | { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } |
| `data.currency_code?` | `string` |
| `data.deleted_at?` | ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.description?` | `string` |
| `data.id?` | `string` |
| `data.metadata?` | { [x: string]: unknown; } |
| `data.payment_sessions?` | (`undefined` \| { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: {...)[] |
| `data.payments?` | (`undefined` \| { swap\_id?: string \| undefined; swap?: { fulfillment\_status?: SwapFulfillmentStatus \| undefined; payment\_status?: SwapPaymentStatus \| undefined; ... 21 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; })[] |
| `data.refunded_amount?` | `number` |
| `data.region?` | { name?: string \| undefined; currency\_code?: string \| undefined; currency?: { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } \| undefined; ... 15 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.region_id?` | `string` |
| `data.status?` | `PaymentCollectionStatus` |
| `data.type?` | `ORDER_EDIT` |
| `data.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |

#### Returns

`Promise`<`PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:97](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/payment-collection.ts#L97)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
