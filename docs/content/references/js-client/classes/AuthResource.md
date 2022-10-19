# Class: AuthResource

## Hierarchy

- `default`

  ↳ **`AuthResource`**

## Methods

### authenticate

▸ **authenticate**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-31.md#storeauthres)\>

**`Description`**

Authenticates a customer using email and password combination

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostAuthReq`](internal-31.StorePostAuthReq.md) | authentication payload |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-31.md#storeauthres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:16](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/auth.ts#L16)

___

### deleteSession

▸ **deleteSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

**`Description`**

Removes authentication session

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`void`\>

#### Defined in

[medusa-js/src/resources/auth.ts:25](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/auth.ts#L25)

___

### exists

▸ **exists**(`email`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-31.md#storegetauthemailres)\>

**`Description`**

Check if email exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal-31.md#storegetauthemailres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:47](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/auth.ts#L47)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-31.md#storeauthres)\>

**`Description`**

Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal-31.md#storeauthres)\>

#### Defined in

[medusa-js/src/resources/auth.ts:36](https://github.com/medusajs/medusa/blob/53e34d33d/packages/medusa-js/src/resources/auth.ts#L36)
