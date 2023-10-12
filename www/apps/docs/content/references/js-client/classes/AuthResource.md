---
displayed_sidebar: jsClientSidebar
---

# Class: AuthResource

## Hierarchy

- `default`

  ↳ **`AuthResource`**

## Methods

### authenticate

▸ **authenticate**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreAuthRes`](../modules/internal-8.internal.md#storeauthres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostAuthReq`](internal-8.internal.StorePostAuthReq.md) | authentication payload |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreAuthRes`](../modules/internal-8.internal.md#storeauthres)\>

**`Description`**

Authenticates a customer using email and password combination

#### Defined in

[packages/medusa-js/src/resources/auth.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/auth.ts#L18)

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

Removes authentication session

#### Defined in

[packages/medusa-js/src/resources/auth.ts:27](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/auth.ts#L27)

___

### exists

▸ **exists**(`email`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-8.internal.md#storegetauthemailres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-8.internal.md#storegetauthemailres)\>

**`Description`**

Check if email exists

#### Defined in

[packages/medusa-js/src/resources/auth.ts:49](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/auth.ts#L49)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreAuthRes`](../modules/internal-8.internal.md#storeauthres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreAuthRes`](../modules/internal-8.internal.md#storeauthres)\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Defined in

[packages/medusa-js/src/resources/auth.ts:38](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/auth.ts#L38)

___

### getToken

▸ **getToken**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreBearerAuthRes`](../modules/internal-8.internal.md#storebearerauthres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`StorePostAuthReq`](internal-8.internal.StorePostAuthReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreBearerAuthRes`](../modules/internal-8.internal.md#storebearerauthres)\>

**`Description`**

Retrieves a new JWT access token

#### Defined in

[packages/medusa-js/src/resources/auth.ts:60](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/auth.ts#L60)
