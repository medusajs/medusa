# FindOptions

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `TSchema` | [`Document`](Document.md) | Unused schema definition, deprecated usage, only specify `FindOptions` with no generic |

## Hierarchy

- [`Omit`](../types/Omit.md)<[`CommandOperationOptions`](CommandOperationOptions.md), ``"writeConcern"``\>

  ↳ **`FindOptions`**

## Properties

### allowDiskUse

 `Optional` **allowDiskUse**: `boolean`

Allows disk use for blocking sort operations exceeding 100MB memory. (MongoDB 3.2 or higher)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2971

___

### allowPartialResults

 `Optional` **allowPartialResults**: `boolean`

For queries against a sharded collection, allows the command (or subsequent getMore commands) to return partial results, rather than an error, if one or more queried shards are unavailable.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2975

___

### authdb

 `Optional` **authdb**: `string`

#### Inherited from

Omit.authdb

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1997

___

### awaitData

 `Optional` **awaitData**: `boolean`

Specify if the cursor is a tailable-await cursor. Requires `tailable` to be true

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2953

___

### batchSize

 `Optional` **batchSize**: `number`

Set the batchSize for the getMoreCommand when iterating over the query results.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2955

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

Omit.bsonRegExp

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

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

Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).

#### Overrides

Omit.collation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2969

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

### hint

 `Optional` **hint**: [`Hint`](../types/Hint.md)

Tell the query to use specific indexes in the query. Object of indexes to use, `{'_id':1}`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2947

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

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2979

___

### limit

 `Optional` **limit**: `number`

Sets the limit of documents returned in the query.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2939

___

### max

 `Optional` **max**: [`Document`](Document.md)

The exclusive upper bound for a specific index

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2961

___

### maxAwaitTimeMS

 `Optional` **maxAwaitTimeMS**: `number`

The maximum amount of time for the server to wait on new documents to satisfy a tailable cursor query. Requires `tailable` and `awaitData` to be true

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2965

___

### maxTimeMS

 `Optional` **maxTimeMS**: `number`

Number of milliseconds to wait before aborting the query.

#### Overrides

Omit.maxTimeMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2963

___

### min

 `Optional` **min**: [`Document`](Document.md)

The inclusive lower bound for a specific index

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2959

___

### noCursorTimeout

 `Optional` **noCursorTimeout**: `boolean`

The server normally times out idle cursors after an inactivity period (10 minutes) to prevent excess memory use. Set this option to prevent that.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2967

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

### oplogReplay

 `Optional` **oplogReplay**: `boolean`

Option to enable an optimized code path for queries looking for a particular range of `ts` values in the oplog. Requires `tailable` to be true.

**Deprecated**

Starting from MongoDB 4.4 this flag is not needed and will be ignored.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2984

___

### projection

 `Optional` **projection**: [`Document`](Document.md)

The fields to return in the query. Object of fields to either include or exclude (one of, not both), `{'a':1, 'b': 1}` **or** `{'a': 0, 'b': 0}`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2943

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

### retryWrites

 `Optional` **retryWrites**: `boolean`

Should retry failed writes

#### Inherited from

Omit.retryWrites

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1995

___

### returnKey

 `Optional` **returnKey**: `boolean`

If true, returns only the index keys in the resulting documents.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2957

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

### showRecordId

 `Optional` **showRecordId**: `boolean`

Determines whether to return the record identifier for each document. If true, adds a field $recordId to the returned documents.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2977

___

### singleBatch

 `Optional` **singleBatch**: `boolean`

Determines whether to close the cursor after the first batch. Defaults to false.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2973

___

### skip

 `Optional` **skip**: `number`

Set to skip N documents ahead in your query (useful for pagination).

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2945

___

### sort

 `Optional` **sort**: [`Sort`](../types/Sort.md)

Set to sort the documents coming back from the query. Array of indexes, `[['a', 1]]` etc.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2941

___

### tailable

 `Optional` **tailable**: `boolean`

Specify if the cursor is tailable.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2951

___

### timeout

 `Optional` **timeout**: `boolean`

Specify if the cursor can timeout.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2949

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
