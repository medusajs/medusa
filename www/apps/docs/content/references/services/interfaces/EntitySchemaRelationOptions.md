# EntitySchemaRelationOptions

## Properties

### cascade

 `Optional` **cascade**: `boolean` \| (``"insert"`` \| ``"update"`` \| ``"remove"`` \| ``"soft-remove"`` \| ``"recover"``)[]

If set to true then it means that related object can be allowed to be inserted / updated / removed to the db.
This is option a shortcut if you would like to set cascadeInsert, cascadeUpdate and cascadeRemove to true.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:68

___

### createForeignKeyConstraints

 `Optional` **createForeignKeyConstraints**: `boolean`

Indicates whether foreign key constraints will be created for join columns.
Can be used only for many-to-one and owner one-to-one relations.
Defaults to true.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:47

___

### default

 `Optional` **default**: `any`

Default database value.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:72

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../index.md#deferrabletype)

Indicate if foreign key constraints can be deferred.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:88

___

### eager

 `Optional` **eager**: `boolean`

Indicates if this relation will be eagerly loaded.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:29

___

### inverseSide

 `Optional` **inverseSide**: `string`

Inverse side of the relation.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:21

___

### joinColumn

 `Optional` **joinColumn**: `boolean` \| [`JoinColumnOptions`](JoinColumnOptions.md) \| [`JoinColumnOptions`](JoinColumnOptions.md)[]

Join column options of this column. If set to true then it simply means that it has a join column.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:55

___

### joinTable

 `Optional` **joinTable**: `boolean` \| [`JoinTableOptions`](JoinTableOptions.md) \| [`JoinTableMultipleColumnsOptions`](JoinTableMultipleColumnsOptions.md)

Join table options of this column. If set to true then it simply means that it has a join table.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:51

___

### lazy

 `Optional` **lazy**: `boolean`

Indicates if this relation will be lazily loaded.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:25

___

### nullable

 `Optional` **nullable**: `boolean`

Indicates if relation column value can be nullable or not.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:76

___

### onDelete

 `Optional` **onDelete**: [`OnDeleteType`](../index.md#ondeletetype)

Database cascade action on delete.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:80

___

### onUpdate

 `Optional` **onUpdate**: [`OnUpdateType`](../index.md#onupdatetype)

Database cascade action on update.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:84

___

### orphanedRowAction

 `Optional` **orphanedRowAction**: ``"delete"`` \| ``"nullify"`` \| ``"soft-delete"`` \| ``"disable"``

When a parent is saved (with cascading but) without a child row that still exists in database, this will control what shall happen to them.
delete will remove these rows from database. nullify will remove the relation key.
skip will keep the relation intact. Removal of related item is only possible through its own repo.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:94

___

### persistence

 `Optional` **persistence**: `boolean`

Indicates if persistence is enabled for the relation.
By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:36

___

### primary

 `Optional` **primary**: `boolean`

Indicates if this relation will be a primary key.
Can be used only for many-to-one and owner one-to-one relations.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:41

___

### target

 **target**: [`EntityTarget`](../index.md#entitytarget)<`any`\>

Indicates with which entity this relation is made.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:13

___

### treeChildren

 `Optional` **treeChildren**: `boolean`

Indicates if this is a children (can be only one-to-many relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:63

___

### treeParent

 `Optional` **treeParent**: `boolean`

Indicates if this is a parent (can be only many-to-one relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:59

___

### type

 **type**: [`RelationType`](../index.md#relationtype)

Type of relation. Can be one of the value of the RelationTypes class.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationOptions.d.ts:17
