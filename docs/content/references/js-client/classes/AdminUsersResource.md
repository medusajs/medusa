# Class: AdminUsersResource

## Hierarchy

- `default`

  ↳ **`AdminUsersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

**`Description`**

creates a user with the provided information

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminCreateUserPayload`](../modules/internal-32.md#admincreateuserpayload) | user creation request body |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

created user

#### Defined in

[medusa-js/src/resources/admin/users.ts:64](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L64)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

deletes a user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to be deleted |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

delete response

#### Defined in

[medusa-js/src/resources/admin/users.ts:94](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L94)

___

### list

▸ **list**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUsersListRes`](../modules/internal-32.md#adminuserslistres)\>

**`Description`**

lists all users

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUsersListRes`](../modules/internal-32.md#adminuserslistres)\>

a list of all users

#### Defined in

[medusa-js/src/resources/admin/users.ts:106](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L106)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

**`Description`**

resets the users password given the correct token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordRequest`](internal-32.AdminResetPasswordRequest.md) | reset password information. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

#### Defined in

[medusa-js/src/resources/admin/users.ts:36](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

Retrieves a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

the user

#### Defined in

[medusa-js/src/resources/admin/users.ts:50](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L50)

___

### sendResetPasswordToken

▸ **sendResetPasswordToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

**`Description`**

resets password by re-sending password token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`AdminResetPasswordTokenRequest`](internal-32.AdminResetPasswordTokenRequest.md) | payload for generating reset-password token. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

#### Defined in

[medusa-js/src/resources/admin/users.ts:22](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L22)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

**`Description`**

updates a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to update |
| `payload` | [`AdminUpdateUserPayload`](../modules/internal-32.md#adminupdateuserpayload) | user update request body |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminUserRes`](../modules/internal-32.md#adminuserres)\>

the updated user

#### Defined in

[medusa-js/src/resources/admin/users.ts:79](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/users.ts#L79)
