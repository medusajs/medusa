---
displayed_sidebar: jsClientSidebar
---

# Interface: ErrorConstructor

[internal](../modules/internal.md).ErrorConstructor

## Callable

### ErrorConstructor

▸ **ErrorConstructor**(`message?`): [`Error`](../modules/internal.md#error)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`Error`](../modules/internal.md#error)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1029

## Properties

### prepareStackTrace

• `Optional` **prepareStackTrace**: (`err`: [`Error`](../modules/internal.md#error), `stackTraces`: [`CallSite`](internal.CallSite.md)[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Error`](../modules/internal.md#error) |
| `stackTraces` | [`CallSite`](internal.CallSite.md)[] |

##### Returns

`any`

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### prototype

• `Readonly` **prototype**: [`Error`](../modules/internal.md#error)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1030

___

### stackTraceLimit

• **stackTraceLimit**: `number`

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | [`Function`](../modules/internal.md#function) |

#### Returns

`void`

#### Defined in

node_modules/@types/node/globals.d.ts:4
