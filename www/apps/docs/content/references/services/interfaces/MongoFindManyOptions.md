# MongoFindManyOptions

Defines a special criteria to find specific entities.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | `object` |

## Hierarchy

- [`MongoFindOneOptions`](../index.md#mongofindoneoptions)<`Entity`\>

  ↳ **`MongoFindManyOptions`**

## Properties

### cache

 `Optional` **cache**: `number` \| `boolean` \| { `id`: `any` ; `milliseconds`: `number`  }

Enables or disables query result caching.

#### Inherited from

MongoFindOneOptions.cache

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:49

___

### comment

 `Optional` **comment**: `string`

Adds a comment with the supplied string in the generated query.  This is
helpful for debugging purposes, such as finding a specific query in the
database server's logs, or for categorization using an APM product.

#### Inherited from

MongoFindOneOptions.comment

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:15

___

### join

 `Optional` **join**: [`JoinOptions`](JoinOptions.md)

Specifies what relations should be loaded.

**Deprecated**

#### Inherited from

MongoFindOneOptions.join

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:41

___

### loadEagerRelations

 `Optional` **loadEagerRelations**: `boolean`

Indicates if eager relations should be loaded or not.
By default, they are loaded when find methods are used.

#### Inherited from

MongoFindOneOptions.loadEagerRelations

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:82

___

### loadRelationIds

 `Optional` **loadRelationIds**: `boolean` \| { `disableMixedMap?`: `boolean` ; `relations?`: `string`[]  }

If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects).
If array of strings is given then loads only relation ids of the given properties.

#### Inherited from

MongoFindOneOptions.loadRelationIds

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:74

___

### lock

 `Optional` **lock**: { `mode`: ``"optimistic"`` ; `version`: `number` \| `Date`  } \| { `mode`: ``"pessimistic_read"`` \| ``"pessimistic_write"`` \| ``"dirty_read"`` \| ``"pessimistic_partial_write"`` \| ``"pessimistic_write_or_fail"`` \| ``"for_no_key_update"`` \| ``"for_key_share"`` ; `onLocked?`: ``"nowait"`` \| ``"skip_locked"`` ; `tables?`: `string`[]  }

Indicates what locking mode should be used.

Note: For lock tables, you must specify the table names and not the relation names

#### Inherited from

MongoFindOneOptions.lock

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:58

___

### order

 `Optional` **order**: [`FindOptionsOrder`](../index.md#findoptionsorder)<`Entity`\>

Order, in which entities should be ordered.

#### Inherited from

MongoFindOneOptions.order

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:45

___

### relationLoadStrategy

 `Optional` **relationLoadStrategy**: ``"join"`` \| ``"query"``

Specifies how relations must be loaded - using "joins" or separate queries.
If you are loading too much data with nested joins it's better to load relations
using separate queries.

Default strategy is "join", but default can be customized in connection options.

#### Inherited from

MongoFindOneOptions.relationLoadStrategy

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:35

___

### relations

 `Optional` **relations**: [`FindOptionsRelationByString`](../index.md#findoptionsrelationbystring) \| [`FindOptionsRelations`](../index.md#findoptionsrelations)<`Entity`\>

Indicates what relations of entity should be loaded (simplified left join form).

#### Inherited from

MongoFindOneOptions.relations

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:27

___

### select

 `Optional` **select**: [`FindOptionsSelect`](../index.md#findoptionsselect)<`Entity`\> \| [`FindOptionsSelectByString`](../index.md#findoptionsselectbystring)<`Entity`\>

Specifies what columns should be retrieved.

#### Inherited from

MongoFindOneOptions.select

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:19

___

### skip

 `Optional` **skip**: `number`

Offset (paginated) where from entities should be taken.

#### Defined in

node_modules/typeorm/find-options/mongodb/MongoFindManyOptions.d.ts:9

___

### take

 `Optional` **take**: `number`

Limit (paginated) - max number of entities should be taken.

#### Defined in

node_modules/typeorm/find-options/mongodb/MongoFindManyOptions.d.ts:13

___

### transaction

 `Optional` **transaction**: `boolean`

If this is set to true, SELECT query in a `find` method will be executed in a transaction.

#### Inherited from

MongoFindOneOptions.transaction

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:86

___

### where

 `Optional` **where**: [`ObjectLiteral`](ObjectLiteral.md) \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[]

Simple condition that should be applied to match entities.

#### Inherited from

MongoFindOneOptions.where

#### Defined in

node_modules/typeorm/find-options/mongodb/MongoFindOneOptions.d.ts:10

___

### withDeleted

 `Optional` **withDeleted**: `boolean`

Indicates if soft-deleted rows should be included in entity result.

#### Inherited from

MongoFindOneOptions.withDeleted

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:69
