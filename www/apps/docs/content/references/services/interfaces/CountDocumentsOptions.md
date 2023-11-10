# CountDocumentsOptions

## Hierarchy

- [`AggregateOptions`](AggregateOptions.md)

  ↳ **`CountDocumentsOptions`**

## Properties

### allowDiskUse

 `Optional` **allowDiskUse**: `boolean`

allowDiskUse lets the server know if it can use disk to store temporary results for the aggregation (requires mongodb 2.6 \>).

#### Inherited from

[AggregateOptions](AggregateOptions.md).[allowDiskUse](AggregateOptions.md#allowdiskuse)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:294

___

### authdb

 `Optional` **authdb**: `string`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[authdb](AggregateOptions.md#authdb)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1997

___

### batchSize

 `Optional` **batchSize**: `number`

The number of documents to return per batch. See [aggregation documentation](https://www.mongodb.com/docs/manual/reference/command/aggregate).

#### Inherited from

[AggregateOptions](AggregateOptions.md).[batchSize](AggregateOptions.md#batchsize)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:296

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[bsonRegExp](AggregateOptions.md#bsonregexp)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

___

### bypassDocumentValidation

 `Optional` **bypassDocumentValidation**: `boolean`

Allow driver to bypass schema validation in MongoDB 3.2 or higher.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[bypassDocumentValidation](AggregateOptions.md#bypassdocumentvalidation)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:298

___

### checkKeys

 `Optional` **checkKeys**: `boolean`

the serializer will check if keys are valid.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[checkKeys](AggregateOptions.md#checkkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:917

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Specify collation.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[collation](AggregateOptions.md#collation)

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

[AggregateOptions](AggregateOptions.md).[comment](AggregateOptions.md#comment)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1993

___

### cursor

 `Optional` **cursor**: [`Document`](Document.md)

Return the query as cursor, on 2.6 \> it returns as a real cursor on pre 2.6 it returns as an emulated cursor.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[cursor](AggregateOptions.md#cursor)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:300

___

### dbName

 `Optional` **dbName**: `string`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[dbName](AggregateOptions.md#dbname)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1996

___

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[enableUtf8Validation](AggregateOptions.md#enableutf8validation)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

___

### explain

 `Optional` **explain**: [`ExplainVerbosityLike`](../index.md#explainverbositylike)

Specifies the verbosity mode for the explain output.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[explain](AggregateOptions.md#explain)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2651

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[fieldsAsRaw](AggregateOptions.md#fieldsasraw)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### hint

 `Optional` **hint**: [`Hint`](../index.md#hint)

Add an index selection hint to an aggregation command

#### Inherited from

[AggregateOptions](AggregateOptions.md).[hint](AggregateOptions.md#hint)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:308

___

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

[AggregateOptions](AggregateOptions.md).[ignoreUndefined](AggregateOptions.md#ignoreundefined)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### let

 `Optional` **let**: [`Document`](Document.md)

Map of parameter names and values that can be accessed using $$var (requires MongoDB 5.0).

#### Inherited from

[AggregateOptions](AggregateOptions.md).[let](AggregateOptions.md#let)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:310

___

### limit

 `Optional` **limit**: `number`

The maximum amounts to count before aborting.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2219

___

### maxAwaitTimeMS

 `Optional` **maxAwaitTimeMS**: `number`

The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[maxAwaitTimeMS](AggregateOptions.md#maxawaittimems)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:304

___

### maxTimeMS

 `Optional` **maxTimeMS**: `number`

specifies a cumulative time limit in milliseconds for processing operations on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[maxTimeMS](AggregateOptions.md#maxtimems)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:302

___

### noResponse

 `Optional` **noResponse**: `boolean`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[noResponse](AggregateOptions.md#noresponse)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1998

___

### omitReadPreference

 `Optional` **omitReadPreference**: `boolean`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[omitReadPreference](AggregateOptions.md#omitreadpreference)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4328

___

### out

 `Optional` **out**: `string`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[out](AggregateOptions.md#out)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:311

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[promoteBuffers](AggregateOptions.md#promotebuffers)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[promoteLongs](AggregateOptions.md#promotelongs)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[promoteValues](AggregateOptions.md#promotevalues)

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

[AggregateOptions](AggregateOptions.md).[raw](AggregateOptions.md#raw)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readConcern

 `Optional` **readConcern**: [`ReadConcernLike`](../index.md#readconcernlike)

Specify a read concern and level for the collection. (only MongoDB 3.2 or higher supported)

#### Inherited from

[AggregateOptions](AggregateOptions.md).[readConcern](AggregateOptions.md#readconcern)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1981

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../index.md#readpreferencelike)

The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest).

#### Inherited from

[AggregateOptions](AggregateOptions.md).[readPreference](AggregateOptions.md#readpreference)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4327

___

### retryWrites

 `Optional` **retryWrites**: `boolean`

Should retry failed writes

#### Inherited from

[AggregateOptions](AggregateOptions.md).[retryWrites](AggregateOptions.md#retrywrites)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1995

___

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[serializeFunctions](AggregateOptions.md#serializefunctions)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### session

 `Optional` **session**: [`ClientSession`](../classes/ClientSession.md)

Specify ClientSession for this command

#### Inherited from

[AggregateOptions](AggregateOptions.md).[session](AggregateOptions.md#session)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4324

___

### skip

 `Optional` **skip**: `number`

The number of documents to skip.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2217

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

[AggregateOptions](AggregateOptions.md).[useBigInt64](AggregateOptions.md#usebigint64)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### willRetryWrite

 `Optional` **willRetryWrite**: `boolean`

#### Inherited from

[AggregateOptions](AggregateOptions.md).[willRetryWrite](AggregateOptions.md#willretrywrite)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4325

___

### writeConcern

 `Optional` **writeConcern**: [`WriteConcern`](../classes/WriteConcern.md) \| [`WriteConcernSettings`](WriteConcernSettings.md)

Write Concern as an object

#### Inherited from

[AggregateOptions](AggregateOptions.md).[writeConcern](AggregateOptions.md#writeconcern)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5474
