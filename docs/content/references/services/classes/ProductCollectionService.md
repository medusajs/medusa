# Class: ProductCollectionService

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

[services/product-collection.js:11](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L11)

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

[services/product-collection.js:170](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L170)

___

### create

▸ **create**(`collection`): `Promise`<`ProductCollection`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collection` | `any` |  |

#### Returns

`Promise`<`ProductCollection`\>

#### Defined in

[services/product-collection.js:104](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L104)

___

### delete

▸ **delete**(`collectionId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product-collection.js:152](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L152)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product-collection.js:206](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L206)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product-collection.js:221](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L221)

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

[services/product-collection.js:188](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L188)

___

### retrieve

▸ **retrieve**(`collectionId`, `config?`): `Promise`<`ProductCollection`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`ProductCollection`\>

#### Defined in

[services/product-collection.js:55](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L55)

___

### retrieveByHandle

▸ **retrieveByHandle**(`collectionHandle`, `config?`): `Promise`<`ProductCollection`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionHandle` | `string` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`ProductCollection`\>

#### Defined in

[services/product-collection.js:81](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L81)

___

### update

▸ **update**(`collectionId`, `update`): `Promise`<`ProductCollection`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`ProductCollection`\>

#### Defined in

[services/product-collection.js:125](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L125)

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

[services/product-collection.js:32](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-collection.js#L32)
