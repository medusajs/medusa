# ServerOpts

## Hierarchy

- **`ServerOpts`**

  ↳ [`TlsOptions`](TlsOptions.md)

## Properties

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

Indicates whether half-opened TCP connections are allowed.

**Default**

```ts
false
```

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:468

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

If set to `true`, it enables keep-alive functionality on the socket immediately after a new incoming connection is received,
similarly on what is done in `socket.setKeepAlive([enable][, initialDelay])`.

**Default**

```ts
false
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:486

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

If set to a positive number, it sets the initial delay before the first keepalive probe is sent on an idle socket.

**Default**

```ts
0
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:492

___

### noDelay

 `Optional` **noDelay**: `boolean`

If set to `true`, it disables the use of Nagle's algorithm immediately after a new incoming connection is received.

**Default**

```ts
false
```

**Since**

v16.5.0

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:479

___

### pauseOnConnect

 `Optional` **pauseOnConnect**: `boolean`

Indicates whether the socket should be paused on incoming connections.

**Default**

```ts
false
```

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:473
