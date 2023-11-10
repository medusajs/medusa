# ObjectId

A class representation of the BSON ObjectId type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`ObjectId`**

## Constructors

### constructor

**new ObjectId**(`inputId?`)

Create an ObjectId type

#### Parameters

| Name | Description |
| :------ | :------ |
| `inputId?` | `string` \| `number` \| [`ObjectId`](ObjectId.md) \| `Uint8Array` \| [`ObjectIdLike`](../interfaces/ObjectIdLike.md) | Can be a 24 character hex string, 12 byte binary Buffer, or a number. |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:827

## Properties

### cacheHexString

 `Static` **cacheHexString**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:821

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"ObjectId"``

#### Returns

``"ObjectId"``

-```"ObjectId"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:820

___

### id

`get` **id**(): `Uint8Array`

The ObjectId bytes

#### Returns

`Uint8Array`

-`Uint8Array`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:832

## Methods

### equals

**equals**(`otherId`): `boolean`

Compares the equality of this ObjectId with `otherID`.

#### Parameters

| Name | Description |
| :------ | :------ |
| `otherId` | `string` \| [`ObjectId`](ObjectId.md) \| [`ObjectIdLike`](../interfaces/ObjectIdLike.md) | ObjectId instance to compare against. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:854

___

### getTimestamp

**getTimestamp**(): `Date`

Returns the generation date (accurate up to the second) that this ID was generated.

#### Returns

`Date`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:856

___

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:877

___

### toHexString

**toHexString**(): `string`

Returns the ObjectId id as a 24 character hex string representation

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:835

___

### toJSON

**toJSON**(): `string`

Converts to its JSON the 24 character hex string representation.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:848

___

### toString

**toString**(`encoding?`): `string`

Converts the id into a 24 character hex string for printing, unless encoding is provided.

#### Parameters

| Name | Description |
| :------ | :------ |
| `encoding?` | ``"base64"`` \| ``"hex"`` | hex or base64 |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:846

___

### createFromBase64

`Static` **createFromBase64**(`base64`): [`ObjectId`](ObjectId.md)

Creates an ObjectId instance from a base64 string

#### Parameters

| Name |
| :------ |
| `base64` | `string` |

#### Returns

[`ObjectId`](ObjectId.md)

-`ObjectId`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:870

___

### createFromHexString

`Static` **createFromHexString**(`hexString`): [`ObjectId`](ObjectId.md)

Creates an ObjectId from a hex string representation of an ObjectId.

#### Parameters

| Name | Description |
| :------ | :------ |
| `hexString` | `string` | create a ObjectId from a passed in 24 character hexstring. |

#### Returns

[`ObjectId`](ObjectId.md)

-`ObjectId`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:868

___

### createFromTime

`Static` **createFromTime**(`time`): [`ObjectId`](ObjectId.md)

Creates an ObjectId from a second based number, with the rest of the ObjectId zeroed out. Used for comparisons or sorting the ObjectId.

#### Parameters

| Name | Description |
| :------ | :------ |
| `time` | `number` | an integer number representing a number of seconds. |

#### Returns

[`ObjectId`](ObjectId.md)

-`ObjectId`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:862

___

### generate

`Static` **generate**(`time?`): `Uint8Array`

Generate a 12 byte id buffer used in ObjectId's

#### Parameters

| Name | Description |
| :------ | :------ |
| `time?` | `number` | pass in a second based timestamp. |

#### Returns

`Uint8Array`

-`Uint8Array`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:841

___

### isValid

`Static` **isValid**(`id`): `boolean`

Checks if a value is a valid bson ObjectId

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` \| `number` \| [`ObjectId`](ObjectId.md) \| `Uint8Array` \| [`ObjectIdLike`](../interfaces/ObjectIdLike.md) | ObjectId instance to validate. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:876
