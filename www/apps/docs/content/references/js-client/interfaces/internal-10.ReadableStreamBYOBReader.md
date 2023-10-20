---
displayed_sidebar: jsClientSidebar
---

# Interface: ReadableStreamBYOBReader

[internal](../modules/internal-10.md).ReadableStreamBYOBReader

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader)

## Hierarchy

- [`ReadableStreamGenericReader`](internal-10.ReadableStreamGenericReader.md)

  ↳ **`ReadableStreamBYOBReader`**

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

▸ **read**<`T`\>(`view`): `Promise`<[`ReadableStreamReadResult`](../modules/internal-10.md#readablestreamreadresult)<`T`\>\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader/read)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ArrayBufferView`](internal-8.ArrayBufferView.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `view` | `T` |

#### Returns

`Promise`<[`ReadableStreamReadResult`](../modules/internal-10.md#readablestreamreadresult)<`T`\>\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18514

___

### releaseLock

▸ **releaseLock**(): `void`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader/releaseLock)

#### Returns

`void`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:18516
