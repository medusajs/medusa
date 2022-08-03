# Class: ProductTypeService

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

[services/product-type.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L16)

## Properties

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/product-type.ts:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L14)

___

### typeRepository\_

• `Private` **typeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[services/product-type.ts:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L15)

## Methods

### list

▸ **list**(`selector?`, `config?`): `Promise`<`ProductType`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductTypeProps` |  |
| `config` | `FindConfig`<`ProductType`\> |  |

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[services/product-type.ts:72](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L72)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`ProductType`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductTypeProps` |  |
| `config` | `FindConfig`<`ProductType`\> |  |

#### Returns

`Promise`<[`ProductType`[], `number`]\>

#### Defined in

[services/product-type.ts:88](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L88)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ProductType`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`ProductType`\> |  |

#### Returns

`Promise`<`ProductType`\>

#### Defined in

[services/product-type.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L47)

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

[services/product-type.ts:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/product-type.ts#L23)
