# ReadConcern

The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
of the data read from replica sets and replica set shards.

**See**

https://www.mongodb.com/docs/manual/reference/read-concern/index.html

## Constructors

### constructor

**new ReadConcern**(`level`)

Constructs a ReadConcern from the read concern level.

#### Parameters

| Name |
| :------ |
| `level` | [`ReadConcernLevel`](../index.md#readconcernlevel) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4412

## Properties

### level

 **level**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4410

## Accessors

### AVAILABLE

`Static` `get` **AVAILABLE**(): ``"available"``

#### Returns

``"available"``

-```"available"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4423

___

### LINEARIZABLE

`Static` `get` **LINEARIZABLE**(): ``"linearizable"``

#### Returns

``"linearizable"``

-```"linearizable"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4424

___

### MAJORITY

`Static` `get` **MAJORITY**(): ``"majority"``

#### Returns

``"majority"``

-```"majority"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4422

___

### SNAPSHOT

`Static` `get` **SNAPSHOT**(): ``"snapshot"``

#### Returns

``"snapshot"``

-```"snapshot"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4425

## Methods

### toJSON

**toJSON**(): [`Document`](../interfaces/Document.md)

#### Returns

[`Document`](../interfaces/Document.md)

-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4426

___

### fromOptions

`Static` **fromOptions**(`options?`): `undefined` \| [`ReadConcern`](ReadConcern.md)

Construct a ReadConcern given an options object.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | `object` | The options object from which to extract the write concern. |
| `options.level?` | [`ReadConcernLevel`](../index.md#readconcernlevel) |
| `options.readConcern?` | [`ReadConcernLike`](../types/ReadConcernLike.md) |

#### Returns

`undefined` \| [`ReadConcern`](ReadConcern.md)

-`undefined \| ReadConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4418
