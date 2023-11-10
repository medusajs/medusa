# QueryBuilderCteOptions

## Properties

### columnNames

 `Optional` **columnNames**: `string`[]

Overwrite column names
If number of columns returned doesn't work, it throws

#### Defined in

node_modules/typeorm/query-builder/QueryBuilderCte.d.ts:16

___

### materialized

 `Optional` **materialized**: `boolean`

Supported only by Postgres currently
Oracle users should use query with undocumented materialize hint

#### Defined in

node_modules/typeorm/query-builder/QueryBuilderCte.d.ts:6

___

### recursive

 `Optional` **recursive**: `boolean`

Supported by Postgres, SQLite, MySQL and MariaDB
SQL Server automatically detects recursive queries

#### Defined in

node_modules/typeorm/query-builder/QueryBuilderCte.d.ts:11
