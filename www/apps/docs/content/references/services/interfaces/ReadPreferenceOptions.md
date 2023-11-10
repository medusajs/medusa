# ReadPreferenceOptions

## Hierarchy

- **`ReadPreferenceOptions`**

  ↳ [`ReadPreferenceLikeOptions`](ReadPreferenceLikeOptions.md)

## Properties

### hedge

 `Optional` **hedge**: [`HedgeOptions`](HedgeOptions.md)

Server mode in which the same query is dispatched in parallel to multiple replica set members.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4541

___

### maxStalenessSeconds

 `Optional` **maxStalenessSeconds**: `number`

Max secondary read staleness in seconds, Minimum value is 90 seconds.

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4539
