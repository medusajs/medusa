# ReadPreferenceLikeOptions

## Hierarchy

- [`ReadPreferenceOptions`](ReadPreferenceOptions.md)

  ↳ **`ReadPreferenceLikeOptions`**

  ↳↳ [`ReadPreferenceFromOptions`](ReadPreferenceFromOptions.md)

## Properties

### hedge

 `Optional` **hedge**: [`HedgeOptions`](HedgeOptions.md)

Server mode in which the same query is dispatched in parallel to multiple replica set members.

#### Inherited from

[ReadPreferenceOptions](ReadPreferenceOptions.md).[hedge](ReadPreferenceOptions.md#hedge)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4541

___

### maxStalenessSeconds

 `Optional` **maxStalenessSeconds**: `number`

Max secondary read staleness in seconds, Minimum value is 90 seconds.

#### Inherited from

[ReadPreferenceOptions](ReadPreferenceOptions.md).[maxStalenessSeconds](ReadPreferenceOptions.md#maxstalenessseconds)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4539

___

### readPreference

 `Optional` **readPreference**: [`ReadPreferenceLike`](../index.md#readpreferencelike) \| { `maxStalenessSeconds?`: `number` ; `mode?`: [`ReadPreferenceMode`](../index.md#readpreferencemode-1) ; `preference?`: [`ReadPreferenceMode`](../index.md#readpreferencemode-1) ; `tags?`: [`TagSet`](../index.md#tagset)[]  }

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4519
