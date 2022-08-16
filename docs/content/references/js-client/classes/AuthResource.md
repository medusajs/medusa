# Class: AuthResource

## Hierarchy

- `default`

  ↳ **`AuthResource`**

## Methods

### authenticate

▸ **authenticate**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-29.md#storeauthres)\>

**`Description`**

Authenticates a customer using email and password combination

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostAuthReq`](internal-29.StorePostAuthReq.md) | authentication payload |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-29.md#storeauthres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:16](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/auth.ts#L16)

___

### exists

▸ **exists**(`email`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-29.md#storegetauthemailres)\>

**`Description`**

Check if email exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-29.md#storegetauthemailres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:38](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/auth.ts#L38)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-29.md#storeauthres)\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-29.md#storeauthres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:27](https://github.com/medusajs/medusa/blob/e38dd7f6/packages/medusa-js/src/resources/auth.ts#L27)
