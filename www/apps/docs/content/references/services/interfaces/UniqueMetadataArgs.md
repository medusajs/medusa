# UniqueMetadataArgs

Arguments for UniqueMetadata class.

## Properties

### columns

 `Optional` **columns**: `string`[] \| (`object?`: `any`) => `any`[] \| { `[key: string]`: `number`;  }

Columns combination to be unique.

#### Defined in

node_modules/typeorm/metadata-args/UniqueMetadataArgs.d.ts:17

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../index.md#deferrabletype)

Indicate if unique constraints can be deferred.

#### Defined in

node_modules/typeorm/metadata-args/UniqueMetadataArgs.d.ts:23

___

### name

 `Optional` **name**: `string`

Unique constraint name.

#### Defined in

node_modules/typeorm/metadata-args/UniqueMetadataArgs.d.ts:13

___

### target

 **target**: `string` \| `Function`

Class to which index is applied.

#### Defined in

node_modules/typeorm/metadata-args/UniqueMetadataArgs.d.ts:9
