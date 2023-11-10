# MongoDBNamespace

## Constructors

### constructor

**new MongoDBNamespace**(`db`, `collection?`)

Create a namespace object

#### Parameters

| Name | Description |
| :------ | :------ |
| `db` | `string` | database name |
| `collection?` | `string` | collection name |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3876

## Properties

### collection

 **collection**: `undefined` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3869

___

### db

 **db**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3868

## Methods

### toString

**toString**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3877

___

### withCollection

**withCollection**(`collection`): [`MongoDBNamespace`](MongoDBNamespace.md)

#### Parameters

| Name |
| :------ |
| `collection` | `string` |

#### Returns

[`MongoDBNamespace`](MongoDBNamespace.md)

-`MongoDBNamespace`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3878

___

### fromString

`Static` **fromString**(`namespace?`): [`MongoDBNamespace`](MongoDBNamespace.md)

#### Parameters

| Name |
| :------ |
| `namespace?` | `string` |

#### Returns

[`MongoDBNamespace`](MongoDBNamespace.md)

-`MongoDBNamespace`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3879
