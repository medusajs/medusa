# RelationOptions

Describes all relation's options.

## Properties

### cascade

 `Optional` **cascade**: `boolean` \| (``"insert"`` \| ``"update"`` \| ``"remove"`` \| ``"soft-remove"`` \| ``"recover"``)[]

Sets cascades options for the given relation.
If set to true then it means that related object can be allowed to be inserted or updated in the database.
You can separately restrict cascades to insertion or updation using following syntax:

cascade: ["insert", "update", "remove", "soft-remove", "recover"] // include or exclude one of them

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:15

___

### createForeignKeyConstraints

 `Optional` **createForeignKeyConstraints**: `boolean`

Indicates whether foreign key constraints will be created for join columns.
Can be used only for many-to-one and owner one-to-one relations.
Defaults to true.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:37

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../types/DeferrableType.md)

Indicate if foreign key constraints can be deferred.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:31

___

### eager

 `Optional` **eager**: `boolean`

Set this relation to be eager.
Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods.
Only using QueryBuilder prevents loading eager relations.
Eager flag cannot be set from both sides of relation - you can eager load only one side of the relationship.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:49

___

### lazy

 `Optional` **lazy**: `boolean`

Set this relation to be lazy. Note: lazy relations are promises. When you call them they return promise
which resolve relation result then. If your property's type is Promise then this relation is set to lazy automatically.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:42

___

### nullable

 `Optional` **nullable**: `boolean`

Indicates if relation column value can be nullable or not.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:19

___

### onDelete

 `Optional` **onDelete**: [`OnDeleteType`](../types/OnDeleteType.md)

Database cascade action on delete.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:23

___

### onUpdate

 `Optional` **onUpdate**: [`OnUpdateType`](../types/OnUpdateType.md)

Database cascade action on update.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:27

___

### orphanedRowAction

 `Optional` **orphanedRowAction**: ``"delete"`` \| ``"nullify"`` \| ``"soft-delete"`` \| ``"disable"``

When a parent is saved (with cascading but) without a child row that still exists in database, this will control what shall happen to them.
delete will remove these rows from database.
nullify will remove the relation key.
disable will keep the relation intact. Removal of related item is only possible through its own repo.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:63

___

### persistence

 `Optional` **persistence**: `boolean`

Indicates if persistence is enabled for the relation.
By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.

#### Defined in

node_modules/typeorm/decorator/options/RelationOptions.d.ts:56
