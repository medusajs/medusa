# ServerSession

Reflects the existence of a session on the server. Can be reused by the session pool.
WARNING: not meant to be instantiated directly. For internal use only.

## Constructors

### constructor

**new ServerSession**()

## Properties

### id

 **id**: [`ServerSessionId`](../types/ServerSessionId.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4806

___

### isDirty

 **isDirty**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4809

___

### lastUse

 **lastUse**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4807

___

### txnNumber

 **txnNumber**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4808

## Methods

### hasTimedOut

**hasTimedOut**(`sessionTimeoutMinutes`): `boolean`

Determines if the server session has timed out.

#### Parameters

| Name | Description |
| :------ | :------ |
| `sessionTimeoutMinutes` | `number` | The server's "logicalSessionTimeoutMinutes" |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4815
