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

[services/strategy-resolver.ts:17](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/strategy-resolver.ts#L17)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `InjectedDependencies`

#### Inherited from

TransactionBaseService.container

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/strategy-resolver.ts:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/strategy-resolver.ts#L14)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/strategy-resolver.ts:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/strategy-resolver.ts#L15)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

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

[services/strategy-resolver.ts:22](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/strategy-resolver.ts#L22)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
