# SalesChannelService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`SalesChannelService`**

## Constructors

### constructor

**new SalesChannelService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-33.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L34)

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

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L31)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### salesChannelRepository\_

 `Protected` `Readonly` **salesChannelRepository\_**: [`Repository`](Repository.md)<[`SalesChannel`](SalesChannel.md)\> & { `addProducts`: Method addProducts ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `listProductIdsBySalesChannelIds`: Method listProductIdsBySalesChannelIds ; `removeProducts`: Method removeProducts  }

#### Defined in

[packages/medusa/src/services/sales-channel.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L30)

___

### storeService\_

 `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L32)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/sales-channel.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L24)

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

## Methods

### addProducts

**addProducts**(`salesChannelId`, `productIds`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Add a batch of product to a sales channel

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to add the products |
| `productIds` | `string`[] | The products ids to attach to the sales channel |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: the sales channel on which the products have been added
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:348](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L348)

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

### create

**create**(`data`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Creates a SalesChannel

 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name |
| :------ |
| `data` | [`CreateSalesChannelInput`](../types/CreateSalesChannelInput.md) |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: the created channel
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:168](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L168)

___

### createDefault

**createDefault**(): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Creates a default sales channel, if this does not already exist.

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: the sales channel
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:258](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L258)

___

### delete

**delete**(`salesChannelId`): `Promise`<`void`\>

Deletes a sales channel from
 This feature is under development and may change in the future.
To use this feature please enable the corresponding feature flag in your medusa backend project.

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | the id of the sales channel to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:219](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L219)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`SalesChannel`](SalesChannel.md)[], `number`]\>

Lists sales channels based on the provided parameters and includes the count of
sales channels that match the query.

#### Parameters

| Name |
| :------ |
| `selector` | [`QuerySelector`](../types/QuerySelector.md)<[`SalesChannel`](SalesChannel.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`SalesChannel`](SalesChannel.md)\> |

#### Returns

`Promise`<[[`SalesChannel`](SalesChannel.md)[], `number`]\>

-`Promise`: an array containing the sales channels as
  the first element and the total count of sales channels that matches the query
  as the second element.
	-`SalesChannel[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:134](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L134)

___

### listProductIdsBySalesChannelIds

**listProductIdsBySalesChannelIds**(`salesChannelIds`): `Promise`<{ `[salesChannelId: string]`: `string`[];  }\>

List all product ids that belongs to the sales channels ids

#### Parameters

| Name |
| :------ |
| `salesChannelIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[salesChannelId: string]`: `string`[];  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:310](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L310)

___

### removeProducts

**removeProducts**(`salesChannelId`, `productIds`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Remove a batch of product from a sales channel

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | The id of the sales channel on which to remove the products |
| `productIds` | `string`[] | The products ids to remove from the sales channel |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: the sales channel on which the products have been removed
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:327](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L327)

___

### retrieve

**retrieve**(`salesChannelId`, `config?`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Retrieve a SalesChannel by id

#### Parameters

| Name | Description |
| :------ | :------ |
| `salesChannelId` | `string` | id of the channel to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`SalesChannel`](SalesChannel.md)\> | SC config This feature is under development and may change in the future. To use this feature please enable the corresponding feature flag in your medusa backend project. |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: a sales channel
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:92](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L92)

___

### retrieveByName

**retrieveByName**(`name`, `config?`): `Promise`<`unknown`\>

Find a sales channel by name.

#### Parameters

| Name | Description |
| :------ | :------ |
| `name` | `string` | of the sales channel |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`SalesChannel`](SalesChannel.md)\> | find config |

#### Returns

`Promise`<`unknown`\>

-`Promise`: a sales channel with matching name
	-`unknown`: (optional) 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:113](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L113)

___

### retrieveDefault

**retrieveDefault**(): `Promise`<[`SalesChannel`](SalesChannel.md)\>

Retrieves the default sales channel.

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: the sales channel
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:288](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L288)

___

### retrieve\_

`Protected` **retrieve_**(`selector`, `config?`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

A generic retrieve used to find a sales channel by different attributes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`SalesChannel`](SalesChannel.md)\> | SC selector |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`SalesChannel`](SalesChannel.md)\> | find config |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: a single SC matching the query or throws
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L54)

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

### update

**update**(`salesChannelId`, `data`): `Promise`<[`SalesChannel`](SalesChannel.md)\>

#### Parameters

| Name |
| :------ |
| `salesChannelId` | `string` |
| `data` | [`Partial`](../types/Partial.md)<[`CreateSalesChannelInput`](../types/CreateSalesChannelInput.md)\> |

#### Returns

`Promise`<[`SalesChannel`](SalesChannel.md)\>

-`Promise`: 
	-`SalesChannel`: 

#### Defined in

[packages/medusa/src/services/sales-channel.ts:185](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/sales-channel.ts#L185)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`SalesChannelService`](SalesChannelService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`SalesChannelService`](SalesChannelService.md)

-`SalesChannelService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
