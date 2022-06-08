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

- [`Error`](../modules/internal.md#error)

  ↳ **`AxiosError`**

## Properties

### code

• `Optional` **code**: `string`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:126

___

### config

• **config**: [`AxiosRequestConfig`](internal.AxiosRequestConfig.md)<`D`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:125

___

### isAxiosError

• **isAxiosError**: `boolean`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:129

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

___

### request

• `Optional` **request**: `any`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:127

___

### response

• `Optional` **response**: [`AxiosResponse`](internal.AxiosResponse.md)<`T`, `D`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:128

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

## Methods

### toJSON

▸ **toJSON**(): `object`

#### Returns

`object`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:130
