---
displayed_sidebar: jsClientSidebar
---

# Interface: PromiseLike<T\>

[internal](../modules/internal-8.md).PromiseLike

## Type parameters

| Name |
| :------ |
| `T` |

## Methods

### then

▸ **then**<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): [`PromiseLike`](internal-8.PromiseLike.md)<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult1` | `T` |
| `TResult2` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: `T`) => `TResult1` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TResult1`\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult2` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TResult2`\> | The callback to execute when the Promise is rejected. |

#### Returns

[`PromiseLike`](internal-8.PromiseLike.md)<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1529
