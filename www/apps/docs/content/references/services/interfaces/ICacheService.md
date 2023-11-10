# ICacheService

## Methods

### get

**get**<`T`\>(`key`): `Promise`<``null`` \| `T`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `key` | `string` |

#### Returns

`Promise`<``null`` \| `T`\>

-`Promise`: 
	-```null`` \| T`: (optional) 

#### Defined in

packages/types/dist/cache/service.d.ts:2

___

### invalidate

**invalidate**(`key`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/cache/service.d.ts:4

___

### set

**set**(`key`, `data`, `ttl?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `data` | `unknown` |
| `ttl?` | `number` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/cache/service.d.ts:3
