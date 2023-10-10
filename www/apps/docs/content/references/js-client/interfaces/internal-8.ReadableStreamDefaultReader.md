---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStreamDefaultReader<R\>

[internal](../modules/internal-8.md).ReadableStreamDefaultReader

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

## Hierarchy

- [`ReadableStreamGenericReader`](internal-8.ReadableStreamGenericReader.md)

  ↳ **`ReadableStreamDefaultReader`**

## Properties

### closed

• `Readonly` **closed**: `Promise`<`undefined`\>

#### Inherited from

[ReadableStreamGenericReader](internal-8.ReadableStreamGenericReader.md).[closed](internal-8.ReadableStreamGenericReader.md#closed)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:65

## Methods

### cancel

▸ **cancel**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[ReadableStreamGenericReader](internal-8.ReadableStreamGenericReader.md).[cancel](internal-8.ReadableStreamGenericReader.md#cancel)

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:66

___

### read

▸ **read**(): `Promise`<[`ReadableStreamDefaultReadResult`](../modules/internal-8.md#readablestreamdefaultreadresult)<`R`\>\>

#### Returns

`Promise`<[`ReadableStreamDefaultReadResult`](../modules/internal-8.md#readablestreamdefaultreadresult)<`R`\>\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:151

___

### releaseLock

▸ **releaseLock**(): `void`

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:152
