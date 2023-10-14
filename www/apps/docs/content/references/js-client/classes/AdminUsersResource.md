---
displayed_sidebar: jsClientSidebar
---

# Class: AdminUsersResource

## Hierarchy

- `default`

  ↳ **`AdminUsersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminCreateUserPayload`](../modules/internal-11.md#admincreateuserpayload) | user creation request body |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

created user

**`Description`**

creates a user with the provided information

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:64](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L64)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to be deleted |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

delete response

**`Description`**

deletes a user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:94](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L94)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUsersListRes`](../modules/internal-8.internal.md#adminuserslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUsersListRes`](../modules/internal-8.internal.md#adminuserslistres)\>

a list of all users

**`Description`**

lists all users

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:106](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L106)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordRequest`](internal-8.internal.AdminResetPasswordRequest.md) | reset password information. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

**`Description`**

resets the users password given the correct token.

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

Retrieves a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

the user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L50)

___

### sendResetPasswordToken

▸ **sendResetPasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordTokenRequest`](internal-8.internal.AdminResetPasswordTokenRequest.md) | payload for generating reset-password token. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`void`\>

**`Description`**

resets password by re-sending password token.

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:22](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L22)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to update |
| `payload` | [`AdminUpdateUserPayload`](../modules/internal-11.md#adminupdateuserpayload) | user update request body |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminUserRes`](../modules/internal-8.internal.md#adminuserres)\>

the updated user

**`Description`**

updates a given user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:79](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/users.ts#L79)
