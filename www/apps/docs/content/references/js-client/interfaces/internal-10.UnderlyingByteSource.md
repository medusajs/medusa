---
displayed_sidebar: jsClientSidebar
---

# Interface: UnderlyingByteSource

[internal](../modules/internal-10.md).UnderlyingByteSource

## Properties

### autoAllocateChunkSize

• `Optional` **autoAllocateChunkSize**: `number`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1938

___

### cancel

• `Optional` **cancel**: [`UnderlyingSourceCancelCallback`](internal-10.UnderlyingSourceCancelCallback.md)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1939

___

### pull

• `Optional` **pull**: (`controller`: [`ReadableByteStreamController`](../modules/internal-10.md#readablebytestreamcontroller)) => `void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

#### Type declaration

▸ (`controller`): `void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`ReadableByteStreamController`](../modules/internal-10.md#readablebytestreamcontroller) |

##### Returns

`void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1940

___

### start

• `Optional` **start**: (`controller`: [`ReadableByteStreamController`](../modules/internal-10.md#readablebytestreamcontroller)) => `any`

#### Type declaration

▸ (`controller`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`ReadableByteStreamController`](../modules/internal-10.md#readablebytestreamcontroller) |

##### Returns

`any`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1941

___

### type

• **type**: ``"bytes"``

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1942
