# MappedColumnTypes

Orm has special columns and we need to know what database column types should be for those types.
Column types are driver dependant.

## Properties

### cacheDuration

 **cacheDuration**: [`ColumnType`](../types/ColumnType.md)

Column type for duration column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:78

___

### cacheId

 **cacheId**: [`ColumnType`](../types/ColumnType.md)

Column type for identifier column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:66

___

### cacheIdentifier

 **cacheIdentifier**: [`ColumnType`](../types/ColumnType.md)

Column type for identifier column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:70

___

### cacheQuery

 **cacheQuery**: [`ColumnType`](../types/ColumnType.md)

Column type for query column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:82

___

### cacheResult

 **cacheResult**: [`ColumnType`](../types/ColumnType.md)

Column type for result column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:86

___

### cacheTime

 **cacheTime**: [`ColumnType`](../types/ColumnType.md)

Column type for time column in query result cache table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:74

___

### createDate

 **createDate**: [`ColumnType`](../types/ColumnType.md)

Column type for the create date column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:10

___

### createDateDefault

 **createDateDefault**: `string`

Default value should be used by a database for "created date" column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:18

___

### createDatePrecision

 `Optional` **createDatePrecision**: `number`

Precision of datetime column. Used in MySql to define milliseconds.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:14

___

### deleteDate

 **deleteDate**: [`ColumnType`](../types/ColumnType.md)

Column type for the delete date column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:34

___

### deleteDateNullable

 **deleteDateNullable**: `boolean`

Nullable value should be used by a database for "deleted date" column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:42

___

### deleteDatePrecision

 `Optional` **deleteDatePrecision**: `number`

Precision of datetime column. Used in MySql to define milliseconds.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:38

___

### metadataDatabase

 **metadataDatabase**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata database name column in typeorm metadata table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:95

___

### metadataName

 **metadataName**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata name column in typeorm metadata table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:107

___

### metadataSchema

 **metadataSchema**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata schema name column in typeorm metadata table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:99

___

### metadataTable

 **metadataTable**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata table name column in typeorm metadata table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:103

___

### metadataType

 **metadataType**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata type column in typeorm metadata table.
Stores type of metadata. E.g. 'VIEW' or 'CHECK'

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:91

___

### metadataValue

 **metadataValue**: [`ColumnType`](../types/ColumnType.md)

Column type for metadata value column in typeorm metadata table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:111

___

### migrationId

 **migrationId**: [`ColumnType`](../types/ColumnType.md)

Column type of id column used for migrations table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:54

___

### migrationName

 **migrationName**: [`ColumnType`](../types/ColumnType.md)

Column type for migration name column used for migrations table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:62

___

### migrationTimestamp

 **migrationTimestamp**: [`ColumnType`](../types/ColumnType.md)

Column type of timestamp column used for migrations table.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:58

___

### treeLevel

 **treeLevel**: [`ColumnType`](../types/ColumnType.md)

Column type for the tree level column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:50

___

### updateDate

 **updateDate**: [`ColumnType`](../types/ColumnType.md)

Column type for the update date column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:22

___

### updateDateDefault

 **updateDateDefault**: `string`

Default value should be used by a database for "updated date" column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:30

___

### updateDatePrecision

 `Optional` **updateDatePrecision**: `number`

Precision of datetime column. Used in MySql to define milliseconds.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:26

___

### version

 **version**: [`ColumnType`](../types/ColumnType.md)

Column type for the version column.

#### Defined in

node_modules/typeorm/driver/types/MappedColumnTypes.d.ts:46
