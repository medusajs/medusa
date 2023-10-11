---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosInstance

[internal](../modules/internal-12.md).AxiosInstance

## Hierarchy

- [`Axios`](../classes/internal-12.Axios.md)

  ↳ **`AxiosInstance`**

## Callable

### AxiosInstance

▸ **AxiosInstance**(`config`): [`AxiosPromise`](internal-12.AxiosPromise.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `AxiosRequestConfig`<`any`\> |

#### Returns

[`AxiosPromise`](internal-12.AxiosPromise.md)<`any`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:188

### AxiosInstance

▸ **AxiosInstance**(`url`, `config?`): [`AxiosPromise`](internal-12.AxiosPromise.md)<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | `AxiosRequestConfig`<`any`\> |

#### Returns

[`AxiosPromise`](internal-12.AxiosPromise.md)<`any`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:189

## Properties

### defaults

• **defaults**: [`AxiosDefaults`](internal-12.AxiosDefaults.md)<`any`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[defaults](../classes/internal-12.Axios.md#defaults)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:171

___

### interceptors

• **interceptors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`AxiosInterceptorManager`](internal-12.AxiosInterceptorManager.md)<`AxiosRequestConfig`<`any`\>\> |
| `response` | [`AxiosInterceptorManager`](internal-12.AxiosInterceptorManager.md)<[`AxiosResponse`](internal-12.AxiosResponse.md)<`any`, `any`\>\> |

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[interceptors](../classes/internal-12.Axios.md#interceptors)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:172

## Methods

### delete

▸ **delete**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[delete](../classes/internal-12.Axios.md#delete)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:179

___

### get

▸ **get**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[get](../classes/internal-12.Axios.md#get)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:178

___

### getUri

▸ **getUri**(`config?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | `AxiosRequestConfig`<`any`\> |

#### Returns

`string`

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[getUri](../classes/internal-12.Axios.md#geturi)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:176

___

### head

▸ **head**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[head](../classes/internal-12.Axios.md#head)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:180

___

### options

▸ **options**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[options](../classes/internal-12.Axios.md#options)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:181

___

### patch

▸ **patch**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[patch](../classes/internal-12.Axios.md#patch)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:184

___

### post

▸ **post**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[post](../classes/internal-12.Axios.md#post)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:182

___

### put

▸ **put**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[put](../classes/internal-12.Axios.md#put)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:183

___

### request

▸ **request**<`T`, `R`, `D`\>(`config`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `AxiosRequestConfig`<`D`\> |

#### Returns

`Promise`<`R`\>

#### Inherited from

[Axios](../classes/internal-12.Axios.md).[request](../classes/internal-12.Axios.md#request)

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:177
