# Class: AdminAuthResource

## Hierarchy

- `default`

  ↳ **`AdminAuthResource`**

## Methods

### createSession

▸ **createSession**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminAuthRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostAuthReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminAuthRes`\>

**`Description`**

Creates an authenticated session

#### Defined in

[admin/auth.ts:38](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/auth.ts#L38)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): `ResponsePromise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`void`\>

**`Description`**

destroys an authenticated session

#### Defined in

[admin/auth.ts:25](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/auth.ts#L25)

___

### getSession

▸ **getSession**(`customHeaders?`): `ResponsePromise`<`AdminAuthRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminAuthRes`\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Defined in

[admin/auth.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/auth.ts#L13)

___

### getToken

▸ **getToken**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminBearerAuthRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostAuthReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminBearerAuthRes`\>

**`Description`**

Retrieves a new JWT access token

#### Defined in

[admin/auth.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/auth.ts#L52)
