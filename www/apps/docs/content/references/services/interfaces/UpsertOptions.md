# UpsertOptions

Special options passed to Repository#upsert

## Type parameters

| Name |
| :------ |
| `Entity` | `object` |

## Hierarchy

- [`InsertOrUpdateOptions`](../types/InsertOrUpdateOptions.md)

  ↳ **`UpsertOptions`**

## Properties

### conflictPaths

 **conflictPaths**: `string`[] \| { [P in string \| number \| symbol]?: true }

#### Defined in

node_modules/typeorm/repository/UpsertOptions.d.ts:7

___

### indexPredicate

 `Optional` **indexPredicate**: `string`

If included, postgres will apply the index predicate to a conflict target (partial index)

#### Inherited from

InsertOrUpdateOptions.indexPredicate

#### Defined in

node_modules/typeorm/query-builder/InsertOrUpdateOptions.d.ts:10

___

### skipUpdateIfNoValuesChanged

 `Optional` **skipUpdateIfNoValuesChanged**: `boolean`

If true, postgres will skip the update if no values would be changed (reduces writes)

#### Overrides

InsertOrUpdateOptions.skipUpdateIfNoValuesChanged

#### Defined in

node_modules/typeorm/repository/UpsertOptions.d.ts:13

___

### upsertType

 `Optional` **upsertType**: [`UpsertType`](../types/UpsertType.md)

Define the type of upsert to use (currently, CockroachDB only).

If none provided, it will use the default for the database (first one in the list)

#### Overrides

InsertOrUpdateOptions.upsertType

#### Defined in

node_modules/typeorm/repository/UpsertOptions.d.ts:19
