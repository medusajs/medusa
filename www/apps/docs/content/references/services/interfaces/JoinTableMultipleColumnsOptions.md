# JoinTableMultipleColumnsOptions

Describes all join table with multiple column options.

## Properties

### database

 `Optional` **database**: `string`

Database where join table will be created.
Works only in some databases (like mysql and mssql).

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:23

___

### inverseJoinColumns

 `Optional` **inverseJoinColumns**: [`JoinColumnOptions`](JoinColumnOptions.md)[]

Second (inverse) column of the join table.

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:18

___

### joinColumns

 `Optional` **joinColumns**: [`JoinColumnOptions`](JoinColumnOptions.md)[]

First column of the join table.

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:14

___

### name

 `Optional` **name**: `string`

Name of the table that will be created to store values of the both tables (join table).
By default is auto generated.

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:10

___

### schema

 `Optional` **schema**: `string`

Schema where join table will be created.
Works only in some databases (like postgres and mssql).

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:28

___

### synchronize

 `Optional` `Readonly` **synchronize**: `boolean`

Indicates if schema synchronization is enabled or disabled junction table.
If it will be set to false then schema sync will and migrations ignores junction table.
By default schema synchronization is enabled.

#### Defined in

node_modules/typeorm/decorator/options/JoinTableMultipleColumnsOptions.d.ts:34
