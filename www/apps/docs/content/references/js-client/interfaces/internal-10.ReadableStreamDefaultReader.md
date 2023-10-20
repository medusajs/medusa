---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStreamDefaultReader<R\>

[internal](../modules/internal-10.md).ReadableStreamDefaultReader

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

## Hierarchy

- [`ReadableStreamGenericReader`](internal-10.ReadableStreamGenericReader.md)

  ↳ **`ReadableStreamDefaultReader`**

## Properties

### closed

• `Readonly` **closed**: `Promise`<`undefined`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader/closed)

#### Inherited from

[ReadableStreamGenericReader](internal-10.ReadableStreamGenericReader.md).[closed](internal-10.ReadableStreamGenericReader.md#closed)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18571

## Methods

### cancel

▸ **cancel**(`reason?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader/cancel)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[ReadableStreamGenericReader](internal-10.ReadableStreamGenericReader.md).[cancel](internal-10.ReadableStreamGenericReader.md#cancel)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18573

___

### read

▸ **read**(): `Promise`<[`ReadableStreamReadResult`](../modules/internal-10.md#readablestreamreadresult)<`R`\>\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read)

#### Returns

`Promise`<[`ReadableStreamReadResult`](../modules/internal-10.md#readablestreamreadresult)<`R`\>\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18559

___

### releaseLock

▸ **releaseLock**(): `void`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/releaseLock)

#### Returns

`void`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18561
