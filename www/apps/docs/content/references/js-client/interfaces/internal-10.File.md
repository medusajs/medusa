---
displayed_sidebar: jsClientSidebar
---

# Interface: File

[internal](../modules/internal-10.md).File

Provides information about files and allows JavaScript in a web page to access their content.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File)

## Hierarchy

- `Blob`

  ↳ **`File`**

## Properties

### lastModified

• `Readonly` **lastModified**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:8262

___

### name

• `Readonly` **name**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:8264

___

### prototype

• **prototype**: `Blob`

#### Inherited from

Blob.prototype

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3124

___

### size

• `Readonly` **size**: `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/size)

#### Inherited from

Blob.size

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3110

___

### type

• `Readonly` **type**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/type)

#### Inherited from

Blob.type

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3112

___

### webkitRelativePath

• `Readonly` **webkitRelativePath**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:8266

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/arrayBuffer)

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

Blob.arrayBuffer

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3114

___

### slice

▸ **slice**(`start?`, `end?`, `contentType?`): `Blob`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/slice)

#### Parameters

| Name | Type |
| :------ | :------ |
| `start?` | `number` |
| `end?` | `number` |
| `contentType?` | `string` |

#### Returns

`Blob`

#### Inherited from

Blob.slice

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3116

___

### stream

▸ **stream**(): [`ReadableStream`](../modules/internal-10.md#readablestream)<`Uint8Array`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/stream)

#### Returns

[`ReadableStream`](../modules/internal-10.md#readablestream)<`Uint8Array`\>

#### Inherited from

Blob.stream

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3118

___

### text

▸ **text**(): `Promise`<`string`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/text)

#### Returns

`Promise`<`string`\>

#### Inherited from

Blob.text

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:3120
