# DeleteOneModel

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | [`Document`](Document.md) |

## Properties

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specifies a collation.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2560

___

### filter

 **filter**: [`Filter`](../index.md#filter)<`TSchema`\>

The filter to limit the deleted documents.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2558

___

### hint

 `Optional` **hint**: [`Hint`](../index.md#hint)

The index to use. If specified, then the query system will only consider plans using the hinted index.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2562
