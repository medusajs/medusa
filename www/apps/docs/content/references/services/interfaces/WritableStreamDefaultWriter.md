# WritableStreamDefaultWriter

This Streams API interface is the object returned by
WritableStream.getWriter() and once created locks the < writer to the
WritableStream ensuring that no other streams can write to the underlying
sink.

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `object` |

## Properties

### closed

 `Readonly` **closed**: `Promise`<`undefined`\>

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:248

___

### desiredSize

 `Readonly` **desiredSize**: ``null`` \| `number`

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:249

___

### ready

 `Readonly` **ready**: `Promise`<`undefined`\>

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:250

## Methods

### abort

**abort**(`reason?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `reason?` | `any` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:251

___

### close

**close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:252

___

### releaseLock

**releaseLock**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:253

___

### write

**write**(`chunk?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `chunk?` | `W` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:254
