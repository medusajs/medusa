# Class: ProductCollectionService

Provides layer to manipulate product collections.

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductCollectionService`**

## Constructors

### constructor

• **new ProductCollectionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/product-collection.ts:35](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L35)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-collection.ts:30](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L30)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-collection.ts:27](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L27)

___

### productCollectionRepository\_

• `Protected` `Readonly` **productCollectionRepository\_**: typeof `ProductCollectionRepository`

#### Defined in

[packages/medusa/src/services/product-collection.ts:32](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L32)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/product-collection.ts:33](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L33)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-collection.ts:28](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L28)

## Methods

### addProducts

▸ **addProducts**(`collectionId`, `productIds`): `Promise`<`ProductCollection`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<`ProductCollection`\>

#### Defined in

[packages/medusa/src/services/product-collection.ts:179](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L179)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`collection`): `Promise`<`ProductCollection`\>

Creates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collection` | `CreateProductCollection` | the collection to create |

#### Returns

`Promise`<`ProductCollection`\>

created collection

#### Defined in

[packages/medusa/src/services/product-collection.ts:108](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L108)

___

### delete

▸ **delete**(`collectionId`): `Promise`<`void`\>

Deletes a product collection idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | id of collection to delete |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[packages/medusa/src/services/product-collection.ts:161](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L161)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`ProductCollection`[]\>

Lists product collections

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `selector` | `Object` | `{}` | the query object for find |
| `config` | `Object` | `undefined` | the config to be used for find |
| `config.skip` | `number` | `0` | - |
| `config.take` | `number` | `20` | - |

#### Returns

`Promise`<`ProductCollection`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/product-collection.ts:221](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L221)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`ProductCollection`[], `number`]\>

Lists product collections and add count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`ProductCollection`\> | the query object for find |
| `config` | `FindConfig`<`ProductCollection`\> | the config to be used for find |

#### Returns

`Promise`<[`ProductCollection`[], `number`]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/product-collection.ts:239](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L239)

___

### removeProducts

▸ **removeProducts**(`collectionId`, `productIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/product-collection.ts:200](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L200)

___

### retrieve

▸ **retrieve**(`collectionId`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | the id of the collection to retrieve. |
| `config` | `FindConfig`<`ProductCollection`\> | the config of the collection to retrieve. |

#### Returns

`Promise`<`ProductCollection`\>

the collection.

#### Defined in

[packages/medusa/src/services/product-collection.ts:55](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L55)

___

### retrieveByHandle

▸ **retrieveByHandle**(`collectionHandle`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionHandle` | `string` | the handle of the collection to retrieve. |
| `config` | `FindConfig`<`ProductCollection`\> | query config for request |

#### Returns

`Promise`<`ProductCollection`\>

the collection.

#### Defined in

[packages/medusa/src/services/product-collection.ts:82](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L82)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`collectionId`, `update`): `Promise`<`ProductCollection`\>

Updates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | id of collection to update |
| `update` | `UpdateProductCollection` | update object |

#### Returns

`Promise`<`ProductCollection`\>

update collection

#### Defined in

[packages/medusa/src/services/product-collection.ts:131](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/product-collection.ts#L131)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductCollectionService`](ProductCollectionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductCollectionService`](ProductCollectionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
