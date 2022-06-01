# Class: ProductCollectionService

Provides layer to manipulate product collections.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ProductCollectionService`**

## Constructors

### constructor

• **new ProductCollectionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/product-collection.js:11](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L11)

## Methods

### addProducts

▸ **addProducts**(`collectionId`, `productIds`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `any` |
| `productIds` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product-collection.js:170](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L170)

___

### create

▸ **create**(`collection`): `Promise`<`ProductCollection`\>

Creates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collection` | `any` | the collection to create |

#### Returns

`Promise`<`ProductCollection`\>

created collection

#### Defined in

[services/product-collection.js:104](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L104)

___

### delete

▸ **delete**(`collectionId`): `Promise`<`any`\>

Deletes a product collection idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | id of collection to delete |

#### Returns

`Promise`<`any`\>

empty promise

#### Defined in

[services/product-collection.js:152](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L152)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

Lists product collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config to be used for find |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/product-collection.js:206](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L206)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<`any`\>

Lists product collections and add count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config to be used for find |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/product-collection.js:221](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L221)

___

### removeProducts

▸ **removeProducts**(`collectionId`, `productIds`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `any` |
| `productIds` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product-collection.js:188](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L188)

___

### retrieve

▸ **retrieve**(`collectionId`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | the id of the collection to retrieve. |
| `config` | `any` | the config of the collection to retrieve. |

#### Returns

`Promise`<`ProductCollection`\>

the collection.

#### Defined in

[services/product-collection.js:55](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L55)

___

### retrieveByHandle

▸ **retrieveByHandle**(`collectionHandle`, `config?`): `Promise`<`ProductCollection`\>

Retrieves a product collection by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionHandle` | `string` | the handle of the collection to retrieve. |
| `config` | `any` | query config for request |

#### Returns

`Promise`<`ProductCollection`\>

the collection.

#### Defined in

[services/product-collection.js:81](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L81)

___

### update

▸ **update**(`collectionId`, `update`): `Promise`<`ProductCollection`\>

Updates a product collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | id of collection to update |
| `update` | `any` | update object |

#### Returns

`Promise`<`ProductCollection`\>

update collection

#### Defined in

[services/product-collection.js:125](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L125)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ProductCollectionService`](ProductCollectionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`ProductCollectionService`](ProductCollectionService.md)

#### Defined in

[services/product-collection.js:32](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product-collection.js#L32)
