---
displayed_sidebar: jsClientSidebar
---

# Class: ProductCollectionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductCollectionService

Provides layer to manipulate product collections.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductCollectionService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:23

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productCollectionRepository\_

• `Protected` `Readonly` **productCollectionRepository\_**: `Repository`<[`ProductCollection`](internal-3.ProductCollection.md)\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductCollection`](internal-3.ProductCollection.md)\>) => `Promise`<[[`ProductCollection`](internal-3.ProductCollection.md)[], `number`]\>  }

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:24

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<[`Product`](internal-3.Product.md)\> & { `_applyCategoriesQuery`: (`qb`: `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\>, `__namedParameters`: { `alias`: `any` ; `categoryAlias`: `any` ; `joinName`: `any` ; `where`: `any`  }) => `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\> ; `_findWithRelations`: (`__namedParameters`: { `idsOrOptionsWithoutRelations`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1) ; `relations`: `string`[] ; `shouldCount`: `boolean` ; `withDeleted`: `boolean`  }) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findOneWithRelations`: (`relations?`: `string`[], `optionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[`Product`](internal-3.Product.md)\> ; `findWithRelations`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `withDeleted?`: `boolean`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findWithRelationsAndCount`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `getCategoryIdsFromInput`: (`categoryId?`: [`CategoryQueryParams`](../modules/internal-8.md#categoryqueryparams), `includeCategoryChildren?`: `boolean`) => `Promise`<`string`[]\> ; `getCategoryIdsRecursively`: (`productCategory`: [`ProductCategory`](internal-3.ProductCategory.md)) => `string`[] ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `relations?`: `string`[]) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `queryProducts`: (`optionsWithoutRelations`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `shouldCount?`: `boolean`) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `queryProductsWithIds`: (`__namedParameters`: { `entityIds`: `string`[] ; `groupedRelations`: { `[toplevel: string]`: `string`[];  } ; `order?`: { `[column: string]`: ``"ASC"`` \| ``"DESC"``;  } ; `select?`: keyof [`Product`](internal-3.Product.md)[] ; `where?`: `FindOptionsWhere`<[`Product`](internal-3.Product.md)\> ; `withDeleted?`: `boolean`  }) => `Promise`<[`Product`](internal-3.Product.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:25

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PRODUCTS_ADDED` | `string` |
| `PRODUCTS_REMOVED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:26

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addProducts

▸ **addProducts**(`collectionId`, `productIds`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:67

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`collection`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

Creates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collection` | [`CreateProductCollection`](../modules/internal-8.md#createproductcollection) | the collection to create |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

created collection

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:53

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

packages/medusa/dist/services/product-collection.d.ts:66

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)[]\>

Lists product collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductCollection`](internal-3.ProductCollection.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config?` | `Object` | the config to be used for find |
| `config.skip` | `number` | - |
| `config.take` | `number` | - |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:75

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`ProductCollection`](internal-3.ProductCollection.md)[], `number`]\>

Lists product collections and add count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`ListAndCountSelector`](../modules/internal-8.md#listandcountselector) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCollection`](internal-3.ProductCollection.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`ProductCollection`](internal-3.ProductCollection.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:88

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

packages/medusa/dist/services/product-collection.d.ts:68

___

### retrieve

▸ **retrieve**(`collectionId`, `config?`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | the id of the collection to retrieve. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCollection`](internal-3.ProductCollection.md)\> | the config of the collection to retrieve. |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

the collection.

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:40

___

### retrieveByHandle

▸ **retrieveByHandle**(`collectionHandle`, `config?`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionHandle` | `string` | the handle of the collection to retrieve. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCollection`](internal-3.ProductCollection.md)\> | query config for request |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

the collection.

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:47

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`collectionId`, `update`): `Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

Updates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | id of collection to update |
| `update` | [`UpdateProductCollection`](../modules/internal-8.md#updateproductcollection) | update object |

#### Returns

`Promise`<[`ProductCollection`](internal-3.ProductCollection.md)\>

update collection

#### Defined in

packages/medusa/dist/services/product-collection.d.ts:60

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductCollectionService`](internal-8.internal.ProductCollectionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductCollectionService`](internal-8.internal.ProductCollectionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
