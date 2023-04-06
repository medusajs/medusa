---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosRequestConfig<D\>

[internal](../modules/internal.md).AxiosRequestConfig

## Type parameters

| Name | Type |
| :------ | :------ |
| `D` | `any` |

## Properties

### adapter

• `Optional` **adapter**: [`AxiosAdapter`](internal.AxiosAdapter.md)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:75

___

### auth

• `Optional` **auth**: [`AxiosBasicCredentials`](internal.AxiosBasicCredentials.md)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:76

___

### baseURL

• `Optional` **baseURL**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:65

___

### cancelToken

• `Optional` **cancelToken**: [`CancelToken`](internal.CancelToken.md)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:90

___

### data

• `Optional` **data**: `D`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:71

___

### decompress

• `Optional` **decompress**: `boolean`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:91

___

### headers

• `Optional` **headers**: [`AxiosRequestHeaders`](../modules/internal.md#axiosrequestheaders)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:68

___

### httpAgent

• `Optional` **httpAgent**: `any`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:87

___

### httpsAgent

• `Optional` **httpsAgent**: `any`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:88

___

### insecureHTTPParser

• `Optional` **insecureHTTPParser**: `boolean`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:94

___

### maxBodyLength

• `Optional` **maxBodyLength**: `number`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:84

___

### maxContentLength

• `Optional` **maxContentLength**: `number`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:82

___

### maxRedirects

• `Optional` **maxRedirects**: `number`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:85

___

### method

• `Optional` **method**: [`Method`](../modules/internal.md#method)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:64

___

### onDownloadProgress

• `Optional` **onDownloadProgress**: (`progressEvent`: `any`) => `void`

#### Type declaration

▸ (`progressEvent`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progressEvent` | `any` |

##### Returns

`void`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:81

___

### onUploadProgress

• `Optional` **onUploadProgress**: (`progressEvent`: `any`) => `void`

#### Type declaration

▸ (`progressEvent`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progressEvent` | `any` |

##### Returns

`void`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:80

___

### params

• `Optional` **params**: `any`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:69

___

### paramsSerializer

• `Optional` **paramsSerializer**: (`params`: `any`) => `string`

#### Type declaration

▸ (`params`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

##### Returns

`string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:70

___

### proxy

• `Optional` **proxy**: ``false`` \| [`AxiosProxyConfig`](internal.AxiosProxyConfig.md)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:89

___

### raxConfig

• `Optional` **raxConfig**: [`RetryConfig`](internal.RetryConfig.md)

#### Defined in

medusa-js/node_modules/retry-axios/dist/src/index.d.ts:89

___

### responseType

• `Optional` **responseType**: [`ResponseType`](../modules/internal.md#responsetype)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:77

___

### signal

• `Optional` **signal**: `AbortSignal`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:93

___

### socketPath

• `Optional` **socketPath**: ``null`` \| `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:86

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:72

___

### timeoutErrorMessage

• `Optional` **timeoutErrorMessage**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:73

___

### transformRequest

• `Optional` **transformRequest**: [`AxiosRequestTransformer`](internal.AxiosRequestTransformer.md) \| [`AxiosRequestTransformer`](internal.AxiosRequestTransformer.md)[]

#### Defined in

medusa-js/node_modules/axios/index.d.ts:66

___

### transformResponse

• `Optional` **transformResponse**: [`AxiosResponseTransformer`](internal.AxiosResponseTransformer.md) \| [`AxiosResponseTransformer`](internal.AxiosResponseTransformer.md)[]

#### Defined in

medusa-js/node_modules/axios/index.d.ts:67

___

### transitional

• `Optional` **transitional**: [`TransitionalOptions`](internal.TransitionalOptions.md)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:92

___

### url

• `Optional` **url**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:63

___

### validateStatus

• `Optional` **validateStatus**: ``null`` \| (`status`: `number`) => `boolean`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:83

___

### withCredentials

• `Optional` **withCredentials**: `boolean`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:74

___

### xsrfCookieName

• `Optional` **xsrfCookieName**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:78

___

### xsrfHeaderName

• `Optional` **xsrfHeaderName**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:79
