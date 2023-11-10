# CommonConnectionOptions

## Hierarchy

- **`CommonConnectionOptions`**

  ↳ [`TlsOptions`](TlsOptions.md)

  ↳ [`ConnectionOptions`](ConnectionOptions.md)

  ↳ [`TLSSocketOptions`](TLSSocketOptions.md)

## Properties

### ALPNProtocols

 `Optional` **ALPNProtocols**: `string`[] \| `Uint8Array` \| `Uint8Array`[]

An array of strings or a Buffer naming possible ALPN protocols.
(Protocols should be ordered by their priority.)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:526

___

### SNICallback

 `Optional` **SNICallback**: (`servername`: `string`, `cb`: (`err`: ``null`` \| `Error`, `ctx?`: [`SecureContext`](SecureContext.md)) => `void`) => `void`

#### Type declaration

(`servername`, `cb`): `void`

SNICallback(servername, cb) <Function> A function that will be
called if the client supports SNI TLS extension. Two arguments
will be passed when called: servername and cb. SNICallback should
invoke cb(null, ctx), where ctx is a SecureContext instance.
(tls.createSecureContext(...) can be used to get a proper
SecureContext.) If SNICallback wasn't provided the default callback
with high-level API will be used (see below).

##### Parameters

| Name |
| :------ |
| `servername` | `string` |
| `cb` | (`err`: ``null`` \| `Error`, `ctx?`: [`SecureContext`](SecureContext.md)) => `void` |

##### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:536

___

### enableTrace

 `Optional` **enableTrace**: `boolean`

When enabled, TLS packet trace information is written to `stderr`. This can be
used to debug TLS connection problems.

**Default**

```ts
false
```

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:515

___

### rejectUnauthorized

 `Optional` **rejectUnauthorized**: `boolean`

If true the server will reject any connection which is not
authorized with the list of supplied CAs. This option only has an
effect if requestCert is true.

**Default**

```ts
true
```

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:543

___

### requestCert

 `Optional` **requestCert**: `boolean`

If true the server will request a certificate from clients that
connect and attempt to verify that certificate. Defaults to
false.

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:521

___

### secureContext

 `Optional` **secureContext**: [`SecureContext`](SecureContext.md)

An optional TLS context object from tls.createSecureContext()

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:509
