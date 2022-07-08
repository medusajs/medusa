# Class: AdminUsersResource

## Hierarchy

- `default`

  ↳ **`AdminUsersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

**`description`** creates a user with the provided information

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminCreateUserPayload`](../modules/internal.md#admincreateuserpayload) | user creation request body |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

created user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:61](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L61)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** deletes a user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to be deleted |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

delete response

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:88](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L88)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUsersListRes`](../modules/internal.md#adminuserslistres)\>

**`description`** lists all users

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUsersListRes`](../modules/internal.md#adminuserslistres)\>

a list of all users

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:97](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L97)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

**`description`** resets the users password given the correct token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordRequest`](internal.AdminResetPasswordRequest.md) | reset password information. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:36](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

Retrieves a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

the user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:50](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L50)

___

### sendResetPasswordToken

▸ **sendResetPasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

**`description`** resets password by re-sending password token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordTokenRequest`](internal.AdminResetPasswordTokenRequest.md) | payload for generating reset-password token. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:22](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L22)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

**`description`** updates a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to update |
| `payload` | [`AdminUpdateUserPayload`](../modules/internal.md#adminupdateuserpayload) | user update request body |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal.md#adminuserres)\>

the updated user

#### Defined in

[packages/medusa-js/src/resources/admin/users.ts:73](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/users.ts#L73)
