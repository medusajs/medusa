# Double

A class representation of the BSON Double type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`Double`**

## Constructors

### constructor

**new Double**(`value`)

Create a Double type

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | the number we want to represent as a double. |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:390

## Properties

### value

 **value**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:384

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Double"``

#### Returns

``"Double"``

-```"Double"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:383

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:399

___

### toJSON

**toJSON**(): `number`

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:397

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

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:398

___

### valueOf

**valueOf**(): `number`

Access the number value.

#### Returns

`number`

-`number`: (optional) returns the wrapped double number.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:396
