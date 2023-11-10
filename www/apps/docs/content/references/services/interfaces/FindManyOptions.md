# FindManyOptions

Defines a special criteria to find specific entities.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | `object` |

## Hierarchy

- [`FindOneOptions`](FindOneOptions.md)<`Entity`\>

  ↳ **`FindManyOptions`**

## Properties

### cache

 `Optional` **cache**: `number` \| `boolean` \| { `id`: `any` ; `milliseconds`: `number`  }

Enables or disables query result caching.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[cache](FindOneOptions.md#cache)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:49

___

### comment

 `Optional` **comment**: `string`

Adds a comment with the supplied string in the generated query.  This is
helpful for debugging purposes, such as finding a specific query in the
database server's logs, or for categorization using an APM product.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[comment](FindOneOptions.md#comment)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:15

___

### join

 `Optional` **join**: [`JoinOptions`](JoinOptions.md)

Specifies what relations should be loaded.

**Deprecated**

#### Inherited from

[FindOneOptions](FindOneOptions.md).[join](FindOneOptions.md#join)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:41

___

### loadEagerRelations

 `Optional` **loadEagerRelations**: `boolean`

Indicates if eager relations should be loaded or not.
By default, they are loaded when find methods are used.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[loadEagerRelations](FindOneOptions.md#loadeagerrelations)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:82

___

### loadRelationIds

 `Optional` **loadRelationIds**: `boolean` \| { `disableMixedMap?`: `boolean` ; `relations?`: `string`[]  }

If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects).
If array of strings is given then loads only relation ids of the given properties.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[loadRelationIds](FindOneOptions.md#loadrelationids)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:74

___

### lock

 `Optional` **lock**: { `mode`: ``"optimistic"`` ; `version`: `number` \| `Date`  } \| { `mode`: ``"pessimistic_read"`` \| ``"pessimistic_write"`` \| ``"dirty_read"`` \| ``"pessimistic_partial_write"`` \| ``"pessimistic_write_or_fail"`` \| ``"for_no_key_update"`` \| ``"for_key_share"`` ; `onLocked?`: ``"nowait"`` \| ``"skip_locked"`` ; `tables?`: `string`[]  }

Indicates what locking mode should be used.

Note: For lock tables, you must specify the table names and not the relation names

#### Inherited from

[FindOneOptions](FindOneOptions.md).[lock](FindOneOptions.md#lock)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:58

___

### order

 `Optional` **order**: [`FindOptionsOrder`](../types/FindOptionsOrder.md)<`Entity`\>

Order, in which entities should be ordered.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[order](FindOneOptions.md#order)

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

[FindOneOptions](FindOneOptions.md).[relationLoadStrategy](FindOneOptions.md#relationloadstrategy)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:35

___

### relations

 `Optional` **relations**: [`FindOptionsRelationByString`](../types/FindOptionsRelationByString.md) \| [`FindOptionsRelations`](../types/FindOptionsRelations.md)<`Entity`\>

Indicates what relations of entity should be loaded (simplified left join form).

#### Inherited from

[FindOneOptions](FindOneOptions.md).[relations](FindOneOptions.md#relations)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:27

___

### select

 `Optional` **select**: [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`Entity`\> \| [`FindOptionsSelectByString`](../types/FindOptionsSelectByString.md)<`Entity`\>

Specifies what columns should be retrieved.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[select](FindOneOptions.md#select)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:19

___

### skip

 `Optional` **skip**: `number`

Offset (paginated) where from entities should be taken.

#### Defined in

node_modules/typeorm/find-options/FindManyOptions.d.ts:9

___

### take

 `Optional` **take**: `number`

Limit (paginated) - max number of entities should be taken.

#### Defined in

node_modules/typeorm/find-options/FindManyOptions.d.ts:13

___

### transaction

 `Optional` **transaction**: `boolean`

If this is set to true, SELECT query in a `find` method will be executed in a transaction.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[transaction](FindOneOptions.md#transaction)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:86

___

### where

 `Optional` **where**: [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[]

Simple condition that should be applied to match entities.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[where](FindOneOptions.md#where)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:23

___

### withDeleted

 `Optional` **withDeleted**: `boolean`

Indicates if soft-deleted rows should be included in entity result.

#### Inherited from

[FindOneOptions](FindOneOptions.md).[withDeleted](FindOneOptions.md#withdeleted)

#### Defined in

node_modules/typeorm/find-options/FindOneOptions.d.ts:69
