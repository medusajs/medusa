# Class: PaymentService

## Hierarchy

- `TransactionBaseService`

  ↳ **`PaymentService`**

## Constructors

### constructor

• **new PaymentService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/payment.ts:39](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L39)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/payment.ts:27](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L27)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/payment.ts:28](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L28)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<`Payment`\>

#### Defined in

[medusa/src/services/payment.ts:29](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L29)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `REFUND_CREATED` | `string` |
| `REFUND_FAILED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/payment.ts:30](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L30)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### capture

▸ **capture**(`paymentOrId`): `Promise`<`Payment`\>

Captures a payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentOrId` | `string` \| `Payment` | the id or the class instance of the payment |

#### Returns

`Promise`<`Payment`\>

the payment captured.

#### Defined in

[medusa/src/services/payment.ts:153](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L153)

___

### create

▸ **create**(`paymentInput`): `Promise`<`Payment`\>

Created a new payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentInput` | `PaymentDataInput` | info to create the payment |

#### Returns

`Promise`<`Payment`\>

the payment created.

#### Defined in

[medusa/src/services/payment.ts:92](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L92)

___

### refund

▸ **refund**(`paymentOrId`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

refunds a payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentOrId` | `string` \| `Payment` | the id or the class instance of the payment |
| `amount` | `number` | the amount to be refunded from the payment |
| `reason` | `string` | the refund reason |
| `note?` | `string` | additional note of the refund |

#### Returns

`Promise`<`Refund`\>

the refund created.

#### Defined in

[medusa/src/services/payment.ts:202](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L202)

___

### retrieve

▸ **retrieve**(`paymentId`, `config?`): `Promise`<`Payment`\>

Retrieves a payment by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `config` | `FindConfig`<`Payment`\> | the config to retrieve the payment |

#### Returns

`Promise`<`Payment`\>

the payment.

#### Defined in

[medusa/src/services/payment.ts:58](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L58)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`paymentId`, `data`): `Promise`<`Payment`\>

Updates a payment in order to link it to an order or a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `data` | `Object` | order_id or swap_id to link the payment |
| `data.order_id?` | `string` | - |
| `data.swap_id?` | `string` | - |

#### Returns

`Promise`<`Payment`\>

the payment updated.

#### Defined in

[medusa/src/services/payment.ts:121](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/payment.ts#L121)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentService`](PaymentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentService`](PaymentService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
