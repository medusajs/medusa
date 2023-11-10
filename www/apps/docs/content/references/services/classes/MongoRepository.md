# MongoRepository

Repository used to manage mongodb documents of a single entity type.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

## Hierarchy

- [`Repository`](Repository.md)<`Entity`\>

  ↳ **`MongoRepository`**

## Constructors

### constructor

**new MongoRepository**<`Entity`\>(`target`, `manager`, `queryRunner?`)

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

 `Readonly` **manager**: [`MongoEntityManager`](MongoEntityManager.md)

Entity Manager used by this repository.

#### Overrides

[Repository](Repository.md).[manager](Repository.md#manager)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:18

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

### aggregate

**aggregate**<`R`\>(`pipeline`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`Entity`\>

Execute an aggregation framework pipeline against the collection.

| Name | Type |
| :------ | :------ |
| `R` | `object` |

#### Parameters

| Name |
| :------ |
| `pipeline` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`Entity`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:100

___

### aggregateEntity

**aggregateEntity**(`pipeline`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`Entity`\>

Execute an aggregation framework pipeline against the collection.
This returns modified version of cursor that transforms each result into Entity model.

#### Parameters

| Name |
| :------ |
| `pipeline` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`Entity`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:105

___

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

### bulkWrite

**bulkWrite**(`operations`, `options?`): `Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

Perform a bulkWrite operation without a fluent API.

#### Parameters

| Name |
| :------ |
| `operations` | [`AnyBulkWriteOperation`](../types/AnyBulkWriteOperation.md)[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

-`Promise`: 
	-`BulkWriteResult`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:109

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

### collectionIndexExists

**collectionIndexExists**(`indexes`): `Promise`<`boolean`\>

Retrieve all the indexes on the collection.

#### Parameters

| Name |
| :------ |
| `indexes` | `string` \| `string`[] |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:167

___

### collectionIndexInformation

**collectionIndexInformation**(`options?`): `Promise`<`any`\>

Retrieves this collections index info.

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.full` | `boolean` |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:171

___

### collectionIndexes

**collectionIndexes**(): `Promise`<`any`\>

Retrieve all the indexes on the collection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:163

___

### count

**count**(`query?`, `options?`): `Promise`<`number`\>

Count number of matching documents in the db to a query.

#### Parameters

| Name |
| :------ |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Overrides

[Repository](Repository.md).[count](Repository.md#count)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:113

___

### countBy

**countBy**(`query?`, `options?`): `Promise`<`number`\>

Count number of matching documents in the db to a query.

#### Parameters

| Name |
| :------ |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Overrides

[Repository](Repository.md).[countBy](Repository.md#countby)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:117

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

### createCollectionIndex

**createCollectionIndex**(`fieldOrSpec`, `options?`): `Promise`<`string`\>

Creates an index on the db and collection.

#### Parameters

| Name |
| :------ |
| `fieldOrSpec` | `any` |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:121

___

### createCollectionIndexes

**createCollectionIndexes**(`indexSpecs`): `Promise`<`string`[]\>

Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
Earlier version of MongoDB will throw a command not supported error.
Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.

#### Parameters

| Name |
| :------ |
| `indexSpecs` | [`IndexDescription`](../interfaces/IndexDescription.md)[] |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:127

___

### createCursor

**createCursor**<`T`\>(`query?`): [`FindCursor`](FindCursor.md)<`T`\>

Creates a cursor for a query that can be used to iterate over results from MongoDB.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `query?` | [`Filter`](../types/Filter.md)<`Entity`\> |

#### Returns

[`FindCursor`](FindCursor.md)<`T`\>

-`FindCursor`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:91

___

### createEntityCursor

**createEntityCursor**(`query?`): [`FindCursor`](FindCursor.md)<`Entity`\>

Creates a cursor for a query that can be used to iterate over results from MongoDB.
This returns modified version of cursor that transforms each result into Entity model.

#### Parameters

| Name |
| :------ |
| `query?` | [`Filter`](../types/Filter.md)<`Entity`\> |

#### Returns

[`FindCursor`](FindCursor.md)<`Entity`\>

-`FindCursor`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:96

___

### createQueryBuilder

**createQueryBuilder**(`alias`, `queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Using Query Builder with MongoDB is not supported yet.
Calling this method will return an error.

#### Parameters

| Name |
| :------ |
| `alias` | `string` |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Overrides

[Repository](Repository.md).[createQueryBuilder](Repository.md#createquerybuilder)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:28

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

### deleteMany

**deleteMany**(`query`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete multiple documents on MongoDB.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:131

___

### deleteOne

**deleteOne**(`query`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete a document on MongoDB.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:135

___

### distinct

**distinct**(`key`, `query`, `options?`): `Promise`<`any`\>

The distinct command returns returns a list of distinct values for the given key across a collection.

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:139

___

### dropCollectionIndex

**dropCollectionIndex**(`indexName`, `options?`): `Promise`<`any`\>

Drops an index from this collection.

#### Parameters

| Name |
| :------ |
| `indexName` | `string` |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:143

___

### dropCollectionIndexes

**dropCollectionIndexes**(): `Promise`<`any`\>

Drops all indexes from the collection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:147

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

**extend**<`CustomRepository`\>(`custom`): [`MongoRepository`](MongoRepository.md)<`Entity`\> & `CustomRepository`

Extends repository with provided functions.

| Name |
| :------ |
| `CustomRepository` | `object` |

#### Parameters

| Name |
| :------ |
| `custom` | `CustomRepository` & [`ThisType`](../interfaces/ThisType.md)<[`MongoRepository`](MongoRepository.md)<`Entity`\> & `CustomRepository`\> |

#### Returns

[`MongoRepository`](MongoRepository.md)<`Entity`\> & `CustomRepository`

-`[`MongoRepository`](MongoRepository.md)<`Entity`\> & `CustomRepository``: (optional) 

#### Inherited from

[Repository](Repository.md).[extend](Repository.md#extend)

#### Defined in

node_modules/typeorm/repository/Repository.d.ts:311

___

### find

**find**(`options?`): `Promise`<`Entity`[]\>

Finds entities that match given find options or conditions.

#### Parameters

| Name |
| :------ |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> \| [`FilterOperators`](../interfaces/FilterOperators.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Overrides

[Repository](Repository.md).[find](Repository.md#find)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:32

___

### findAndCount

**findAndCount**(`options?`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options or conditions.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

#### Parameters

| Name |
| :------ |
| `options?` | [`MongoFindManyOptions`](../interfaces/MongoFindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Overrides

[Repository](Repository.md).[findAndCount](Repository.md#findandcount)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:42

___

### findAndCountBy

**findAndCountBy**(`where`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options or conditions.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

#### Parameters

| Name |
| :------ |
| `where` | `any` |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Overrides

[Repository](Repository.md).[findAndCountBy](Repository.md#findandcountby)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:48

___

### findBy

**findBy**(`where`): `Promise`<`Entity`[]\>

Finds entities that match given find options or conditions.

#### Parameters

| Name |
| :------ |
| `where` | `any` |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Overrides

[Repository](Repository.md).[findBy](Repository.md#findby)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:36

___

### findByIds

**findByIds**(`ids`, `options?`): `Promise`<`Entity`[]\>

Finds entities by ids.
Optionally find options can be applied.

#### Parameters

| Name |
| :------ |
| `ids` | `any`[] |
| `options?` | `any` |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

**Deprecated**

use `findBy` method instead in conjunction with `In` operator, for example:

.findBy({
    id: In([1, 2, 3])
})

#### Overrides

[Repository](Repository.md).[findByIds](Repository.md#findbyids)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:59

___

### findOne

**findOne**(`options`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given find options.

#### Parameters

| Name |
| :------ |
| `options` | [`MongoFindOneOptions`](../types/MongoFindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Overrides

[Repository](Repository.md).[findOne](Repository.md#findone)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:63

___

### findOneAndDelete

**findOneAndDelete**(`query`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`FindOneAndDeleteOptions`](../interfaces/FindOneAndDeleteOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:151

___

### findOneAndReplace

**findOneAndReplace**(`query`, `replacement`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `replacement` | `Object` |
| `options?` | [`FindOneAndReplaceOptions`](../interfaces/FindOneAndReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:155

___

### findOneAndUpdate

**findOneAndUpdate**(`query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `update` | `Object` |
| `options?` | [`FindOneAndUpdateOptions`](../interfaces/FindOneAndUpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:159

___

### findOneBy

**findOneBy**(`where`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given WHERE conditions.

#### Parameters

| Name |
| :------ |
| `where` | `any` |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Overrides

[Repository](Repository.md).[findOneBy](Repository.md#findoneby)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:67

___

### findOneById

**findOneById**(`id`): `Promise`<``null`` \| `Entity`\>

Finds entity that matches given id.

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

#### Overrides

[Repository](Repository.md).[findOneById](Repository.md#findonebyid)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:77

___

### findOneByOrFail

**findOneByOrFail**(`where`): `Promise`<`Entity`\>

Finds first entity that matches given where condition.
If entity was not found in the database - rejects with error.

#### Parameters

| Name |
| :------ |
| `where` | `any` |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Overrides

[Repository](Repository.md).[findOneByOrFail](Repository.md#findonebyorfail)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:87

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

#### Overrides

[Repository](Repository.md).[findOneOrFail](Repository.md#findoneorfail)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:82

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

### initializeOrderedBulkOp

**initializeOrderedBulkOp**(`options?`): [`OrderedBulkOperation`](OrderedBulkOperation.md)

Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.

#### Parameters

| Name |
| :------ |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`OrderedBulkOperation`](OrderedBulkOperation.md)

-`OrderedBulkOperation`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:177

___

### initializeUnorderedBulkOp

**initializeUnorderedBulkOp**(`options?`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.

#### Parameters

| Name |
| :------ |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:181

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

### insertMany

**insertMany**(`docs`, `options?`): `Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts an array of documents into MongoDB.

#### Parameters

| Name |
| :------ |
| `docs` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertManyResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:185

___

### insertOne

**insertOne**(`doc`, `options?`): `Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts a single document into MongoDB.

#### Parameters

| Name |
| :------ |
| `doc` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`InsertOneOptions`](../interfaces/InsertOneOptions.md) |

#### Returns

`Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertOneResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:189

___

### isCapped

**isCapped**(): `Promise`<`any`\>

Returns if the collection is a capped collection.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:193

___

### listCollectionIndexes

**listCollectionIndexes**(`options?`): [`ListIndexesCursor`](ListIndexesCursor.md)

Get the list of all indexes information for the collection.

#### Parameters

| Name |
| :------ |
| `options?` | [`ListIndexesOptions`](../interfaces/ListIndexesOptions.md) |

#### Returns

[`ListIndexesCursor`](ListIndexesCursor.md)

-`ListIndexesCursor`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:197

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

Raw SQL query execution is not supported by MongoDB.
Calling this method will return an error.

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Overrides

[Repository](Repository.md).[query](Repository.md#query)

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:23

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

### rename

**rename**(`newName`, `options?`): `Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.

#### Parameters

| Name |
| :------ |
| `newName` | `string` |
| `options?` | `object` |
| `options.dropTarget?` | `boolean` |

#### Returns

`Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`Collection`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:201

___

### replaceOne

**replaceOne**(`query`, `doc`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Replace a document on MongoDB.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `doc` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`ReplaceOptions`](../interfaces/ReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:207

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

### stats

**stats**(`options?`): `Promise`<[`CollStats`](../interfaces/CollStats.md)\>

Get all the collection statistics.

#### Parameters

| Name |
| :------ |
| `options?` | [`CollStatsOptions`](../interfaces/CollStatsOptions.md) |

#### Returns

`Promise`<[`CollStats`](../interfaces/CollStats.md)\>

-`Promise`: 
	-`avgObjSize`: Average object size in bytes
	-`capped`: `true` if the collection is capped
	-`count`: Number of documents
	-`freeStorageSize`: (optional) The amount of storage available for reuse. The scale argument affects this value.
	-`indexBuilds`: (optional) An array that contains the names of the indexes that are currently being built on the collection
	-`indexDetails`: (optional) The fields in this document are the names of the indexes, while the values themselves are documents that contain statistics for the index provided by the storage engine
	-`indexSizes`: Size of specific indexes in bytes
		-`_id_`: 
	-`lastExtentSize`: Size of the most recently created extent in bytes
	-`max`: The maximum number of documents that may be present in a capped collection
	-`maxSize`: The maximum size of a capped collection
	-`nindexes`: Number of indexes
	-`ns`: Namespace
	-`numExtents`: Number of extents (contiguously allocated chunks of datafile space)
	-`ok`: 
	-`paddingFactor`: Padding can speed up updates if documents grow
	-`scaleFactor`: The scale value used by the command.
	-`size`: Collection size in bytes
	-`storageSize`: (Pre)allocated space for the collection in bytes
	-`totalIndexSize`: Total index size in bytes
	-`totalSize`: The sum of the storageSize and totalIndexSize. The scale argument affects this value
	-`userFlags`: (optional) A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine
	-`wiredTiger`: (optional) This document contains data reported directly by the WiredTiger engine and other data for internal diagnostic use
		-`LSM`: 
		-`block-manager`: 
		-`btree`: 
		-`cache`: 
		-`cache_walk`: 
		-`compression`: 
		-`cursor`: 
		-`reconciliation`: 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:211

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

### updateMany

**updateMany**(`query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update multiple documents on MongoDB.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `update` | [`UpdateFilter`](../types/UpdateFilter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:215

___

### updateOne

**updateOne**(`query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update a single document on MongoDB.

#### Parameters

| Name |
| :------ |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `update` | [`UpdateFilter`](../types/UpdateFilter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/repository/MongoRepository.d.ts:219

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
