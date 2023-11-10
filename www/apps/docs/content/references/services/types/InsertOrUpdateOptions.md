# InsertOrUpdateOptions

 **InsertOrUpdateOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexPredicate?` | `string` | If included, postgres will apply the index predicate to a conflict target (partial index) |
| `skipUpdateIfNoValuesChanged?` | `boolean` | If true, postgres will skip the update if no values would be changed (reduces writes) |
| `upsertType?` | [`UpsertType`](UpsertType.md) | - |

#### Defined in

node_modules/typeorm/query-builder/InsertOrUpdateOptions.d.ts:2
