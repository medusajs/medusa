# View

View in the database represented in this class.

## Constructors

### constructor

**new View**(`options?`)

#### Parameters

| Name |
| :------ |
| `options?` | [`ViewOptions`](../interfaces/ViewOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:32

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:7

___

### database

 `Optional` **database**: `string`

Database name that this view resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:11

___

### expression

 **expression**: `string` \| (`connection`: [`DataSource`](DataSource.md)) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

View definition.

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:31

___

### indices

 **indices**: [`TableIndex`](TableIndex.md)[]

View Indices

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:27

___

### materialized

 **materialized**: `boolean`

Indicates if view is materialized.

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:23

___

### name

 **name**: `string`

View name

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:19

___

### schema

 `Optional` **schema**: `string`

Schema name that this view resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:15

## Methods

### addIndex

**addIndex**(`index`): `void`

Add index

#### Parameters

| Name |
| :------ |
| `index` | [`TableIndex`](TableIndex.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:40

___

### clone

**clone**(): [`View`](View.md)

Clones this table to a new table with all properties cloned.

#### Returns

[`View`](View.md)

-`View`: 

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:36

___

### removeIndex

**removeIndex**(`viewIndex`): `void`

Remove index

#### Parameters

| Name |
| :------ |
| `viewIndex` | [`TableIndex`](TableIndex.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:44

___

### create

`Static` **create**(`entityMetadata`, `driver`): [`View`](View.md)

Creates view from a given entity metadata.

#### Parameters

| Name |
| :------ |
| `entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |
| `driver` | [`Driver`](../interfaces/Driver.md) |

#### Returns

[`View`](View.md)

-`View`: 

#### Defined in

node_modules/typeorm/schema-builder/view/View.d.ts:48
