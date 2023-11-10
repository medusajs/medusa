# InsertManyResult

## Type parameters

| Name | Type |
| :------ | :------ |
| `TSchema` | `object` |

## Properties

### acknowledged

 **acknowledged**: `boolean`

Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3295

___

### insertedCount

 **insertedCount**: `number`

The number of inserted documents for this operations

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3297

___

### insertedIds

 **insertedIds**: `object`

Map of the index of the inserted document to the id of the inserted document

#### Index signature

▪ [key: `number`]: [`InferIdType`](../types/InferIdType.md)<`TSchema`\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3299
