# SalesChannelLocationService

Service for managing the stock locations of sales channels

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`SalesChannelLocationService`**

## Constructors

### constructor

**new SalesChannelLocationService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-35) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L27)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`IEventBusService`](../interfaces/IEventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:21](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L21)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### salesChannelService\_

 `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](SalesChannelService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L20)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### stockLocationService\_

`Protected` `get` **stockLocationService_**(): [`IStockLocationService`](../interfaces/IStockLocationService.md)

#### Returns

[`IStockLocationService`](../interfaces/IStockLocationService.md)

-`__joinerConfig`: 
-`create`: 
-`delete`: 
-`list`: 
-`listAndCount`: 
-`retrieve`: 
-`update`: 

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:23](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L23)

## Methods

### associateLocation

**associateLocation**(`salesChannelId`, `locationId`): `Promise`<`void`\>

Associates a sales channel with a stock location.

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | The ID of the sales channel. |
| `locationId` | `string` | The ID of the stock location. |

#### Returns

`Promise`<`void`\>

-`Promise`: A promise that resolves when the association has been created.

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L70)

___

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### listLocationIds

**listLocationIds**(`salesChannelId`): `Promise`<`string`[]\>

Lists the stock locations associated with a sales channel.

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` \| `string`[] | The ID of the sales channel. |

#### Returns

`Promise`<`string`[]\>

-`Promise`: A promise that resolves with an array of location IDs.
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:101](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L101)

___

### listSalesChannelIds

**listSalesChannelIds**(`locationId`): `Promise`<`string`[]\>

Lists the sales channels associated with a stock location.

#### Parameters

| Name |
| :------ |
| `locationId` | `string` |

#### Returns

`Promise`<`string`[]\>

-`Promise`: A promise that resolves with an array of sales channel IDs.
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:130](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L130)

___

### removeLocation

**removeLocation**(`locationId`, `salesChannelId?`): `Promise`<`void`\>

Removes an association between a sales channel and a stock location.

#### Parameters

| Name | Description |
| :------ | :------ |
| `locationId` | `string` | The ID of the stock location. |
| `salesChannelId?` | `string` | The ID of the sales channel or undefined if all the sales channel will be affected. |

#### Returns

`Promise`<`void`\>

-`Promise`: A promise that resolves when the association has been removed.

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/sales-channel-location.ts#L41)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`SalesChannelLocationService`](SalesChannelLocationService.md)

-`SalesChannelLocationService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
