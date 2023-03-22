# Class: CacheService

## Implements

- `ICacheService`

## Constructors

### constructor

• **new CacheService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Defined in

[packages/medusa/src/services/cache.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/cache.ts#L10)

## Properties

### redis\_

• `Protected` `Readonly` **redis\_**: `Redis`

#### Defined in

[packages/medusa/src/services/cache.ts:8](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/cache.ts#L8)

## Methods

### get

▸ **get**<`T`\>(`cacheKey`): `Promise`<``null`` \| `T`\>

Retrieve a cached value belonging to the given key.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheKey` | `string` |

#### Returns

`Promise`<``null`` \| `T`\>

#### Implementation of

ICacheService.get

#### Defined in

[packages/medusa/src/services/cache.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/cache.ts#L40)

___

### invalidate

▸ **invalidate**(`key`): `Promise`<`void`\>

Invalidate cache for a specific key. a key can be either a specific key or more global such as "ps:*".

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

ICacheService.invalidate

#### Defined in

[packages/medusa/src/services/cache.ts:56](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/cache.ts#L56)

___

### set

▸ **set**(`key`, `data`, `ttl?`): `Promise`<`void`\>

Set a key/value pair to the cache.
It is also possible to manage the ttl through environment variable using CACHE_TTL. If the ttl is 0 it will
act like the value should not be cached at all.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `undefined` |
| `data` | `Record`<`string`, `unknown`\> | `undefined` |
| `ttl` | `number` | `DEFAULT_CACHE_TIME` |

#### Returns

`Promise`<`void`\>

#### Implementation of

ICacheService.set

#### Defined in

[packages/medusa/src/services/cache.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/cache.ts#L22)
