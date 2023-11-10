# QueryResultCache

Implementations of this interface provide different strategies to cache query builder results.

## Methods

### clear

**clear**(`queryRunner?`): `Promise`<`void`\>

Clears everything stored in the cache.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:34

___

### connect

**connect**(): `Promise`<`void`\>

Creates a connection with given cache provider.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:10

___

### disconnect

**disconnect**(): `Promise`<`void`\>

Closes a connection with given cache provider.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:14

___

### getFromCache

**getFromCache**(`options`, `queryRunner?`): `Promise`<`undefined` \| [`QueryResultCacheOptions`](QueryResultCacheOptions.md)\>

Caches given query result.

#### Parameters

| Name |
| :------ |
| `options` | [`QueryResultCacheOptions`](QueryResultCacheOptions.md) |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`undefined` \| [`QueryResultCacheOptions`](QueryResultCacheOptions.md)\>

-`Promise`: 
	-`undefined \| QueryResultCacheOptions`: (optional) 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:22

___

### isExpired

**isExpired**(`savedCache`): `boolean`

Checks if cache is expired or not.

#### Parameters

| Name |
| :------ |
| `savedCache` | [`QueryResultCacheOptions`](QueryResultCacheOptions.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:30

___

### remove

**remove**(`identifiers`, `queryRunner?`): `Promise`<`void`\>

Removes all cached results by given identifiers from cache.

#### Parameters

| Name |
| :------ |
| `identifiers` | `string`[] |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:38

___

### storeInCache

**storeInCache**(`options`, `savedCache`, `queryRunner?`): `Promise`<`void`\>

Stores given query result in the cache.

#### Parameters

| Name |
| :------ |
| `options` | [`QueryResultCacheOptions`](QueryResultCacheOptions.md) |
| `savedCache` | `undefined` \| [`QueryResultCacheOptions`](QueryResultCacheOptions.md) |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:26

___

### synchronize

**synchronize**(`queryRunner?`): `Promise`<`void`\>

Performs operations needs to be created during schema synchronization.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/cache/QueryResultCache.d.ts:18
