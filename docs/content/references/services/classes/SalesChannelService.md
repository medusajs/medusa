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

[packages/medusa/src/services/sales-channel.ts:37](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L37)

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

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L34)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/sales-channel.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L30)

___

### salesChannelRepository\_

• `Protected` `Readonly` **salesChannelRepository\_**: typeof `SalesChannelRepository`

#### Defined in

[packages/medusa/src/services/sales-channel.ts:33](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L33)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[packages/medusa/src/services/sales-channel.ts:35](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L35)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/sales-channel.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L31)

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

[packages/medusa/src/services/sales-channel.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L24)

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

[packages/medusa/src/services/sales-channel.ts:344](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L344)

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

[packages/medusa/src/services/sales-channel.ts:180](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L180)

___

### createDefault

▸ **createDefault**(): `Promise`<`SalesChannel`\>

Creates a default sales channel, if this does not already exist.

#### Returns

`Promise`<`SalesChannel`\>

the sales channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:270](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L270)

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

[packages/medusa/src/services/sales-channel.ts:231](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L231)

___

### getManager

▸ `Private` **getManager**(): `EntityManager`

#### Returns

`EntityManager`

#### Defined in

[packages/medusa/src/services/sales-channel.ts:52](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L52)

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

[packages/medusa/src/services/sales-channel.ts:145](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L145)

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

[packages/medusa/src/services/sales-channel.ts:323](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L323)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `config?`): `Promise`<`SalesChannel`\>

Retrieve a SalesChannel by id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | id of the channel to retrieve |
| `config` | `FindConfig`<`SalesChannel`\> | SC config  This feature is under development and may change in the future. To use this feature please enable the corresponding feature flag in your medusa backend project. |

#### Returns

`Promise`<`SalesChannel`\>

a sales channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:103](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L103)

___

### retrieveByName

▸ **retrieveByName**(`name`, `config?`): `Promise`<`unknown`\>

Find a sales channel by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | of the sales channel |
| `config` | `FindConfig`<`SalesChannel`\> | find config |

#### Returns

`Promise`<`unknown`\>

a sales channel with matching name

#### Defined in

[packages/medusa/src/services/sales-channel.ts:124](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L124)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<`SalesChannel`\>

Retrieves the default sales channel.

#### Returns

`Promise`<`SalesChannel`\>

the sales channel

#### Defined in

[packages/medusa/src/services/sales-channel.ts:300](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L300)

___

### retrieve\_

▸ `Protected` **retrieve_**(`selector`, `config?`): `Promise`<`SalesChannel`\>

A generic retrieve used to find a sales channel by different attributes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`SalesChannel`\> | SC selector |
| `config` | `FindConfig`<`SalesChannel`\> | find config |

#### Returns

`Promise`<`SalesChannel`\>

a single SC matching the query or throws

#### Defined in

[packages/medusa/src/services/sales-channel.ts:63](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L63)

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

[packages/medusa/src/services/sales-channel.ts:197](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel.ts#L197)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
