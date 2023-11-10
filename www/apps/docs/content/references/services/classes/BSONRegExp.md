# BSONRegExp

A class representation of the BSON RegExp type.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`BSONRegExp`**

## Constructors

### constructor

**new BSONRegExp**(`pattern`, `options?`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `pattern` | `string` | The regular expression pattern to match |
| `options?` | `string` | The regular expression options |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:134

## Properties

### options

 **options**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:129

___

### pattern

 **pattern**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:128

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"BSONRegExp"``

#### Returns

``"BSONRegExp"``

-```"BSONRegExp"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:127

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:136

___

### parseOptions

`Static` **parseOptions**(`options?`): `string`

#### Parameters

| Name |
| :------ |
| `options?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:135
