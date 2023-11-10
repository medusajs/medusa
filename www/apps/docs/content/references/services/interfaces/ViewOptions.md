# ViewOptions

View options.

## Properties

### database

 `Optional` **database**: `string`

Database name that this table resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/options/ViewOptions.d.ts:9

___

### expression

 **expression**: `string` \| (`connection`: [`DataSource`](../classes/DataSource.md)) => [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

View expression.

#### Defined in

node_modules/typeorm/schema-builder/options/ViewOptions.d.ts:21

___

### materialized

 `Optional` **materialized**: `boolean`

Indicates if view is materialized

#### Defined in

node_modules/typeorm/schema-builder/options/ViewOptions.d.ts:25

___

### name

 **name**: `string`

View name.

#### Defined in

node_modules/typeorm/schema-builder/options/ViewOptions.d.ts:17

___

### schema

 `Optional` **schema**: `string`

Schema name that this table resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/options/ViewOptions.d.ts:13
