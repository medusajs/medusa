---
displayed_sidebar: jsClientSidebar
---

# Interface: WritableStreamDefaultWriter<W\>

[internal](../modules/internal-8.md).WritableStreamDefaultWriter

This Streams API interface is the object returned by
WritableStream.getWriter() and once created locks the < writer to the
WritableStream ensuring that no other streams can write to the underlying
sink.

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `any` |

## Properties

### closed

• `Readonly` **closed**: `Promise`<`undefined`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:228

___

### desiredSize

• `Readonly` **desiredSize**: ``null`` \| `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:229

___

### ready

• `Readonly` **ready**: `Promise`<`undefined`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:230

## Methods

### abort

▸ **abort**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:231

___

### close

▸ **close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:232

___

### releaseLock

▸ **releaseLock**(): `void`

#### Returns

`void`

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:233

___

### write

▸ **write**(`chunk?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk?` | `W` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa-js/node_modules/@types/node/stream/web.d.ts:234
