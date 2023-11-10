# UpdateResult

## Properties

### acknowledged

 **acknowledged**: `boolean`

Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5242

___

### matchedCount

 **matchedCount**: `number`

The number of documents that matched the filter

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5244

___

### modifiedCount

 **modifiedCount**: `number`

The number of documents that were modified

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5246

___

### upsertedCount

 **upsertedCount**: `number`

The number of documents that were upserted

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5248

___

### upsertedId

 **upsertedId**: [`ObjectId`](../classes/ObjectId.md)

The identifier of the inserted document if an upsert took place

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5250
