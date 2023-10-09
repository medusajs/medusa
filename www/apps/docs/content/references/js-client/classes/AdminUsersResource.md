# Class: AdminUsersResource

## Hierarchy

- `default`

  ↳ **`AdminUsersResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminUserRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminCreateUserPayload` | user creation request body |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminUserRes`\>

created user

**`Description`**

creates a user with the provided information

#### Defined in

[admin/users.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L64)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to be deleted |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

delete response

**`Description`**

deletes a user

#### Defined in

[admin/users.ts:94](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L94)

___

### list

▸ **list**(`customHeaders?`): `ResponsePromise`<`AdminUsersListRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminUsersListRes`\>

a list of all users

**`Description`**

lists all users

#### Defined in

[admin/users.ts:106](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L106)

___

### resetPassword

▸ **resetPassword**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminUserRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminResetPasswordRequest` | reset password information. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminUserRes`\>

**`Description`**

resets the users password given the correct token.

#### Defined in

[admin/users.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminUserRes`\>

Retrieves a given user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminUserRes`\>

the user

#### Defined in

[admin/users.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L50)

___

### sendResetPasswordToken

▸ **sendResetPasswordToken**(`payload`, `customHeaders?`): `ResponsePromise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `AdminResetPasswordTokenRequest` | payload for generating reset-password token. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`void`\>

**`Description`**

resets password by re-sending password token.

#### Defined in

[admin/users.ts:22](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L22)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminUserRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the user to update |
| `payload` | `AdminUpdateUserPayload` | user update request body |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminUserRes`\>

the updated user

**`Description`**

updates a given user

#### Defined in

[admin/users.ts:79](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/users.ts#L79)
