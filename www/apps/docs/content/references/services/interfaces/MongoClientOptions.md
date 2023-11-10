# MongoClientOptions

Describes all possible URI query options for the mongo client

**See**

https://www.mongodb.com/docs/manual/reference/connection-string

## Hierarchy

- [`BSONSerializeOptions`](BSONSerializeOptions.md)

- [`SupportedNodeConnectionOptions`](../index.md#supportednodeconnectionoptions)

  ↳ **`MongoClientOptions`**

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

The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3712

___

### auth

 `Optional` **auth**: [`Auth`](Auth.md)

The auth settings for when connection to server.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3696

___

### authMechanism

 `Optional` **authMechanism**: [`AuthMechanism`](../index.md#authmechanism-1)

Specify the authentication mechanism that MongoDB will use to authenticate the connection.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3700

___

### authMechanismProperties

 `Optional` **authMechanismProperties**: [`AuthMechanismProperties`](AuthMechanismProperties.md)

Specify properties for the specified authMechanism as a comma-separated list of colon-separated key-value pairs.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3702

___

### authSource

 `Optional` **authSource**: `string`

Specify the database name associated with the user’s credentials.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3698

___

### autoEncryption

 `Optional` **autoEncryption**: [`AutoEncryptionOptions`](AutoEncryptionOptions.md)

Optionally enable in-use auto encryption

**Remarks**

Automatic encryption is an enterprise only feature that only applies to operations on a collection. Automatic encryption is not supported for operations on a database or view, and operations that are not bypassed will result in error
 (see [libmongocrypt: Auto Encryption Allow-List](https://github.com/mongodb/specifications/blob/master/source/client-side-encryption/client-side-encryption.rst#libmongocrypt-auto-encryption-allow-list)). To bypass automatic encryption for all operations, set bypassAutoEncryption=true in AutoEncryptionOpts.

 Automatic encryption requires the authenticated user to have the [listCollections privilege action](https://www.mongodb.com/docs/manual/reference/command/listCollections/#dbcmd.listCollections).

 If a MongoClient with a limited connection pool size (i.e a non-zero maxPoolSize) is configured with AutoEncryptionOptions, a separate internal MongoClient is created if any of the following are true:
 - AutoEncryptionOptions.keyVaultClient is not passed.
 - AutoEncryptionOptions.bypassAutomaticEncryption is false.

If an internal MongoClient is created, it is configured with the same options as the parent MongoClient except minPoolSize is set to 0 and AutoEncryptionOptions is omitted.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3784

___

### bsonRegExp

 `Optional` **bsonRegExp**: `boolean`

return BSON regular expressions as BSONRegExp instances.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[bsonRegExp](BSONSerializeOptions.md#bsonregexp)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:335

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

### checkKeys

 `Optional` **checkKeys**: `boolean`

the serializer will check if keys are valid.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[checkKeys](BSONSerializeOptions.md#checkkeys)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:917

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

 `Optional` **compressors**: `string` \| (``"none"`` \| ``"snappy"`` \| ``"zlib"`` \| ``"zstd"``)[]

An array or comma-delimited string of compressors to enable network compression for communication between this client and a mongod/mongos instance.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3662

___

### connectTimeoutMS

 `Optional` **connectTimeoutMS**: `number`

The time in milliseconds to attempt a connection before timing out.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3658

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

### directConnection

 `Optional` **directConnection**: `boolean`

Allow a driver to force a Single topology type with a connection string containing one host

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3718

___

### driverInfo

 `Optional` **driverInfo**: [`DriverInfo`](DriverInfo.md)

Allows a wrapping driver to amend the client metadata generated by the driver to include information about the wrapping driver

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

### enableUtf8Validation

 `Optional` **enableUtf8Validation**: `boolean`

Enable utf8 validation when deserializing BSON documents.  Defaults to true.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[enableUtf8Validation](BSONSerializeOptions.md#enableutf8validation)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:716

___

### family

 `Optional` **family**: `number`

#### Inherited from

SupportedNodeConnectionOptions.family

#### Defined in

docs-util/node_modules/@types/node/net.d.ts:59

___

### fieldsAsRaw

 `Optional` **fieldsAsRaw**: [`Document`](Document.md)

allow to specify if there what fields we wish to return as unserialized raw buffer.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[fieldsAsRaw](BSONSerializeOptions.md#fieldsasraw)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:333

___

### forceServerObjectId

 `Optional` **forceServerObjectId**: `boolean`

Force server to assign `_id` values instead of driver

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3762

___

### heartbeatFrequencyMS

 `Optional` **heartbeatFrequencyMS**: `number`

heartbeatFrequencyMS controls when the driver checks the state of the MongoDB deployment. Specify the interval (in milliseconds) between checks, counted from the end of the previous check until the beginning of the next one.

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

### ignoreUndefined

 `Optional` **ignoreUndefined**: `boolean`

serialize will not emit undefined fields **(default:true)**

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[ignoreUndefined](BSONSerializeOptions.md#ignoreundefined)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:921

___

### journal

 `Optional` **journal**: `boolean`

The journal write concern

**Deprecated**

Please use the `writeConcern` option instead

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3735

___

### keepAlive

 `Optional` **keepAlive**: `boolean`

TCP Connection keep alive enabled

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3758

___

### keepAliveInitialDelay

 `Optional` **keepAliveInitialDelay**: `number`

The number of milliseconds to wait before initiating keepAlive on the TCP socket

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

 `Optional` **loadBalanced**: `boolean`

Instruct the driver it is connecting to a load balancer fronting a mongos like service

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3720

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

 `Optional` **localThresholdMS**: `number`

The size (in milliseconds) of the latency window for selecting among multiple suitable MongoDB instances.

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

 `Optional` **maxConnecting**: `number`

The maximum number of connections that may be in the process of being established concurrently by the connection pool.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3680

___

### maxIdleTimeMS

 `Optional` **maxIdleTimeMS**: `number`

The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3682

___

### maxPoolSize

 `Optional` **maxPoolSize**: `number`

The maximum number of connections in the connection pool.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3676

___

### maxStalenessSeconds

 `Optional` **maxStalenessSeconds**: `number`

Specifies, in seconds, how stale a secondary can be before the client stops using it for read operations.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3692

___

### minDHSize

 `Optional` **minDHSize**: `number`

#### Inherited from

SupportedNodeConnectionOptions.minDHSize

#### Defined in

docs-util/node_modules/@types/node/tls.d.ts:602

___

### minHeartbeatFrequencyMS

 `Optional` **minHeartbeatFrequencyMS**: `number`

Sets the minimum heartbeat frequency. In the event that the driver has to frequently re-check a server's availability, it will wait at least this long since the previous check to avoid wasted effort.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3710

___

### minPoolSize

 `Optional` **minPoolSize**: `number`

The minimum number of connections in the connection pool.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3678

___

### monitorCommands

 `Optional` **monitorCommands**: `boolean`

Enable command monitoring for this client

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3766

___

### noDelay

 `Optional` **noDelay**: `boolean`

TCP Connection no delay

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

 `Optional` **pkFactory**: [`PkFactory`](PkFactory.md)

A primary key factory function for generation of custom `_id` keys

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3764

___

### promoteBuffers

 `Optional` **promoteBuffers**: `boolean`

when deserializing a Binary will return it as a node.js Buffer instance.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteBuffers](BSONSerializeOptions.md#promotebuffers)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:329

___

### promoteLongs

 `Optional` **promoteLongs**: `boolean`

when deserializing a Long will fit it into a Number if it's smaller than 53 bits.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteLongs](BSONSerializeOptions.md#promotelongs)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:327

___

### promoteValues

 `Optional` **promoteValues**: `boolean`

when deserializing will promote BSON values to their Node.js closest equivalent types.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[promoteValues](BSONSerializeOptions.md#promotevalues)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:331

___

### proxyHost

 `Optional` **proxyHost**: `string`

Configures a Socks5 proxy host used for creating TCP connections.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3788

___

### proxyPassword

 `Optional` **proxyPassword**: `string`

Configures a Socks5 proxy password when the proxy in proxyHost requires username/password authentication.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3794

___

### proxyPort

 `Optional` **proxyPort**: `number`

Configures a Socks5 proxy port used for creating TCP connections.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3790

___

### proxyUsername

 `Optional` **proxyUsername**: `string`

Configures a Socks5 proxy username when the proxy in proxyHost requires username/password authentication.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3792

___

### raw

 `Optional` **raw**: `boolean`

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

[BSONSerializeOptions](BSONSerializeOptions.md).[raw](BSONSerializeOptions.md#raw)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:714

___

### readConcern

 `Optional` **readConcern**: [`ReadConcernLike`](../index.md#readconcernlike)

Specify a read concern for the collection (only MongoDB 3.2 or higher supported)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3686

___

### readConcernLevel

 `Optional` **readConcernLevel**: [`ReadConcernLevel`](../index.md#readconcernlevel-1)

The level of isolation

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3688

___

### readPreference

 `Optional` **readPreference**: [`ReadPreference`](../classes/ReadPreference.md) \| [`ReadPreferenceMode`](../index.md#readpreferencemode-1)

Specifies the read preferences for this connection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3690

___

### readPreferenceTags

 `Optional` **readPreferenceTags**: [`TagSet`](../index.md#tagset)[]

Specifies the tags document as a comma-separated list of colon-separated key-value pairs.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3694

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

 `Optional` **replicaSet**: `string`

Specifies the name of the replica set, if the mongod is a member of a replica set.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3638

___

### retryReads

 `Optional` **retryReads**: `boolean`

Enables retryable reads.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3714

___

### retryWrites

 `Optional` **retryWrites**: `boolean`

Enable retryable writes.

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

### serializeFunctions

 `Optional` **serializeFunctions**: `boolean`

serialize the javascript functions **(default:false)**.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[serializeFunctions](BSONSerializeOptions.md#serializefunctions)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:919

___

### serverApi

 `Optional` **serverApi**: ``"1"`` \| [`ServerApi`](ServerApi.md)

Server API version

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3768

___

### serverSelectionTimeoutMS

 `Optional` **serverSelectionTimeoutMS**: `number`

Specifies how long (in milliseconds) to block for server selection before throwing an exception.

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

 `Optional` **socketTimeoutMS**: `number`

The time in milliseconds to attempt a send or receive on a socket before the attempt times out.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3660

___

### srvMaxHosts

 `Optional` **srvMaxHosts**: `number`

The maximum number of hosts to connect to when using an srv connection string, a setting of `0` means unlimited hosts

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3666

___

### srvServiceName

 `Optional` **srvServiceName**: `string`

Modifies the srv URI to look like:

`_{srvServiceName}._tcp.{hostname}.{domainname}`

Querying this DNS URI is expected to respond with SRV records

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3674

___

### ssl

 `Optional` **ssl**: `boolean`

A boolean to enable or disables TLS/SSL for the connection. (The ssl option is equivalent to the tls option.)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3642

___

### sslCA

 `Optional` **sslCA**: `string`

SSL Certificate file path.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3746

___

### sslCRL

 `Optional` **sslCRL**: `string`

SSL Certificate revocation list file path.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3754

___

### sslCert

 `Optional` **sslCert**: `string`

SSL Certificate file path.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3748

___

### sslKey

 `Optional` **sslKey**: `string`

SSL Key file file path.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3750

___

### sslPass

 `Optional` **sslPass**: `string`

SSL Certificate pass phrase.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3752

___

### sslValidate

 `Optional` **sslValidate**: `boolean`

Validate mongod server certificate against Certificate Authority

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3744

___

### tls

 `Optional` **tls**: `boolean`

Enables or disables TLS/SSL for the connection.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3640

___

### tlsAllowInvalidCertificates

 `Optional` **tlsAllowInvalidCertificates**: `boolean`

Bypasses validation of the certificates presented by the mongod/mongos instance

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3652

___

### tlsAllowInvalidHostnames

 `Optional` **tlsAllowInvalidHostnames**: `boolean`

Disables hostname validation of the certificate presented by the mongod/mongos instance.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3654

___

### tlsCAFile

 `Optional` **tlsCAFile**: `string`

Specifies the location of a local .pem file that contains the root certificate chain from the Certificate Authority. This file is used to validate the certificate presented by the mongod/mongos instance.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3650

___

### tlsCertificateFile

 `Optional` **tlsCertificateFile**: `string`

Specifies the location of a local TLS Certificate

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3644

___

### tlsCertificateKeyFile

 `Optional` **tlsCertificateKeyFile**: `string`

Specifies the location of a local .pem file that contains either the client's TLS/SSL certificate and key or only the client's TLS/SSL key when tlsCertificateFile is used to provide the certificate.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3646

___

### tlsCertificateKeyFilePassword

 `Optional` **tlsCertificateKeyFilePassword**: `string`

Specifies the password to de-crypt the tlsCertificateKeyFile.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3648

___

### tlsInsecure

 `Optional` **tlsInsecure**: `boolean`

Disables various certificate validations.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3656

___

### useBigInt64

 `Optional` **useBigInt64**: `boolean`

when deserializing a Long will return as a BigInt.

#### Inherited from

[BSONSerializeOptions](BSONSerializeOptions.md).[useBigInt64](BSONSerializeOptions.md#usebigint64)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:325

___

### w

 `Optional` **w**: [`W`](../index.md#w)

The write concern w value

**Deprecated**

Please use the `writeConcern` option instead

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3725

___

### waitQueueTimeoutMS

 `Optional` **waitQueueTimeoutMS**: `number`

The maximum time in milliseconds that a thread can wait for a connection to become available.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3684

___

### writeConcern

 `Optional` **writeConcern**: [`WriteConcern`](../classes/WriteConcern.md) \| [`WriteConcernSettings`](WriteConcernSettings.md)

A MongoDB WriteConcern, which describes the level of acknowledgement
requested from MongoDB for write operations.

**See**

https://www.mongodb.com/docs/manual/reference/write-concern/

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3742

___

### wtimeoutMS

 `Optional` **wtimeoutMS**: `number`

The write concern timeout

**Deprecated**

Please use the `writeConcern` option instead

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3730

___

### zlibCompressionLevel

 `Optional` **zlibCompressionLevel**: ``0`` \| ``1`` \| ``2`` \| ``3`` \| ``4`` \| ``5`` \| ``6`` \| ``7`` \| ``8`` \| ``9``

An integer that specifies the compression level if using zlib for network compression.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3664
