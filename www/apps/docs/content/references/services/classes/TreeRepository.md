# TreeRepository

Repository with additional functions to work with trees.

**See**

Repository

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

## Hierarchy

- [`Repository`](Repository.md)<`Entity`\>

  ↳ **`TreeRepository`**

## Constructors

### constructor

**new TreeRepository**<`Entity`\>(`target`, `manager`, `queryRunner?`)

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `manager` | [`EntityManager`](EntityManager.md) |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Inherited from

[Repository](Repository.md).[constructor](Repository.md#constructor)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:41

## Properties

### manager

 `Readonly` **manager**: [`EntityManager`](EntityManager.md)

Entity Manager used by this repository.

#### Inherited from

[Repository](Repository.md).[manager](Repository.md#manager)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:32

___

### queryRunner

 `Optional` `Readonly` **queryRunner**: [`QueryRunner`](../interfaces/QueryRunner.md)

Query runner provider used for this repository.

#### Inherited from

[Repository](Repository.md).[queryRunner](Repository.md#queryrunner)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:36

___

### target

 `Readonly` **target**: [`EntityTarget`](../types/EntityTarget.md)<`Entity`\>

Entity target that is managed by this repository.
If this repository manages entity from schema,
then it returns a name of that schema instead.

#### Inherited from

[Repository](Repository.md).[target](Repository.md#target)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:28

## Accessors

### metadata

`get` **metadata**(): [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the entity current repository manages.

#### Returns

[`EntityMetadata`](EntityMetadata.md)

-`EntityMetadata`: 

#### Inherited from

Repository.metadata

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:40

## Methods

### average

**average**(`columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the AVG of a column

#### Parameters

| Name |
| :------ |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[Repository](Repository.md).[average](Repository.md#average)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:217

___

### clear

**clear**(): `Promise`<`void`\>

Clears all the data from the given table/collection (truncates/drops it).

Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.

#### Returns

`Promise`<`void`\>

-`Promise`: 

**See**

https://stackoverflow.com/a/5972738/925151

#### Inherited from

[Repository](Repository.md).[clear](Repository.md#clear)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:299

___

### count

**count**(`options?`): `Promise`<`number`\>

Counts entities that match given options.
Useful for pagination.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Inherited from

[Repository](Repository.md).[count](Repository.md#count)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:204

___

### countAncestors

**countAncestors**(`entity`): `Promise`<`number`\>

Gets number of ancestors of the entity.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:46

___

### countBy

**countBy**(`where`): `Promise`<`number`\>

Counts entities that match given conditions.
Useful for pagination.

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Inherited from

[Repository](Repository.md).[countBy](Repository.md#countby)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:209

___

### countDescendants

**countDescendants**(`entity`): `Promise`<`number`\>

Gets number of descendants of the entity.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:30

___

### create

**create**(): `Entity`

Creates a new entity instance.

#### Returns

`Entity`

#### Inherited from

[Repository](Repository.md).[create](Repository.md#create)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:58

**create**(`entityLikeArray`): `Entity`[]

Creates new entities and copies all entity properties from given objects into their new entities.
Note that it copies only properties that are present in entity schema.

#### Parameters

| Name |
| :------ |
| `entityLikeArray` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\>[] |

#### Returns

`Entity`[]

-`Entity[]`: 

#### Inherited from

[Repository](Repository.md).[create](Repository.md#create)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:63

**create**(`entityLike`): `Entity`

Creates a new entity instance and copies all entity properties from this object into a new entity.
Note that it copies only properties that are present in entity schema.

#### Parameters

| Name |
| :------ |
| `entityLike` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\> |

#### Returns

`Entity`

#### Inherited from

[Repository](Repository.md).[create](Repository.md#create)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:68

___

### createAncestorsQueryBuilder

**createAncestorsQueryBuilder**(`alias`, `closureTableAlias`, `entity`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a query builder used to get ancestors of the entities in the tree.

#### Parameters

| Name |
| :------ |
| `alias` | `string` |
| `closureTableAlias` | `string` |
| `entity` | `Entity` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:50

___

### createDescendantsQueryBuilder

**createDescendantsQueryBuilder**(`alias`, `closureTableAlias`, `entity`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a query builder used to get descendants of the entities in a tree.

#### Parameters

| Name |
| :------ |
| `alias` | `string` |
| `closureTableAlias` | `string` |
| `entity` | `Entity` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:34

___

### createQueryBuilder

**createQueryBuilder**(`alias?`, `queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a new query builder that can be used to build a SQL query.

#### Parameters

| Name |
| :------ |
| `alias?` | `string` |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[Repository](Repository.md).[createQueryBuilder](Repository.md#createquerybuilder)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:45

___

### decrement

**decrement**(`conditions`, `propertyPath`, `value`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Decrements some column by provided value of the entities matched given conditions.

#### Parameters

| Name |
| :------ |
| `conditions` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |
| `propertyPath` | `string` |
| `value` | `string` \| `number` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[Repository](Repository.md).[decrement](Repository.md#decrement)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:307

___

### delete

**delete**(`criteria`): `Promise`<[`DeleteResult`](DeleteResult.md)\>

Deletes entities by a given criteria.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient DELETE query.
Does not check if entity exist in the database.

#### Parameters

| Name |
| :------ |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |

#### Returns

`Promise`<[`DeleteResult`](DeleteResult.md)\>

-`Promise`: 
	-`DeleteResult`: 

#### Inherited from

[Repository](Repository.md).[delete](Repository.md#delete)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:181

___

### exist

**exist**(`options?`): `Promise`<`boolean`\>

Checks whether any entity exists that match given options.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Inherited from

[Repository](Repository.md).[exist](Repository.md#exist)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:199

___

### extend

**extend**<`CustomRepository`\>(`custom`): [`TreeRepository`](TreeRepository.md)<`Entity`\> & `CustomRepository`

Extends repository with provided functions.

| Name |
| :------ |
| `CustomRepository` | `object` |

#### Parameters

| Name |
| :------ |
| `custom` | `CustomRepository` & [`ThisType`](../interfaces/ThisType.md)<[`TreeRepository`](TreeRepository.md)<`Entity`\> & `CustomRepository`\> |

#### Returns

[`TreeRepository`](TreeRepository.md)<`Entity`\> & `CustomRepository`

-`[`TreeRepository`](TreeRepository.md)<`Entity`\> & `CustomRepository``: (optional) 

#### Inherited from

[Repository](Repository.md).[extend](Repository.md#extend)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:311

___

### find

**find**(`options?`): `Promise`<`Entity`[]\>

Finds entities that match given find options.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[Repository](Repository.md).[find](Repository.md#find)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:229

___

### findAncestors

**findAncestors**(`entity`, `options?`): `Promise`<`Entity`[]\>

Gets all parents (ancestors) of the given entity. Returns them all in a flat array.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:38

___

### findAncestorsTree

**findAncestorsTree**(`entity`, `options?`): `Promise`<`Entity`\>

Gets all parents (ancestors) of the given entity. Returns them in a tree - nested into each other.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:42

___

### findAndCount

**findAndCount**(`options?`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

#### Parameters

| Name |
| :------ |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Inherited from

[Repository](Repository.md).[findAndCount](Repository.md#findandcount)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:239

___

### findAndCountBy

**findAndCountBy**(`where`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given WHERE conditions.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Inherited from

[Repository](Repository.md).[findAndCountBy](Repository.md#findandcountby)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:245

___

### findBy

**findBy**(`where`): `Promise`<`Entity`[]\>

Finds entities that match given find options.

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[Repository](Repository.md).[findBy](Repository.md#findby)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:233

___

### findByIds

**findByIds**(`ids`): `Promise`<`Entity`[]\>

Finds entities with ids.
Optionally find options or conditions can be applied.

#### Parameters

| Name |
| :------ |
| `ids` | `any`[] |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

**Deprecated**

use `findBy` method instead in conjunction with `In` operator, for example:

.findBy({
    id: In([1, 2, 3])
})

#### Inherited from

[Repository](Repository.md).[findByIds](Repository.md#findbyids)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:256

___

### findDescendants

**findDescendants**(`entity`, `options?`): `Promise`<`Entity`[]\>

Gets all children (descendants) of the given entity. Returns them all in a flat array.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:22

___

### findDescendantsTree

**findDescendantsTree**(`entity`, `options?`): `Promise`<`Entity`\>

Gets all children (descendants) of the given entity. Returns them in a tree - nested into each other.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:26

___

### findOne

**findOne**(`options`): `Promise`<``null`` \| `Entity`\>

Finds first entity by a given find options.
If entity was not found in the database - returns null.

#### Parameters

| Name |
| :------ |
| `options` | [`FindOneOptions`](../interfaces/FindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Inherited from

[Repository](Repository.md).[findOne](Repository.md#findone)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:261

___

### findOneBy

**findOneBy**(`where`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given where condition.
If entity was not found in the database - returns null.

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Inherited from

[Repository](Repository.md).[findOneBy](Repository.md#findoneby)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:266

___

### findOneById

**findOneById**(`id`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given id.
If entity was not found in the database - returns null.

#### Parameters

| Name |
| :------ |
| `id` | `string` \| `number` \| `Date` \| [`ObjectId`](ObjectId.md) |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

**Deprecated**

use `findOneBy` method instead in conjunction with `In` operator, for example:

.findOneBy({
    id: 1 // where "id" is your primary column name
})

#### Inherited from

[Repository](Repository.md).[findOneById](Repository.md#findonebyid)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:277

___

### findOneByOrFail

**findOneByOrFail**(`where`): `Promise`<`Entity`\>

Finds first entity that matches given where condition.
If entity was not found in the database - rejects with error.

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[findOneByOrFail](Repository.md#findonebyorfail)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:287

___

### findOneOrFail

**findOneOrFail**(`options`): `Promise`<`Entity`\>

Finds first entity by a given find options.
If entity was not found in the database - rejects with error.

#### Parameters

| Name |
| :------ |
| `options` | [`FindOneOptions`](../interfaces/FindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[findOneOrFail](Repository.md#findoneorfail)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:282

___

### findRoots

**findRoots**(`options?`): `Promise`<`Entity`[]\>

Roots are entities that have no ancestors. Finds them all.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:18

___

### findTrees

**findTrees**(`options?`): `Promise`<`Entity`[]\>

Gets complete trees for all roots in the table.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindTreeOptions`](../interfaces/FindTreeOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/repository/TreeRepository.d.ts:14

___

### getId

**getId**(`entity`): `any`

Gets entity mixed id.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |

#### Returns

`any`

-`any`: (optional) 

#### Inherited from

[Repository](Repository.md).[getId](Repository.md#getid)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:54

___

### hasId

**hasId**(`entity`): `boolean`

Checks if entity has an id.
If entity composite compose ids, it will check them all.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[Repository](Repository.md).[hasId](Repository.md#hasid)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:50

___

### increment

**increment**(`conditions`, `propertyPath`, `value`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Increments some column by provided value of the entities matched given conditions.

#### Parameters

| Name |
| :------ |
| `conditions` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |
| `propertyPath` | `string` |
| `value` | `string` \| `number` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[Repository](Repository.md).[increment](Repository.md#increment)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:303

___

### insert

**insert**(`entity`): `Promise`<[`InsertResult`](InsertResult.md)\>

Inserts a given entity into the database.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient INSERT query.
Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.

#### Parameters

| Name |
| :------ |
| `entity` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Inherited from

[Repository](Repository.md).[insert](Repository.md#insert)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:161

___

### maximum

**maximum**(`columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the MAX of a column

#### Parameters

| Name |
| :------ |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[Repository](Repository.md).[maximum](Repository.md#maximum)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:225

___

### merge

**merge**(`mergeIntoEntity`, `...entityLikes`): `Entity`

Merges multiple entities (or entity-like objects) into a given entity.

#### Parameters

| Name |
| :------ |
| `mergeIntoEntity` | `Entity` |
| `...entityLikes` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\>[] |

#### Returns

`Entity`

#### Inherited from

[Repository](Repository.md).[merge](Repository.md#merge)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:72

___

### minimum

**minimum**(`columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the MIN of a column

#### Parameters

| Name |
| :------ |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[Repository](Repository.md).[minimum](Repository.md#minimum)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:221

___

### preload

**preload**(`entityLike`): `Promise`<`undefined` \| `Entity`\>

Creates a new entity from the given plain javascript object. If entity already exist in the database, then
it loads it (and everything related to it), replaces all values with the new ones from the given object
and returns this new entity. This new entity is actually a loaded from the db entity with all properties
replaced from the new object.

Note that given entity-like object must have an entity id / primary key to find entity by.
Returns undefined if entity with given id was not found.

#### Parameters

| Name |
| :------ |
| `entityLike` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\> |

#### Returns

`Promise`<`undefined` \| `Entity`\>

-`Promise`: 
	-`undefined \| Entity`: (optional) 

#### Inherited from

[Repository](Repository.md).[preload](Repository.md#preload)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:82

___

### query

**query**(`query`, `parameters?`): `Promise`<`any`\>

Executes a raw SQL query and returns a raw database results.
Raw query execution is supported only by relational databases (MongoDB is not supported).

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Inherited from

[Repository](Repository.md).[query](Repository.md#query)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:292

___

### recover

**recover**<`T`\>(`entities`, `options`): `Promise`<`T`[]\>

Recovers all given entities in the database.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[Repository](Repository.md).[recover](Repository.md#recover)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:138

**recover**<`T`\>(`entities`, `options?`): `Promise`<`T` & `Entity`[]\>

Recovers all given entities in the database.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`[]\>

-`Promise`: 
	-``T` & `Entity`[]`: 
		-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[recover](Repository.md#recover)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:144

**recover**<`T`\>(`entity`, `options`): `Promise`<`T`\>

Recovers a given entity in the database.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[recover](Repository.md#recover)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:148

**recover**<`T`\>(`entity`, `options?`): `Promise`<`T` & `Entity`\>

Recovers a given entity in the database.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`\>

-`Promise`: 
	-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[recover](Repository.md#recover)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:154

___

### remove

**remove**(`entities`, `options?`): `Promise`<`Entity`[]\>

Removes a given entities from the database.

#### Parameters

| Name |
| :------ |
| `entities` | `Entity`[] |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[Repository](Repository.md).[remove](Repository.md#remove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:110

**remove**(`entity`, `options?`): `Promise`<`Entity`\>

Removes a given entity from the database.

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[remove](Repository.md#remove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:114

___

### restore

**restore**(`criteria`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Restores entities by a given criteria.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient SOFT-DELETE query.
Does not check if entity exist in the database.

#### Parameters

| Name |
| :------ |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[Repository](Repository.md).[restore](Repository.md#restore)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:195

___

### save

**save**<`T`\>(`entities`, `options`): `Promise`<`T`[]\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[Repository](Repository.md).[save](Repository.md#save)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:87

**save**<`T`\>(`entities`, `options?`): `Promise`<`T` & `Entity`[]\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`[]\>

-`Promise`: 
	-``T` & `Entity`[]`: 
		-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[save](Repository.md#save)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:94

**save**<`T`\>(`entity`, `options`): `Promise`<`T`\>

Saves a given entity in the database.
If entity does not exist in the database then inserts, otherwise updates.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[save](Repository.md#save)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:99

**save**<`T`\>(`entity`, `options?`): `Promise`<`T` & `Entity`\>

Saves a given entity in the database.
If entity does not exist in the database then inserts, otherwise updates.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`\>

-`Promise`: 
	-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[save](Repository.md#save)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:106

___

### softDelete

**softDelete**(`criteria`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Records the delete date of entities by a given criteria.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient SOFT-DELETE query.
Does not check if entity exist in the database.

#### Parameters

| Name |
| :------ |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[Repository](Repository.md).[softDelete](Repository.md#softdelete)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:188

___

### softRemove

**softRemove**<`T`\>(`entities`, `options`): `Promise`<`T`[]\>

Records the delete date of all given entities.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[Repository](Repository.md).[softRemove](Repository.md#softremove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:118

**softRemove**<`T`\>(`entities`, `options?`): `Promise`<`T` & `Entity`[]\>

Records the delete date of all given entities.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`[]\>

-`Promise`: 
	-``T` & `Entity`[]`: 
		-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[softRemove](Repository.md#softremove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:124

**softRemove**<`T`\>(`entity`, `options`): `Promise`<`T`\>

Records the delete date of a given entity.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[Repository](Repository.md).[softRemove](Repository.md#softremove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:128

**softRemove**<`T`\>(`entity`, `options?`): `Promise`<`T` & `Entity`\>

Records the delete date of a given entity.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| {} |

#### Parameters

| Name |
| :------ |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`\>

-`Promise`: 
	-``T` & `Entity``: (optional) 

#### Inherited from

[Repository](Repository.md).[softRemove](Repository.md#softremove)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:134

___

### sum

**sum**(`columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the SUM of a column

#### Parameters

| Name |
| :------ |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[Repository](Repository.md).[sum](Repository.md#sum)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:213

___

### update

**update**(`criteria`, `partialEntity`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Updates entity partially. Entity can be found by a given conditions.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient UPDATE query.
Does not check if entity exist in the database.

#### Parameters

| Name |
| :------ |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> |
| `partialEntity` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[Repository](Repository.md).[update](Repository.md#update)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:168

___

### upsert

**upsert**(`entityOrEntities`, `conflictPathsOrOptions`): `Promise`<[`InsertResult`](InsertResult.md)\>

Inserts a given entity into the database, unless a unique constraint conflicts then updates the entity
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient INSERT ... ON CONFLICT DO UPDATE/ON DUPLICATE KEY UPDATE query.

#### Parameters

| Name |
| :------ |
| `entityOrEntities` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |
| `conflictPathsOrOptions` | `string`[] \| [`UpsertOptions`](../interfaces/UpsertOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Inherited from

[Repository](Repository.md).[upsert](Repository.md#upsert)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:174
