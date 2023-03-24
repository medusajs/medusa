# Class: DiscountConditionService

Provides layer to manipulate discount conditions.

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`DiscountConditionService`**

## Constructors

### constructor

• **new DiscountConditionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/discount-condition.ts:37](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L37)

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

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: typeof `DiscountConditionRepository`

#### Defined in

[packages/medusa/src/services/discount-condition.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L31)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/discount-condition.ts:32](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L32)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/discount-condition.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L34)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/discount-condition.ts:35](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L35)

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

### delete

▸ **delete**(`discountConditionId`): `Promise`<`void` \| `DiscountCondition`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountConditionId` | `string` |

#### Returns

`Promise`<`void` \| `DiscountCondition`\>

#### Defined in

[packages/medusa/src/services/discount-condition.ts:220](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L220)

___

### removeResources

▸ **removeResources**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Omit`<`DiscountConditionInput`, ``"id"``\> & { `id`: `string`  } |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/discount-condition.ts:188](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L188)

___

### retrieve

▸ **retrieve**(`conditionId`, `config?`): `Promise`<`DiscountCondition`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `conditionId` | `string` |
| `config?` | `FindConfig`<`DiscountCondition`\> |

#### Returns

`Promise`<`DiscountCondition`\>

#### Defined in

[packages/medusa/src/services/discount-condition.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L49)

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

### upsertCondition

▸ **upsertCondition**(`data`, `overrideExisting?`): `Promise`<(`DiscountConditionProduct` \| `DiscountConditionProductType` \| `DiscountConditionProductCollection` \| `DiscountConditionProductTag` \| `DiscountConditionCustomerGroup`)[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `DiscountConditionInput` | `undefined` |
| `overrideExisting` | `boolean` | `true` |

#### Returns

`Promise`<(`DiscountConditionProduct` \| `DiscountConditionProductType` \| `DiscountConditionProductCollection` \| `DiscountConditionProductTag` \| `DiscountConditionCustomerGroup`)[]\>

#### Defined in

[packages/medusa/src/services/discount-condition.ts:116](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L116)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DiscountConditionService`](DiscountConditionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DiscountConditionService`](DiscountConditionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### resolveConditionType\_

▸ `Static` `Protected` **resolveConditionType_**(`data`): `undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: `DiscountConditionType`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DiscountConditionInput` |

#### Returns

`undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: `DiscountConditionType`  }

#### Defined in

[packages/medusa/src/services/discount-condition.ts:79](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/discount-condition.ts#L79)
