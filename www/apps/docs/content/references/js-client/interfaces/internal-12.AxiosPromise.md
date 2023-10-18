---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosPromise<T\>

[internal](../modules/internal-12.md).AxiosPromise

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- `Promise`<[`AxiosResponse`](internal-12.AxiosResponse.md)<`T`\>\>

  ↳ **`AxiosPromise`**

## Properties

### [toStringTag]

• `Readonly` **[toStringTag]**: `string`

#### Inherited from

Promise.[toStringTag]

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

## Methods

### catch

▸ **catch**<`TResult`\>(`onrejected?`): `Promise`<[`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> \| `TResult`\>

Attaches a callback for only the rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TResult`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<[`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

Promise.catch

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1549

___

### finally

▸ **finally**(`onfinally?`): `Promise`<[`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\>\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfinally?` | ``null`` \| () => `void` | The callback to execute when the Promise is settled (fulfilled or rejected). |

#### Returns

`Promise`<[`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\>\>

A Promise for the completion of the callback.

#### Inherited from

Promise.finally

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2018.promise.d.ts:29

___

### then

▸ **then**<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult1` | [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\> |
| `TResult2` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: [`AxiosResponse`](internal-12.AxiosResponse.md)<`T`, `any`\>) => `TResult1` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TResult1`\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult2` \| [`PromiseLike`](internal-8.PromiseLike.md)<`TResult2`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

Promise.then

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1542
