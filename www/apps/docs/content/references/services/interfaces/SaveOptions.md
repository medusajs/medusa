# SaveOptions

Special options passed to Repository#save, Repository#insert and Repository#update methods.

## Properties

### chunk

 `Optional` **chunk**: `number`

Breaks save execution into chunks of a given size.
For example, if you want to save 100,000 objects but you have issues with saving them,
you can break them into 10 groups of 10,000 objects (by setting { chunk: 10000 }) and save each group separately.
This option is needed to perform very big insertions when you have issues with underlying driver parameter number limitation.

#### Defined in

node_modules/typeorm/repository/SaveOptions.d.ts:26

___

### data

 `Optional` **data**: `any`

Additional data to be passed with persist method.
This data can be used in subscribers then.

#### Defined in

node_modules/typeorm/repository/SaveOptions.d.ts:9

___

### listeners

 `Optional` **listeners**: `boolean`

Indicates if listeners and subscribers are called for this operation.
By default they are enabled, you can disable them by setting { listeners: false } in save/remove options.

#### Defined in

node_modules/typeorm/repository/SaveOptions.d.ts:14

___

### reload

 `Optional` **reload**: `boolean`

Flag to determine whether the entity that is being persisted
should be reloaded during the persistence operation.

It will work only on databases which does not support RETURNING / OUTPUT statement.
Enabled by default.

#### Defined in

node_modules/typeorm/repository/SaveOptions.d.ts:34

___

### transaction

 `Optional` **transaction**: `boolean`

By default transactions are enabled and all queries in persistence operation are wrapped into the transaction.
You can disable this behaviour by setting { transaction: false } in the persistence options.

#### Defined in

node_modules/typeorm/repository/SaveOptions.d.ts:19
