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

[packages/medusa/src/services/payment-collection.ts:57](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L57)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:53](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L53)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:51](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L51)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:49](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L49)

___

### paymentCollectionRepository\_

• `Protected` `Readonly` **paymentCollectionRepository\_**: typeof `PaymentCollectionRepository`

#### Defined in

[packages/medusa/src/services/payment-collection.ts:55](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L55)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/payment-collection.ts:52](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L52)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment-collection.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L50)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PAYMENT_AUTHORIZED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `REFUND_CREATED` | `string` |
| `REFUND_FAILED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/payment-collection.ts:38](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L38)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### authorize

▸ **authorize**(`paymentCollectionId`, `context?`): `Promise`<`PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `context` | `Record`<`string`, `unknown`\> |

#### Returns

`Promise`<`PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:373](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L373)

___

### capture

▸ **capture**(`paymentId`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:522](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L522)

___

### captureAll

▸ **captureAll**(`paymentCollectionId`): `Promise`<`Payment`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |

#### Returns

`Promise`<`Payment`[]\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:541](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L541)

___

### capturePayment

▸ `Private` **capturePayment**(`payCol`, `payment`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payCol` | `PaymentCollection` |
| `payment` | `Payment` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:451](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L451)

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

[packages/medusa/src/services/payment-collection.ts:97](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L97)

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

[packages/medusa/src/services/payment-collection.ts:155](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L155)

___

### isValidTotalAmount

▸ `Private` **isValidTotalAmount**(`total`, `sessionsInput`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `total` | `number` |
| `sessionsInput` | `PaymentCollectionSessionInput`[] |

#### Returns

`boolean`

#### Defined in

[packages/medusa/src/services/payment-collection.ts:193](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L193)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`paymentCollectionId`, `sessionId`, `sessionInput`): `Promise`<`PaymentSession`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `sessionId` | `string` |
| `sessionInput` | `PaymentCollectionSessionInput` |

#### Returns

`Promise`<`PaymentSession`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:298](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L298)

___

### refund

▸ **refund**(`paymentId`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:632](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L632)

___

### refundAll

▸ **refundAll**(`paymentCollectionId`, `reason`, `note?`): `Promise`<`Refund`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`[]\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:655](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L655)

___

### refundPayment

▸ `Private` **refundPayment**(`payCol`, `payment`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payCol` | `PaymentCollection` |
| `payment` | `Payment` |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:560](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L560)

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

[packages/medusa/src/services/payment-collection.ts:74](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L74)

___

### setPaymentSessions

▸ **setPaymentSessions**(`paymentCollectionId`, `sessions`): `Promise`<`PaymentCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentCollectionId` | `string` |
| `sessions` | `PaymentCollectionSessionInput` \| `PaymentCollectionSessionInput`[] |

#### Returns

`Promise`<`PaymentCollection`\>

#### Defined in

[packages/medusa/src/services/payment-collection.ts:201](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L201)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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
| `data.captured_amount?` | `number` |
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

[packages/medusa/src/services/payment-collection.ts:126](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/payment-collection.ts#L126)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
