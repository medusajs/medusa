---
displayed_sidebar: jsClientSidebar
---

# Class: MedusaError

[internal](../modules/internal-8.md).MedusaError

Standardized error to be used across Medusa project.

## Hierarchy

- [`Error`](../modules/internal-8.md#error)

  ↳ **`MedusaError`**

## Properties

### code

• `Optional` **code**: `string`

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:29

___

### date

• **date**: `Date`

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:30

___

### message

• **message**: `string`

#### Overrides

Error.message

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:28

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1069

___

### type

• **type**: `string`

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:27

___

### Codes

▪ `Static` **Codes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CART_INCOMPATIBLE_STATE` | `string` |
| `INSUFFICIENT_INVENTORY` | `string` |

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:44

___

### Types

▪ `Static` **Types**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `CONFLICT` | `string` | - |
| `DB_ERROR` | `string` | Errors stemming from the database |
| `DUPLICATE_ERROR` | `string` | - |
| `INVALID_ARGUMENT` | `string` | - |
| `INVALID_DATA` | `string` | - |
| `NOT_ALLOWED` | `string` | - |
| `NOT_FOUND` | `string` | - |
| `PAYMENT_AUTHORIZATION_ERROR` | `string` | - |
| `UNAUTHORIZED` | `string` | - |
| `UNEXPECTED_STATE` | `string` | - |

#### Defined in

packages/medusa-core-utils/dist/errors.d.ts:31

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: [`Error`](../modules/internal-8.md#error), `stackTraces`: [`CallSite`](../interfaces/internal-8.CallSite.md)[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Error`](../modules/internal-8.md#error) |
| `stackTraces` | [`CallSite`](../interfaces/internal-8.CallSite.md)[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:4
