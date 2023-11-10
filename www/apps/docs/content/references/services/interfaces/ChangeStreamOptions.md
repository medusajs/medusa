# ChangeStreamOptions

Options that can be passed to a ChangeStream. Note that startAfter, resumeAfter, and startAtOperationTime are all mutually exclusive, and the server will error if more than one is specified.

## Hierarchy

- [`Omit`](../types/Omit.md)<[`AggregateOptions`](AggregateOptions.md), ``"writeConcern"``\>

  ↳ **`ChangeStreamOptions`**

## Properties

### allowDiskUse

 `Optional` **allowDiskUse**: `boolean`

allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 \>).

#### Inherited from

Omit.allowDiskUse

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:294

___

### authdb

 `Optional` **authdb**: `string`

#### Inherited from

Omit.authdb

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1997

___

### batchSize

 `Optional` **batchSize**: `number`

The number of documents to return per batch.

**See**

https://www.mongodb.com/docs/manual/reference/command/aggregate

#### Overrides

Omit.batchSize

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1171

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

Omit.bsonRegExp

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

___

### bypassDocumentValidation

 `Optional` **bypassDocumentValidation**: `boolean`

Allow driver to bypass schema validation in MongoDB 3.2 or higher.

#### Inherited from

Omit.bypassDocumentValidation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:298

___

### checkKeys

 `Optional` **checkKeys**: `boolean`

the serializer will check if keys are valid.

#### Inherited from

Omit.checkKeys

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:917

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specify collation.

#### Inherited from

Omit.collation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:306

___

### comment

 `Optional` **comment**: `unknown`

Comment to apply to the operation.

In server versions pre-4.4, 'comment' must be string.  A server
error will be thrown if any other type is provided.

In server versions 4.4 and above, 'comment' can be any valid BSON type.

#### Inherited from

Omit.comment

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1993

___

### cursor

 `Optional` **cursor**: [`Document`](Document.md)

Return the query as cursor, on 2.6 \> it returns as a real cursor on pre 2.6 it returns as an emulated cursor.

#### Inherited from

Omit.cursor

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:300

___

### dbName

 `Optional` **dbName**: `string`

#### Inherited from

Omit.dbName

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1996

___

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Inherited from

Omit.enableUtf8Validation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

___

### explain

 `Optional` **explain**: [`ExplainVerbosityLike`](../types/ExplainVerbosityLike.md)

Specifies the verbosity mode for the explain output.

#### Inherited from

Omit.explain

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2651

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Inherited from

Omit.fieldsAsRaw

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### fullDocument

 `Optional` **fullDocument**: `string`

Allowed values: 'updateLookup', 'whenAvailable', 'required'.

When set to 'updateLookup', the change notification for partial updates
will include both a delta describing the changes to the document as well
as a copy of the entire document that was changed from some time after
the change occurred.

When set to 'whenAvailable', configures the change stream to return the
post-image of the modified document for replace and update change events
if the post-image for this event is available.

When set to 'required', the same behavior as 'whenAvailable' except that
an error is raised if the post-image is not available.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1139

___

### fullDocumentBeforeChange

 `Optional` **fullDocumentBeforeChange**: `string`

Allowed values: 'whenAvailable', 'required', 'off'.

The default is to not send a value, which is equivalent to 'off'.

When set to 'whenAvailable', configures the change stream to return the
pre-image of the modified document for replace, update, and delete change
events if it is available.

When set to 'required', the same behavior as 'whenAvailable' except that
an error is raised if the pre-image is not available.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1152

___

### hint

 `Optional` **hint**: [`Hint`](../types/Hint.md)

Add an index selection hint to an aggregation command

#### Inherited from

Omit.hint

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:308

___

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

Omit.ignoreUndefined

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### let

 `Optional` **let**: [`Document`](Document.md)

Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0).

#### Inherited from

Omit.let

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:310

___

### maxAwaitTimeMS

 `Optional` **maxAwaitTimeMS**: `number`

The maximum amount of time for the server to wait on new documents to satisfy a change stream query.

#### Overrides

Omit.maxAwaitTimeMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1154

___

### maxTimeMS

 `Optional` **maxTimeMS**: `number`

specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.

#### Inherited from

Omit.maxTimeMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:302

___

### noResponse

 `Optional` **noResponse**: `boolean`

#### Inherited from

Omit.noResponse

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1998

___

### omitReadPreference

 `Optional` **omitReadPreference**: `boolean`

#### Inherited from

Omit.omitReadPreference

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4328

___

### out

 `Optional` **out**: `string`

#### Inherited from

Omit.out

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:311

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Inherited from

Omit.promoteBuffers

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Inherited from

Omit.promoteLongs

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Inherited from

Omit.promoteValues

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:331

___

### raw

 `Optional` **raw**: `boolean`

Enabling the raw option will return a [Node.js Buffer](https://nodejs.org/api/buffer.html)
which is allocated using [allocUnsafe API](https://nodejs.org/api/buffer.html#static-method-bufferallocunsafesize).
See this section from the [Node.js Docs here](https://nodejs.org/api/buffer.html#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-unsafe)
for more detail about what "unsafe" refers to in this context.
If you need to maintain your own editable clone of the bytes returned for an extended life time of the process, it is recommended you allocate
your own buffer and clone the contents:

**Remarks**

Please note there is a known limitation where this option cannot be used at the MongoClient level (see [NODE-3946](https://jira.mongodb.org/browse/NODE-3946)).
It does correctly work at `Db`, `Collection`, and per operation the same as other BSON options work.

**Example**

```ts
const raw = await collection.findOne({}, { raw: true })
const myBuffer = Buffer.alloc(raw.byteLength)
myBuffer.set(raw, 0)
// Only save and use `myBuffer` beyond this point
```

#### Inherited from

Omit.raw

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readConcern

 `Optional` **readConcern**: [`ReadConcernLike`](../types/ReadConcernLike.md)

Specify a read concern and level for the collection. (only MongoDB 3.2 or higher supported)

#### Inherited from

Omit.readConcern

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1981

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../types/ReadPreferenceLike.md)

The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest).

#### Inherited from

Omit.readPreference

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4327

___

### resumeAfter

 `Optional` **resumeAfter**: `unknown`

Allows you to start a changeStream after a specified event.

**See**

https://www.mongodb.com/docs/manual/changeStreams/#resumeafter-for-change-streams

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1159

___

### retryWrites

 `Optional` **retryWrites**: `boolean`

Should retry failed writes

#### Inherited from

Omit.retryWrites

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1995

___

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

Omit.serializeFunctions

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### session

 `Optional` **session**: [`ClientSession`](../classes/ClientSession.md)

Specify ClientSession for this command

#### Inherited from

Omit.session

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4324

___

### showExpandedEvents

 `Optional` **showExpandedEvents**: `boolean`

When enabled, configures the change stream to include extra change events.

- createIndexes
- dropIndexes
- modify
- create
- shardCollection
- reshardCollection
- refineCollectionShardKey

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1183

___

### startAfter

 `Optional` **startAfter**: `unknown`

Similar to resumeAfter, but will allow you to start after an invalidated event.

**See**

https://www.mongodb.com/docs/manual/changeStreams/#startafter-for-change-streams

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1164

___

### startAtOperationTime

 `Optional` **startAtOperationTime**: [`Timestamp`](../classes/Timestamp.md)

Will start the changeStream after the specified operationTime.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1166

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

Omit.useBigInt64

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### willRetryWrite

 `Optional` **willRetryWrite**: `boolean`

#### Inherited from

Omit.willRetryWrite

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4325
