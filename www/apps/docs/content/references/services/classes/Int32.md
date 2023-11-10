# Int32

A class representation of a BSON Int32 type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`Int32`**

## Constructors

### constructor

**new Int32**(`value`)

Create an Int32 type

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `string` \| `number` | the number we want to represent as an int32. |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:448

## Properties

### value

 **value**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:442

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Int32"``

#### Returns

``"Int32"``

-```"Int32"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:441

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:457

___

### toJSON

**toJSON**(): `number`

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:456

___

### toString

**toString**(`radix?`): `string`

#### Parameters

| Name |
| :------ |
| `radix?` | `number` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:455

___

### valueOf

**valueOf**(): `number`

Access the number value.

#### Returns

`number`

-`number`: (optional) returns the wrapped int32 number.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:454
