---
displayed_sidebar: jsClientSidebar
---

# Class: AdminAuthResource

## Hierarchy

- `default`

  ↳ **`AdminAuthResource`**

## Methods

### createSession

▸ **createSession**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostAuthReq`](internal-1.AdminPostAuthReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

**`Description`**

Creates an authenticated session

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:38](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/auth.ts#L38)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<`void`\>

**`Description`**

destroys an authenticated session

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:25](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/auth.ts#L25)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:13](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/auth.ts#L13)

___

### getToken

▸ **getToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminBearerAuthRes`](../modules/internal-1.md#adminbearerauthres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostAuthReq`](internal-1.AdminPostAuthReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminBearerAuthRes`](../modules/internal-1.md#adminbearerauthres)\>

**`Description`**

Retrieves a new JWT access token

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:52](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/auth.ts#L52)
