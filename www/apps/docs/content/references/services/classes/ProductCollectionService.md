# ProductCollectionService

Provides layer to manipulate product collections.

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductCollectionService`**

## Constructors

### constructor

**new ProductCollectionService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product-collection.ts:49](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L49)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product-collection.ts:36](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L36)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCollectionRepository\_

 `Protected` `Readonly` **productCollectionRepository\_**: `Repository`<`ProductCollection`\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId  }

#### Defined in

[medusa/src/services/product-collection.ts:38](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L38)

___

### productRepository\_

 `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `_applyCategoriesQuery`: Method \_applyCategoriesQuery ; `_findWithRelations`: Method \_findWithRelations ; `bulkAddToCollection`: Method bulkAddToCollection ; `bulkRemoveFromCollection`: Method bulkRemoveFromCollection ; `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `getCategoryIdsFromInput`: Method getCategoryIdsFromInput ; `getCategoryIdsRecursively`: Method getCategoryIdsRecursively ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `isProductInSalesChannels`: Method isProductInSalesChannels ; `queryProducts`: Method queryProducts ; `queryProductsWithIds`: Method queryProductsWithIds  }

#### Defined in

[medusa/src/services/product-collection.ts:39](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L39)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PRODUCTS_ADDED` | `string` |
| `PRODUCTS_REMOVED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/product-collection.ts:41](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L41)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addProducts

**addProducts**(`collectionId`, `productIds`): `Promise`<`ProductCollection`\>

#### Parameters

| Name |
| :------ |
| `collectionId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<`ProductCollection`\>

-`Promise`: 
	-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:216](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L216)

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
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`collection`): `Promise`<`ProductCollection`\>

Creates a product collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `collection` | `CreateProductCollection` | the collection to create |

#### Returns

`Promise`<`ProductCollection`\>

-`Promise`: created collection
	-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:128](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L128)

___

### delete

**delete**(`collectionId`): `Promise`<`void`\>

Deletes a product collection idempotently

#### Parameters

| Name | Description |
| :------ | :------ |
| `collectionId` | `string` | id of collection to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[medusa/src/services/product-collection.ts:192](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L192)

___

### list

**list**(`selector?`, `config?`): `Promise`<`ProductCollection`[]\>

Lists product collections

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ProductCollection`\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | `object` | the config to be used for find |
| `config.skip` | `number` | `0` |
| `config.take` | `number` | `20` |

#### Returns

`Promise`<`ProductCollection`[]\>

-`Promise`: the result of the find operation
	-`ProductCollection[]`: 
		-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:274](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L274)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[`ProductCollection`[], `number`]\>

Lists product collections and add count.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `ListAndCountSelector` | the query object for find |
| `config` | `FindConfig`<`ProductCollection`\> | the config to be used for find |

#### Returns

`Promise`<[`ProductCollection`[], `number`]\>

-`Promise`: the result of the find operation
	-`ProductCollection[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/product-collection.ts:291](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L291)

___

### removeProducts

**removeProducts**(`collectionId`, `productIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `collectionId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/product-collection.ts:242](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L242)

___

### retrieve

**retrieve**(`collectionId`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `collectionId` | `string` | the id of the collection to retrieve. |
| `config` | `FindConfig`<`ProductCollection`\> | the config of the collection to retrieve. |

#### Returns

`Promise`<`ProductCollection`\>

-`Promise`: the collection.
	-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:68](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L68)

___

### retrieveByHandle

**retrieveByHandle**(`collectionHandle`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `collectionHandle` | `string` | the handle of the collection to retrieve. |
| `config` | `FindConfig`<`ProductCollection`\> | query config for request |

#### Returns

`Promise`<`ProductCollection`\>

-`Promise`: the collection.
	-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:102](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L102)

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

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`collectionId`, `update`): `Promise`<`ProductCollection`\>

Updates a product collection

#### Parameters

| Name | Description |
| :------ | :------ |
| `collectionId` | `string` | id of collection to update |
| `update` | `UpdateProductCollection` | update object |

#### Returns

`Promise`<`ProductCollection`\>

-`Promise`: update collection
	-`ProductCollection`: 

#### Defined in

[medusa/src/services/product-collection.ts:154](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product-collection.ts#L154)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductCollectionService`](ProductCollectionService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductCollectionService`](ProductCollectionService.md)

-`ProductCollectionService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
