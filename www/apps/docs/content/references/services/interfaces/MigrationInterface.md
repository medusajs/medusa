# MigrationInterface

Migrations should implement this interface and all its methods.

## Properties

### name

 `Optional` **name**: `string`

Optional migration name, defaults to class name.

#### Defined in

node_modules/typeorm/migration/MigrationInterface.d.ts:9

___

### transaction

 `Optional` **transaction**: `boolean`

Optional flag to determine whether to run the migration in a transaction or not.
Can only be used when `migrationsTransactionMode` is either "each" or "none"
Defaults to `true` when `migrationsTransactionMode` is "each"
Defaults to `false` when `migrationsTransactionMode` is "none"

#### Defined in

node_modules/typeorm/migration/MigrationInterface.d.ts:16

## Methods

### down

**down**(`queryRunner`): `Promise`<`any`\>

Reverse the migrations.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/migration/MigrationInterface.d.ts:24

___

### up

**up**(`queryRunner`): `Promise`<`any`\>

Run the migrations.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/migration/MigrationInterface.d.ts:20
