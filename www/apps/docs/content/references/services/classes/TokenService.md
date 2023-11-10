# TokenService

## Constructors

### constructor

**new TokenService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-41.md) |

#### Defined in

[packages/medusa/src/services/token.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/token.ts#L16)

## Properties

### configModule\_

 `Protected` `Readonly` **configModule\_**: [`ConfigModule`](../types/ConfigModule.md)

#### Defined in

[packages/medusa/src/services/token.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/token.ts#L14)

___

### RESOLUTION\_KEY

 `Static` **RESOLUTION\_KEY**: `string`

#### Defined in

[packages/medusa/src/services/token.ts:12](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/token.ts#L12)

## Methods

### signToken

**signToken**(`data`, `options?`): `string`

#### Parameters

| Name |
| :------ |
| `data` | `string` \| `object` \| [`Buffer`](../index.md#buffer) |
| `options?` | [`SignOptions`](../interfaces/SignOptions.md) |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/token.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/token.ts#L34)

___

### verifyToken

**verifyToken**(`token`, `options?`): `string` \| [`Jwt`](../interfaces/Jwt.md) \| [`JwtPayload`](../interfaces/JwtPayload.md)

#### Parameters

| Name |
| :------ |
| `token` | `string` |
| `options?` | [`VerifyOptions`](../interfaces/VerifyOptions.md) |

#### Returns

`string` \| [`Jwt`](../interfaces/Jwt.md) \| [`JwtPayload`](../interfaces/JwtPayload.md)

-`string \| Jwt \| JwtPayload`: (optional) 

#### Defined in

[packages/medusa/src/services/token.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/token.ts#L20)
