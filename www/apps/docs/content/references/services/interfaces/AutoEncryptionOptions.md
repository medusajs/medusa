# AutoEncryptionOptions

## Properties

### bypassAutoEncryption

 `Optional` **bypassAutoEncryption**: `boolean`

Allows the user to bypass auto encryption, maintaining implicit decryption

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:576

___

### bypassQueryAnalysis

 `Optional` **bypassQueryAnalysis**: `boolean`

Public Technical Preview: Allows users to bypass query analysis

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:578

___

### encryptedFieldsMap

 `Optional` **encryptedFieldsMap**: [`Document`](Document.md)

Public Technical Preview: Supply a schema for the encrypted fields in the document

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:574

___

### extraOptions

 `Optional` **extraOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cryptSharedLibPath?` | `string` | Full path to a MongoDB Crypt shared library to be used (instead of mongocryptd). This needs to be the path to the file itself, not a directory. It can be an absolute or relative path. If the path is relative and its first component is `$ORIGIN`, it will be replaced by the directory containing the mongodb-client-encryption native addon file. Otherwise, the path will be interpreted relative to the current working directory. Currently, loading different MongoDB Crypt shared library files from different MongoClients in the same process is not supported. If this option is provided and no MongoDB Crypt shared library could be loaded from the specified location, creating the MongoClient will fail. If this option is not provided and `cryptSharedLibRequired` is not specified, the AutoEncrypter will attempt to spawn and/or use mongocryptd according to the mongocryptd-specific `extraOptions` options. Specifying a path prevents mongocryptd from being used as a fallback. Requires the MongoDB Crypt shared library, available in MongoDB 6.0 or higher. |
| `cryptSharedLibRequired?` | `boolean` | If specified, never use mongocryptd and instead fail when the MongoDB Crypt shared library could not be loaded. This is always true when `cryptSharedLibPath` is specified. Requires the MongoDB Crypt shared library, available in MongoDB 6.0 or higher. |
| `mongocryptdBypassSpawn?` | `boolean` | If true, autoEncryption will not attempt to spawn a mongocryptd before connecting |
| `mongocryptdSpawnArgs?` | `string`[] | Command line arguments to use when auto-spawning a mongocryptd |
| `mongocryptdSpawnPath?` | `string` | The path to the mongocryptd executable on the system |
| `mongocryptdURI?` | `string` | A local process the driver communicates with to determine how to encrypt values in a command. Defaults to "mongodb://%2Fvar%2Fmongocryptd.sock" if domain sockets are available or "mongodb://localhost:27020" otherwise |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:583

___

### keyVaultClient

 `Optional` **keyVaultClient**: [`MongoClient`](../classes/MongoClient.md)

A `MongoClient` used to fetch keys from a key vault

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:489

___

### keyVaultNamespace

 `Optional` **keyVaultNamespace**: `string`

The namespace where keys are stored in the key vault

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:491

___

### kmsProviders

 `Optional` **kmsProviders**: `Object`

Configuration options that are used by specific KMS providers during key generation, encryption, and decryption.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `aws?` | Record<`string`, `never`\> \| { `accessKeyId`: `string` ; `secretAccessKey`: `string` ; `sessionToken?`: `string`  } | Configuration options for using 'aws' as your KMS provider |
| `azure?` | Record<`string`, `never`\> \| { `clientId`: `string` ; `clientSecret`: `string` ; `identityPlatformEndpoint?`: `string` ; `tenantId`: `string`  } \| { `accessToken`: `string`  } | Configuration options for using 'azure' as your KMS provider |
| `gcp?` | Record<`string`, `never`\> \| { `email`: `string` ; `endpoint?`: `string` ; `privateKey`: `string` \| [`Buffer`](../index.md#buffer)  } \| { `accessToken`: `string`  } | Configuration options for using 'gcp' as your KMS provider |
| `kmip?` | { `endpoint?`: `string`  } | Configuration options for using 'kmip' as your KMS provider |
| `kmip.endpoint?` | `string` | The output endpoint string. The endpoint consists of a hostname and port separated by a colon. E.g. "example.com:123". A port is always present. |
| `local?` | { `key`: `string` \| [`Buffer`](../index.md#buffer)  } | Configuration options for using 'local' as your KMS provider |
| `local.key` | `string` \| [`Buffer`](../index.md#buffer) | The master key used to encrypt/decrypt data keys. A 96-byte long Buffer or base64 encoded string. |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:493

___

### options

 `Optional` **options**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `logger?` | (`level`: [`AutoEncryptionLoggerLevel`](../index.md#autoencryptionloggerlevel-1), `message`: `string`) => `void` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:579

___

### proxyOptions

 `Optional` **proxyOptions**: [`ProxyOptions`](ProxyOptions.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:629

___

### schemaMap

 `Optional` **schemaMap**: [`Document`](Document.md)

A map of namespaces to a local JSON schema for encryption

**NOTE**: Supplying options.schemaMap provides more security than relying on JSON Schemas obtained from the server.
It protects against a malicious server advertising a false JSON Schema, which could trick the client into sending decrypted data that should be encrypted.
Schemas supplied in the schemaMap only apply to configuring automatic encryption for Client-Side Field Level Encryption.
Other validation rules in the JSON schema will not be enforced by the driver and will result in an error.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:572

___

### tlsOptions

 `Optional` **tlsOptions**: `Object`

The TLS options to use connecting to the KMS provider

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aws?` | [`AutoEncryptionTlsOptions`](AutoEncryptionTlsOptions.md) |
| `azure?` | [`AutoEncryptionTlsOptions`](AutoEncryptionTlsOptions.md) |
| `gcp?` | [`AutoEncryptionTlsOptions`](AutoEncryptionTlsOptions.md) |
| `kmip?` | [`AutoEncryptionTlsOptions`](AutoEncryptionTlsOptions.md) |
| `local?` | [`AutoEncryptionTlsOptions`](AutoEncryptionTlsOptions.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:631
