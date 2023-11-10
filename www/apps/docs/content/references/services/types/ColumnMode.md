# ColumnMode

 **ColumnMode**: ``"regular"`` \| ``"virtual"`` \| ``"virtual-property"`` \| ``"createDate"`` \| ``"updateDate"`` \| ``"deleteDate"`` \| ``"version"`` \| ``"treeChildrenCount"`` \| ``"treeLevel"`` \| ``"objectId"`` \| ``"array"``

Kinda type of the column. Not a type in the database, but locally used type to determine what kind of column
we are working with.
For example, "primary" means that it will be a primary column, or "createDate" means that it will create a create
date column.

#### Defined in

node_modules/typeorm/metadata-args/types/ColumnMode.d.ts:7
