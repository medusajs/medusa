# KeyObject

Node.js uses a `KeyObject` class to represent a symmetric or asymmetric key,
and each kind of key exposes different functions. The createSecretKey, createPublicKey and createPrivateKey methods are used to create `KeyObject`instances. `KeyObject`
objects are not to be created directly using the `new`keyword.

Most applications should consider using the new `KeyObject` API instead of
passing keys as strings or `Buffer`s due to improved security features.

`KeyObject` instances can be passed to other threads via `postMessage()`.
The receiver obtains a cloned `KeyObject`, and the `KeyObject` does not need to
be listed in the `transferList` argument.

**Since**

v11.6.0

## Constructors

### constructor

`Private` **new KeyObject**()

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:555

## Properties

### asymmetricKeyDetails

 `Optional` **asymmetricKeyDetails**: [`AsymmetricKeyDetails`](../interfaces/AsymmetricKeyDetails.md)

This property exists only on asymmetric keys. Depending on the type of the key,
this object contains information about the key. None of the information obtained
through this property can be used to uniquely identify a key or to compromise
the security of the key.

For RSA-PSS keys, if the key material contains a `RSASSA-PSS-params` sequence,
the `hashAlgorithm`, `mgf1HashAlgorithm`, and `saltLength` properties will be
set.

Other key details might be exposed via this API using additional attributes.

**Since**

v15.7.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:613

___

### asymmetricKeySize

 `Optional` **asymmetricKeySize**: `number`

For asymmetric keys, this property represents the size of the embedded key in
bytes. This property is `undefined` for symmetric keys.

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:599

___

### asymmetricKeyType

 `Optional` **asymmetricKeyType**: [`KeyType`](../index.md#keytype)

For asymmetric keys, this property represents the type of the key. Supported key
types are:

* `'rsa'` (OID 1.2.840.113549.1.1.1)
* `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
* `'dsa'` (OID 1.2.840.10040.4.1)
* `'ec'` (OID 1.2.840.10045.2.1)
* `'x25519'` (OID 1.3.101.110)
* `'x448'` (OID 1.3.101.111)
* `'ed25519'` (OID 1.3.101.112)
* `'ed448'` (OID 1.3.101.113)
* `'dh'` (OID 1.2.840.113549.1.3.1)

This property is `undefined` for unrecognized `KeyObject` types and symmetric
keys.

**Since**

v11.6.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:594

___

### symmetricKeySize

 `Optional` **symmetricKeySize**: `number`

For secret keys, this property represents the size of the key in bytes. This
property is `undefined` for asymmetric keys.

**Since**

v11.6.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:645

___

### type

 **type**: [`KeyObjectType`](../index.md#keyobjecttype)

Depending on the type of this `KeyObject`, this property is either`'secret'` for secret (symmetric) keys, `'public'` for public (asymmetric) keys
or `'private'` for private (asymmetric) keys.

**Since**

v11.6.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:651

## Methods

### export

**export**(`options`): `string` \| [`Buffer`](../index.md#buffer)

For symmetric keys, the following encoding options can be used:

For public keys, the following encoding options can be used:

For private keys, the following encoding options can be used:

The result type depends on the selected encoding format, when PEM the
result is a string, when DER it will be a buffer containing the data
encoded as DER, when [JWK](https://tools.ietf.org/html/rfc7517) it will be an object.

When [JWK](https://tools.ietf.org/html/rfc7517) encoding format was selected, all other encoding options are
ignored.

PKCS#1, SEC1, and PKCS#8 type keys can be encrypted by using a combination of
the `cipher` and `format` options. The PKCS#8 `type` can be used with any`format` to encrypt any key algorithm (RSA, EC, or DH) by specifying a`cipher`. PKCS#1 and SEC1 can only be
encrypted by specifying a `cipher`when the PEM `format` is used. For maximum compatibility, use PKCS#8 for
encrypted private keys. Since PKCS#8 defines its own
encryption mechanism, PEM-level encryption is not supported when encrypting
a PKCS#8 key. See [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) for PKCS#8 encryption and [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) for
PKCS#1 and SEC1 encryption.

#### Parameters

| Name |
| :------ |
| `options` | [`KeyExportOptions`](../interfaces/KeyExportOptions.md)<``"pem"``\> |

#### Returns

`string` \| [`Buffer`](../index.md#buffer)

-`string \| Buffer`: (optional) 

**Since**

v11.6.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:637

**export**(`options?`): [`Buffer`](../index.md#buffer)

#### Parameters

| Name |
| :------ |
| `options?` | [`KeyExportOptions`](../interfaces/KeyExportOptions.md)<``"der"``\> |

#### Returns

[`Buffer`](../index.md#buffer)

-`Buffer`: 

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:638

**export**(`options?`): [`JsonWebKey`](../interfaces/JsonWebKey.md)

#### Parameters

| Name |
| :------ |
| `options?` | [`JwkKeyExportOptions`](../interfaces/JwkKeyExportOptions.md) |

#### Returns

[`JsonWebKey`](../interfaces/JsonWebKey.md)

-`crv`: (optional) 
-`d`: (optional) 
-`dp`: (optional) 
-`dq`: (optional) 
-`e`: (optional) 
-`k`: (optional) 
-`kty`: (optional) 
-`n`: (optional) 
-`p`: (optional) 
-`q`: (optional) 
-`qi`: (optional) 
-`x`: (optional) 
-`y`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:639

___

### from

`Static` **from**(`key`): [`KeyObject`](KeyObject.md)

Example: Converting a `CryptoKey` instance to a `KeyObject`:

```js
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Prints: 32 (symmetric key size in bytes)
```

#### Parameters

| Name |
| :------ |
| `key` | [`CryptoKey`](../interfaces/CryptoKey.md) |

#### Returns

[`KeyObject`](KeyObject.md)

-`KeyObject`: 

**Since**

v15.0.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:575
