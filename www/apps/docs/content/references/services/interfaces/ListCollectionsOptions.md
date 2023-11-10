# ListCollectionsOptions

## Hierarchy

- [`Omit`](../types/Omit.md)<[`CommandOperationOptions`](CommandOperationOptions.md), ``"writeConcern"``\>

  ↳ **`ListCollectionsOptions`**

## Properties

### authdb

 `Optional` **authdb**: `string`

#### Inherited from

Omit.authdb

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1997

___

### authorizedCollections

 `Optional` **authorizedCollections**: `boolean`

Since 4.0: If true and nameOnly is true, allows a user without the required privilege (i.e. listCollections action on the database) to run the command when access control is enforced.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3380

___

### batchSize

 `Optional` **batchSize**: `number`

The batchSize for the returned command cursor or if pre 2.8 the systems batch collection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3382

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

Collation

#### Inherited from

Omit.collation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1983

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

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

Omit.ignoreUndefined

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### maxTimeMS

 `Optional` **maxTimeMS**: `number`

#### Inherited from

Omit.maxTimeMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1984

___

### nameOnly

 `Optional` **nameOnly**: `boolean`

Since 4.0: If true, will only return the collection name in the response, and will omit additional info

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3378

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
