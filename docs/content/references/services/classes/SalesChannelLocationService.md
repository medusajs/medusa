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

[packages/medusa/src/services/sales-channel-location.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L26)

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

### eventBusService

• `Protected` `Readonly` **eventBusService**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:23](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L23)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L19)

___

### salesChannelService\_

• `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](SalesChannelService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L22)

___

### stockLocationService

• `Protected` `Readonly` **stockLocationService**: `IStockLocationService`

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L24)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L20)

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

[packages/medusa/src/services/sales-channel-location.ts:77](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L77)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### listLocations

▸ **listLocations**(`salesChannelId`): `Promise`<`string`[]\>

Lists the stock locations associated with a sales channel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The ID of the sales channel. |

#### Returns

`Promise`<`string`[]\>

A promise that resolves with an array of location IDs.

#### Defined in

[packages/medusa/src/services/sales-channel-location.ts:104](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L104)

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

[packages/medusa/src/services/sales-channel-location.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-location.ts#L47)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
