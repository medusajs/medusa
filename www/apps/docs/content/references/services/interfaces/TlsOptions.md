# TlsOptions

## Hierarchy

- [`SecureContextOptions`](SecureContextOptions.md)

- [`CommonConnectionOptions`](CommonConnectionOptions.md)

- [`ServerOpts`](ServerOpts.md)

  ↳ **`TlsOptions`**

## Properties

### ALPNCallback

 `Optional` **ALPNCallback**: (`arg`: { `protocols`: `string`[] ; `servername`: `string`  }) => `undefined` \| `string`

#### Type declaration

(`arg`): `undefined` \| `string`

If set, this will be called when a client opens a connection using the ALPN extension.
One argument will be passed to the callback: an object containing `servername` and `protocols` fields,
respectively containing the server name from the SNI extension (if any) and an array of
ALPN protocol name strings. The callback must return either one of the strings listed in `protocols`,
which will be returned to the client as the selected ALPN protocol, or `undefined`,
to reject the connection with a fatal alert. If a string is returned that does not match one of
the client's ALPN protocols, an error will be thrown.
This option cannot be used with the `ALPNProtocols` option, and setting both options will throw an error.

##### Parameters

| Name |
| :------ |
| `arg` | `object` |
| `arg.protocols` | `string`[] |
| `arg.servername` | `string` |

##### Returns

`undefined` \| `string`

-`undefined \| string`: (optional) 

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[ALPNCallback](SecureContextOptions.md#alpncallback)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:811

___

### ALPNProtocols

 `Optional` **ALPNProtocols**: `string`[] \| `Uint8Array` \| `Uint8Array`[]

An array of strings or a Buffer naming possible ALPN protocols.
(Protocols should be ordered by their priority.)

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[ALPNProtocols](CommonConnectionOptions.md#alpnprotocols)

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

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[SNICallback](CommonConnectionOptions.md#snicallback)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:536

___

### allowHalfOpen

 `Optional` **allowHalfOpen**: `boolean`

Indicates whether half-opened TCP connections are allowed.

**Default**

```ts
false
```

#### Inherited from

[ServerOpts](ServerOpts.md).[allowHalfOpen](ServerOpts.md#allowhalfopen)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:468

___

### ca

 `Optional` **ca**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

Optionally override the trusted CA certificates. Default is to trust
the well-known CAs curated by Mozilla. Mozilla's CAs are completely
replaced when CAs are explicitly specified using this option.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[ca](SecureContextOptions.md#ca)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:817

___

### cert

 `Optional` **cert**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

Cert chains in PEM format. One cert chain should be provided per
 private key. Each cert chain should consist of the PEM formatted
 certificate for a provided private key, followed by the PEM
 formatted intermediate certificates (if any), in order, and not
 including the root CA (the root CA must be pre-known to the peer,
 see ca). When providing multiple cert chains, they do not have to
 be in the same order as their private keys in key. If the
 intermediate certificates are not provided, the peer will not be
 able to validate the certificate, and the handshake will fail.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[cert](SecureContextOptions.md#cert)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:829

___

### ciphers

 `Optional` **ciphers**: `string`

Cipher suite specification, replacing the default. For more
information, see modifying the default cipher suite. Permitted
ciphers can be obtained via tls.getCiphers(). Cipher names must be
uppercased in order for OpenSSL to accept them.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[ciphers](SecureContextOptions.md#ciphers)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:843

___

### clientCertEngine

 `Optional` **clientCertEngine**: `string`

Name of an OpenSSL engine which can provide the client certificate.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[clientCertEngine](SecureContextOptions.md#clientcertengine)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:847

___

### crl

 `Optional` **crl**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

PEM formatted CRLs (Certificate Revocation Lists).

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[crl](SecureContextOptions.md#crl)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:851

___

### dhparam

 `Optional` **dhparam**: `string` \| [`Buffer`](../index.md#buffer)

`'auto'` or custom Diffie-Hellman parameters, required for non-ECDHE perfect forward secrecy.
If omitted or invalid, the parameters are silently discarded and DHE ciphers will not be available.
ECDHE-based perfect forward secrecy will still be available.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[dhparam](SecureContextOptions.md#dhparam)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:857

___

### ecdhCurve

 `Optional` **ecdhCurve**: `string`

A string describing a named curve or a colon separated list of curve
NIDs or names, for example P-521:P-384:P-256, to use for ECDH key
agreement. Set to auto to select the curve automatically. Use
crypto.getCurves() to obtain a list of available curve names. On
recent releases, openssl ecparam -list_curves will also display the
name and description of each available elliptic curve. Default:
tls.DEFAULT_ECDH_CURVE.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[ecdhCurve](SecureContextOptions.md#ecdhcurve)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:867

___

### enableTrace

 `Optional` **enableTrace**: `boolean`

When enabled, TLS packet trace information is written to `stderr`. This can be
used to debug TLS connection problems.

**Default**

```ts
false
```

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[enableTrace](CommonConnectionOptions.md#enabletrace)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:515

___

### handshakeTimeout

 `Optional` **handshakeTimeout**: `number`

Abort the connection if the SSL/TLS handshake does not finish in the
specified number of milliseconds. A 'tlsClientError' is emitted on
the tls.Server object whenever a handshake times out. Default:
120000 (120 seconds).

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:552

___

### honorCipherOrder

 `Optional` **honorCipherOrder**: `boolean`

Attempt to use the server's cipher suite preferences instead of the
client's. When true, causes SSL_OP_CIPHER_SERVER_PREFERENCE to be
set in secureOptions

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[honorCipherOrder](SecureContextOptions.md#honorcipherorder)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:873

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

#### Inherited from

[ServerOpts](ServerOpts.md).[keepAlive](ServerOpts.md#keepalive)

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

#### Inherited from

[ServerOpts](ServerOpts.md).[keepAliveInitialDelay](ServerOpts.md#keepaliveinitialdelay)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:492

___

### key

 `Optional` **key**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer) \| [`KeyObject`](KeyObject-1.md))[]

Private keys in PEM format. PEM allows the option of private keys
being encrypted. Encrypted keys will be decrypted with
options.passphrase. Multiple keys using different algorithms can be
provided either as an array of unencrypted key strings or buffers,
or an array of objects in the form {pem: <string|buffer>[,
passphrase: <string>]}. The object form can only occur in an array.
object.passphrase is optional. Encrypted keys will be decrypted with
object.passphrase if provided, or options.passphrase if it is not.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[key](SecureContextOptions.md#key)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:884

___

### maxVersion

 `Optional` **maxVersion**: [`SecureVersion`](../index.md#secureversion)

Optionally set the maximum TLS version to allow. One
of `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'`, or `'TLSv1'`. Cannot be specified along with the
`secureProtocol` option, use one or the other.
**Default:** `'TLSv1.3'`, unless changed using CLI options. Using
`--tls-max-v1.2` sets the default to `'TLSv1.2'`. Using `--tls-max-v1.3` sets the default to
`'TLSv1.3'`. If multiple of the options are provided, the highest maximum is used.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[maxVersion](SecureContextOptions.md#maxversion)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:904

___

### minVersion

 `Optional` **minVersion**: [`SecureVersion`](../index.md#secureversion)

Optionally set the minimum TLS version to allow. One
of `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'`, or `'TLSv1'`. Cannot be specified along with the
`secureProtocol` option, use one or the other.  It is not recommended to use
less than TLSv1.2, but it may be required for interoperability.
**Default:** `'TLSv1.2'`, unless changed using CLI options. Using
`--tls-v1.0` sets the default to `'TLSv1'`. Using `--tls-v1.1` sets the default to
`'TLSv1.1'`. Using `--tls-min-v1.3` sets the default to
'TLSv1.3'. If multiple of the options are provided, the lowest minimum is used.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[minVersion](SecureContextOptions.md#minversion)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:915

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

#### Inherited from

[ServerOpts](ServerOpts.md).[noDelay](ServerOpts.md#nodelay)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:479

___

### passphrase

 `Optional` **passphrase**: `string`

Shared passphrase used for a single private key and/or a PFX.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[passphrase](SecureContextOptions.md#passphrase)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:919

___

### pauseOnConnect

 `Optional` **pauseOnConnect**: `boolean`

Indicates whether the socket should be paused on incoming connections.

**Default**

```ts
false
```

#### Inherited from

[ServerOpts](ServerOpts.md).[pauseOnConnect](ServerOpts.md#pauseonconnect)

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:473

___

### pfx

 `Optional` **pfx**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer) \| [`PxfObject`](PxfObject.md))[]

PFX or PKCS12 encoded private key and certificate chain. pfx is an
alternative to providing key and cert individually. PFX is usually
encrypted, if it is, passphrase will be used to decrypt it. Multiple
PFX can be provided either as an array of unencrypted PFX buffers,
or an array of objects in the form {buf: <string|buffer>[,
passphrase: <string>]}. The object form can only occur in an array.
object.passphrase is optional. Encrypted PFX will be decrypted with
object.passphrase if provided, or options.passphrase if it is not.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[pfx](SecureContextOptions.md#pfx)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:930

___

### privateKeyEngine

 `Optional` **privateKeyEngine**: `string`

Name of an OpenSSL engine to get private key from. Should be used
together with privateKeyIdentifier.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[privateKeyEngine](SecureContextOptions.md#privatekeyengine)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:889

___

### privateKeyIdentifier

 `Optional` **privateKeyIdentifier**: `string`

Identifier of a private key managed by an OpenSSL engine. Should be
used together with privateKeyEngine. Should not be set together with
key, because both options define a private key in different ways.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[privateKeyIdentifier](SecureContextOptions.md#privatekeyidentifier)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:895

___

### pskIdentityHint

 `Optional` **pskIdentityHint**: `string`

hint to send to a client to help
with selecting the identity during TLS-PSK negotiation. Will be ignored
in TLS 1.3. Upon failing to set pskIdentityHint `tlsClientError` will be
emitted with `ERR_TLS_PSK_SET_IDENTIY_HINT_FAILED` code.

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:588

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

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[rejectUnauthorized](CommonConnectionOptions.md#rejectunauthorized)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:543

___

### requestCert

 `Optional` **requestCert**: `boolean`

If true the server will request a certificate from clients that
connect and attempt to verify that certificate. Defaults to
false.

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[requestCert](CommonConnectionOptions.md#requestcert)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:521

___

### secureContext

 `Optional` **secureContext**: [`SecureContext`](SecureContext.md)

An optional TLS context object from tls.createSecureContext()

#### Inherited from

[CommonConnectionOptions](CommonConnectionOptions.md).[secureContext](CommonConnectionOptions.md#securecontext)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:509

___

### secureOptions

 `Optional` **secureOptions**: `number`

Optionally affect the OpenSSL protocol behavior, which is not
usually necessary. This should be used carefully if at all! Value is
a numeric bitmask of the SSL_OP_* options from OpenSSL Options

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[secureOptions](SecureContextOptions.md#secureoptions)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:936

___

### secureProtocol

 `Optional` **secureProtocol**: `string`

Legacy mechanism to select the TLS protocol version to use, it does
not support independent control of the minimum and maximum version,
and does not support limiting the protocol to TLSv1.3. Use
minVersion and maxVersion instead. The possible values are listed as
SSL_METHODS, use the function names as strings. For example, use
'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method' to allow
any TLS protocol version up to TLSv1.3. It is not recommended to use
TLS versions less than 1.2, but it may be required for
interoperability. Default: none, see minVersion.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[secureProtocol](SecureContextOptions.md#secureprotocol)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:948

___

### sessionIdContext

 `Optional` **sessionIdContext**: `string`

Opaque identifier used by servers to ensure session state is not
shared between applications. Unused by clients.

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[sessionIdContext](SecureContextOptions.md#sessionidcontext)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:953

___

### sessionTimeout

 `Optional` **sessionTimeout**: `number`

The number of seconds after which a TLS session created by the
server will no longer be resumable. See Session Resumption for more
information. Default: 300.

#### Overrides

[SecureContextOptions](SecureContextOptions.md).[sessionTimeout](SecureContextOptions.md#sessiontimeout)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:558

___

### sigalgs

 `Optional` **sigalgs**: `string`

Colon-separated list of supported signature algorithms. The list
 can contain digest algorithms (SHA256, MD5 etc.), public key
 algorithms (RSA-PSS, ECDSA etc.), combination of both (e.g
 'RSA+SHA384') or TLS v1.3 scheme names (e.g. rsa_pss_pss_sha512).

#### Inherited from

[SecureContextOptions](SecureContextOptions.md).[sigalgs](SecureContextOptions.md#sigalgs)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:836

___

### ticketKeys

 `Optional` **ticketKeys**: [`Buffer`](../index.md#buffer)

48-bytes of cryptographically strong pseudo-random data.

#### Overrides

[SecureContextOptions](SecureContextOptions.md).[ticketKeys](SecureContextOptions.md#ticketkeys)

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:562

## Methods

### pskCallback

`Optional` **pskCallback**(`socket`, `identity`): ``null`` \| [`TypedArray`](../index.md#typedarray) \| `DataView`

#### Parameters

| Name | Description |
| :------ | :------ |
| `socket` | [`TLSSocket`](../classes/TLSSocket.md) |
| `identity` | `string` | identity parameter sent from the client. |

#### Returns

``null`` \| [`TypedArray`](../index.md#typedarray) \| `DataView`

-```null`` \| TypedArray \| DataView`: (optional) pre-shared key that must either be
a buffer or `null` to stop the negotiation process. Returned PSK must be
compatible with the selected cipher's digest.

When negotiating TLS-PSK (pre-shared keys), this function is called
with the identity provided by the client.
If the return value is `null` the negotiation process will stop and an
"unknown_psk_identity" alert message will be sent to the other party.
If the server wishes to hide the fact that the PSK identity was not known,
the callback must provide some random data as `psk` to make the connection
fail with "decrypt_error" before negotiation is finished.
PSK ciphers are disabled by default, and using TLS-PSK thus
requires explicitly specifying a cipher suite with the `ciphers` option.
More information can be found in the RFC 4279.

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:581
