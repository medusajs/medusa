---
displayed_sidebar: jsClientSidebar
---

# Interface: ICacheService

[internal](../modules/internal-8.md).ICacheService

## Methods

### get

▸ **get**<`T`\>(`key`): `Promise`<``null`` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<``null`` \| `T`\>

#### Defined in

packages/types/dist/cache/service.d.ts:2

___

### invalidate

▸ **invalidate**(`key`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/cache/service.d.ts:4

___

### set

▸ **set**(`key`, `data`, `ttl?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `data` | `unknown` |
| `ttl?` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/cache/service.d.ts:3
