# UUID

A class representation of the BSON UUID type.

## Hierarchy

- [`Binary`](Binary.md)

  ↳ **`UUID`**

## Constructors

### constructor

**new UUID**(`input?`)

Create an UUID type

#### Parameters

| Name | Description |
| :------ | :------ |
| `input?` | `string` \| `Uint8Array` \| [`UUID`](UUID.md) | Can be a 32 or 36 character hex string (dashes excluded/included) or a 16 byte binary Buffer. |

#### Overrides

[Binary](Binary.md).[constructor](Binary.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1031

## Properties

### buffer

 **buffer**: `Uint8Array`

#### Inherited from

[Binary](Binary.md).[buffer](Binary.md#buffer)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:28

___

### position

 **position**: `number`

#### Inherited from

[Binary](Binary.md).[position](Binary.md#position)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:30

___

### sub\_type

 **sub\_type**: `number`

#### Inherited from

[Binary](Binary.md).[sub_type](Binary.md#sub_type)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:29

___

### BUFFER\_SIZE

 `Static` `Readonly` **BUFFER\_SIZE**: ``256``

Initial buffer default size

#### Inherited from

[Binary](Binary.md).[BUFFER_SIZE](Binary.md#buffer_size)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:9

___

### SUBTYPE\_BYTE\_ARRAY

 `Static` `Readonly` **SUBTYPE\_BYTE\_ARRAY**: ``2``

Byte Array BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_BYTE_ARRAY](Binary.md#subtype_byte_array)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:15

___

### SUBTYPE\_COLUMN

 `Static` `Readonly` **SUBTYPE\_COLUMN**: ``7``

Column BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_COLUMN](Binary.md#subtype_column)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:25

___

### SUBTYPE\_DEFAULT

 `Static` `Readonly` **SUBTYPE\_DEFAULT**: ``0``

Default BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_DEFAULT](Binary.md#subtype_default)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:11

___

### SUBTYPE\_ENCRYPTED

 `Static` `Readonly` **SUBTYPE\_ENCRYPTED**: ``6``

Encrypted BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_ENCRYPTED](Binary.md#subtype_encrypted)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:23

___

### SUBTYPE\_FUNCTION

 `Static` `Readonly` **SUBTYPE\_FUNCTION**: ``1``

Function BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_FUNCTION](Binary.md#subtype_function)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:13

___

### SUBTYPE\_MD5

 `Static` `Readonly` **SUBTYPE\_MD5**: ``5``

MD5 BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_MD5](Binary.md#subtype_md5)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:21

___

### SUBTYPE\_USER\_DEFINED

 `Static` `Readonly` **SUBTYPE\_USER\_DEFINED**: ``128``

User BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_USER_DEFINED](Binary.md#subtype_user_defined)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:27

___

### SUBTYPE\_UUID

 `Static` `Readonly` **SUBTYPE\_UUID**: ``4``

UUID BSON type

#### Inherited from

[Binary](Binary.md).[SUBTYPE_UUID](Binary.md#subtype_uuid)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:19

___

### SUBTYPE\_UUID\_OLD

 `Static` `Readonly` **SUBTYPE\_UUID\_OLD**: ``3``

Deprecated UUID BSON type

**Deprecated**

Please use SUBTYPE_UUID

#### Inherited from

[Binary](Binary.md).[SUBTYPE_UUID_OLD](Binary.md#subtype_uuid_old)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:17

___

### cacheHexString

 `Static` **cacheHexString**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1025

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Binary"``

#### Returns

``"Binary"``

-```"Binary"```: (optional) 

#### Inherited from

Binary.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:7

___

### id

`get` **id**(): `Uint8Array`

The UUID bytes

#### Returns

`Uint8Array`

-`Uint8Array`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1036

## Methods

### equals

**equals**(`otherId`): `boolean`

Compares the equality of this UUID with `otherID`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `otherId` | `string` \| `Uint8Array` \| [`UUID`](UUID.md) | UUID instance to compare against. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1057

___

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[Binary](Binary.md).[inspect](Binary.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1078

___

### length

**length**(): `number`

the length of the binary sequence

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

[Binary](Binary.md).[length](Binary.md#length)

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

#### Inherited from

[Binary](Binary.md).[put](Binary.md#put)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:48

___

### read

**read**(`position`, `length`): [`BinarySequence`](../types/BinarySequence.md)

Reads **length** bytes starting at **position**.

#### Parameters

| Name | Description |
| :------ | :------ |
| `position` | `number` | read from the given position in the Binary. |
| `length` | `number` | the number of bytes to read. |

#### Returns

[`BinarySequence`](../types/BinarySequence.md)

-`BinarySequence`: 

#### Inherited from

[Binary](Binary.md).[read](Binary.md#read)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:62

___

### toBinary

**toBinary**(): [`Binary`](Binary.md)

Creates a Binary instance from the current UUID.

#### Returns

[`Binary`](Binary.md)

-`Binary`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1061

___

### toHexString

**toHexString**(`includeDashes?`): `string`

Returns the UUID id as a 32 or 36 character hex string representation, excluding/including dashes (defaults to 36 character dash separated)

#### Parameters

| Name | Description |
| :------ | :------ |
| `includeDashes?` | `boolean` | should the string exclude dash-separators. |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1042

___

### toJSON

**toJSON**(): `string`

Converts the id into its JSON string representation.
A 36 character (dashes included) hex string in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[Binary](Binary.md).[toJSON](Binary.md#tojson)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1051

___

### toString

**toString**(`encoding?`): `string`

Converts the id into a 36 character (dashes included) hex string, unless a encoding is specified.

#### Parameters

| Name |
| :------ |
| `encoding?` | ``"base64"`` \| ``"hex"`` |

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[Binary](Binary.md).[toString](Binary.md#tostring)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1046

___

### toUUID

**toUUID**(): [`UUID`](UUID.md)

#### Returns

[`UUID`](UUID.md)

-`UUID`: 

#### Inherited from

[Binary](Binary.md).[toUUID](Binary.md#touuid)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:74

___

### value

**value**(`asRaw?`): `string` \| [`BinarySequence`](../types/BinarySequence.md)

Returns the value of this binary as a string.

#### Parameters

| Name | Description |
| :------ | :------ |
| `asRaw?` | `boolean` | Will skip converting to a string |

#### Returns

`string` \| [`BinarySequence`](../types/BinarySequence.md)

-`string \| BinarySequence`: (optional) 

**Remarks**

This is handy when calling this function conditionally for some key value pairs and not others

#### Inherited from

[Binary](Binary.md).[value](Binary.md#value)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:69

___

### write

**write**(`sequence`, `offset`): `void`

Writes a buffer or string to the binary.

#### Parameters

| Name | Description |
| :------ | :------ |
| `sequence` | `string` \| [`BinarySequence`](../types/BinarySequence.md) | a string or buffer to be written to the Binary BSON object. |
| `offset` | `number` | specify the binary of where to write the content. |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

[Binary](Binary.md).[write](Binary.md#write)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:55

___

### createFromBase64

`Static` **createFromBase64**(`base64`): [`UUID`](UUID.md)

Creates an UUID from a base64 string representation of an UUID.

#### Parameters

| Name |
| :------ |
| `base64` | `string` |

#### Returns

[`UUID`](UUID.md)

-`UUID`: 

#### Overrides

[Binary](Binary.md).[createFromBase64](Binary.md#createfrombase64)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1077

___

### createFromHexString

`Static` **createFromHexString**(`hexString`): [`UUID`](UUID.md)

Creates an UUID from a hex string representation of an UUID.

#### Parameters

| Name | Description |
| :------ | :------ |
| `hexString` | `string` | 32 or 36 character hex string (dashes excluded/included). |

#### Returns

[`UUID`](UUID.md)

-`UUID`: 

#### Overrides

[Binary](Binary.md).[createFromHexString](Binary.md#createfromhexstring)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1075

___

### generate

`Static` **generate**(): `Uint8Array`

Generates a populated buffer containing a v4 uuid

#### Returns

`Uint8Array`

-`Uint8Array`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1065

___

### isValid

`Static` **isValid**(`input`): `boolean`

Checks if a value is a valid bson UUID

#### Parameters

| Name | Description |
| :------ | :------ |
| `input` | `string` \| `Uint8Array` \| [`UUID`](UUID.md) | UUID, string or Buffer to validate. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1070
