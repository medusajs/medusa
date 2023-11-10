# ReadableStreamDefaultReader

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `object` |

## Hierarchy

- [`ReadableStreamGenericReader`](ReadableStreamGenericReader.md)

  ↳ **`ReadableStreamDefaultReader`**

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

**read**(): `Promise`<[`ReadableStreamDefaultReadResult`](../types/ReadableStreamDefaultReadResult.md)<`R`\>\>

#### Returns

`Promise`<[`ReadableStreamDefaultReadResult`](../types/ReadableStreamDefaultReadResult.md)<`R`\>\>

-`Promise`: 
	-`ReadableStreamDefaultReadResult`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:163

___

### releaseLock

**releaseLock**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:164
