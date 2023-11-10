# Decimal128

A class representation of the BSON Decimal128 type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`Decimal128`**

## Constructors

### constructor

**new Decimal128**(`bytes`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `bytes` | `string` \| `Uint8Array` | a buffer containing the raw Decimal128 bytes in little endian order, or a string representation as returned by .toString() |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:298

## Properties

### bytes

 `Readonly` **bytes**: `Uint8Array`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:293

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Decimal128"``

#### Returns

``"Decimal128"``

-```"Decimal128"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:292

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:308

___

### toJSON

**toJSON**(): [`Decimal128Extended`](../interfaces/Decimal128Extended.md)

#### Returns

[`Decimal128Extended`](../interfaces/Decimal128Extended.md)

-`$numberDecimal`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:307

___

### toString

**toString**(): `string`

Create a string representation of the raw Decimal128 value

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:306

___

### fromString

`Static` **fromString**(`representation`): [`Decimal128`](Decimal128.md)

Create a Decimal128 instance from a string representation

#### Parameters

| Name | Description |
| :------ | :------ |
| `representation` | `string` | a numeric string representation. |

#### Returns

[`Decimal128`](Decimal128.md)

-`Decimal128`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:304
