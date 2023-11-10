# VerifyOptions

## Properties

### algorithms

 `Optional` **algorithms**: [`Algorithm`](../index.md#algorithm)[]

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:71

___

### audience

 `Optional` **audience**: `string` \| `RegExp` \| (`string` \| `RegExp`)[]

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:72

___

### clockTimestamp

 `Optional` **clockTimestamp**: `number`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:73

___

### clockTolerance

 `Optional` **clockTolerance**: `number`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:74

___

### complete

 `Optional` **complete**: `boolean`

return an object with the decoded `{ payload, header, signature }` instead of only the usual content of the payload.

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:76

___

### ignoreExpiration

 `Optional` **ignoreExpiration**: `boolean`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:78

___

### ignoreNotBefore

 `Optional` **ignoreNotBefore**: `boolean`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:79

___

### issuer

 `Optional` **issuer**: `string` \| `string`[]

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:77

___

### jwtid

 `Optional` **jwtid**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:80

___

### maxAge

 `Optional` **maxAge**: `string` \| `number`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:87

___

### nonce

 `Optional` **nonce**: `string`

If you want to check `nonce` claim, provide a string value here.
It is used on Open ID for the ID Tokens. ([Open ID implementation notes](https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes))

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:85

___

### subject

 `Optional` **subject**: `string`

#### Defined in

node_modules/@types/jsonwebtoken/index.d.ts:86
