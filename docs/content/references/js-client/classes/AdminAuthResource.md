# Class: AdminAuthResource

## Hierarchy

- `default`

  ↳ **`AdminAuthResource`**

## Methods

### createSession

▸ **createSession**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

**`Description`**

Creates an authenticated session

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostAuthReq`](internal-1.AdminPostAuthReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

#### Defined in

[medusa-js/src/resources/admin/auth.ts:37](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/auth.ts#L37)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

**`Description`**

destroys an authenticated session

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

#### Defined in

[medusa-js/src/resources/admin/auth.ts:24](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/auth.ts#L24)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal-1.md#adminauthres)\>

#### Defined in

[medusa-js/src/resources/admin/auth.ts:12](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/auth.ts#L12)
