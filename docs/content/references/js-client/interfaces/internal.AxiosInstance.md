---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosInstance

[internal](../modules/internal.md).AxiosInstance

## Hierarchy

- [`Axios`](../classes/internal.Axios.md)

  ↳ **`AxiosInstance`**

## Callable

### AxiosInstance

▸ **AxiosInstance**(`config`): [`AxiosPromise`](internal.AxiosPromise.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`any`\> |

#### Returns

[`AxiosPromise`](internal.AxiosPromise.md)<`any`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:188

### AxiosInstance

▸ **AxiosInstance**(`url`, `config?`): [`AxiosPromise`](internal.AxiosPromise.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`any`\> |

#### Returns

[`AxiosPromise`](internal.AxiosPromise.md)<`any`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:189

## Properties

### defaults

• **defaults**: [`AxiosDefaults`](internal.AxiosDefaults.md)<`any`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[defaults](../classes/internal.Axios.md#defaults)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:171

___

### interceptors

• **interceptors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`AxiosInterceptorManager`](internal.AxiosInterceptorManager.md)<[`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`any`\>\> |
| `response` | [`AxiosInterceptorManager`](internal.AxiosInterceptorManager.md)<[`AxiosResponse`](internal.AxiosResponse.md)<`any`, `any`\>\> |

#### Inherited from

[Axios](../classes/internal.Axios.md).[interceptors](../classes/internal.Axios.md#interceptors)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:172

## Methods

### delete

▸ **delete**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[delete](../classes/internal.Axios.md#delete)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:179

___

### get

▸ **get**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[get](../classes/internal.Axios.md#get)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:178

___

### getUri

▸ **getUri**(`config?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`any`\> |

#### Returns

`string`

#### Inherited from

[Axios](../classes/internal.Axios.md).[getUri](../classes/internal.Axios.md#geturi)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:176

___

### head

▸ **head**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[head](../classes/internal.Axios.md#head)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:180

___

### options

▸ **options**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[options](../classes/internal.Axios.md#options)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:181

___

### patch

▸ **patch**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[patch](../classes/internal.Axios.md#patch)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:184

___

### post

▸ **post**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[post](../classes/internal.Axios.md#post)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:182

___

### put

▸ **put**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[put](../classes/internal.Axios.md#put)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:183

___

### request

▸ **request**<`T`, `R`, `D`\>(`config`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal.Axios.md).[request](../classes/internal.Axios.md#request)

#### Defined in

medusa-js/node_modules/axios/index.d.ts:177
