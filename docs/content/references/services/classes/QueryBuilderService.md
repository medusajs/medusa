# Class: QueryBuilderService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`QueryBuilderService`**

## Constructors

### constructor

• **new QueryBuilderService**()

#### Inherited from

BaseService.constructor

## Methods

### buildFilterQuery

▸ **buildFilterQuery**(`filters`): `undefined` \| {}

#### Parameters

| Name | Type |
| :------ | :------ |
| `filters` | `any` |

#### Returns

`undefined` \| {}

#### Defined in

[services/query-builder.js:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/query-builder.js#L25)

___

### buildQuery

▸ **buildQuery**(`params`, `properties`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |
| `properties` | `any` |

#### Returns

`Object`

#### Defined in

[services/query-builder.js:5](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/query-builder.js#L5)

___

### buildTextSearchQuery

▸ **buildTextSearchQuery**(`search`, `searchProperties`): `undefined` \| { `$or`: `any` = searchQuery }

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `any` |
| `searchProperties` | `any` |

#### Returns

`undefined` \| { `$or`: `any` = searchQuery }

#### Defined in

[services/query-builder.js:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/query-builder.js#L39)
