# ConnectionPoolOptions

## Hierarchy

- [`Omit`](../types/Omit.md)<[`ConnectionOptions`](ConnectionOptions-1.md), ``"id"`` \| ``"generation"``\>

  ↳ **`ConnectionPoolOptions`**

## Properties

### ALPNProtocols

 `Optional` **ALPNProtocols**: `string`[] \| `Uint8Array` \| `Uint8Array`[]

An array of strings or a Buffer naming possible ALPN protocols.
(Protocols should be ordered by their priority.)

#### Inherited from

Omit.ALPNProtocols

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:526

docs-util/node_modules/@types/node/tls.d.ts:526

___

### autoEncrypter

 `Optional` **autoEncrypter**: [`AutoEncrypter`](AutoEncrypter.md)

#### Inherited from

Omit.autoEncrypter

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2117

___

### ca

 `Optional` **ca**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

Optionally override the trusted CA certificates. Default is to trust
the well-known CAs curated by Mozilla. Mozilla's CAs are completely
replaced when CAs are explicitly specified using this option.

#### Inherited from

Omit.ca

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:817

docs-util/node_modules/@types/node/tls.d.ts:817

___

### cancellationToken

 `Optional` **cancellationToken**: [`CancellationToken`](../classes/CancellationToken.md)

#### Inherited from

Omit.cancellationToken

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2127

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

Omit.cert

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:829

docs-util/node_modules/@types/node/tls.d.ts:829

___

### checkServerIdentity

 `Optional` **checkServerIdentity**: (`hostname`: `string`, `cert`: [`PeerCertificate`](PeerCertificate.md)) => `Error` \| `undefined`

#### Type declaration

(`hostname`, `cert`): `Error` \| `undefined`

Verifies the certificate `cert` is issued to `hostname`.

Returns [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object, populating it with `reason`, `host`, and `cert` on
failure. On success, returns [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

This function is intended to be used in combination with the`checkServerIdentity` option that can be passed to connect and as
such operates on a `certificate object`. For other purposes, consider using `x509.checkHost()` instead.

This function can be overwritten by providing an alternative function as the`options.checkServerIdentity` option that is passed to `tls.connect()`. The
overwriting function can call `tls.checkServerIdentity()` of course, to augment
the checks done with additional verification.

This function is only called if the certificate passed all other checks, such as
being issued by trusted CA (`options.ca`).

Earlier versions of Node.js incorrectly accepted certificates for a given`hostname` if a matching `uniformResourceIdentifier` subject alternative name
was present (see [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Applications that wish to accept`uniformResourceIdentifier` subject alternative names can use
a custom`options.checkServerIdentity` function that implements the desired behavior.

##### Parameters

| Name | Description |
| :------ | :------ |
| `hostname` | `string` | The host name or IP address to verify the certificate against. |
| `cert` | [`PeerCertificate`](PeerCertificate.md) | A `certificate object` representing the peer's certificate. |

##### Returns

`Error` \| `undefined`

-`Error \| undefined`: (optional) 

**Since**

v0.8.4

#### Inherited from

Omit.checkServerIdentity

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:599

___

### ciphers

 `Optional` **ciphers**: `string`

Cipher suite specification, replacing the default. For more
information, see modifying the default cipher suite. Permitted
ciphers can be obtained via tls.getCiphers(). Cipher names must be
uppercased in order for OpenSSL to accept them.

#### Inherited from

Omit.ciphers

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:843

docs-util/node_modules/@types/node/tls.d.ts:843

___

### compressors

 `Optional` **compressors**: (``"none"`` \| ``"snappy"`` \| ``"zlib"`` \| ``"zstd"``)[]

#### Inherited from

Omit.compressors

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4879

___

### connectTimeoutMS

 `Optional` **connectTimeoutMS**: `number`

#### Inherited from

Omit.connectTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2121

___

### credentials

 `Optional` **credentials**: [`MongoCredentials`](../classes/MongoCredentials.md)

#### Inherited from

Omit.credentials

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2120

___

### crl

 `Optional` **crl**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

PEM formatted CRLs (Certificate Revocation Lists).

#### Inherited from

Omit.crl

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:851

docs-util/node_modules/@types/node/tls.d.ts:851

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

Omit.ecdhCurve

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:867

docs-util/node_modules/@types/node/tls.d.ts:867

___

### family

 `Optional` **family**: `number`

#### Inherited from

Omit.family

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:59

___

### hints

 `Optional` **hints**: `number`

#### Inherited from

Omit.hints

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:58

___

### hostAddress

 **hostAddress**: [`HostAddress`](../classes/HostAddress.md)

#### Inherited from

Omit.hostAddress

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2116

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

#### Inherited from

Omit.keepAlive

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2123

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

#### Inherited from

Omit.keepAliveInitialDelay

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2124

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

Omit.key

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:884

docs-util/node_modules/@types/node/tls.d.ts:884

___

### loadBalanced

 **loadBalanced**: `boolean`

If we are in load balancer mode.

#### Overrides

Omit.loadBalanced

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2192

___

### localAddress

 `Optional` **localAddress**: `string`

#### Inherited from

Omit.localAddress

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:56

___

### localPort

 `Optional` **localPort**: `number`

#### Inherited from

Omit.localPort

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:57

___

### logicalSessionTimeoutMinutes

 `Optional` **logicalSessionTimeoutMinutes**: `number`

#### Inherited from

Omit.logicalSessionTimeoutMinutes

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4880

___

### lookup

 `Optional` **lookup**: [`LookupFunction`](../types/LookupFunction.md)

#### Inherited from

Omit.lookup

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:60

___

### maxConnecting

 **maxConnecting**: `number`

The maximum number of connections that may be in the process of being established concurrently by the connection pool.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2186

___

### maxIdleTimeMS

 **maxIdleTimeMS**: `number`

The maximum amount of time a connection should remain idle in the connection pool before being marked idle.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2188

___

### maxPoolSize

 **maxPoolSize**: `number`

The maximum number of connections that may be associated with a pool at a given time. This includes in use and available connections.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2182

___

### metadata

 **metadata**: [`ClientMetadata`](ClientMetadata.md)

#### Inherited from

Omit.metadata

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2128

___

### minDHSize

 `Optional` **minDHSize**: `number`

#### Inherited from

Omit.minDHSize

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:602

___

### minPoolSize

 **minPoolSize**: `number`

The minimum number of connections that MUST exist at any moment in a single connection pool.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2184

___

### monitorCommands

 **monitorCommands**: `boolean`

#### Inherited from

Omit.monitorCommands

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2119

___

### noDelay

 `Optional` **noDelay**: `boolean`

#### Inherited from

Omit.noDelay

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2125

___

### passphrase

 `Optional` **passphrase**: `string`

Shared passphrase used for a single private key and/or a PFX.

#### Inherited from

Omit.passphrase

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:919

docs-util/node_modules/@types/node/tls.d.ts:919

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

Omit.pfx

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:930

docs-util/node_modules/@types/node/tls.d.ts:930

___

### proxyHost

 `Optional` **proxyHost**: `string`

#### Inherited from

Omit.proxyHost

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4379

___

### proxyPassword

 `Optional` **proxyPassword**: `string`

#### Inherited from

Omit.proxyPassword

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4382

___

### proxyPort

 `Optional` **proxyPort**: `number`

#### Inherited from

Omit.proxyPort

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4380

___

### proxyUsername

 `Optional` **proxyUsername**: `string`

#### Inherited from

Omit.proxyUsername

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4381

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

Omit.rejectUnauthorized

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:543

docs-util/node_modules/@types/node/tls.d.ts:543

___

### secureContext

 `Optional` **secureContext**: [`SecureContext`](SecureContext.md)

An optional TLS context object from tls.createSecureContext()

#### Inherited from

Omit.secureContext

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:509

docs-util/node_modules/@types/node/tls.d.ts:509

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

Omit.secureProtocol

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:948

docs-util/node_modules/@types/node/tls.d.ts:948

___

### serverApi

 `Optional` **serverApi**: [`ServerApi`](ServerApi.md)

#### Inherited from

Omit.serverApi

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2118

___

### servername

 `Optional` **servername**: `string`

#### Inherited from

Omit.servername

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:600

___

### session

 `Optional` **session**: [`Buffer`](../index.md#buffer)

An optional Buffer instance containing a TLS session.

#### Inherited from

Omit.session

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:601

docs-util/node_modules/@types/node/tls.d.ts:201

___

### socketTimeoutMS

 `Optional` **socketTimeoutMS**: `number`

#### Inherited from

Omit.socketTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2126

___

### tls

 **tls**: `boolean`

#### Inherited from

Omit.tls

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2122

___

### waitQueueTimeoutMS

 **waitQueueTimeoutMS**: `number`

The maximum amount of time operation execution should wait for a connection to become available. The default is 0 which means there is no limit.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2190
