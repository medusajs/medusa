# Table

Table in the database represented in this class.

## Constructors

### constructor

**new Table**(`options?`)

#### Parameters

| Name |
| :------ |
| `options?` | [`TableOptions`](../interfaces/TableOptions.md) |

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:67

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:14

___

### checks

 **checks**: [`TableCheck`](TableCheck.md)[]

Table check constraints.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:48

___

### columns

 **columns**: [`TableColumn`](TableColumn.md)[]

Table columns.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:32

___

### database

 `Optional` **database**: `string`

Database name that this table resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:18

___

### engine

 `Optional` **engine**: `string`

Table engine.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:66

___

### exclusions

 **exclusions**: [`TableExclusion`](TableExclusion.md)[]

Table exclusion constraints.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:52

___

### foreignKeys

 **foreignKeys**: [`TableForeignKey`](TableForeignKey.md)[]

Table foreign keys.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:40

___

### indices

 **indices**: [`TableIndex`](TableIndex.md)[]

Table indices.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:36

___

### justCreated

 **justCreated**: `boolean`

Indicates if table was just created.
This is needed, for example to check if we need to skip primary keys creation
for new tables.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:58

___

### name

 **name**: `string`

May contain database name, schema name and table name, unless they're the current database.

E.g. myDB.mySchema.myTable

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:28

___

### schema

 `Optional` **schema**: `string`

Schema name that this table resides in if it applies.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:22

___

### uniques

 **uniques**: [`TableUnique`](TableUnique.md)[]

Table unique constraints.

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:44

___

### withoutRowid

 `Optional` **withoutRowid**: `boolean`

Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:62

## Accessors

### primaryColumns

`get` **primaryColumns**(): [`TableColumn`](TableColumn.md)[]

#### Returns

[`TableColumn`](TableColumn.md)[]

-`TableColumn[]`: 
	-`TableColumn`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:68

## Methods

### addCheckConstraint

**addCheckConstraint**(`checkConstraint`): `void`

Adds check constraint.

#### Parameters

| Name |
| :------ |
| `checkConstraint` | [`TableCheck`](TableCheck.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:92

___

### addColumn

**addColumn**(`column`): `void`

Add column and creates its constraints.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:76

___

### addExclusionConstraint

**addExclusionConstraint**(`exclusionConstraint`): `void`

Adds exclusion constraint.

#### Parameters

| Name |
| :------ |
| `exclusionConstraint` | [`TableExclusion`](TableExclusion.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:100

___

### addForeignKey

**addForeignKey**(`foreignKey`): `void`

Adds foreign keys.

#### Parameters

| Name |
| :------ |
| `foreignKey` | [`TableForeignKey`](TableForeignKey.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:108

___

### addIndex

**addIndex**(`index`, `isMysql?`): `void`

Adds index.

#### Parameters

| Name |
| :------ |
| `index` | [`TableIndex`](TableIndex.md) |
| `isMysql?` | `boolean` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:116

___

### addUniqueConstraint

**addUniqueConstraint**(`uniqueConstraint`): `void`

Adds unique constraint.

#### Parameters

| Name |
| :------ |
| `uniqueConstraint` | [`TableUnique`](TableUnique.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:84

___

### clone

**clone**(): [`Table`](Table.md)

Clones this table to a new table with all properties cloned.

#### Returns

[`Table`](Table.md)

-`Table`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:72

___

### findColumnByName

**findColumnByName**(`name`): `undefined` \| [`TableColumn`](TableColumn.md)

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`TableColumn`](TableColumn.md)

-`undefined \| TableColumn`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:121

___

### findColumnChecks

**findColumnChecks**(`column`): [`TableCheck`](TableCheck.md)[]

Returns all column checks.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

[`TableCheck`](TableCheck.md)[]

-`TableCheck[]`: 
	-`TableCheck`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:137

___

### findColumnForeignKeys

**findColumnForeignKeys**(`column`): [`TableForeignKey`](TableForeignKey.md)[]

Returns all column foreign keys.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

[`TableForeignKey`](TableForeignKey.md)[]

-`TableForeignKey[]`: 
	-`TableForeignKey`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:129

___

### findColumnIndices

**findColumnIndices**(`column`): [`TableIndex`](TableIndex.md)[]

Returns all column indices.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

[`TableIndex`](TableIndex.md)[]

-`TableIndex[]`: 
	-`TableIndex`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:125

___

### findColumnUniques

**findColumnUniques**(`column`): [`TableUnique`](TableUnique.md)[]

Returns all column uniques.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

[`TableUnique`](TableUnique.md)[]

-`TableUnique[]`: 
	-`TableUnique`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:133

___

### removeCheckConstraint

**removeCheckConstraint**(`removedCheck`): `void`

Removes check constraint.

#### Parameters

| Name |
| :------ |
| `removedCheck` | [`TableCheck`](TableCheck.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:96

___

### removeColumn

**removeColumn**(`column`): `void`

Remove column and its constraints.

#### Parameters

| Name |
| :------ |
| `column` | [`TableColumn`](TableColumn.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:80

___

### removeExclusionConstraint

**removeExclusionConstraint**(`removedExclusion`): `void`

Removes exclusion constraint.

#### Parameters

| Name |
| :------ |
| `removedExclusion` | [`TableExclusion`](TableExclusion.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:104

___

### removeForeignKey

**removeForeignKey**(`removedForeignKey`): `void`

Removes foreign key.

#### Parameters

| Name |
| :------ |
| `removedForeignKey` | [`TableForeignKey`](TableForeignKey.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:112

___

### removeIndex

**removeIndex**(`tableIndex`, `isMysql?`): `void`

Removes index.

#### Parameters

| Name |
| :------ |
| `tableIndex` | [`TableIndex`](TableIndex.md) |
| `isMysql?` | `boolean` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:120

___

### removeUniqueConstraint

**removeUniqueConstraint**(`removedUnique`): `void`

Removes unique constraint.

#### Parameters

| Name |
| :------ |
| `removedUnique` | [`TableUnique`](TableUnique.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:88

___

### create

`Static` **create**(`entityMetadata`, `driver`): [`Table`](Table.md)

Creates table from a given entity metadata.

#### Parameters

| Name |
| :------ |
| `entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |
| `driver` | [`Driver`](../interfaces/Driver.md) |

#### Returns

[`Table`](Table.md)

-`Table`: 

#### Defined in

node_modules/typeorm/schema-builder/table/Table.d.ts:141
