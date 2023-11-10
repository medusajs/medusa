# Logger

Performs logging of the events in TypeORM.

## Methods

### log

**log**(`level`, `message`, `queryRunner?`): `any`

Perform logging using given logger, or by default to the console.
Log has its own level and message.

#### Parameters

| Name |
| :------ |
| `level` | ``"info"`` \| ``"warn"`` \| ``"log"`` |
| `message` | `any` |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:30

___

### logMigration

**logMigration**(`message`, `queryRunner?`): `any`

Logs events from the migrations run process.

#### Parameters

| Name |
| :------ |
| `message` | `string` |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:25

___

### logQuery

**logQuery**(`query`, `parameters?`, `queryRunner?`): `any`

Logs query and parameters used in it.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:9

___

### logQueryError

**logQueryError**(`error`, `query`, `parameters?`, `queryRunner?`): `any`

Logs query that is failed.

#### Parameters

| Name |
| :------ |
| `error` | `string` \| `Error` |
| `query` | `string` |
| `parameters?` | `any`[] |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:13

___

### logQuerySlow

**logQuerySlow**(`time`, `query`, `parameters?`, `queryRunner?`): `any`

Logs query that is slow.

#### Parameters

| Name |
| :------ |
| `time` | `number` |
| `query` | `string` |
| `parameters?` | `any`[] |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:17

___

### logSchemaBuild

**logSchemaBuild**(`message`, `queryRunner?`): `any`

Logs events from the schema build process.

#### Parameters

| Name |
| :------ |
| `message` | `string` |
| `queryRunner?` | [`QueryRunner`](QueryRunner.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/logger/Logger.d.ts:21
