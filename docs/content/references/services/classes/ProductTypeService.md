# Class: ProductTypeService

Provides layer to manipulate products.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ProductTypeService`**

## Constructors

### constructor

• **new ProductTypeService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/product-type.ts:16](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L16)

## Properties

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/product-type.ts:14](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L14)

___

### typeRepository\_

• `Private` **typeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[services/product-type.ts:15](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L15)

## Methods

### list

▸ **list**(`selector?`, `config?`): `Promise`<`ProductType`[]\>

Lists product types

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductTypeProps` | the query object for find |
| `config` | `FindConfig`<`ProductType`\> | the config to be used for find |

#### Returns

`Promise`<`ProductType`[]\>

the result of the find operation

#### Defined in

[services/product-type.ts:72](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L72)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`ProductType`[], `number`]\>

Lists product tags and adds count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductTypeProps` | the query object for find |
| `config` | `FindConfig`<`ProductType`\> | the config to be used for find |

#### Returns

`Promise`<[`ProductType`[], `number`]\>

the result of the find operation

#### Defined in

[services/product-type.ts:88](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L88)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ProductType`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the product to get. |
| `config` | `FindConfig`<`ProductType`\> | object that defines what should be included in the   query response |

#### Returns

`Promise`<`ProductType`\>

the result of the find one operation.

#### Defined in

[services/product-type.ts:47](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L47)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ProductTypeService`](ProductTypeService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`ProductTypeService`](ProductTypeService.md)

#### Defined in

[services/product-type.ts:23](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-type.ts#L23)
