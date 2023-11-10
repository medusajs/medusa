# PromiseLike

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Methods

### then

**then**<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): [`PromiseLike`](PromiseLike.md)<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

| Name | Type |
| :------ | :------ |
| `TResult1` | `object` |
| `TResult2` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: `T`) => `TResult1` \| [`PromiseLike`](PromiseLike.md)<`TResult1`\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult2` \| [`PromiseLike`](PromiseLike.md)<`TResult2`\> | The callback to execute when the Promise is rejected. |

#### Returns

[`PromiseLike`](PromiseLike.md)<`TResult1` \| `TResult2`\>

-`PromiseLike`: A Promise for the completion of which ever callback is executed.
	-`TResult1 \| TResult2`: (optional) 

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1529
