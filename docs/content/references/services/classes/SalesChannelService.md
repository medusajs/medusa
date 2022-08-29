# Class: SalesChannelService

## Hierarchy

- `TransactionBaseService`

  ↳ **`SalesChannelService`**

## Constructors

### constructor

• **new SalesChannelService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/sales-channel.ts:37](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L37)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:34](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L34)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/sales-channel.ts:30](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L30)

___

### salesChannelRepository\_

• `Protected` `Readonly` **salesChannelRepository\_**: typeof `SalesChannelRepository`

#### Defined in

[packages/medusa/src/services/sales-channel.ts:33](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L33)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:35](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L35)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/sales-channel.ts:31](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L31)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/sales-channel.ts:24](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L24)

## Methods

### addProducts

▸ **addProducts**(`salesChannelId`, `productIds`): `Promise`<`SalesChannel`\>

Add a batch of product to a sales channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to add the products |
| `productIds` | `string`[] | The products ids to attach to the sales channel |

#### Returns

`Promise`<`SalesChannel`\>

the sales channel on which the products have been added

#### Defined in

[packages/medusa/src/services/sales-channel.ts:277](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L277)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`data`): `Promise`<`SalesChannel`\>

Creates a SalesChannel

 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateSalesChannelInput` |

#### Returns

`Promise`<`SalesChannel`\>

the created channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:134](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L134)

___

### createDefault

▸ **createDefault**(): `Promise`<`SalesChannel`\>

Creates a default sales channel, if this does not already exist.

#### Returns

`Promise`<`SalesChannel`\>

the sales channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:224](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L224)

___

### delete

▸ **delete**(`salesChannelId`): `Promise`<`void`\>

Deletes a sales channel from
 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | the id of the sales channel to delete |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/sales-channel.ts:185](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L185)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`SalesChannel`[], `number`]\>

Lists sales channels based on the provided parameters and includes the count of
sales channels that match the query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`SalesChannel`\> |
| `config` | `FindConfig`<`SalesChannel`\> |

#### Returns

`Promise`<[`SalesChannel`[], `number`]\>

an array containing the sales channels as
  the first element and the total count of sales channels that matches the query
  as the second element.

#### Defined in

[packages/medusa/src/services/sales-channel.ts:99](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L99)

___

### removeProducts

▸ **removeProducts**(`salesChannelId`, `productIds`): `Promise`<`SalesChannel`\>

Remove a batch of product from a sales channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to remove the products |
| `productIds` | `string`[] | The products ids to remove from the sales channel |

#### Returns

`Promise`<`SalesChannel`\>

the sales channel on which the products have been removed

#### Defined in

[packages/medusa/src/services/sales-channel.ts:256](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L256)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `config?`): `Promise`<`SalesChannel`\>

Retrieve a SalesChannel by id

 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `config` | `FindConfig`<`SalesChannel`\> |

#### Returns

`Promise`<`SalesChannel`\>

a sales channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:64](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L64)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`salesChannelId`, `data`): `Promise`<`SalesChannel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `data` | `Partial`<`CreateSalesChannelInput`\> |

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[packages/medusa/src/services/sales-channel.ts:151](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/sales-channel.ts#L151)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`SalesChannelService`](SalesChannelService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`SalesChannelService`](SalesChannelService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
