# WritableStream

This Streams API interface provides a standard abstraction for writing
streaming data to a destination, known as a sink. This object comes with
built-in back pressure and queuing.

## Type parameters

| Name | Type |
| :------ | :------ |
| `W` | `object` |

## Properties

### locked

 `Readonly` **locked**: `boolean`

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:232

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

docs-util/node_modules/@types/node/stream/web.d.ts:233

___

### close

**close**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:234

___

### getWriter

**getWriter**(): [`WritableStreamDefaultWriter`](../index.md#writablestreamdefaultwriter)<`W`\>

#### Returns

[`WritableStreamDefaultWriter`](../index.md#writablestreamdefaultwriter)<`W`\>

-`WritableStreamDefaultWriter`: 
	-`W`: 

#### Defined in

docs-util/node_modules/@types/node/stream/web.d.ts:235
