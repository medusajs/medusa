---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosError<T, D\>

[internal](../modules/internal.md).AxiosError

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `D` | `any` |

## Hierarchy

- `Error`

  ↳ **`AxiosError`**

## Properties

### code

• `Optional` **code**: `string`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:126

___

### config

• **config**: [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:125

___

### isAxiosError

• **isAxiosError**: `boolean`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:129

___

### request

• `Optional` **request**: `any`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:127

___

### response

• `Optional` **response**: [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `D`\>

#### Defined in

medusa-js/node_modules/axios/index.d.ts:128

___

### toJSON

• **toJSON**: () => `object`

#### Type declaration

▸ (): `object`

##### Returns

`object`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:130
