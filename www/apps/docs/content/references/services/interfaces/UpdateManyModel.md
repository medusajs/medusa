# UpdateManyModel

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Properties

### arrayFilters

 `Optional` **arrayFilters**: [`Document`](Document.md)[]

A set of filters specifying to which array elements an update should apply.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5201

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specifies a collation.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5203

___

### filter

 **filter**: [`Filter`](../index.md#filter)<`TSchema`\>

The filter to limit the updated documents.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5197

___

### hint

 `Optional` **hint**: [`Hint`](../index.md#hint)

The index to use. If specified, then the query system will only consider plans using the hinted index.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5205

___

### update

 **update**: [`UpdateFilter`](../index.md#updatefilter)<`TSchema`\> \| [`UpdateFilter`](../index.md#updatefilter)<`TSchema`\>[]

A document or pipeline containing update operators.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5199

___

### upsert

 `Optional` **upsert**: `boolean`

When true, creates a new document if no document matches the query.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5207
