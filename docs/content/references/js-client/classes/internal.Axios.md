---
displayed_sidebar: jsClientSidebar
---

# Class: Axios

[internal](../modules/internal.md).Axios

## Hierarchy

- **`Axios`**

  ↳ [`AxiosInstance`](../interfaces/internal.AxiosInstance.md)

## Properties

### defaults

• **defaults**: [`AxiosDefaults`](../interfaces/internal.AxiosDefaults.md)<`any`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:171

___

### interceptors

• **interceptors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`AxiosInterceptorManager`](../interfaces/internal.AxiosInterceptorManager.md)<[`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`any`\>\> |
| `response` | [`AxiosInterceptorManager`](../interfaces/internal.AxiosInterceptorManager.md)<[`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`any`, `any`\>\> |

#### Defined in

medusa-js/node_modules/axios/index.d.ts:172

## Methods

### delete

▸ **delete**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:179

___

### get

▸ **get**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:178

___

### getUri

▸ **getUri**(`config?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`any`\> |

#### Returns

`string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:176

___

### head

▸ **head**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:180

___

### options

▸ **options**<`T`, `R`, `D`\>(`url`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:181

___

### patch

▸ **patch**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:184

___

### post

▸ **post**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:182

___

### put

▸ **put**<`T`, `R`, `D`\>(`url`, `data?`, `config?`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | `D` |
| `config?` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:183

___

### request

▸ **request**<`T`, `R`, `D`\>(`config`): `Promise`<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `R` | [`AxiosResponse`](../interfaces/internal.AxiosResponse.md)<`T`, `any`\> |
| `D` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AxiosRequestConfig`](../interfaces/internal.AxiosRequestConfig.md)<`D`\> |

#### Returns

`Promise`<`R`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:177
