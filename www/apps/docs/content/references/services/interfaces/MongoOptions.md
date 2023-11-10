# MongoOptions

Mongo Client Options

## Hierarchy

- [`Required`](../index.md#required)<[`Pick`](../index.md#pick)<[`MongoClientOptions`](MongoClientOptions.md), ``"autoEncryption"`` \| ``"connectTimeoutMS"`` \| ``"directConnection"`` \| ``"driverInfo"`` \| ``"forceServerObjectId"`` \| ``"minHeartbeatFrequencyMS"`` \| ``"heartbeatFrequencyMS"`` \| ``"keepAlive"`` \| ``"keepAliveInitialDelay"`` \| ``"localThresholdMS"`` \| ``"maxConnecting"`` \| ``"maxIdleTimeMS"`` \| ``"maxPoolSize"`` \| ``"minPoolSize"`` \| ``"monitorCommands"`` \| ``"noDelay"`` \| ``"pkFactory"`` \| ``"raw"`` \| ``"replicaSet"`` \| ``"retryReads"`` \| ``"retryWrites"`` \| ``"serverSelectionTimeoutMS"`` \| ``"socketTimeoutMS"`` \| ``"srvMaxHosts"`` \| ``"srvServiceName"`` \| ``"tlsAllowInvalidCertificates"`` \| ``"tlsAllowInvalidHostnames"`` \| ``"tlsInsecure"`` \| ``"waitQueueTimeoutMS"`` \| ``"zlibCompressionLevel"``\>\>

- [`SupportedNodeConnectionOptions`](../index.md#supportednodeconnectionoptions)

  ↳ **`MongoOptions`**

## Properties

### ALPNProtocols

 `Optional` **ALPNProtocols**: `string`[] \| `Uint8Array` \| `Uint8Array`[]

An array of strings or a Buffer naming possible ALPN protocols.
(Protocols should be ordered by their priority.)

#### Inherited from

SupportedNodeConnectionOptions.ALPNProtocols

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:526

docs-util/node_modules/@types/node/tls.d.ts:526

___

### appName

 `Optional` **appName**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4064

___

### autoEncrypter

 `Optional` **autoEncrypter**: [`AutoEncrypter`](AutoEncrypter.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4076

___

### autoEncryption

 **autoEncryption**: [`AutoEncryptionOptions`](AutoEncryptionOptions.md)

Optionally enable in-use auto encryption

**Remarks**

Automatic encryption is an enterprise only feature that only applies to operations on a collection. Automatic encryption is not supported for operations on a database or view, and operations that are not bypassed will result in error
 (see [libmongocrypt: Auto Encryption Allow-List](https://github.com/mongodb/specifications/blob/master/source/client-side-encryption/client-side-encryption.rst#libmongocrypt-auto-encryption-allow-list)). To bypass automatic encryption for all operations, set bypassAutoEncryption=true in AutoEncryptionOpts.

 Automatic encryption requires the authenticated user to have the [listCollections privilege action](https://www.mongodb.com/docs/manual/reference/command/listCollections/#dbcmd.listCollections).

 If a MongoClient with a limited connection pool size (i.e a non-zero maxPoolSize) is configured with AutoEncryptionOptions, a separate internal MongoClient is created if any of the following are true:
 - AutoEncryptionOptions.keyVaultClient is not passed.
 - AutoEncryptionOptions.bypassAutomaticEncryption is false.

If an internal MongoClient is created, it is configured with the same options as the parent MongoClient except minPoolSize is set to 0 and AutoEncryptionOptions is omitted.

#### Inherited from

Required.autoEncryption

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3784

___

### ca

 `Optional` **ca**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

Optionally override the trusted CA certificates. Default is to trust
the well-known CAs curated by Mozilla. Mozilla's CAs are completely
replaced when CAs are explicitly specified using this option.

#### Inherited from

SupportedNodeConnectionOptions.ca

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:817

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

SupportedNodeConnectionOptions.cert

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

SupportedNodeConnectionOptions.checkServerIdentity

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

SupportedNodeConnectionOptions.ciphers

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:843

docs-util/node_modules/@types/node/tls.d.ts:843

___

### compressors

 **compressors**: (``"none"`` \| ``"snappy"`` \| ``"zlib"`` \| ``"zstd"``)[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4072

___

### connectTimeoutMS

 **connectTimeoutMS**: `number`

The time in milliseconds to attempt a connection before timing out.

#### Inherited from

Required.connectTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3658

___

### credentials

 `Optional` **credentials**: [`MongoCredentials`](../classes/MongoCredentials.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4067

___

### crl

 `Optional` **crl**: `string` \| [`Buffer`](../index.md#buffer) \| (`string` \| [`Buffer`](../index.md#buffer))[]

PEM formatted CRLs (Certificate Revocation Lists).

#### Inherited from

SupportedNodeConnectionOptions.crl

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:851

docs-util/node_modules/@types/node/tls.d.ts:851

___

### dbName

 **dbName**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4074

___

### directConnection

 **directConnection**: `boolean`

Allow a driver to force a Single topology type with a connection string containing one host

#### Inherited from

Required.directConnection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3718

___

### driverInfo

 **driverInfo**: [`DriverInfo`](DriverInfo.md)

Allows a wrapping driver to amend the client metadata generated by the driver to include information about the wrapping driver

#### Inherited from

Required.driverInfo

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3786

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

SupportedNodeConnectionOptions.ecdhCurve

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:867

docs-util/node_modules/@types/node/tls.d.ts:867

___

### family

 `Optional` **family**: `number`

#### Inherited from

SupportedNodeConnectionOptions.family

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:59

___

### forceServerObjectId

 **forceServerObjectId**: `boolean`

Force server to assign `_id` values instead of driver

#### Inherited from

Required.forceServerObjectId

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3762

___

### heartbeatFrequencyMS

 **heartbeatFrequencyMS**: `number`

heartbeatFrequencyMS controls when the driver checks the state of the MongoDB deployment. Specify the interval (in milliseconds) between checks, counted from the end of the previous check until the beginning of the next one.

#### Inherited from

Required.heartbeatFrequencyMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3708

___

### hints

 `Optional` **hints**: `number`

#### Inherited from

SupportedNodeConnectionOptions.hints

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:58

___

### hosts

 **hosts**: [`HostAddress`](../classes/HostAddress.md)[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4065

___

### keepAlive

 **keepAlive**: `boolean`

TCP Connection keep alive enabled

#### Inherited from

Required.keepAlive

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3758

___

### keepAliveInitialDelay

 **keepAliveInitialDelay**: `number`

The number of milliseconds to wait before initiating keepAlive on the TCP socket

#### Inherited from

Required.keepAliveInitialDelay

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3760

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

SupportedNodeConnectionOptions.key

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:884

docs-util/node_modules/@types/node/tls.d.ts:884

___

### loadBalanced

 **loadBalanced**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4070

___

### localAddress

 `Optional` **localAddress**: `string`

#### Inherited from

SupportedNodeConnectionOptions.localAddress

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:56

___

### localPort

 `Optional` **localPort**: `number`

#### Inherited from

SupportedNodeConnectionOptions.localPort

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:57

___

### localThresholdMS

 **localThresholdMS**: `number`

The size (in milliseconds) of the latency window for selecting among multiple suitable MongoDB instances.

#### Inherited from

Required.localThresholdMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3704

___

### lookup

 `Optional` **lookup**: [`LookupFunction`](../index.md#lookupfunction)

#### Inherited from

SupportedNodeConnectionOptions.lookup

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:60

___

### maxConnecting

 **maxConnecting**: `number`

The maximum number of connections that may be in the process of being established concurrently by the connection pool.

#### Inherited from

Required.maxConnecting

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3680

___

### maxIdleTimeMS

 **maxIdleTimeMS**: `number`

The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed.

#### Inherited from

Required.maxIdleTimeMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3682

___

### maxPoolSize

 **maxPoolSize**: `number`

The maximum number of connections in the connection pool.

#### Inherited from

Required.maxPoolSize

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3676

___

### metadata

 **metadata**: [`ClientMetadata`](ClientMetadata.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4075

___

### minDHSize

 `Optional` **minDHSize**: `number`

#### Inherited from

SupportedNodeConnectionOptions.minDHSize

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:602

___

### minHeartbeatFrequencyMS

 **minHeartbeatFrequencyMS**: `number`

Sets the minimum heartbeat frequency. In the event that the driver has to frequently re-check a server's availability, it will wait at least this long since the previous check to avoid wasted effort.

#### Inherited from

Required.minHeartbeatFrequencyMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3710

___

### minPoolSize

 **minPoolSize**: `number`

The minimum number of connections in the connection pool.

#### Inherited from

Required.minPoolSize

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3678

___

### monitorCommands

 **monitorCommands**: `boolean`

Enable command monitoring for this client

#### Inherited from

Required.monitorCommands

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3766

___

### noDelay

 **noDelay**: `boolean`

TCP Connection no delay

#### Inherited from

Required.noDelay

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3756

___

### passphrase

 `Optional` **passphrase**: `string`

Shared passphrase used for a single private key and/or a PFX.

#### Inherited from

SupportedNodeConnectionOptions.passphrase

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

SupportedNodeConnectionOptions.pfx

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:930

docs-util/node_modules/@types/node/tls.d.ts:930

___

### pkFactory

 **pkFactory**: [`PkFactory`](PkFactory.md)

A primary key factory function for generation of custom `_id` keys

#### Inherited from

Required.pkFactory

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3764

___

### proxyHost

 `Optional` **proxyHost**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4077

___

### proxyPassword

 `Optional` **proxyPassword**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4080

___

### proxyPort

 `Optional` **proxyPort**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4078

___

### proxyUsername

 `Optional` **proxyUsername**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4079

___

### raw

 **raw**: `boolean`

Enabling the raw option will return a [Node.js Buffer](https://nodejs.org/api/buffer.html)
which is allocated using [allocUnsafe API](https://nodejs.org/api/buffer.html#static-method-bufferallocunsafesize).
See this section from the [Node.js Docs here](https://nodejs.org/api/buffer.html#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-unsafe)
for more detail about what "unsafe" refers to in this context.
If you need to maintain your own editable clone of the bytes returned for an extended life time of the process, it is recommended you allocate
your own buffer and clone the contents:

**Remarks**

Please note there is a known limitation where this option cannot be used at the MongoClient level (see [NODE-3946](https://jira.mongodb.org/browse/NODE-3946)).
It does correctly work at `Db`, `Collection`, and per operation the same as other BSON options work.

**Example**

```ts
const raw = await collection.findOne({}, { raw: true })
const myBuffer = Buffer.alloc(raw.byteLength)
myBuffer.set(raw, 0)
// Only save and use `myBuffer` beyond this point
```

#### Inherited from

Required.raw

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readConcern

 **readConcern**: [`ReadConcern`](../classes/ReadConcern.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4069

___

### readPreference

 **readPreference**: [`ReadPreference`](../classes/ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4068

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

SupportedNodeConnectionOptions.rejectUnauthorized

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:543

docs-util/node_modules/@types/node/tls.d.ts:543

___

### replicaSet

 **replicaSet**: `string`

Specifies the name of the replica set, if the mongod is a member of a replica set.

#### Inherited from

Required.replicaSet

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3638

___

### retryReads

 **retryReads**: `boolean`

Enables retryable reads.

#### Inherited from

Required.retryReads

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3714

___

### retryWrites

 **retryWrites**: `boolean`

Enable retryable writes.

#### Inherited from

Required.retryWrites

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3716

___

### secureContext

 `Optional` **secureContext**: [`SecureContext`](SecureContext.md)

An optional TLS context object from tls.createSecureContext()

#### Inherited from

SupportedNodeConnectionOptions.secureContext

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

SupportedNodeConnectionOptions.secureProtocol

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:948

docs-util/node_modules/@types/node/tls.d.ts:948

___

### serverApi

 **serverApi**: [`ServerApi`](ServerApi.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4071

___

### serverSelectionTimeoutMS

 **serverSelectionTimeoutMS**: `number`

Specifies how long (in milliseconds) to block for server selection before throwing an exception.

#### Inherited from

Required.serverSelectionTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3706

___

### servername

 `Optional` **servername**: `string`

#### Inherited from

SupportedNodeConnectionOptions.servername

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:600

___

### session

 `Optional` **session**: [`Buffer`](../index.md#buffer)

An optional Buffer instance containing a TLS session.

#### Inherited from

SupportedNodeConnectionOptions.session

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:601

docs-util/node_modules/@types/node/tls.d.ts:201

___

### socketTimeoutMS

 **socketTimeoutMS**: `number`

The time in milliseconds to attempt a send or receive on a socket before the attempt times out.

#### Inherited from

Required.socketTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3660

___

### srvHost

 `Optional` **srvHost**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4066

___

### srvMaxHosts

 **srvMaxHosts**: `number`

The maximum number of hosts to connect to when using an srv connection string, a setting of `0` means unlimited hosts

#### Inherited from

Required.srvMaxHosts

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3666

___

### srvServiceName

 **srvServiceName**: `string`

Modifies the srv URI to look like:

`_{srvServiceName}._tcp.{hostname}.{domainname}`

Querying this DNS URI is expected to respond with SRV records

#### Inherited from

Required.srvServiceName

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3674

___

### tls

 **tls**: `boolean`

# NOTE ABOUT TLS Options

If set TLS enabled, equivalent to setting the ssl option.

### Additional options:

|    nodejs option     | MongoDB equivalent                                       | type                                   |
|:---------------------|--------------------------------------------------------- |:---------------------------------------|
| `ca`                 | `sslCA`, `tlsCAFile`                                     | `string \| Buffer \| Buffer[]`         |
| `crl`                | `sslCRL`                                                 | `string \| Buffer \| Buffer[]`         |
| `cert`               | `sslCert`, `tlsCertificateFile`, `tlsCertificateKeyFile` | `string \| Buffer \| Buffer[]`         |
| `key`                | `sslKey`, `tlsCertificateKeyFile`                        | `string \| Buffer \| KeyObject[]`      |
| `passphrase`         | `sslPass`, `tlsCertificateKeyFilePassword`               | `string`                               |
| `rejectUnauthorized` | `sslValidate`                                            | `boolean`                              |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4098

___

### tlsAllowInvalidCertificates

 **tlsAllowInvalidCertificates**: `boolean`

Bypasses validation of the certificates presented by the mongod/mongos instance

#### Inherited from

Required.tlsAllowInvalidCertificates

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3652

___

### tlsAllowInvalidHostnames

 **tlsAllowInvalidHostnames**: `boolean`

Disables hostname validation of the certificate presented by the mongod/mongos instance.

#### Inherited from

Required.tlsAllowInvalidHostnames

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3654

___

### tlsInsecure

 **tlsInsecure**: `boolean`

Disables various certificate validations.

#### Inherited from

Required.tlsInsecure

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3656

___

### waitQueueTimeoutMS

 **waitQueueTimeoutMS**: `number`

The maximum time in milliseconds that a thread can wait for a connection to become available.

#### Inherited from

Required.waitQueueTimeoutMS

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3684

___

### writeConcern

 **writeConcern**: [`WriteConcern`](../classes/WriteConcern.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4073

___

### zlibCompressionLevel

 **zlibCompressionLevel**: ``0`` \| ``1`` \| ``2`` \| ``3`` \| ``4`` \| ``5`` \| ``6`` \| ``7`` \| ``8`` \| ``9``

An integer that specifies the compression level if using zlib for network compression.

#### Inherited from

Required.zlibCompressionLevel

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3664
