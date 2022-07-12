# Class: ProductService

## Hierarchy

- `TransactionBaseService`<[`ProductService`](ProductService.md)\>

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;ProductService\&gt;.constructor

#### Defined in

[services/product.ts:62](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L62)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/product.ts:53](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L53)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: typeof `ImageRepository`

#### Defined in

[services/product.ts:50](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L50)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/product.ts:42](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L42)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: typeof `ProductOptionRepository`

#### Defined in

[services/product.ts:45](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L45)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[services/product.ts:46](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L46)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: typeof `ProductTagRepository`

#### Defined in

[services/product.ts:49](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L49)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[services/product.ts:48](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L48)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[services/product.ts:47](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L47)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/product.ts:51](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L51)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[services/product.ts:52](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L52)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/product.ts:43](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L43)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/product.ts:56](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L56)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[services/product.ts:55](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L55)

## Methods

### addOption

▸ **addOption**(`productId`, `optionTitle`): `Promise`<`Product`\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<`Product`\>

the result of the model update operation

#### Defined in

[services/product.ts:552](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L552)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### count

▸ **count**(`selector?`): `Promise`<`number`\>

Return the total number of documents in database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> | the selector to choose products by |

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

[services/product.ts:175](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L175)

___

### create

▸ **create**(`productObject`): `Promise`<`Product`\>

Creates a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productObject` | `CreateProductInput` | the product to create |

#### Returns

`Promise`<`Product`\>

resolves to the creation result.

#### Defined in

[services/product.ts:324](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L324)

___

### delete

▸ **delete**(`productId`): `Promise`<`void`\>

Deletes a product from a given product id. The product's associated
variants will also be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[services/product.ts:518](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L518)

___

### deleteOption

▸ **deleteOption**(`productId`, `optionId`): `Promise`<`void` \| `Product`\>

Delete an option from a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`void` \| `Product`\>

the updated product

#### Defined in

[services/product.ts:693](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L693)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Product`[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> | an object that defines rules to filter products   by |
| `config` | `FindProductConfig` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<`Product`[]\>

the result of the find operation

#### Defined in

[services/product.ts:107](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L107)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Product`[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> | an object that defines rules to filter products   by |
| `config` | `FindProductConfig` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<[`Product`[], `number`]\>

an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

[services/product.ts:144](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L144)

___

### listTagsByUsage

▸ **listTagsByUsage**(`count?`): `Promise`<`ProductTag`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `10` |

#### Returns

`Promise`<`ProductTag`[]\>

#### Defined in

[services/product.ts:309](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L309)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[services/product.ts:299](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L299)

___

### prepareListQuery\_

▸ `Protected` **prepareListQuery_**(`selector`, `config`): `Object`

Creates a query object to be used for list queries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> | the selector to create the query from |
| `config` | `FindProductConfig` | the config to use for the query |

#### Returns

`Object`

an object containing the query, relations and free-text
  search param.

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | `FindWithoutRelationsOptions` |
| `relations` | keyof `Product`[] |

#### Defined in

[services/product.ts:759](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L759)

___

### reorderVariants

▸ **reorderVariants**(`productId`, `variantOrder`): `Promise`<`Product`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/product.ts:591](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L591)

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<`Product`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | `FindProductConfig` | object that defines what should be included in the   query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.ts:191](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L191)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Product`\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.ts:225](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L225)

___

### retrieveByHandle

▸ **retrieveByHandle**(`productHandle`, `config?`): `Promise`<`Product`\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.ts:209](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L209)

___

### retrieveVariants

▸ **retrieveVariants**(`productId`, `config?`): `Promise`<`ProductVariant`[]\>

Gets all variants belonging to a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config` | `FindProductConfig` | The config to select and configure relations etc... |

#### Returns

`Promise`<`ProductVariant`[]\>

an array of variants

#### Defined in

[services/product.ts:279](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L279)

___

### retrieve\_

▸ **retrieve_**(`selector`, `config?`): `Promise`<`Product`\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> | selector object |
| `config` | `FindProductConfig` | object that defines what should be included in the   query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.ts:242](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L242)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`productId`, `update`): `Promise`<`Product`\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateProductInput` | an object with the update values. |

#### Returns

`Promise`<`Product`\>

resolves to the update result.

#### Defined in

[services/product.ts:399](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L399)

___

### updateOption

▸ **updateOption**(`productId`, `optionId`, `data`): `Promise`<`Product`\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | `ProductOptionInput` | the data to update the option with |

#### Returns

`Promise`<`Product`\>

the updated product

#### Defined in

[services/product.ts:637](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product.ts#L637)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductService`](ProductService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductService`](ProductService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
