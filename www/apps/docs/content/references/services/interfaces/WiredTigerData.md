# WiredTigerData

## Hierarchy

- [`Document`](Document.md)

  ↳ **`WiredTigerData`**

## Properties

### LSM

 **LSM**: { `bloom filter false positives`: `number` ; `bloom filter hits`: `number` ; `bloom filter misses`: `number` ; `bloom filter pages evicted from cache`: `number` ; `bloom filter pages read into cache`: `number` ; `bloom filters in the LSM tree`: `number` ; `chunks in the LSM tree`: `number` ; `highest merge generation in the LSM tree`: `number` ; `queries that could have benefited from a Bloom filter that did not exist`: `number` ; `sleep for LSM checkpoint throttle`: `number` ; `sleep for LSM merge throttle`: `number` ; `total size of bloom filters`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5278

___

### block-manager

 **block-manager**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allocations requiring file extension` | `number` |
| `blocks allocated` | `number` |
| `blocks freed` | `number` |
| `checkpoint size` | `number` |
| `file allocation unit size` | `number` |
| `file bytes available for reuse` | `number` |
| `file magic number` | `number` |
| `file major version number` | `number` |
| `file size in bytes` | `number` |
| `minor version number` | `number` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5292

___

### btree

 **btree**: { `btree checkpoint generation`: `number` ; `column-store fixed-size leaf pages`: `number` ; `column-store internal pages`: `number` ; `column-store variable-size RLE encoded values`: `number` ; `column-store variable-size deleted values`: `number` ; `column-store variable-size leaf pages`: `number` ; `fixed-record size`: `number` ; `maximum internal page key size`: `number` ; `maximum internal page size`: `number` ; `maximum leaf page key size`: `number` ; `maximum leaf page size`: `number` ; `maximum leaf page value size`: `number` ; `maximum tree depth`: `number` ; `number of key/value pairs`: `number` ; `overflow pages`: `number` ; `pages rewritten by compaction`: `number` ; `row-store internal pages`: `number` ; `row-store leaf pages`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5304

___

### cache

 **cache**: { `bytes currently in the cache`: `number` ; `bytes read into cache`: `number` ; `bytes written from cache`: `number` ; `checkpoint blocked page eviction`: `number` ; `data source pages selected for eviction unable to be evicted`: `number` ; `hazard pointer blocked page eviction`: `number` ; `in-memory page passed criteria to be split`: `number` ; `in-memory page splits`: `number` ; `internal pages evicted`: `number` ; `internal pages split during eviction`: `number` ; `leaf pages split during eviction`: `number` ; `modified pages evicted`: `number` ; `overflow pages read into cache`: `number` ; `overflow values cached in memory`: `number` ; `page split during eviction deepened the tree`: `number` ; `page written requiring lookaside records`: `number` ; `pages read into cache`: `number` ; `pages read into cache requiring lookaside entries`: `number` ; `pages requested from the cache`: `number` ; `pages written from cache`: `number` ; `pages written requiring in-memory restoration`: `number` ; `tracked dirty bytes in the cache`: `number` ; `unmodified pages evicted`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5324

___

### cache\_walk

 **cache\_walk**: { `Average difference between current eviction generation when the page was last considered`: `number` ; `Average on-disk page image size seen`: `number` ; `Clean pages currently in cache`: `number` ; `Current eviction generation`: `number` ; `Dirty pages currently in cache`: `number` ; `Entries in the root page`: `number` ; `Internal pages currently in cache`: `number` ; `Leaf pages currently in cache`: `number` ; `Maximum difference between current eviction generation when the page was last considered`: `number` ; `Maximum page size seen`: `number` ; `Minimum on-disk page image size seen`: `number` ; `On-disk page image sizes smaller than a single allocation unit`: `number` ; `Pages created in memory and never written`: `number` ; `Pages currently queued for eviction`: `number` ; `Pages that could not be queued for eviction`: `number` ; `Refs skipped during cache traversal`: `number` ; `Size of the root page`: `number` ; `Total number of pages currently in cache`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5349

___

### compression

 **compression**: { `compressed pages read`: `number` ; `compressed pages written`: `number` ; `page written failed to compress`: `number` ; `page written was too small to compress`: `number` ; `raw compression call failed, additional data available`: `number` ; `raw compression call failed, no additional data available`: `number` ; `raw compression call succeeded`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5369

___

### cursor

 **cursor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bulk-loaded cursor-insert calls` | `number` |
| `create calls` | `number` |
| `cursor-insert key and value bytes inserted` | `number` |
| `cursor-remove key bytes removed` | `number` |
| `cursor-update value bytes updated` | `number` |
| `insert calls` | `number` |
| `next calls` | `number` |
| `prev calls` | `number` |
| `remove calls` | `number` |
| `reset calls` | `number` |
| `restarted searches` | `number` |
| `search calls` | `number` |
| `search near calls` | `number` |
| `truncate calls` | `number` |
| `update calls` | `number` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5378

___

### reconciliation

 **reconciliation**: { `dictionary matches`: `number` ; `fast-path pages deleted`: `number` ; `internal page key bytes discarded using suffix compression`: `number` ; `internal page multi-block writes`: `number` ; `internal-page overflow keys`: `number` ; `leaf page key bytes discarded using prefix compression`: `number` ; `leaf page multi-block writes`: `number` ; `leaf-page overflow keys`: `number` ; `maximum blocks required for a page`: `number` ; `overflow values written`: `number` ; `page checksum matches`: `number` ; `page reconciliation calls`: `number` ; `page reconciliation calls for eviction`: `number` ; `pages deleted`: `number`  } & [`Document`](Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:5395
