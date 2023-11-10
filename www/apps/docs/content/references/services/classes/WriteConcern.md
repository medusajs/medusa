# WriteConcern

A MongoDB WriteConcern, which describes the level of acknowledgement
requested from MongoDB for write operations.

**See**

https://www.mongodb.com/docs/manual/reference/write-concern/

## Constructors

### constructor

**new WriteConcern**(`w?`, `wtimeout?`, `j?`, `fsync?`)

Constructs a WriteConcern from the write concern properties.

#### Parameters

| Name | Description |
| :------ | :------ |
| `w?` | [`W`](../types/W.md) | request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags. |
| `wtimeout?` | `number` | specify a time limit to prevent write operations from blocking indefinitely |
| `j?` | `boolean` | request acknowledgment that the write operation has been written to the on-disk journal |
| `fsync?` | `boolean` \| ``1`` | equivalent to the j option |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5445

## Properties

### fsync

 `Optional` **fsync**: `boolean` \| ``1``

equivalent to the j option

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5437

___

### j

 `Optional` **j**: `boolean`

request acknowledgment that the write operation has been written to the on-disk journal

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5435

___

### w

 `Optional` **w**: [`W`](../types/W.md)

request acknowledgment that the write operation has propagated to a specified number of mongod instances or to mongod instances with specified tags.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5431

___

### wtimeout

 `Optional` **wtimeout**: `number`

specify a time limit to prevent write operations from blocking indefinitely

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5433

## Methods

### fromOptions

`Static` **fromOptions**(`options?`, `inherit?`): `undefined` \| [`WriteConcern`](WriteConcern.md)

Construct a WriteConcern given an options object.

#### Parameters

| Name |
| :------ |
| `options?` | [`WriteConcernOptions`](../interfaces/WriteConcernOptions.md) \| [`WriteConcern`](WriteConcern.md) \| [`W`](../types/W.md) |
| `inherit?` | [`WriteConcernOptions`](../interfaces/WriteConcernOptions.md) \| [`WriteConcern`](WriteConcern.md) |

#### Returns

`undefined` \| [`WriteConcern`](WriteConcern.md)

-`undefined \| WriteConcern`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5447
