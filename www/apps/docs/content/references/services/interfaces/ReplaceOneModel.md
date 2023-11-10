# ReplaceOneModel

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Properties

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specifies a collation.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4561

___

### filter

 **filter**: [`Filter`](../types/Filter.md)<`TSchema`\>

The filter to limit the replaced document.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4557

___

### hint

 `Optional` **hint**: [`Hint`](../types/Hint.md)

The index to use. If specified, then the query system will only consider plans using the hinted index.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4563

___

### replacement

 **replacement**: [`WithoutId`](../types/WithoutId.md)<`TSchema`\>

The document with which to replace the matched document.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4559

___

### upsert

 `Optional` **upsert**: `boolean`

When true, creates a new document if no document matches the query.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4565
