# ForeignKeyMetadata

Contains all information about entity's foreign key.

## Constructors

### constructor

**new ForeignKeyMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.columns` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `options.deferrable?` | [`DeferrableType`](../index.md#deferrabletype) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |
| `options.name?` | `string` |
| `options.namingStrategy?` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |
| `options.onDelete?` | [`OnDeleteType`](../index.md#ondeletetype) |
| `options.onUpdate?` | [`OnUpdateType`](../index.md#onupdatetype) |
| `options.referencedColumns` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `options.referencedEntityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:61

## Properties

### columnNames

 **columnNames**: `string`[]

Gets array of column names.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:52

___

### columns

 **columns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Array of columns of this foreign key.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:22

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../index.md#deferrabletype)

When to check the constraints of a foreign key.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:38

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata where this foreign key is.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:14

___

### givenName

 `Optional` **givenName**: `string`

User specified unique constraint name.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:60

___

### name

 **name**: `string`

Gets foreign key name.
If unique constraint name was given by a user then it stores givenName.
If unique constraint name was not given then its generated.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:48

___

### onDelete

 `Optional` **onDelete**: [`OnDeleteType`](../index.md#ondeletetype)

What to do with a relation on deletion of the row containing a foreign key.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:30

___

### onUpdate

 `Optional` **onUpdate**: [`OnUpdateType`](../index.md#onupdatetype)

What to do with a relation on update of the row containing a foreign key.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:34

___

### referencedColumnNames

 **referencedColumnNames**: `string`[]

Gets array of referenced column names.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:56

___

### referencedColumns

 **referencedColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Array of referenced columns.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:26

___

### referencedEntityMetadata

 **referencedEntityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata which this foreign key references.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:18

___

### referencedTablePath

 **referencedTablePath**: `string`

Gets the table name to which this foreign key is referenced.

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:42

## Methods

### build

**build**(`namingStrategy`): `void`

Builds some depend foreign key properties.
Must be called after all entity metadatas and their columns are built.

#### Parameters

| Name |
| :------ |
| `namingStrategy` | [`NamingStrategyInterface`](../interfaces/NamingStrategyInterface.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/ForeignKeyMetadata.d.ts:76
