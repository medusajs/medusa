# IStockLocationService

## Methods

### \_\_joinerConfig

**__joinerConfig**(): [`ModuleJoinerConfig`](../types/ModuleJoinerConfig.md)

#### Returns

[`ModuleJoinerConfig`](../types/ModuleJoinerConfig.md)

-`ModuleJoinerConfig`: 
	-`alias`: (optional) Property name to use as entrypoint to the service
	-`args`: (optional) Extra arguments to pass to the remoteFetchData callback
	-`fieldAlias`: (optional) alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })
	-`databaseConfig`: (optional) 
		-`extraFields`: (optional) 
		-`idPrefix`: (optional) Prefix for the id column. If not provided it is "link"
		-`tableName`: (optional) Name of the pivot table. If not provided it is auto generated
	-`extends`: (optional) 
		-`fieldAlias`: (optional) 
		-`relationship`: 
		-`serviceName`: 
	-`isLink`: (optional) If the module is a link module
	-`isReadOnlyLink`: (optional) If true it expands a RemoteQuery property but doesn't create a pivot table
	-`linkableKeys`: (optional) Keys that can be used to link to other modules. e.g { product_id: "Product" } "Product" being the entity it refers to
	-`primaryKeys`: (optional) 
	-`relationships`: (optional) 
		-`alias`: 
		-`args`: (optional) Extra arguments to pass to the remoteFetchData callback
		-`foreignKey`: 
		-`inverse`: (optional) In an inverted relationship the foreign key is on the other service and the primary key is on the current service
		-`isInternalService`: (optional) If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services
		-`isList`: (optional) Force the relationship to return a list
		-`primaryKey`: 
		-`serviceName`: 
		-`deleteCascade`: (optional) If true, the link joiner will cascade deleting the relationship
		-`isInternalService`: (optional) If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services
	-`schema`: (optional) GraphQL schema for the all module's available entities and fields
	-`serviceName`: (optional) 

#### Defined in

packages/types/dist/stock-location/service.d.ts:6

___

### create

**create**(`input`, `context?`): `Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

#### Parameters

| Name |
| :------ |
| `input` | [`CreateStockLocationInput`](../types/CreateStockLocationInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

-`Promise`: 
	-`StockLocationDTO`: Represents a Stock Location
		-`address`: (optional) The Address of the Stock Location
		-`address_id`: Stock location address' ID
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: The stock location's ID
		-`metadata`: An optional key-value map with additional details
		-`name`: The name of the stock location
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/stock-location/service.d.ts:10

___

### delete

**delete**(`id`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/stock-location/service.d.ts:12

___

### list

**list**(`selector`, `config?`, `context?`): `Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)[]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableStockLocationProps`](../types/FilterableStockLocationProps.md) |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`StockLocationDTO`](../types/StockLocationDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)[]\>

-`Promise`: 
	-`StockLocationDTO[]`: 
		-`StockLocationDTO`: Represents a Stock Location

#### Defined in

packages/types/dist/stock-location/service.d.ts:7

___

### listAndCount

**listAndCount**(`selector`, `config?`, `context?`): `Promise`<[[`StockLocationDTO`](../types/StockLocationDTO.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableStockLocationProps`](../types/FilterableStockLocationProps.md) |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`StockLocationDTO`](../types/StockLocationDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[[`StockLocationDTO`](../types/StockLocationDTO.md)[], `number`]\>

-`Promise`: 
	-`StockLocationDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/stock-location/service.d.ts:8

___

### retrieve

**retrieve**(`id`, `config?`, `context?`): `Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`StockLocationDTO`](../types/StockLocationDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

-`Promise`: 
	-`StockLocationDTO`: Represents a Stock Location
		-`address`: (optional) The Address of the Stock Location
		-`address_id`: Stock location address' ID
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: The stock location's ID
		-`metadata`: An optional key-value map with additional details
		-`name`: The name of the stock location
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/stock-location/service.d.ts:9

___

### update

**update**(`id`, `input`, `context?`): `Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `input` | [`UpdateStockLocationInput`](../types/UpdateStockLocationInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`StockLocationDTO`](../types/StockLocationDTO.md)\>

-`Promise`: 
	-`StockLocationDTO`: Represents a Stock Location
		-`address`: (optional) The Address of the Stock Location
		-`address_id`: Stock location address' ID
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: The stock location's ID
		-`metadata`: An optional key-value map with additional details
		-`name`: The name of the stock location
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/stock-location/service.d.ts:11
