# Class: AuthResource

## Hierarchy

- `default`

  ↳ **`AuthResource`**

## Methods

### authenticate

▸ **authenticate**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal.md#storeauthres)\>

**`description`** Authenticates a customer using email and password combination

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostAuthReq`](internal.StorePostAuthReq.md) | authentication payload |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal.md#storeauthres)\>

#### Defined in

[packages/medusa-js/src/resources/auth.ts:16](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/auth.ts#L16)

___

### exists

▸ **exists**(`email`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal.md#storegetauthemailres)\>

**`description`** Check if email exists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGetAuthEmailRes`](../modules/internal.md#storegetauthemailres)\>

#### Defined in

[packages/medusa-js/src/resources/auth.ts:38](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/auth.ts#L38)

___

### getSession

▸ **getSession**(`customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal.md#storeauthres)\>

**`description`** Retrieves an authenticated session
Usually used to check if authenticated session is alive.

#### Parameters

| Name | Type |
| :------ | :------ |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreAuthRes`](../modules/internal.md#storeauthres)\>

#### Defined in

[packages/medusa-js/src/resources/auth.ts:27](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/auth.ts#L27)
