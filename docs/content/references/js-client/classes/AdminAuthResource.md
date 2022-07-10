# Class: AdminAuthResource

## Hierarchy

- `default`

  ↳ **`AdminAuthResource`**

## Methods

### createSession

▸ **createSession**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal.md#adminauthres)\>

**`description`** Creates an authenticated session

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostAuthReq`](internal.AdminPostAuthReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal.md#adminauthres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:33](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/auth.ts#L33)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

**`description`** destroys an authenticated session

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:22](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/auth.ts#L22)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal.md#adminauthres)\>

**`description`** Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminAuthRes`](../modules/internal.md#adminauthres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/auth.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/auth.ts#L12)
