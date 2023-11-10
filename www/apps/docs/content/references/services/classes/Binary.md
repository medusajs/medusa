# Binary

A class representation of the BSON Binary type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`Binary`**

  ↳↳ [`UUID`](UUID.md)

## Constructors

### constructor

**new Binary**(`buffer?`, `subType?`)

Create a new Binary instance.

This constructor can accept a string as its first argument. In this case,
this string will be encoded using ISO-8859-1, **not** using UTF-8.
This is almost certainly not what you want. Use `new Binary(Buffer.from(string))`
instead to convert the string to a Buffer using UTF-8 first.

#### Parameters

| Name | Description |
| :------ | :------ |
| `buffer?` | `string` \| [`BinarySequence`](../index.md#binarysequence) | a buffer object containing the binary data. |
| `subType?` | `number` | the option binary type. |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:42

## Properties

### buffer

 **buffer**: `Uint8Array`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:28

___

### position

 **position**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:30

___

### sub\_type

 **sub\_type**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:29

___

### BUFFER\_SIZE

 `Static` `Readonly` **BUFFER\_SIZE**: ``256``

Initial buffer default size

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:9

___

### SUBTYPE\_BYTE\_ARRAY

 `Static` `Readonly` **SUBTYPE\_BYTE\_ARRAY**: ``2``

Byte Array BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:15

___

### SUBTYPE\_COLUMN

 `Static` `Readonly` **SUBTYPE\_COLUMN**: ``7``

Column BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:25

___

### SUBTYPE\_DEFAULT

 `Static` `Readonly` **SUBTYPE\_DEFAULT**: ``0``

Default BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:11

___

### SUBTYPE\_ENCRYPTED

 `Static` `Readonly` **SUBTYPE\_ENCRYPTED**: ``6``

Encrypted BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:23

___

### SUBTYPE\_FUNCTION

 `Static` `Readonly` **SUBTYPE\_FUNCTION**: ``1``

Function BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:13

___

### SUBTYPE\_MD5

 `Static` `Readonly` **SUBTYPE\_MD5**: ``5``

MD5 BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:21

___

### SUBTYPE\_USER\_DEFINED

 `Static` `Readonly` **SUBTYPE\_USER\_DEFINED**: ``128``

User BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:27

___

### SUBTYPE\_UUID

 `Static` `Readonly` **SUBTYPE\_UUID**: ``4``

UUID BSON type

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:19

___

### SUBTYPE\_UUID\_OLD

 `Static` `Readonly` **SUBTYPE\_UUID\_OLD**: ``3``

Deprecated UUID BSON type

**Deprecated**

Please use SUBTYPE_UUID

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:17

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Binary"``

#### Returns

``"Binary"``

-```"Binary"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:7

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:79

___

### length

**length**(): `number`

the length of the binary sequence

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:71

___

### put

**put**(`byteValue`): `void`

Updates this binary with byte_value.

#### Parameters

| Name | Description |
| :------ | :------ |
| `byteValue` | `string` \| `number` \| `Uint8Array` \| `number`[] | a single byte we wish to write. |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:48

___

### read

**read**(`position`, `length`): [`BinarySequence`](../index.md#binarysequence)

Reads **length** bytes starting at **position**.

#### Parameters

| Name | Description |
| :------ | :------ |
| `position` | `number` | read from the given position in the Binary. |
| `length` | `number` | the number of bytes to read. |

#### Returns

[`BinarySequence`](../index.md#binarysequence)

-`BinarySequence`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:62

___

### toJSON

**toJSON**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:72

___

### toString

**toString**(`encoding?`): `string`

#### Parameters

| Name |
| :------ |
| `encoding?` | ``"utf8"`` \| ``"utf-8"`` \| ``"base64"`` \| ``"hex"`` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:73

___

### toUUID

**toUUID**(): [`UUID`](UUID.md)

#### Returns

[`UUID`](UUID.md)

-`UUID`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:74

___

### value

**value**(`asRaw?`): `string` \| [`BinarySequence`](../index.md#binarysequence)

Returns the value of this binary as a string.

#### Parameters

| Name | Description |
| :------ | :------ |
| `asRaw?` | `boolean` | Will skip converting to a string |

#### Returns

`string` \| [`BinarySequence`](../index.md#binarysequence)

-`string \| BinarySequence`: (optional) 

**Remarks**

This is handy when calling this function conditionally for some key value pairs and not others

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:69

___

### write

**write**(`sequence`, `offset`): `void`

Writes a buffer or string to the binary.

#### Parameters

| Name | Description |
| :------ | :------ |
| `sequence` | `string` \| [`BinarySequence`](../index.md#binarysequence) | a string or buffer to be written to the Binary BSON object. |
| `offset` | `number` | specify the binary of where to write the content. |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:55

___

### createFromBase64

`Static` **createFromBase64**(`base64`, `subType?`): [`Binary`](Binary.md)

Creates an Binary instance from a base64 string

#### Parameters

| Name |
| :------ |
| `base64` | `string` |
| `subType?` | `number` |

#### Returns

[`Binary`](Binary.md)

-`Binary`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:78

___

### createFromHexString

`Static` **createFromHexString**(`hex`, `subType?`): [`Binary`](Binary.md)

Creates an Binary instance from a hex digit string

#### Parameters

| Name |
| :------ |
| `hex` | `string` |
| `subType?` | `number` |

#### Returns

[`Binary`](Binary.md)

-`Binary`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:76
