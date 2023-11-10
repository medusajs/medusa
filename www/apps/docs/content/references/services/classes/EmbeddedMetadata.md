# EmbeddedMetadata

Contains all information about entity's embedded property.

## Constructors

### constructor

**new EmbeddedMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`EmbeddedMetadataArgs`](../interfaces/EmbeddedMetadataArgs.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:142

## Properties

### columns

 **columns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Columns inside this embed.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:40

___

### columnsFromTree

 **columnsFromTree**: [`ColumnMetadata`](ColumnMetadata.md)[]

Embed metadatas from all levels of the parent tree.

example: post[data][information][counters].id where "data", "information" and "counters" are embeds
this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:117

___

### customPrefix

 **customPrefix**: `undefined` \| `string` \| `boolean`

Prefix of the embedded, used instead of propertyName.
If set to empty string or false, then prefix is not set at all.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:84

___

### embeddedMetadataTree

 **embeddedMetadataTree**: [`EmbeddedMetadata`](EmbeddedMetadata.md)[]

Returns embed metadatas from all levels of the parent tree.

example: post[data][information][counters].id where "data", "information" and "counters" are embeds
this method will return [embed metadata of data, embed metadata of information, embed metadata of counters]

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:110

___

### embeddeds

 **embeddeds**: [`EmbeddedMetadata`](EmbeddedMetadata.md)[]

Nested embeddable in this embeddable (which has current embedded as parent embedded).

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:68

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata where this embedded is.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:18

___

### indices

 **indices**: [`IndexMetadata`](IndexMetadata.md)[]

Indices applied to the embed columns.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:52

___

### indicesFromTree

 **indicesFromTree**: [`IndexMetadata`](IndexMetadata.md)[]

Indices of this embed and all indices from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:129

___

### isAlwaysUsingConstructor

 **isAlwaysUsingConstructor**: `boolean`

Indicates if the entity should be instantiated using the constructor
or via allocating a new object via `Object.create()`.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:73

___

### isArray

 **isArray**: `boolean`

Indicates if this embedded is in array mode.

This option works only in mongodb.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:79

___

### listeners

 **listeners**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Entity listeners inside this embed.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:48

___

### listenersFromTree

 **listenersFromTree**: [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

Relations of this embed and all relations from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:125

___

### parentEmbeddedMetadata

 `Optional` **parentEmbeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Parent embedded in the case if this embedded inside other embedded.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:22

___

### parentPrefixes

 **parentPrefixes**: `string`[]

Returns array of prefixes of current embed and all its parent embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:103

___

### parentPropertyNames

 **parentPropertyNames**: `string`[]

Returns array of property names of current embed and all its parent embeds.

example: post[data][information][counters].id where "data", "information" and "counters" are embeds
we need to get value of "id" column from the post real entity object.
this method will return ["data", "information", "counters"]

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:99

___

### prefix

 **prefix**: `string`

Gets the prefix of the columns.
By default its a property name of the class where this prefix is.
But if custom prefix is set then it takes its value as a prefix.
However if custom prefix is set to empty string or false, then prefix to column is not applied at all.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:91

___

### propertyName

 **propertyName**: `string`

Property name on which this embedded is attached.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:30

___

### propertyPath

 **propertyPath**: `string`

Gets full path to this embedded property (including embedded property name).
Full path is relevant when embedded is used inside other embeds (one or multiple nested).
For example it will return "counters.subcounters".

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:36

___

### relationCounts

 **relationCounts**: [`RelationCountMetadata`](RelationCountMetadata.md)[]

Relation counts inside this embed.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:64

___

### relationCountsFromTree

 **relationCountsFromTree**: [`RelationCountMetadata`](RelationCountMetadata.md)[]

Relation counts of this embed and all relation counts from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:141

___

### relationIds

 **relationIds**: [`RelationIdMetadata`](RelationIdMetadata.md)[]

Relation ids inside this embed.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:60

___

### relationIdsFromTree

 **relationIdsFromTree**: [`RelationIdMetadata`](RelationIdMetadata.md)[]

Relation ids of this embed and all relation ids from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:137

___

### relations

 **relations**: [`RelationMetadata`](RelationMetadata.md)[]

Relations inside this embed.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:44

___

### relationsFromTree

 **relationsFromTree**: [`RelationMetadata`](RelationMetadata.md)[]

Relations of this embed and all relations from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:121

___

### type

 **type**: `string` \| `Function`

Embedded target type.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:26

___

### uniques

 **uniques**: [`UniqueMetadata`](UniqueMetadata.md)[]

Uniques applied to the embed columns.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:56

___

### uniquesFromTree

 **uniquesFromTree**: [`UniqueMetadata`](UniqueMetadata.md)[]

Uniques of this embed and all uniques from its child embeds.

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:133

## Methods

### build

**build**(`connection`): [`EmbeddedMetadata`](EmbeddedMetadata.md)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Returns

[`EmbeddedMetadata`](EmbeddedMetadata.md)

-`EmbeddedMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:152

___

### buildColumnsFromTree

`Protected` **buildColumnsFromTree**(): [`ColumnMetadata`](ColumnMetadata.md)[]

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:158

___

### buildEmbeddedMetadataTree

`Protected` **buildEmbeddedMetadataTree**(): [`EmbeddedMetadata`](EmbeddedMetadata.md)[]

#### Returns

[`EmbeddedMetadata`](EmbeddedMetadata.md)[]

-`EmbeddedMetadata[]`: 
	-`EmbeddedMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:157

___

### buildIndicesFromTree

`Protected` **buildIndicesFromTree**(): [`IndexMetadata`](IndexMetadata.md)[]

#### Returns

[`IndexMetadata`](IndexMetadata.md)[]

-`IndexMetadata[]`: 
	-`IndexMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:161

___

### buildListenersFromTree

`Protected` **buildListenersFromTree**(): [`EntityListenerMetadata`](EntityListenerMetadata.md)[]

#### Returns

[`EntityListenerMetadata`](EntityListenerMetadata.md)[]

-`EntityListenerMetadata[]`: 
	-`EntityListenerMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:160

___

### buildParentPrefixes

`Protected` **buildParentPrefixes**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:156

___

### buildParentPropertyNames

`Protected` **buildParentPropertyNames**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:155

___

### buildPartialPrefix

`Protected` **buildPartialPrefix**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:153

___

### buildPrefix

`Protected` **buildPrefix**(`connection`): `string`

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:154

___

### buildRelationCountsFromTree

`Protected` **buildRelationCountsFromTree**(): [`RelationCountMetadata`](RelationCountMetadata.md)[]

#### Returns

[`RelationCountMetadata`](RelationCountMetadata.md)[]

-`RelationCountMetadata[]`: 
	-`RelationCountMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:164

___

### buildRelationIdsFromTree

`Protected` **buildRelationIdsFromTree**(): [`RelationIdMetadata`](RelationIdMetadata.md)[]

#### Returns

[`RelationIdMetadata`](RelationIdMetadata.md)[]

-`RelationIdMetadata[]`: 
	-`RelationIdMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:163

___

### buildRelationsFromTree

`Protected` **buildRelationsFromTree**(): [`RelationMetadata`](RelationMetadata.md)[]

#### Returns

[`RelationMetadata`](RelationMetadata.md)[]

-`RelationMetadata[]`: 
	-`RelationMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:159

___

### buildUniquesFromTree

`Protected` **buildUniquesFromTree**(): [`UniqueMetadata`](UniqueMetadata.md)[]

#### Returns

[`UniqueMetadata`](UniqueMetadata.md)[]

-`UniqueMetadata[]`: 
	-`UniqueMetadata`: 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:162

___

### create

**create**(`options?`): `any`

Creates a new embedded object.

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.fromDeserializer?` | `boolean` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EmbeddedMetadata.d.ts:149
