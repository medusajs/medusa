---
displayed_sidebar: jsClientSidebar
---

# Interface: AxiosInterceptorManager<V\>

[internal](../modules/internal.md).AxiosInterceptorManager

## Type parameters

| Name |
| :------ |
| `V` |

## Methods

### eject

▸ **eject**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`void`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:166

___

### use

▸ **use**<`T`\>(`onFulfilled?`, `onRejected?`): `number`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `onFulfilled?` | (`value`: `V`) => `T` \| `Promise`<`T`\> |
| `onRejected?` | (`error`: `any`) => `any` |

#### Returns

`number`

#### Defined in

medusa-js/node_modules/axios/index.d.ts:165
