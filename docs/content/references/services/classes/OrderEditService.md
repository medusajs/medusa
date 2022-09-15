# Class: OrderEditService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OrderEditService`**

## Constructors

### constructor

• **new OrderEditService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/order-edit.ts:27](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L27)

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

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:23](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L23)

___

### orderEditRepository\_

• `Protected` `Readonly` **orderEditRepository\_**: typeof `OrderEditRepository`

#### Defined in

[packages/medusa/src/services/order-edit.ts:24](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L24)

___

### orderService\_

• `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/order-edit.ts:25](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L25)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/order-edit.ts:22](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L22)

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

### computeLineItems

▸ **computeLineItems**(`orderEditId`): `Promise`<{ `items`: `LineItem`[] ; `removedItems`: `LineItem`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |

#### Returns

`Promise`<{ `items`: `LineItem`[] ; `removedItems`: `LineItem`[]  }\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:64](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L64)

___

### retrieve

▸ **retrieve**(`orderEditId`, `config?`): `Promise`<`OrderEdit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `orderEditId` | `string` |
| `config` | `FindConfig`<`OrderEdit`\> |

#### Returns

`Promise`<`OrderEdit`\>

#### Defined in

[packages/medusa/src/services/order-edit.ts:40](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/order-edit.ts#L40)

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OrderEditService`](OrderEditService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OrderEditService`](OrderEditService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
