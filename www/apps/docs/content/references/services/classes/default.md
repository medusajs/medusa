# default

## Constructors

### constructor

**new default**(`disconnectTimeout`)

#### Parameters

| Name |
| :------ |
| `disconnectTimeout` | `number` |

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:8

## Properties

### connecting

 `Protected` **connecting**: `boolean`

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:5

___

### disconnectTimeout

 `Private` **disconnectTimeout**: `any`

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:7

___

### firstError

 `Optional` **firstError**: `Error`

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:4

___

### stream

 `Protected` **stream**: [`NetStream`](../types/NetStream.md)

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:6

## Methods

### check

**check**(`info`): `boolean`

#### Parameters

| Name |
| :------ |
| `info` | `any` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:9

___

### connect

`Abstract` **connect**(`_`): `Promise`<[`NetStream`](../types/NetStream.md)\>

#### Parameters

| Name |
| :------ |
| `_` | [`ErrorEmitter`](../types/ErrorEmitter.md) |

#### Returns

`Promise`<[`NetStream`](../types/NetStream.md)\>

-`Promise`: 
	-`NetStream`: 

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:11

___

### disconnect

**disconnect**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/ioredis/built/connectors/AbstractConnector.d.ts:10
