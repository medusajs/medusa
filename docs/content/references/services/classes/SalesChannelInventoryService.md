# Class: SalesChannelInventoryService

## Hierarchy

- `TransactionBaseService`

  ↳ **`SalesChannelInventoryService`**

## Constructors

### constructor

• **new SalesChannelInventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/sales-channel-inventory.ts:18](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/sales-channel-inventory.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:6

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: `IEventBusService`

#### Defined in

[medusa/src/services/sales-channel-inventory.ts:15](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/sales-channel-inventory.ts#L15)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `IInventoryService`

#### Defined in

[medusa/src/services/sales-channel-inventory.ts:16](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/sales-channel-inventory.ts#L16)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:7

___

### salesChannelLocationService\_

• `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[medusa/src/services/sales-channel-inventory.ts:14](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/sales-channel-inventory.ts#L14)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

utils/dist/common/transaction-base-service.d.ts:9

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

utils/dist/common/transaction-base-service.d.ts:24

___

### retrieveAvailableItemQuantity

▸ **retrieveAvailableItemQuantity**(`salesChannelId`, `inventoryItemId`): `Promise`<`number`\>

Retrieves the available quantity of an item across all sales channel locations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | Sales channel id |
| `inventoryItemId` | `string` | Item id |

#### Returns

`Promise`<`number`\>

available quantity of item across all sales channel locations

#### Defined in

[medusa/src/services/sales-channel-inventory.ts:37](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/sales-channel-inventory.ts#L37)

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

utils/dist/common/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

utils/dist/common/transaction-base-service.d.ts:11
