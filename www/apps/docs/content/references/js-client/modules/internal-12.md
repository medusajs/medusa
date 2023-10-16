---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Classes

- [Axios](../classes/internal-12.Axios.md)
- [Client](../classes/internal-12.Client.md)

## Interfaces

- [AxiosAdapter](../interfaces/internal-12.AxiosAdapter.md)
- [AxiosBasicCredentials](../interfaces/internal-12.AxiosBasicCredentials.md)
- [AxiosDefaults](../interfaces/internal-12.AxiosDefaults.md)
- [AxiosError](../interfaces/internal-12.AxiosError.md)
- [AxiosInstance](../interfaces/internal-12.AxiosInstance.md)
- [AxiosInterceptorManager](../interfaces/internal-12.AxiosInterceptorManager.md)
- [AxiosPromise](../interfaces/internal-12.AxiosPromise.md)
- [AxiosProxyConfig](../interfaces/internal-12.AxiosProxyConfig.md)
- [AxiosRequestTransformer](../interfaces/internal-12.AxiosRequestTransformer.md)
- [AxiosResponse](../interfaces/internal-12.AxiosResponse.md)
- [AxiosResponseTransformer](../interfaces/internal-12.AxiosResponseTransformer.md)
- [Cancel](../interfaces/internal-12.Cancel.md)
- [CancelToken](../interfaces/internal-12.CancelToken.md)
- [Config](../interfaces/internal-12.Config.md)
- [HTTPResponse](../interfaces/internal-12.HTTPResponse.md)
- [HeadersDefaults](../interfaces/internal-12.HeadersDefaults.md)
- [RetryConfig](../interfaces/internal-12.RetryConfig.md)
- [TransitionalOptions](../interfaces/internal-12.TransitionalOptions.md)

## Type Aliases

### AxiosRequestHeaders

Ƭ **AxiosRequestHeaders**: [`Record`](internal.md#record)<`string`, `string`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:3

___

### AxiosResponseHeaders

Ƭ **AxiosResponseHeaders**: [`Record`](internal.md#record)<`string`, `string`\> & { `set-cookie?`: `string`[]  }

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:5

___

### Method

Ƭ **Method**: ``"get"`` \| ``"GET"`` \| ``"delete"`` \| ``"DELETE"`` \| ``"head"`` \| ``"HEAD"`` \| ``"options"`` \| ``"OPTIONS"`` \| ``"post"`` \| ``"POST"`` \| ``"put"`` \| ``"PUT"`` \| ``"patch"`` \| ``"PATCH"`` \| ``"purge"`` \| ``"PURGE"`` \| ``"link"`` \| ``"LINK"`` \| ``"unlink"`` \| ``"UNLINK"``

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:36

___

### RequestMethod

Ƭ **RequestMethod**: ``"DELETE"`` \| ``"POST"`` \| ``"GET"``

#### Defined in

[packages/medusa-js/src/request.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/request.ts#L28)

___

### Response

Ƭ **Response**<`T`\>: `T` & { `response`: [`HTTPResponse`](../interfaces/internal-12.HTTPResponse.md)  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/medusa-js/src/typings.ts:17](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L17)

___

### ResponsePromise

Ƭ **ResponsePromise**<`T`\>: `Promise`<[`Response`](internal-12.md#response)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[packages/medusa-js/src/typings.ts:21](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/typings.ts#L21)

___

### ResponseType

Ƭ **ResponseType**: ``"arraybuffer"`` \| ``"blob"`` \| ``"document"`` \| ``"json"`` \| ``"text"`` \| ``"stream"``

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:48
