# Namespace: internal

## Classes

- [AdminCreateUserRequest](../classes/internal-32.AdminCreateUserRequest.md)
- [AdminResetPasswordRequest](../classes/internal-32.AdminResetPasswordRequest.md)
- [AdminResetPasswordTokenRequest](../classes/internal-32.AdminResetPasswordTokenRequest.md)
- [AdminUpdateUserRequest](../classes/internal-32.AdminUpdateUserRequest.md)

## Type Aliases

### AdminCreateUserPayload

Ƭ **AdminCreateUserPayload**: `Omit`<[`AdminCreateUserRequest`](../classes/internal-32.AdminCreateUserRequest.md), ``"role"``\> \| { `role?`: [`CreateUserRoles`](internal-32.md#createuserroles)  }

#### Defined in

[medusa-js/src/typings.ts:31](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L31)

___

### AdminUpdateUserPayload

Ƭ **AdminUpdateUserPayload**: `Omit`<[`AdminUpdateUserRequest`](../classes/internal-32.AdminUpdateUserRequest.md), ``"role"``\> & { `role?`: [`UpdateUserRoles`](internal-32.md#updateuserroles)  }

#### Defined in

[medusa-js/src/typings.ts:41](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L41)

___

### AdminUserRes

Ƭ **AdminUserRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `user` | `Omit`<[`User`](../classes/internal-1.User.md), ``"password_hash"``\> |

#### Defined in

medusa/dist/api/routes/admin/users/index.d.ts:6

___

### AdminUsersListRes

Ƭ **AdminUsersListRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `users` | `Omit`<[`User`](../classes/internal-1.User.md), ``"password_hash"``\>[] |

#### Defined in

medusa/dist/api/routes/admin/users/index.d.ts:9

___

### CreateUserRoles

Ƭ **CreateUserRoles**: \`${CreateUserRolesEnum}\`

#### Defined in

[medusa-js/src/typings.ts:28](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L28)

___

### CreateUserRolesEnum

Ƭ **CreateUserRolesEnum**: [`NoUndefined`](internal-32.md#noundefined)<[`AdminCreateUserRequest`](../classes/internal-32.AdminCreateUserRequest.md)[``"role"``]\>

#### Defined in

[medusa-js/src/typings.ts:25](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L25)

___

### NoUndefined

Ƭ **NoUndefined**<`T`\>: `T` extends `undefined` ? `never` : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[medusa-js/src/typings.ts:23](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L23)

___

### UpdateUserRoles

Ƭ **UpdateUserRoles**: \`${UpdateUserRolesEnum}\`

#### Defined in

[medusa-js/src/typings.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L39)

___

### UpdateUserRolesEnum

Ƭ **UpdateUserRolesEnum**: [`NoUndefined`](internal-32.md#noundefined)<[`AdminUpdateUserRequest`](../classes/internal-32.AdminUpdateUserRequest.md)[``"role"``]\>

#### Defined in

[medusa-js/src/typings.ts:37](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L37)
