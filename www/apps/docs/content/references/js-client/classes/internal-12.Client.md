---
displayed_sidebar: jsClientSidebar
---

# Class: Client

[internal](../modules/internal-12.md).Client

## Properties

### axiosClient

• `Private` **axiosClient**: [`AxiosInstance`](../interfaces/internal-12.AxiosInstance.md)

#### Defined in

[packages/medusa-js/src/request.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L36)

___

### config

• `Private` **config**: [`Config`](../interfaces/internal-12.Config.md)

#### Defined in

[packages/medusa-js/src/request.ts:37](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L37)

## Methods

### createClient

▸ **createClient**(`config`): [`AxiosInstance`](../interfaces/internal-12.AxiosInstance.md)

Creates the axios client used for requests
As part of the creation, we configure the retry conditions
and the exponential backoff approach.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Config`](../interfaces/internal-12.Config.md) | user supplied configurations |

#### Returns

[`AxiosInstance`](../interfaces/internal-12.AxiosInstance.md)

#### Defined in

[packages/medusa-js/src/request.ts:169](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L169)

___

### normalizeHeader

▸ **normalizeHeader**(`header`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `string` |

#### Returns

`string`

#### Defined in

[packages/medusa-js/src/request.ts:90](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L90)

___

### normalizeHeaders

▸ **normalizeHeaders**(`obj`): [`Record`](../modules/internal.md#record)<`string`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `object` |

#### Returns

[`Record`](../modules/internal.md#record)<`string`, `any`\>

#### Defined in

[packages/medusa-js/src/request.ts:78](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L78)

___

### request

▸ **request**(`method`, `path`, `payload?`, `options?`, `customHeaders?`): `Promise`<`any`\>

Axios request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | [`RequestMethod`](../modules/internal-12.md#requestmethod) | request method |
| `path` | `string` | request path |
| `payload` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | request payload |
| `options` | [`RequestOptions`](../interfaces/internal-5.RequestOptions.md) | axios configuration |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | custom request headers |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa-js/src/request.ts:206](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L206)

___

### requiresAuthentication

▸ **requiresAuthentication**(`path`, `method`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `any` |
| `method` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/medusa-js/src/request.ts:99](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L99)

___

### setHeaders

▸ **setHeaders**(`userHeaders`, `method`, `path`, `customHeaders?`): [`AxiosRequestHeaders`](../modules/internal-12.md#axiosrequestheaders)

Creates all the initial headers.
We add the idempotency key, if the request is configured to retry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userHeaders` | [`RequestOptions`](../interfaces/internal-5.RequestOptions.md) | user supplied headers |
| `method` | [`RequestMethod`](../modules/internal-12.md#requestmethod) | request method |
| `path` | `string` | request path |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> | user supplied headers |

#### Returns

[`AxiosRequestHeaders`](../modules/internal-12.md#axiosrequestheaders)

#### Defined in

[packages/medusa-js/src/request.ts:115](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L115)

___

### shouldRetryCondition

▸ **shouldRetryCondition**(`err`, `numRetries`, `maxRetries`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`AxiosError`](../interfaces/internal-12.AxiosError.md)<`any`, `any`\> |
| `numRetries` | `number` |
| `maxRetries` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/medusa-js/src/request.ts:47](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L47)
