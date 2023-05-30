# Class: SalesChannelLocationService

Service for managing the stock locations of sales channels

## Hierarchy

- `TransactionBaseService`

  ↳ **`SalesChannelLocationService`**

## Constructors

### constructor

• **new SalesChannelLocationService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/sales-channel-location.ts:25](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L25)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: `IEventBusService`

#### Defined in

[medusa/src/services/sales-channel-location.ts:22](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L22)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### salesChannelService\_

• `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](SalesChannelService.md)

#### Defined in

[medusa/src/services/sales-channel-location.ts:21](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L21)

___

### stockLocationService\_

• `Protected` `Readonly` **stockLocationService\_**: `IStockLocationService`

#### Defined in

[medusa/src/services/sales-channel-location.ts:23](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L23)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### associateLocation

▸ **associateLocation**(`salesChannelId`, `locationId`): `Promise`<`void`\>

Associates a sales channel with a stock location.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The ID of the sales channel. |
| `locationId` | `string` | The ID of the stock location. |

#### Returns

`Promise`<`void`\>

A promise that resolves when the association has been created.

#### Defined in

[medusa/src/services/sales-channel-location.ts:73](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L73)

___

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### listLocationIds

▸ **listLocationIds**(`salesChannelId`): `Promise`<`string`[]\>

Lists the stock locations associated with a sales channel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` \| `string`[] | The ID of the sales channel. |

#### Returns

`Promise`<`string`[]\>

A promise that resolves with an array of location IDs.

#### Defined in

[medusa/src/services/sales-channel-location.ts:102](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L102)

___

### listSalesChannelIds

▸ **listSalesChannelIds**(`locationId`): `Promise`<`string`[]\>

Lists the sales channels associated with a stock location.

#### Parameters

| Name | Type |
| :------ | :------ |
| `locationId` | `string` |

#### Returns

`Promise`<`string`[]\>

A promise that resolves with an array of sales channel IDs.

#### Defined in

[medusa/src/services/sales-channel-location.ts:131](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L131)

___

### removeLocation

▸ **removeLocation**(`locationId`, `salesChannelId?`): `Promise`<`void`\>

Removes an association between a sales channel and a stock location.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locationId` | `string` | The ID of the stock location. |
| `salesChannelId?` | `string` | The ID of the sales channel or undefined if all the sales channel will be affected. |

#### Returns

`Promise`<`void`\>

A promise that resolves when the association has been removed.

#### Defined in

[medusa/src/services/sales-channel-location.ts:44](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/sales-channel-location.ts#L44)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
