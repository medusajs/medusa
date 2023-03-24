# Class: TokenService

## Constructors

### constructor

• **new TokenService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Defined in

[packages/medusa/src/services/token.ts:16](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/token.ts#L16)

## Properties

### configModule\_

• `Protected` `Readonly` **configModule\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/token.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/token.ts#L14)

___

### RESOLUTION\_KEY

▪ `Static` **RESOLUTION\_KEY**: `string`

#### Defined in

[packages/medusa/src/services/token.ts:12](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/token.ts#L12)

## Methods

### signToken

▸ **signToken**(`data`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `object` \| `Buffer` |
| `options?` | `SignOptions` |

#### Returns

`string`

#### Defined in

[packages/medusa/src/services/token.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/token.ts#L34)

___

### verifyToken

▸ **verifyToken**(`token`, `options?`): `string` \| `Jwt` \| `JwtPayload`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |
| `options?` | `VerifyOptions` |

#### Returns

`string` \| `Jwt` \| `JwtPayload`

#### Defined in

[packages/medusa/src/services/token.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/token.ts#L20)
