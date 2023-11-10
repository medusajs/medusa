# WriteConcernError

An error representing a failure by the server to apply the requested write concern to the bulk operation.

## Constructors

### constructor

**new WriteConcernError**(`error`)

#### Parameters

| Name |
| :------ |
| `error` | [`WriteConcernErrorData`](../interfaces/WriteConcernErrorData.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5455

## Accessors

### code

`get` **code**(): `undefined` \| `number`

Write concern error code.

#### Returns

`undefined` \| `number`

-`undefined \| number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5457

___

### errInfo

`get` **errInfo**(): `undefined` \| [`Document`](../interfaces/Document.md)

Write concern error info.

#### Returns

`undefined` \| [`Document`](../interfaces/Document.md)

-`undefined \| Document`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5461

___

### errmsg

`get` **errmsg**(): `undefined` \| `string`

Write concern error message.

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5459

## Methods

### toJSON

**toJSON**(): [`WriteConcernErrorData`](../interfaces/WriteConcernErrorData.md)

#### Returns

[`WriteConcernErrorData`](../interfaces/WriteConcernErrorData.md)

-`code`: 
-`errInfo`: (optional) 
-`errmsg`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5462

___

### toString

**toString**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5463
