# SalesChannelInventoryService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`SalesChannelInventoryService`**

## Constructors

### constructor

**new SalesChannelInventoryService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-34.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:21](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel-inventory.ts#L21)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`IEventBusService`](../interfaces/IEventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel-inventory.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### salesChannelLocationService\_

 `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel-inventory.ts#L14)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### inventoryService\_

`Protected` `get` **inventoryService_**(): [`IInventoryService`](../interfaces/IInventoryService.md)

#### Returns

[`IInventoryService`](../interfaces/IInventoryService.md)

-`__joinerConfig`: 
-`adjustInventory`: 
-`confirmInventory`: 
-`createInventoryItem`: 
-`createInventoryItems`: 
-`createInventoryLevel`: 
-`createInventoryLevels`: 
-`createReservationItem`: 
-`createReservationItems`: 
-`deleteInventoryItem`: 
-`deleteInventoryItemLevelByLocationId`: 
-`deleteInventoryLevel`: 
-`deleteReservationItem`: 
-`deleteReservationItemByLocationId`: 
-`deleteReservationItemsByLineItem`: 
-`listInventoryItems`: 
-`listInventoryLevels`: 
-`listReservationItems`: 
-`restoreInventoryItem`: 
-`retrieveAvailableQuantity`: 
-`retrieveInventoryItem`: 
-`retrieveInventoryLevel`: 
-`retrieveReservationItem`: 
-`retrieveReservedQuantity`: 
-`retrieveStockedQuantity`: 
-`updateInventoryItem`: 
-`updateInventoryLevel`: 
-`updateInventoryLevels`: 
-`updateReservationItem`: 

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel-inventory.ts#L17)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### retrieveAvailableItemQuantity

**retrieveAvailableItemQuantity**(`salesChannelId`, `inventoryItemId`): `Promise`<`number`\>

Retrieves the available quantity of an item across all sales channel locations

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | Sales channel id |
| `inventoryItemId` | `string` | Item id |

#### Returns

`Promise`<`number`\>

-`Promise`: available quantity of item across all sales channel locations
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:38](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel-inventory.ts#L38)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`SalesChannelInventoryService`](SalesChannelInventoryService.md)

-`SalesChannelInventoryService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
