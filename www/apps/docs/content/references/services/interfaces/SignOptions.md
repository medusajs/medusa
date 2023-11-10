# SignOptions

## Properties

### algorithm

 `Optional` **algorithm**: [`Algorithm`](../index.md#algorithm)

Signature algorithm. Could be one of these values :
- HS256:    HMAC using SHA-256 hash algorithm (default)
- HS384:    HMAC using SHA-384 hash algorithm
- HS512:    HMAC using SHA-512 hash algorithm
- RS256:    RSASSA using SHA-256 hash algorithm
- RS384:    RSASSA using SHA-384 hash algorithm
- RS512:    RSASSA using SHA-512 hash algorithm
- ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
- ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
- ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
- none:     No digital signature or MAC value included

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:54

___

### audience

 `Optional` **audience**: `string` \| `string`[]

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:60

___

### encoding

 `Optional` **encoding**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:67

___

### expiresIn

 `Optional` **expiresIn**: `string` \| `number`

expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:57

___

### header

 `Optional` **header**: [`JwtHeader`](JwtHeader.md)

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:66

___

### issuer

 `Optional` **issuer**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:62

___

### jwtid

 `Optional` **jwtid**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:63

___

### keyid

 `Optional` **keyid**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:55

___

### mutatePayload

 `Optional` **mutatePayload**: `boolean`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:64

___

### noTimestamp

 `Optional` **noTimestamp**: `boolean`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:65

___

### notBefore

 `Optional` **notBefore**: `string` \| `number`

expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:59

___

### subject

 `Optional` **subject**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:61
