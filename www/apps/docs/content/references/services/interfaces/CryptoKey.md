# CryptoKey

**Since**

v15.0.0

## Properties

### algorithm

 `Readonly` **algorithm**: [`KeyAlgorithm`](KeyAlgorithm.md)

An object detailing the algorithm for which the key can be used along with additional algorithm-specific parameters.

**Since**

v15.0.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:4094

___

### extractable

 `Readonly` **extractable**: `boolean`

When `true`, the [CryptoKey](CryptoKey.md) can be extracted using either `subtleCrypto.exportKey()` or `subtleCrypto.wrapKey()`.

**Since**

v15.0.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:4099

___

### type

 `Readonly` **type**: [`KeyType`](../types/KeyType-1.md)

A string identifying whether the key is a symmetric (`'secret'`) or asymmetric (`'private'` or `'public'`) key.

**Since**

v15.0.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:4104

___

### usages

 `Readonly` **usages**: [`KeyUsage`](../types/KeyUsage.md)[]

An array of strings identifying the operations for which the key may be used.

The possible usages are:
- `'encrypt'` - The key may be used to encrypt data.
- `'decrypt'` - The key may be used to decrypt data.
- `'sign'` - The key may be used to generate digital signatures.
- `'verify'` - The key may be used to verify digital signatures.
- `'deriveKey'` - The key may be used to derive a new key.
- `'deriveBits'` - The key may be used to derive bits.
- `'wrapKey'` - The key may be used to wrap another key.
- `'unwrapKey'` - The key may be used to unwrap another key.

Valid key usages depend on the key algorithm (identified by `cryptokey.algorithm.name`).

**Since**

v15.0.0

#### Defined in

docs-util/node_modules/@types/node/crypto.d.ts:4121
