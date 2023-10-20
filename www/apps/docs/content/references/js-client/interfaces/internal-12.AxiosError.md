---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosError<T, D\>

[internal](../modules/internal-12.md).AxiosError

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `D` | `any` |

## Hierarchy

- [`Error`](../modules/internal-8.md#error)

  ↳ **`AxiosError`**

## Properties

### code

• `Optional` **code**: `string`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:126

___

### config

• **config**: `AxiosRequestConfig`<`D`\>

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

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1067

___

### request

• `Optional` **request**: `any`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:127

___

### response

• `Optional` **response**: [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `D`\>

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:128

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1069

___

### toJSON

• **toJSON**: () => `object`

#### Type declaration

▸ (): `object`

##### Returns

`object`

#### Defined in

packages/medusa-js/node_modules/axios/index.d.ts:130
