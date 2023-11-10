# RelationMetadata

Contains all information about some entity's relation.

## Constructors

### constructor

**new RelationMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`RelationMetadataArgs`](../interfaces/RelationMetadataArgs.md) |
| `options.embeddedMetadata?` | [`EmbeddedMetadata`](EmbeddedMetadata.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:229

## Properties

### createForeignKeyConstraints

 **createForeignKeyConstraints**: `boolean`

Indicates whether foreign key constraints will be created for join columns.
Can be used only for many-to-one and owner one-to-one relations.
Defaults to true.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:139

___

### deferrable

 `Optional` **deferrable**: [`DeferrableType`](../index.md#deferrabletype)

What to do with a relation on update of the row containing a foreign key.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:133

___

### embeddedMetadata

 `Optional` **embeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Embedded metadata where this relation is.
If this relation is not in embed then this property value is undefined.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:38

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the entity where this relation is placed.

For example for @ManyToMany(type => Category) in Post, entityMetadata will be metadata of Post entity.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:21

___

### foreignKeys

 **foreignKeys**: [`ForeignKeyMetadata`](ForeignKeyMetadata.md)[]

Foreign keys created for this relation.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:213

___

### givenInverseSidePropertyFactory

 **givenInverseSidePropertyFactory**: [`PropertyTypeFactory`](../index.md#propertytypefactory)<`any`\>

Inverse side of the relation set by user.

Inverse side set in the relation can be either string - property name of the column on inverse side,
either can be a function that accepts a map of properties with the object and returns one of them.
Second approach is used to achieve type-safety.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:201

___

### inverseEntityMetadata

 **inverseEntityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the entity that is targeted by this relation.

For example for @ManyToMany(type => Category) in Post, inverseEntityMetadata will be metadata of Category entity.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:27

___

### inverseJoinColumns

 **inverseJoinColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Inverse join table columns.
Inverse join columns are supported only for many-to-many relations
and can be obtained only from owner side of the relation.
From non-owner side of the relation join columns will be undefined.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:228

___

### inverseRelation

 `Optional` **inverseRelation**: [`RelationMetadata`](RelationMetadata.md)

Gets the relation metadata of the inverse side of this relation.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:205

___

### inverseSidePropertyPath

 **inverseSidePropertyPath**: `string`

Gets the property path of the inverse side of the relation.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:193

___

### isCascadeInsert

 **isCascadeInsert**: `boolean`

If set to true then related objects are allowed to be inserted to the database.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:101

___

### isCascadeRecover

 **isCascadeRecover**: `boolean`

If set to true then related objects are allowed to be recovered from the database.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:117

___

### isCascadeRemove

 **isCascadeRemove**: `boolean`

If set to true then related objects are allowed to be remove from the database.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:109

___

### isCascadeSoftRemove

 **isCascadeSoftRemove**: `boolean`

If set to true then related objects are allowed to be soft-removed from the database.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:113

___

### isCascadeUpdate

 **isCascadeUpdate**: `boolean`

If set to true then related objects are allowed to be updated in the database.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:105

___

### isEager

 **isEager**: `boolean`

Indicates if this relation is eagerly loaded.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:84

___

### isLazy

 **isLazy**: `boolean`

Indicates if this relation is lazily loaded.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:80

___

### isManyToMany

 **isManyToMany**: `boolean`

Checks if this relation's type is "many-to-many".

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:179

___

### isManyToManyNotOwner

 **isManyToManyNotOwner**: `boolean`

Checks if this relation's type is "many-to-many", and is NOT owner side of the relationship.
Not owner side means this side of relation does not have a join table.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:189

___

### isManyToManyOwner

 **isManyToManyOwner**: `boolean`

Checks if this relation's type is "many-to-many", and is owner side of the relationship.
Owner side means this side of relation has a join table.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:184

___

### isManyToOne

 **isManyToOne**: `boolean`

Checks if this relation's type is "many-to-one".

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:175

___

### isNullable

 **isNullable**: `boolean`

Indicates if relation column value can be nullable or not.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:121

___

### isOneToMany

 **isOneToMany**: `boolean`

Checks if this relation's type is "one-to-many".

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:171

___

### isOneToOne

 **isOneToOne**: `boolean`

Checks if this relation's type is "one-to-one".

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:153

___

### isOneToOneNotOwner

 **isOneToOneNotOwner**: `boolean`

Checks if this relation is NOT owner side of the "one-to-one" relation.
NOT owner side means this side of relation does not have a join column in the table.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:167

___

### isOneToOneOwner

 **isOneToOneOwner**: `boolean`

Checks if this relation is owner side of the "one-to-one" relation.
Owner side means this side of relation has a join column in the table.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:158

___

### isOwning

 **isOwning**: `boolean`

Indicates if this side is an owner of this relation.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:149

___

### isPrimary

 **isPrimary**: `boolean`

Indicates if this relation's column is a primary key.
Can be used only for many-to-one and owner one-to-one relations.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:76

___

### isTreeChildren

 **isTreeChildren**: `boolean`

Indicates if this is a children (can be only one-to-many relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:71

___

### isTreeParent

 **isTreeParent**: `boolean`

Indicates if this is a parent (can be only many-to-one relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:67

___

### isWithJoinColumn

 **isWithJoinColumn**: `boolean`

Checks if this relation has a join column (e.g. is it many-to-one or one-to-one owner side).

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:162

___

### joinColumns

 **joinColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Join table columns.
Join columns can be obtained only from owner side of the relation.
From non-owner side of the relation join columns will be empty.
If this relation is a many-to-one/one-to-one then it takes join columns from the current entity.
If this relation is many-to-many then it takes all owner join columns from the junction entity.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:221

___

### joinTableName

 **joinTableName**: `string`

Join table name.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:209

___

### junctionEntityMetadata

 `Optional` **junctionEntityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the junction table.
Junction tables have their own entity metadata objects.
Defined only for many-to-many relations.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:33

___

### onDelete

 `Optional` **onDelete**: [`OnDeleteType`](../index.md#ondeletetype)

What to do with a relation on deletion of the row containing a foreign key.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:125

___

### onUpdate

 `Optional` **onUpdate**: [`OnUpdateType`](../index.md#onupdatetype)

What to do with a relation on update of the row containing a foreign key.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:129

___

### orphanedRowAction

 `Optional` **orphanedRowAction**: ``"delete"`` \| ``"nullify"`` \| ``"soft-delete"`` \| ``"disable"``

When a parent is saved (with cascading but) without a child row that still exists in database, this will control what shall happen to them.
delete will remove these rows from database. nullify will remove the relation key.
skip will keep the relation intact. Removal of related item is only possible through its own repo.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:97

___

### persistenceEnabled

 **persistenceEnabled**: `boolean`

Indicates if persistence is enabled for the relation.
By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:91

___

### propertyName

 **propertyName**: `string`

Target's property name to which relation decorator is applied.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:56

___

### propertyPath

 **propertyPath**: `string`

Gets full path to this column property (including relation name).
Full path is relevant when column is used in embeds (one or multiple nested).
For example it will return "counters.subcounters.likes".
If property is not in embeds then it returns just property name of the column.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:63

___

### relationType

 **relationType**: [`RelationType`](../index.md#relationtype)

Relation type, e.g. is it one-to-one, one-to-many, many-to-one or many-to-many.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:42

___

### target

 **target**: `string` \| `Function`

Target entity to which this relation is applied.
Target IS NOT equal to entityMetadata.target, because relation

For example for @ManyToMany(type => Category) in Post, target will be Post.
If @ManyToMany(type => Category) is in Counters which is embedded into Post, target will be Counters.
If @ManyToMany(type => Category) is in abstract class BaseUser which Post extends, target will be BaseUser.
Target can be string if its defined in entity schema instead of class.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:52

___

### type

 **type**: `string` \| `Function`

Gets the property's type to which this relation is applied.

For example for @ManyToMany(type => Category) in Post, target will be Category.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:145

## Methods

### build

**build**(): `void`

Builds some depend relation metadata properties.
This builder method should be used only after embedded metadata tree was build.

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:265

___

### buildInverseSidePropertyPath

**buildInverseSidePropertyPath**(): `string`

Builds inverse side property path based on given inverse side property factory.
This builder method should be used only after properties map of the inverse entity metadata was build.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:285

___

### buildPropertyPath

**buildPropertyPath**(): `string`

Builds relation's property path based on its embedded tree.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:289

___

### createValueMap

**createValueMap**(`value`): `any`

Creates entity id map from the given entity ids array.

#### Parameters

| Name |
| :------ |
| `value` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:260

___

### ensureRelationIdMap

**ensureRelationIdMap**(`id`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Ensures that given object is an entity id map.
If given id is an object then it means its already id map.
If given id isn't an object then it means its a value of the id column
and it creates a new id map with this value and name of the primary column.

#### Parameters

| Name |
| :------ |
| `id` | `any` |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:244

___

### getEntityValue

**getEntityValue**(`entity`, `getLazyRelationsPromiseValue?`): `any`

Extracts column value from the given entity.
If column is in embedded (or recursive embedded) it extracts its value from there.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `getLazyRelationsPromiseValue?` | `boolean` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:249

___

### getRelationIdMap

**getRelationIdMap**(`entity`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Creates join column ids map from the given related entity ids array.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:237

___

### registerForeignKeys

**registerForeignKeys**(`...foreignKeys`): `void`

Registers given foreign keys in the relation.
This builder method should be used to register foreign key in the relation.

#### Parameters

| Name |
| :------ |
| `...foreignKeys` | [`ForeignKeyMetadata`](ForeignKeyMetadata.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:270

___

### registerJoinColumns

**registerJoinColumns**(`joinColumns?`, `inverseJoinColumns?`): `void`

Registers given join columns in the relation.
This builder method should be used to register join column in the relation.

#### Parameters

| Name |
| :------ |
| `joinColumns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |
| `inverseJoinColumns?` | [`ColumnMetadata`](ColumnMetadata.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:275

___

### registerJunctionEntityMetadata

**registerJunctionEntityMetadata**(`junctionEntityMetadata`): `void`

Registers a given junction entity metadata.
This builder method can be called after junction entity metadata for the many-to-many relation was created.

#### Parameters

| Name |
| :------ |
| `junctionEntityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:280

___

### setEntityValue

**setEntityValue**(`entity`, `value`): `void`

Sets given entity's relation's value.
Using of this method helps to set entity relation's value of the lazy and non-lazy relations.

If merge is set to true, it merges given value into currently

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `value` | `any` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/RelationMetadata.d.ts:256
