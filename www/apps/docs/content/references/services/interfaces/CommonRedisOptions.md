# CommonRedisOptions

## Hierarchy

- [`CommanderOptions`](CommanderOptions.md)

  ↳ **`CommonRedisOptions`**

## Properties

### Connector

 `Optional` **Connector**: [`ConnectorConstructor`](ConnectorConstructor.md)

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:7

___

### autoPipeliningIgnoredCommands

 `Optional` **autoPipeliningIgnoredCommands**: `string`[]

**Default**

```ts
[]
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:125

___

### autoResendUnfulfilledCommands

 `Optional` **autoResendUnfulfilledCommands**: `boolean`

Whether or not to resend unfulfilled commands on reconnect.
Unfulfilled commands are most likely to be blocking commands such as `brpop` or `blpop`.

**Default**

```ts
true
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:58

___

### autoResubscribe

 `Optional` **autoResubscribe**: `boolean`

When the client reconnects, channels subscribed in the previous connection will be
resubscribed automatically if `autoResubscribe` is `true`.

**Default**

```ts
true
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:52

___

### commandQueue

 `Optional` **commandQueue**: `boolean`

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:127

___

### commandTimeout

 `Optional` **commandTimeout**: `number`

If a command does not return a reply within a set number of milliseconds,
a "Command timed out" error will be thrown.

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:13

___

### connectTimeout

 `Optional` **connectTimeout**: `number`

How long the client will wait before killing a socket due to inactivity during initial connection.

**Default**

```ts
10000
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:95

___

### connectionName

 `Optional` **connectionName**: `string`

Set the name of the connection to make it easier to identity the connection
in client list.

**Link**

https://redis.io/commands/client-setname

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:31

___

### db

 `Optional` **db**: `number`

Database index to use.

**Default**

```ts
0
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:46

___

### enableAutoPipelining

 `Optional` **enableAutoPipelining**: `boolean`

**Default**

```ts
false
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:121

___

### enableOfflineQueue

 `Optional` **enableOfflineQueue**: `boolean`

By default, if the connection to Redis server has not been established, commands are added to a queue
and are executed once the connection is "ready" (when `enableReadyCheck` is true, "ready" means
the Redis server has loaded the database from disk, otherwise means the connection to the Redis
server has been established). If this option is false, when execute the command when the connection
isn't ready, an error will be returned.

**Default**

```ts
true
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:138

___

### enableReadyCheck

 `Optional` **enableReadyCheck**: `boolean`

The client will sent an INFO command to check whether the server is still loading data from the disk (
which happens when the server is just launched) when the connection is established, and only wait until
the loading process is finished before emitting the `ready` event.

**Default**

```ts
true
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:146

___

### keepAlive

 `Optional` **keepAlive**: `number`

Enable/disable keep-alive functionality.

**Link**

https://nodejs.org/api/net.html#socketsetkeepaliveenable-initialdelay

**Default**

```ts
0
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:19

___

### keyPrefix

 `Optional` **keyPrefix**: `string`

#### Inherited from

[CommanderOptions](CommanderOptions.md).[keyPrefix](CommanderOptions.md#keyprefix)

#### Defined in

node_modules/ioredis/built/utils/Commander.d.ts:5

___

### lazyConnect

 `Optional` **lazyConnect**: `boolean`

When a Redis instance is initialized, a connection to the server is immediately established. Set this to
true will delay the connection to the server until the first command is sent or `redis.connect()` is called
explicitly.

**Default**

```ts
false
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:154

___

### maxLoadingRetryTime

 `Optional` **maxLoadingRetryTime**: `number`

**Default**

```ts
10000
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:117

___

### maxRetriesPerRequest

 `Optional` **maxRetriesPerRequest**: ``null`` \| `number`

The commands that don't get a reply due to the connection to the server is lost are
put into a queue and will be resent on reconnect (if allowed by the `retryStrategy` option).
This option is used to configure how many reconnection attempts should be allowed before
the queue is flushed with a `MaxRetriesPerRequestError` error.
Set this options to `null` instead of a number to let commands wait forever
until the connection is alive again.

**Default**

```ts
20
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:113

___

### monitor

 `Optional` **monitor**: `boolean`

This option is used internally when you call `redis.monitor()` to tell Redis
to enter the monitor mode when the connection is established.

**Default**

```ts
false
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:102

___

### noDelay

 `Optional` **noDelay**: `boolean`

Enable/disable the use of Nagle's algorithm.

**Link**

https://nodejs.org/api/net.html#socketsetnodelaynodelay

**Default**

```ts
true
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:25

___

### offlineQueue

 `Optional` **offlineQueue**: `boolean`

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:126

___

### password

 `Optional` **password**: `string`

If set, client will send AUTH command with the value of this option when connected.

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:40

___

### readOnly

 `Optional` **readOnly**: `boolean`

**Default**

```ts
false
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:84

___

### reconnectOnError

 `Optional` **reconnectOnError**: ``null`` \| [`ReconnectOnError`](../types/ReconnectOnError.md)

Whether or not to reconnect on certain Redis errors.
This options by default is `null`, which means it should never reconnect on Redis errors.
You can pass a function that accepts an Redis error, and returns:
- `true` or `1` to trigger a reconnection.
- `false` or `0` to not reconnect.
- `2` to reconnect and resend the failed command (who triggered the error) after reconnection.

**Default**

```ts
null
```

**Example**

```js
const redis = new Redis({
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      // Only reconnect when the error contains "READONLY"
      return true; // or `return 1;`
    }
  },
});
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:80

___

### retryStrategy

 `Optional` **retryStrategy**: (`times`: `number`) => ``null`` \| `number` \| `void`

#### Type declaration

(`times`): ``null`` \| `number` \| `void`

##### Parameters

| Name |
| :------ |
| `times` | `number` |

##### Returns

``null`` \| `number` \| `void`

-```null`` \| number \| void`: (optional) 

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:8

___

### scripts

 `Optional` **scripts**: Record<`string`, { `lua`: `string` ; `numberOfKeys?`: `number` ; `readOnly?`: `boolean`  }\>

**Default**

```ts
undefined
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:158

___

### showFriendlyErrorStack

 `Optional` **showFriendlyErrorStack**: `boolean`

#### Inherited from

[CommanderOptions](CommanderOptions.md).[showFriendlyErrorStack](CommanderOptions.md#showfriendlyerrorstack)

#### Defined in

node_modules/ioredis/built/utils/Commander.d.ts:6

___

### stringNumbers

 `Optional` **stringNumbers**: `boolean`

When enabled, numbers returned by Redis will be converted to JavaScript strings instead of numbers.
This is necessary if you want to handle big numbers (above `Number.MAX_SAFE_INTEGER` === 2^53).

**Default**

```ts
false
```

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:90

___

### username

 `Optional` **username**: `string`

If set, client will send AUTH command with the value of this option as the first argument when connected.
This is supported since Redis 6.

#### Defined in

node_modules/ioredis/built/redis/RedisOptions.d.ts:36
