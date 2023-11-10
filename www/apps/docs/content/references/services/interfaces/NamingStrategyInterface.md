# NamingStrategyInterface

Naming strategy defines how auto-generated names for such things like table name, or table column gonna be
generated.

## Properties

### materializedPathColumnName

 **materializedPathColumnName**: `string`

Column name for materialized paths.

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:116

___

### name

 `Optional` **name**: `string`

Naming strategy name.

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:11

___

### nestedSetColumnNames

 **nestedSetColumnNames**: `Object`

Column names for nested sets.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `left` | `string` |
| `right` | `string` |

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:109

## Methods

### checkConstraintName

**checkConstraintName**(`tableOrName`, `expression`, `isEnum?`): `string`

Gets the name of the check constraint.

"isEnum" parameter is used to indicate if this check constraint used
to handle "simple-enum" type for databases that are not supporting "enum"
type out of the box. If "true", constraint is ignored during CHECK constraints
synchronization.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `expression` | `string` |
| `isEnum?` | `boolean` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:66

___

### closureJunctionTableName

**closureJunctionTableName**(`originalClosureTableName`): `string`

Creates a table name for a junction table of a closure table.

#### Parameters

| Name | Description |
| :------ | :------ |
| `originalClosureTableName` | `string` | Name of the closure table which owns this junction table. |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:24

___

### columnName

**columnName**(`propertyName`, `customName`, `embeddedPrefixes`): `string`

Gets the table's column name from the given property name.

#### Parameters

| Name |
| :------ |
| `propertyName` | `string` |
| `customName` | `undefined` \| `string` |
| `embeddedPrefixes` | `string`[] |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:28

___

### defaultConstraintName

**defaultConstraintName**(`tableOrName`, `columnName`): `string`

Gets the table's default constraint name from the given table name and column name.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `columnName` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:49

___

### eagerJoinRelationAlias

**eagerJoinRelationAlias**(`alias`, `propertyPath`): `string`

Gets the name of the alias used for relation joins.

#### Parameters

| Name |
| :------ |
| `alias` | `string` |
| `propertyPath` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:105

___

### exclusionConstraintName

**exclusionConstraintName**(`tableOrName`, `expression`): `string`

Gets the name of the exclusion constraint.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `expression` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:70

___

### foreignKeyName

**foreignKeyName**(`tableOrName`, `columnNames`, `referencedTablePath?`, `referencedColumnNames?`): `string`

Gets the name of the foreign key.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `columnNames` | `string`[] |
| `referencedTablePath?` | `string` |
| `referencedColumnNames?` | `string`[] |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:53

___

### indexName

**indexName**(`tableOrName`, `columns`, `where?`): `string`

Gets the name of the index - simple and compose index.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) \| [`View`](../classes/View.md) |
| `columns` | `string`[] |
| `where?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:57

___

### joinColumnName

**joinColumnName**(`relationName`, `referencedColumnName`): `string`

Gets the name of the join column used in the one-to-one and many-to-one relations.

#### Parameters

| Name |
| :------ |
| `relationName` | `string` |
| `referencedColumnName` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:74

___

### joinTableColumnDuplicationPrefix

**joinTableColumnDuplicationPrefix**(`columnName`, `index`): `string`

Columns in join tables can have duplicate names in case of self-referencing.
This method provide a resolution for such column names.

#### Parameters

| Name |
| :------ |
| `columnName` | `string` |
| `index` | `number` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:83

___

### joinTableColumnName

**joinTableColumnName**(`tableName`, `propertyName`, `columnName?`): `string`

Gets the name of the column used for columns in the junction tables.

The reverse?:boolean parameter denotes if the joinTableColumnName is called for the junctionColumn (false)
or the inverseJunctionColumns (true)

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `propertyName` | `string` |
| `columnName?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:90

___

### joinTableInverseColumnName

**joinTableInverseColumnName**(`tableName`, `propertyName`, `columnName?`): `string`

Gets the name of the column used for columns in the junction tables from the invers side of the relationship.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `propertyName` | `string` |
| `columnName?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:94

___

### joinTableName

**joinTableName**(`firstTableName`, `secondTableName`, `firstPropertyName`, `secondPropertyName`): `string`

Gets the name of the join table used in the many-to-many relations.

#### Parameters

| Name |
| :------ |
| `firstTableName` | `string` |
| `secondTableName` | `string` |
| `firstPropertyName` | `string` |
| `secondPropertyName` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:78

___

### prefixTableName

**prefixTableName**(`prefix`, `tableName`): `string`

Adds globally set prefix to the table name.
This method is executed no matter if prefix was set or not.
Table name is either user's given table name, either name generated from entity target.
Note that table name comes here already normalized by #tableName method.

#### Parameters

| Name |
| :------ |
| `prefix` | `string` |
| `tableName` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:101

___

### primaryKeyName

**primaryKeyName**(`tableOrName`, `columnNames`): `string`

Gets the table's primary key name from the given table name and column names.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `columnNames` | `string`[] |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:36

___

### relationConstraintName

**relationConstraintName**(`tableOrName`, `columnNames`, `where?`): `string`

Gets the relation constraint (UNIQUE or UNIQUE INDEX) name from the given table name, column names
and WHERE condition, if UNIQUE INDEX used.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `columnNames` | `string`[] |
| `where?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:45

___

### relationName

**relationName**(`propertyName`): `string`

Gets the table's relation name from the given property name.

#### Parameters

| Name |
| :------ |
| `propertyName` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:32

___

### tableName

**tableName**(`targetName`, `userSpecifiedName`): `string`

Normalizes table name.

#### Parameters

| Name | Description |
| :------ | :------ |
| `targetName` | `string` | Name of the target entity that can be used to generate a table name. |
| `userSpecifiedName` | `undefined` \| `string` | For example if user specified a table name in a decorator, e.g. @Entity("name") |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:18

___

### uniqueConstraintName

**uniqueConstraintName**(`tableOrName`, `columnNames`): `string`

Gets the table's unique constraint name from the given table name and column names.

#### Parameters

| Name |
| :------ |
| `tableOrName` | `string` \| [`Table`](../classes/Table.md) |
| `columnNames` | `string`[] |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/naming-strategy/NamingStrategyInterface.d.ts:40
