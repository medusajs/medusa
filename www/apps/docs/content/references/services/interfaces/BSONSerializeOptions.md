# BSONSerializeOptions

BSON Serialization options.

## Hierarchy

- [`Omit`](../index.md#omit)<[`SerializeOptions`](SerializeOptions.md), ``"index"``\>

- [`Omit`](../index.md#omit)<[`DeserializeOptions`](DeserializeOptions.md), ``"evalFunctions"`` \| ``"cacheFunctions"`` \| ``"cacheFunctionsCrc32"`` \| ``"allowObjectSmallerThanBufferSize"`` \| ``"index"`` \| ``"validation"``\>

  ↳ **`BSONSerializeOptions`**

  ↳↳ [`OperationOptions`](OperationOptions.md)

  ↳↳ [`MongoClientOptions`](MongoClientOptions.md)

  ↳↳ [`DbOptions`](DbOptions.md)

  ↳↳ [`CollectionOptions`](CollectionOptions.md)

## Properties

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

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

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

#### Overrides

Omit.raw

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

Omit.serializeFunctions

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

Omit.useBigInt64

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325
