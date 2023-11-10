# DeserializeOptions

## Properties

### allowObjectSmallerThanBufferSize

 `Optional` **allowObjectSmallerThanBufferSize**: `boolean`

allows the buffer to be larger than the parsed BSON object.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:337

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### index

 `Optional` **index**: `number`

Offset into buffer to begin reading document from

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:339

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:331

___

### raw

 `Optional` **raw**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:340

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### validation

 `Optional` **validation**: `Object`

Allows for opt-out utf-8 validation for all keys or
specified keys. Must be all true or all false.

**Example**

```js
// disables validation on all keys
 validation: { utf8: false }

// enables validation only on specified keys a, b, and c
 validation: { utf8: { a: true, b: true, c: true } }

 // disables validation only on specified keys a, b
 validation: { utf8: { a: false, b: false } }
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `utf8` | `boolean` \| Record<`string`, ``true``\> \| Record<`string`, ``false``\> |

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:356
