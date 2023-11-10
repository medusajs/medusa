# ReadableStreamBYOBReader

## Hierarchy

- [`ReadableStreamGenericReader`](ReadableStreamGenericReader.md)

  ↳ **`ReadableStreamBYOBReader`**

## Properties

### closed

 `Readonly` **closed**: `Promise`<`undefined`\>

#### Inherited from

[ReadableStreamGenericReader](ReadableStreamGenericReader.md).[closed](ReadableStreamGenericReader.md#closed)

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:65

## Methods

### cancel

**cancel**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Inherited from

[ReadableStreamGenericReader](ReadableStreamGenericReader.md).[cancel](ReadableStreamGenericReader.md#cancel)

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:66

___

### read

**read**<`T`\>(`view`): `Promise`<[`ReadableStreamReadResult`](../types/ReadableStreamReadResult.md)<`T`\>\>

| Name | Type |
| :------ | :------ |
| `T` | [`ArrayBufferView`](ArrayBufferView.md) |

#### Parameters

| Name |
| :------ |
| `view` | `T` |

#### Returns

`Promise`<[`ReadableStreamReadResult`](../types/ReadableStreamReadResult.md)<`T`\>\>

-`Promise`: 
	-`ReadableStreamReadResult`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:167

___

### releaseLock

**releaseLock**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:168
