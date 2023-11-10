# WriteError

An error that occurred during a BulkWrite on the server.

## Constructors

### constructor

**new WriteError**(`err`)

#### Parameters

| Name |
| :------ |
| `err` | [`BulkWriteOperationError`](../interfaces/BulkWriteOperationError.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5498

## Properties

### err

 **err**: [`BulkWriteOperationError`](../interfaces/BulkWriteOperationError.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5497

## Accessors

### code

`get` **code**(): `number`

WriteError code.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5500

___

### errInfo

`get` **errInfo**(): `undefined` \| [`Document`](../interfaces/Document.md)

WriteError details.

#### Returns

`undefined` \| [`Document`](../interfaces/Document.md)

-`undefined \| Document`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5506

___

### errmsg

`get` **errmsg**(): `undefined` \| `string`

WriteError message.

#### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5504

___

### index

`get` **index**(): `number`

WriteError original bulk operation index.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5502

## Methods

### getOperation

**getOperation**(): [`Document`](../interfaces/Document.md)

Returns the underlying operation that caused the error

#### Returns

[`Document`](../interfaces/Document.md)

-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5508

___

### toJSON

**toJSON**(): { `code`: `number` ; `errmsg?`: `string` ; `index`: `number` ; `op`: [`Document`](../interfaces/Document.md)  }

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `errmsg?` | `string` |
| `index` | `number` |
| `op` | [`Document`](../interfaces/Document.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5509

___

### toString

**toString**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5515
