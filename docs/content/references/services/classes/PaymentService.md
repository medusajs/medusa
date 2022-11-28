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

[packages/medusa/src/services/payment.ts:40](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L40)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment.ts:28](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L28)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/payment.ts:26](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L26)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/payment.ts:29](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L29)

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: typeof `PaymentRepository`

#### Defined in

[packages/medusa/src/services/payment.ts:30](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L30)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/payment.ts:27](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L27)

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

[packages/medusa/src/services/payment.ts:31](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L31)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### capture

▸ **capture**(`paymentOrId`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentOrId` | `string` \| `Payment` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment.ts:132](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L132)

___

### create

▸ **create**(`paymentInput`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentInput` | `PaymentDataInput` |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment.ts:78](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L78)

___

### refund

▸ **refund**(`paymentOrId`, `amount`, `reason`, `note?`): `Promise`<`Refund`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentOrId` | `string` \| `Payment` |
| `amount` | `number` |
| `reason` | `string` |
| `note?` | `string` |

#### Returns

`Promise`<`Refund`\>

#### Defined in

[packages/medusa/src/services/payment.ts:173](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L173)

___

### retrieve

▸ **retrieve**(`paymentId`, `config?`): `Promise`<`Payment`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `string` |
| `config` | `FindConfig`<`Payment`\> |

#### Returns

`Promise`<`Payment`\>

#### Defined in

[packages/medusa/src/services/payment.ts:55](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L55)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### update

▸ **update**(`paymentId`, `data`): `Promise`<`Payment`\>

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

[packages/medusa/src/services/payment.ts:103](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/payment.ts#L103)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
