# ListDatabasesOptions

## Hierarchy

- [`CommandOperationOptions`](CommandOperationOptions.md)

  ↳ **`ListDatabasesOptions`**

## Properties

### authdb

 `Optional` **authdb**: `string`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[authdb](CommandOperationOptions.md#authdb)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1997

___

### authorizedDatabases

 `Optional` **authorizedDatabases**: `boolean`

A flag that determines which databases are returned based on the user privileges when access control is enabled

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3391

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[bsonRegExp](CommandOperationOptions.md#bsonregexp)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

___

### checkKeys

 `Optional` **checkKeys**: `boolean`

the serializer will check if keys are valid.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[checkKeys](CommandOperationOptions.md#checkkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:917

___

### collation

 `Optional` **collation**: [`CollationOptions`](CollationOptions.md)

Collation

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[collation](CommandOperationOptions.md#collation)

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

[CommandOperationOptions](CommandOperationOptions.md).[comment](CommandOperationOptions.md#comment)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1993

___

### dbName

 `Optional` **dbName**: `string`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[dbName](CommandOperationOptions.md#dbname)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1996

___

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[enableUtf8Validation](CommandOperationOptions.md#enableutf8validation)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

___

### explain

 `Optional` **explain**: [`ExplainVerbosityLike`](../index.md#explainverbositylike)

Specifies the verbosity mode for the explain output.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[explain](CommandOperationOptions.md#explain)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2651

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[fieldsAsRaw](CommandOperationOptions.md#fieldsasraw)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### filter

 `Optional` **filter**: [`Document`](Document.md)

A query predicate that determines which databases are listed

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3387

___

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[ignoreUndefined](CommandOperationOptions.md#ignoreundefined)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### maxTimeMS

 `Optional` **maxTimeMS**: `number`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[maxTimeMS](CommandOperationOptions.md#maxtimems)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1984

___

### nameOnly

 `Optional` **nameOnly**: `boolean`

A flag to indicate whether the command should return just the database names, or return both database names and size information

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3389

___

### noResponse

 `Optional` **noResponse**: `boolean`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[noResponse](CommandOperationOptions.md#noresponse)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1998

___

### omitReadPreference

 `Optional` **omitReadPreference**: `boolean`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[omitReadPreference](CommandOperationOptions.md#omitreadpreference)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4328

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[promoteBuffers](CommandOperationOptions.md#promotebuffers)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[promoteLongs](CommandOperationOptions.md#promotelongs)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[promoteValues](CommandOperationOptions.md#promotevalues)

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

[CommandOperationOptions](CommandOperationOptions.md).[raw](CommandOperationOptions.md#raw)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readConcern

 `Optional` **readConcern**: [`ReadConcernLike`](../index.md#readconcernlike)

Specify a read concern and level for the collection. (only MongoDB 3.2 or higher supported)

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[readConcern](CommandOperationOptions.md#readconcern)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1981

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../index.md#readpreferencelike)

The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest).

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[readPreference](CommandOperationOptions.md#readpreference)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4327

___

### retryWrites

 `Optional` **retryWrites**: `boolean`

Should retry failed writes

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[retryWrites](CommandOperationOptions.md#retrywrites)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1995

___

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[serializeFunctions](CommandOperationOptions.md#serializefunctions)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### session

 `Optional` **session**: [`ClientSession`](../classes/ClientSession.md)

Specify ClientSession for this command

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[session](CommandOperationOptions.md#session)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4324

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[useBigInt64](CommandOperationOptions.md#usebigint64)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### willRetryWrite

 `Optional` **willRetryWrite**: `boolean`

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[willRetryWrite](CommandOperationOptions.md#willretrywrite)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4325

___

### writeConcern

 `Optional` **writeConcern**: [`WriteConcern`](../classes/WriteConcern.md) \| [`WriteConcernSettings`](WriteConcernSettings.md)

Write Concern as an object

#### Inherited from

[CommandOperationOptions](CommandOperationOptions.md).[writeConcern](CommandOperationOptions.md#writeconcern)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5474
