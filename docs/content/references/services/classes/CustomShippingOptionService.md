# Class: CustomShippingOptionService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`CustomShippingOptionService`**

## Constructors

### constructor

• **new CustomShippingOptionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/custom-shipping-option.js:5](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/custom-shipping-option.js#L5)

## Methods

### create

▸ **create**(`data`, `config?`): `Promise`<`CustomShippingOption`\>

Creates a custom shipping option associated with a given author

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | the custom shipping option to create |
| `config` | `any` | any configurations if needed, including meta data |

#### Returns

`Promise`<`CustomShippingOption`\>

resolves to the creation result

#### Defined in

[services/custom-shipping-option.js:88](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/custom-shipping-option.js#L88)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`CustomShippingOption`[]\>

Fetches all custom shipping options related to the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`CustomShippingOption`[]\>

custom shipping options matching the query

#### Defined in

[services/custom-shipping-option.js:65](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/custom-shipping-option.js#L65)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`CustomShippingOption`\>

Retrieves a specific shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the custom shipping option to retrieve. |
| `config` | `any` | any options needed to query for the result. |

#### Returns

`Promise`<`CustomShippingOption`\>

which resolves to the requested custom shipping option.

#### Defined in

[services/custom-shipping-option.js:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/custom-shipping-option.js#L40)

___

### withTransaction

▸ **withTransaction**(`manager`): [`CustomShippingOptionService`](CustomShippingOptionService.md)

Sets the service's manager to a given transaction manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manager` | `EntityManager` | the manager to use |

#### Returns

[`CustomShippingOptionService`](CustomShippingOptionService.md)

a cloned CustomShippingOption service

#### Defined in

[services/custom-shipping-option.js:20](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/custom-shipping-option.js#L20)
