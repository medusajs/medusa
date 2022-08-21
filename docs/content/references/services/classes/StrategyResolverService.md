# Class: StrategyResolverService

## Hierarchy

- `TransactionBaseService`<[`StrategyResolverService`](StrategyResolverService.md), `InjectedDependencies`\>

  ↳ **`StrategyResolverService`**

## Constructors

### constructor

• **new StrategyResolverService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;
  StrategyResolver,
  InjectedDependencies
\&gt;.constructor

#### Defined in

[packages/medusa/src/services/strategy-resolver.ts:17](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/strategy-resolver.ts#L17)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### container

• `Protected` `Readonly` **container**: `InjectedDependencies`

#### Inherited from

TransactionBaseService.container

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/strategy-resolver.ts:14](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/strategy-resolver.ts#L14)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/strategy-resolver.ts:15](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/strategy-resolver.ts#L15)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### resolveBatchJobByType

▸ **resolveBatchJobByType**<`T`\>(`type`): `AbstractBatchJobStrategy`<`T`, `unknown`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `TransactionBaseService`<`never`, `unknown`, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Returns

`AbstractBatchJobStrategy`<`T`, `unknown`\>

#### Defined in

[packages/medusa/src/services/strategy-resolver.ts:22](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/strategy-resolver.ts#L22)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`StrategyResolverService`](StrategyResolverService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StrategyResolverService`](StrategyResolverService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
