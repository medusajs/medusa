---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Enumerations

- [UserRoles](../enums/internal-1.UserRoles.md)

## Classes

- [AdminPostAuthReq](../classes/internal-1.AdminPostAuthReq.md)
- [BaseEntity](../classes/internal-1.BaseEntity.md)
- [SoftDeletableEntity](../classes/internal-1.SoftDeletableEntity.md)
- [User](../classes/internal-1.User.md)

## Type Aliases

### AdminAuthRes

Ƭ **AdminAuthRes**: `Object`

**`Schema`**

AdminAuthRes
type: object
required:
  - user
properties:
  user:
    description: User details.
    $ref: "#/components/schemas/User"

#### Type declaration

| Name | Type |
| :------ | :------ |
| `user` | [`Omit`](internal-1.md#omit)<[`User`](../classes/internal-1.User.md), ``"password_hash"``\> |

#### Defined in

packages/medusa/dist/api/routes/admin/auth/index.d.ts:14

___

### AdminBearerAuthRes

Ƭ **AdminBearerAuthRes**: `Object`

**`Schema`**

AdminBearerAuthRes
type: object
properties:
  accessToken:
    description: Access token for subsequent authorization.
    type: string

#### Type declaration

| Name | Type |
| :------ | :------ |
| `access_token` | `string` |

#### Defined in

packages/medusa/dist/api/routes/admin/auth/index.d.ts:25

___

### Exclude

Ƭ **Exclude**<`T`, `U`\>: `T` extends `U` ? `never` : `T`

Exclude from T those types that are assignable to U

#### Type parameters

| Name |
| :------ |
| `T` |
| `U` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1606

___

### Omit

Ƭ **Omit**<`T`, `K`\>: [`Pick`](internal-1.md#pick)<`T`, [`Exclude`](internal-1.md#exclude)<keyof `T`, `K`\>\>

Construct a type with the properties of T except for those in type K.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `any` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1616

___

### Pick

Ƭ **Pick**<`T`, `K`\>: { [P in K]: T[P] }

From T, pick a set of properties whose keys are in the union K

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `T` |

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1592
