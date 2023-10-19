---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Type Aliases

### AdminCreateUserPayload

Ƭ **AdminCreateUserPayload**: [`Omit`](internal-1.md#omit)<[`AdminCreateUserRequest`](../classes/internal-8.internal.AdminCreateUserRequest.md), ``"role"``\> \| { `role?`: [`CreateUserRoles`](internal-11.md#createuserroles)  }

#### Defined in

[packages/medusa-js/src/typings.ts:31](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L31)

___

### AdminUpdateUserPayload

Ƭ **AdminUpdateUserPayload**: [`Omit`](internal-1.md#omit)<[`AdminUpdateUserRequest`](../classes/internal-8.internal.AdminUpdateUserRequest.md), ``"role"``\> & { `role?`: [`UpdateUserRoles`](internal-11.md#updateuserroles)  }

#### Defined in

[packages/medusa-js/src/typings.ts:41](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L41)

___

### CreateUserRoles

Ƭ **CreateUserRoles**: \`${CreateUserRolesEnum}\`

#### Defined in

[packages/medusa-js/src/typings.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L28)

___

### CreateUserRolesEnum

Ƭ **CreateUserRolesEnum**: [`NoUndefined`](internal-11.md#noundefined)<[`AdminCreateUserRequest`](../classes/internal-8.internal.AdminCreateUserRequest.md)[``"role"``]\>

#### Defined in

[packages/medusa-js/src/typings.ts:25](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L25)

___

### NoUndefined

Ƭ **NoUndefined**<`T`\>: `T` extends `undefined` ? `never` : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/medusa-js/src/typings.ts:23](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L23)

___

### UpdateUserRoles

Ƭ **UpdateUserRoles**: \`${UpdateUserRolesEnum}\`

#### Defined in

[packages/medusa-js/src/typings.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L39)

___

### UpdateUserRolesEnum

Ƭ **UpdateUserRolesEnum**: [`NoUndefined`](internal-11.md#noundefined)<[`AdminUpdateUserRequest`](../classes/internal-8.internal.AdminUpdateUserRequest.md)[``"role"``]\>

#### Defined in

[packages/medusa-js/src/typings.ts:37](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L37)
