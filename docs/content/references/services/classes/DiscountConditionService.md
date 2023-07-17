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

[medusa/src/services/discount-condition.ts:34](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L34)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: `Repository`<`DiscountCondition`\> & { `addConditionResources`: (`conditionId`: `string`, `resourceIds`: (`string` \| { `id`: `string`  })[], `type`: `DiscountConditionType`, `overrideExisting`: `boolean`) => `Promise`<(`DiscountConditionProduct` \| `DiscountConditionProductType` \| `DiscountConditionProductCollection` \| `DiscountConditionProductTag` \| `DiscountConditionCustomerGroup`)[]\> ; `canApplyForCustomer`: (`discountRuleId`: `string`, `customerId`: `string`) => `Promise`<`boolean`\> ; `findOneWithDiscount`: (`conditionId`: `string`, `discountId`: `string`) => `Promise`<`undefined` \| `DiscountCondition` & { `discount`: `Discount`  }\> ; `getJoinTableResourceIdentifiers`: (`type`: `string`) => { `conditionTable`: `DiscountConditionResourceType` ; `joinTable`: `string` ; `joinTableForeignKey`: `DiscountConditionJoinTableForeignKey` ; `joinTableKey`: `string` ; `resourceKey`: `string`  } ; `isValidForProduct`: (`discountRuleId`: `string`, `productId`: `string`) => `Promise`<`boolean`\> ; `queryConditionTable`: (`__namedParameters`: `Object`) => `Promise`<`number`\> ; `removeConditionResources`: (`id`: `string`, `type`: `DiscountConditionType`, `resourceIds`: (`string` \| { `id`: `string`  })[]) => `Promise`<`void` \| `DeleteResult`\>  }

#### Defined in

[medusa/src/services/discount-condition.ts:31](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L31)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/discount-condition.ts:32](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L32)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/discount-condition.ts:217](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L217)

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

[medusa/src/services/discount-condition.ts:184](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L184)

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

[medusa/src/services/discount-condition.ts:45](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L45)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/discount-condition.ts:111](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L111)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

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

[medusa/src/services/discount-condition.ts:74](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/discount-condition.ts#L74)
