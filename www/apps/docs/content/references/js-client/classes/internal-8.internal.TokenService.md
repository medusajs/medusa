---
displayed_sidebar: jsClientSidebar
---

# Class: TokenService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).TokenService

## Properties

### configModule\_

• `Protected` `Readonly` **configModule\_**: [`ConfigModule`](../modules/internal-8.md#configmodule)

#### Defined in

packages/medusa/dist/services/token.d.ts:9

___

### RESOLUTION\_KEY

▪ `Static` **RESOLUTION\_KEY**: `string`

#### Defined in

packages/medusa/dist/services/token.d.ts:8

## Methods

### signToken

▸ **signToken**(`data`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `object` \| [`Buffer`](../modules/internal-8.md#buffer) |
| `options?` | `SignOptions` |

#### Returns

`string`

#### Defined in

packages/medusa/dist/services/token.d.ts:12

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

packages/medusa/dist/services/token.d.ts:11
