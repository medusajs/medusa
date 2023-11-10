# Migration

Represents entity of the migration in the database.

## Constructors

### constructor

**new Migration**(`id`, `timestamp`, `name`, `instance?`, `transaction?`)

#### Parameters

| Name |
| :------ |
| `id` | `undefined` \| `number` |
| `timestamp` | `number` |
| `name` | `string` |
| `instance?` | [`MigrationInterface`](../interfaces/MigrationInterface.md) |
| `transaction?` | `boolean` |

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:27

## Properties

### id

 **id**: `undefined` \| `number`

Migration id.
Indicates order of the executed migrations.

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:10

___

### instance

 `Optional` **instance**: [`MigrationInterface`](../interfaces/MigrationInterface.md)

Migration instance that needs to be run.

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:22

___

### name

 **name**: `string`

Name of the migration (class name).

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:18

___

### timestamp

 **timestamp**: `number`

Timestamp of the migration.

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:14

___

### transaction

 `Optional` **transaction**: `boolean`

Whether to run this migration within a transaction

#### Defined in

node_modules/typeorm/migration/Migration.d.ts:26
