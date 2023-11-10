# RelationMetadataArgs

Arguments for RelationMetadata class.

## Properties

### inverseSideProperty

 `Optional` `Readonly` **inverseSideProperty**: [`PropertyTypeFactory`](../index.md#propertytypefactory)<`any`\>

Inverse side of the relation.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:42

___

### isLazy

 `Readonly` **isLazy**: `boolean`

Indicates if this relation will be lazily loaded.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:24

___

### isTreeChildren

 `Optional` `Readonly` **isTreeChildren**: `boolean`

Indicates if this is a children (can be only one-to-many relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:54

___

### isTreeParent

 `Optional` `Readonly` **isTreeParent**: `boolean`

Indicates if this is a parent (can be only many-to-one relation) relation in the tree tables.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:50

___

### options

 `Readonly` **options**: [`RelationOptions`](RelationOptions.md)

Additional relation options.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:46

___

### propertyName

 `Readonly` **propertyName**: `string`

Class's property name to which this relation is applied.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:20

___

### relationType

 `Readonly` **relationType**: [`RelationType`](../index.md#relationtype)

Type of relation. Can be one of the value of the RelationTypes class.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:33

___

### target

 `Readonly` **target**: `string` \| `Function`

Class to which this relation is applied.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:12

___

### type

 `Readonly` **type**: [`RelationTypeInFunction`](../index.md#relationtypeinfunction)

Type of the relation. This type is in function because of language specifics and problems with recursive
referenced classes.

#### Defined in

node_modules/typeorm/metadata-args/RelationMetadataArgs.d.ts:38
