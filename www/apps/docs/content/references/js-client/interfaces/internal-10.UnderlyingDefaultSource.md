---
displayed_sidebar: jsClientSidebar
---

# Interface: UnderlyingDefaultSource<R\>

[internal](../modules/internal-10.md).UnderlyingDefaultSource

## Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

## Properties

### cancel

• `Optional` **cancel**: [`UnderlyingSourceCancelCallback`](internal-10.UnderlyingSourceCancelCallback.md)

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1946

___

### pull

• `Optional` **pull**: (`controller`: [`ReadableStreamDefaultController`](../modules/internal-10.md#readablestreamdefaultcontroller)<`R`\>) => `void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

#### Type declaration

▸ (`controller`): `void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`ReadableStreamDefaultController`](../modules/internal-10.md#readablestreamdefaultcontroller)<`R`\> |

##### Returns

`void` \| [`PromiseLike`](internal-8.PromiseLike.md)<`void`\>

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1947

___

### start

• `Optional` **start**: (`controller`: [`ReadableStreamDefaultController`](../modules/internal-10.md#readablestreamdefaultcontroller)<`R`\>) => `any`

#### Type declaration

▸ (`controller`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`ReadableStreamDefaultController`](../modules/internal-10.md#readablestreamdefaultcontroller)<`R`\> |

##### Returns

`any`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1948

___

### type

• `Optional` **type**: `undefined`

#### Defined in

docs-util/node_modules/typescript/lib/lib.dom.d.ts:1949
