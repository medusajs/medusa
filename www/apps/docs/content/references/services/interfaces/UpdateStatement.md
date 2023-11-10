# UpdateStatement

## Properties

### arrayFilters

 `Optional` **arrayFilters**: [`Document`](Document.md)[]

An array of filter documents that determines which array elements to modify for an update operation on an array field.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5265

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specifies the collation to use for the operation.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5263

___

### hint

 `Optional` **hint**: [`Hint`](../index.md#hint)

A document or string that specifies the index to use to support the query predicate.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5267

___

### multi

 `Optional` **multi**: `boolean`

If true, updates all documents that meet the query criteria.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5261

___

### q

 **q**: [`Document`](Document.md)

The query that matches documents to update.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5255

___

### u

 **u**: [`Document`](Document.md) \| [`Document`](Document.md)[]

The modifications to apply.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5257

___

### upsert

 `Optional` **upsert**: `boolean`

If true, perform an insert if no documents match the query.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5259
