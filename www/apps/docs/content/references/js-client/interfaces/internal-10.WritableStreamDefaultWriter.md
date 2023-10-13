---
displayed_sidebar: jsClientSidebar
---

# Interface: WritableStreamDefaultWriter<W\>

[internal](../modules/internal-10.md).WritableStreamDefaultWriter

This Streams API interface is the object returned by WritableStream.getWriter() and once created locks the < writer to the WritableStream ensuring that no other streams can write to the underlying sink.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

## Properties

### closed

• `Readonly` **closed**: `Promise`<`undefined`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/closed)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26060

___

### desiredSize

• `Readonly` **desiredSize**: ``null`` \| `number`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/desiredSize)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26062

___

### ready

• `Readonly` **ready**: `Promise`<`undefined`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/ready)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26064

## Methods

### abort

▸ **abort**(`reason?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/abort)

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26066

___

### close

▸ **close**(): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/close)

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26068

___

### releaseLock

▸ **releaseLock**(): `void`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/releaseLock)

#### Returns

`void`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26070

___

### write

▸ **write**(`chunk?`): `Promise`<`void`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk?` | `W` |

#### Returns

`Promise`<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:26072
