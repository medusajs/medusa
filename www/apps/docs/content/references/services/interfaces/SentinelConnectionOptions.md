# SentinelConnectionOptions

## Properties

### connectTimeout

 `Optional` **connectTimeout**: `number`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:40

___

### disconnectTimeout

 `Optional` **disconnectTimeout**: `number`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:41

___

### enableTLSForSentinelMode

 `Optional` **enableTLSForSentinelMode**: `boolean`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:43

___

### failoverDetector

 `Optional` **failoverDetector**: `boolean`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:51

___

### name

 `Optional` **name**: `string`

Master group name of the Sentinel

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:28

___

### natMap

 `Optional` **natMap**: [`NatMap`](NatMap.md)

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:45

___

### preferredSlaves

 `Optional` **preferredSlaves**: [`PreferredSlaves`](../index.md#preferredslaves)

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:39

___

### role

 `Optional` **role**: ``"master"`` \| ``"slave"``

**Default**

```ts
"master"
```

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:32

___

### sentinelCommandTimeout

 `Optional` **sentinelCommandTimeout**: `number`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:42

___

### sentinelMaxConnections

 `Optional` **sentinelMaxConnections**: `number`

**Default**

```ts
10
```

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:50

___

### sentinelPassword

 `Optional` **sentinelPassword**: `string`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:35

___

### sentinelReconnectStrategy

 `Optional` **sentinelReconnectStrategy**: (`retryAttempts`: `number`) => ``null`` \| `number` \| `void`

#### Type declaration

(`retryAttempts`): ``null`` \| `number` \| `void`

##### Parameters

| Name |
| :------ |
| `retryAttempts` | `number` |

##### Returns

``null`` \| `number` \| `void`

-```null`` \| number \| void`: (optional) 

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:38

___

### sentinelRetryStrategy

 `Optional` **sentinelRetryStrategy**: (`retryAttempts`: `number`) => ``null`` \| `number` \| `void`

#### Type declaration

(`retryAttempts`): ``null`` \| `number` \| `void`

##### Parameters

| Name |
| :------ |
| `retryAttempts` | `number` |

##### Returns

``null`` \| `number` \| `void`

-```null`` \| number \| void`: (optional) 

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:37

___

### sentinelTLS

 `Optional` **sentinelTLS**: [`ConnectionOptions`](ConnectionOptions.md)

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:44

___

### sentinelUsername

 `Optional` **sentinelUsername**: `string`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:34

___

### sentinels

 `Optional` **sentinels**: [`Partial`](../index.md#partial)<[`SentinelAddress`](SentinelAddress.md)\>[]

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:36

___

### tls

 `Optional` **tls**: [`ConnectionOptions`](ConnectionOptions.md)

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:33

___

### updateSentinels

 `Optional` **updateSentinels**: `boolean`

#### Defined in

node_modules/ioredis/built/connectors/SentinelConnector/index.d.ts:46
