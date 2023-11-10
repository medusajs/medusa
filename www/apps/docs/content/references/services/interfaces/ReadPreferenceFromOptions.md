# ReadPreferenceFromOptions

## Hierarchy

- [`ReadPreferenceLikeOptions`](ReadPreferenceLikeOptions.md)

  ↳ **`ReadPreferenceFromOptions`**

## Properties

### hedge

 `Optional` **hedge**: [`HedgeOptions`](HedgeOptions.md)

Server mode in which the same query is dispatched in parallel to multiple replica set members.

#### Overrides

[ReadPreferenceLikeOptions](ReadPreferenceLikeOptions.md).[hedge](ReadPreferenceLikeOptions.md#hedge)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4513

___

### maxStalenessSeconds

 `Optional` **maxStalenessSeconds**: `number`

Max secondary read staleness in seconds, Minimum value is 90 seconds.

#### Inherited from

[ReadPreferenceLikeOptions](ReadPreferenceLikeOptions.md).[maxStalenessSeconds](ReadPreferenceLikeOptions.md#maxstalenessseconds)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4539

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../index.md#readpreferencelike) \| { `maxStalenessSeconds?`: `number` ; `mode?`: [`ReadPreferenceMode`](../index.md#readpreferencemode-1) ; `preference?`: [`ReadPreferenceMode`](../index.md#readpreferencemode-1) ; `tags?`: [`TagSet`](../index.md#tagset)[]  }

#### Inherited from

[ReadPreferenceLikeOptions](ReadPreferenceLikeOptions.md).[readPreference](ReadPreferenceLikeOptions.md#readpreference)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4519

___

### readPreferenceTags

 `Optional` **readPreferenceTags**: [`TagSet`](../index.md#tagset)[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4512

___

### session

 `Optional` **session**: [`ClientSession`](../classes/ClientSession.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4511
