# OperationOptions

## Hierarchy

- [`BSONSerializeOptions`](BSONSerializeOptions.md)

  ↳ **`OperationOptions`**

  ↳↳ [`CommandOperationOptions`](CommandOperationOptions.md)

## Properties

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[bsonRegExp](BSONSerializeOptions.md#bsonregexp)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

___

### checkKeys

 `Optional` **checkKeys**: `boolean`

the serializer will check if keys are valid.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[checkKeys](BSONSerializeOptions.md#checkkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:917

___

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[enableUtf8Validation](BSONSerializeOptions.md#enableutf8validation)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[fieldsAsRaw](BSONSerializeOptions.md#fieldsasraw)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[ignoreUndefined](BSONSerializeOptions.md#ignoreundefined)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### omitReadPreference

 `Optional` **omitReadPreference**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4328

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteBuffers](BSONSerializeOptions.md#promotebuffers)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteLongs](BSONSerializeOptions.md#promotelongs)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteValues](BSONSerializeOptions.md#promotevalues)

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

[BSONSerializeOptions](BSONSerializeOptions.md).[raw](BSONSerializeOptions.md#raw)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../types/ReadPreferenceLike.md)

The preferred read preference (ReadPreference.primary, ReadPreference.primary_preferred, ReadPreference.secondary, ReadPreference.secondary_preferred, ReadPreference.nearest).

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4327

___

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[serializeFunctions](BSONSerializeOptions.md#serializefunctions)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### session

 `Optional` **session**: [`ClientSession`](../classes/ClientSession.md)

Specify ClientSession for this command

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4324

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[useBigInt64](BSONSerializeOptions.md#usebigint64)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### willRetryWrite

 `Optional` **willRetryWrite**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4325
