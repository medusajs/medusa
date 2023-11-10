# MongoEntityManager

Entity manager supposed to work with any entity, automatically find its repository and call its methods,
whatever entity type are you passing.

This implementation is used for MongoDB driver which has some specifics in its EntityManager.

## Hierarchy

- [`EntityManager`](EntityManager.md)

  ↳ **`MongoEntityManager`**

## Constructors

### constructor

**new MongoEntityManager**(`connection`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Overrides

[EntityManager](EntityManager.md).[constructor](EntityManager.md#constructor)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:26

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Overrides

[EntityManager](EntityManager.md).[@instanceof](EntityManager.md#@instanceof)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:24

___

### connection

 `Readonly` **connection**: [`DataSource`](DataSource.md)

Connection used by this entity manager.

#### Inherited from

[EntityManager](EntityManager.md).[connection](EntityManager.md#connection)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:34

___

### plainObjectToEntityTransformer

 `Protected` **plainObjectToEntityTransformer**: [`PlainObjectToNewEntityTransformer`](PlainObjectToNewEntityTransformer.md)

Plain to object transformer used in create and merge operations.

#### Inherited from

[EntityManager](EntityManager.md).[plainObjectToEntityTransformer](EntityManager.md#plainobjecttoentitytransformer)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:52

___

### queryRunner

 `Optional` `Readonly` **queryRunner**: [`QueryRunner`](../interfaces/QueryRunner.md)

Custom query runner to be used for operations in this entity manager.
Used only in non-global entity manager.

#### Inherited from

[EntityManager](EntityManager.md).[queryRunner](EntityManager.md#queryrunner)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:39

___

### repositories

 `Protected` **repositories**: `Map`<[`EntityTarget`](../types/EntityTarget.md)<`any`\>, [`Repository`](Repository.md)<`any`\>\>

Once created and then reused by repositories.
Created as a future replacement for the #repositories to provide a bit more perf optimization.

#### Inherited from

[EntityManager](EntityManager.md).[repositories](EntityManager.md#repositories)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:44

___

### treeRepositories

 `Protected` **treeRepositories**: [`TreeRepository`](TreeRepository.md)<`any`\>[]

Once created and then reused by repositories.

#### Inherited from

[EntityManager](EntityManager.md).[treeRepositories](EntityManager.md#treerepositories)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:48

## Accessors

### mongoQueryRunner

`get` **mongoQueryRunner**(): [`MongoQueryRunner`](MongoQueryRunner.md)

#### Returns

[`MongoQueryRunner`](MongoQueryRunner.md)

-`MongoQueryRunner`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:25

## Methods

### aggregate

**aggregate**<`Entity`, `R`\>(`entityClassOrName`, `pipeline`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`R`\>

Execute an aggregation framework pipeline against the collection.

| Name | Type |
| :------ | :------ |
| `Entity` | `object` |
| `R` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `pipeline` | [`Document`](../interfaces/Document.md)[] |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`R`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:103

___

### aggregateEntity

**aggregateEntity**<`Entity`\>(`entityClassOrName`, `pipeline`, `options?`): [`AggregationCursor`](AggregationCursor.md)<`Entity`\>

Execute an aggregation framework pipeline against the collection.
This returns modified version of cursor that transforms each result into Entity model.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `pipeline` | [`Document`](../interfaces/Document.md)[] |
| `options?` | [`AggregateOptions`](../interfaces/AggregateOptions.md) |

#### Returns

[`AggregationCursor`](AggregationCursor.md)<`Entity`\>

-`AggregationCursor`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:108

___

### applyEntityTransformationToCursor

`Protected` **applyEntityTransformationToCursor**<`Entity`\>(`metadata`, `cursor`): `void`

Overrides cursor's toArray and next methods to convert results to entity automatically.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `cursor` | [`FindCursor`](FindCursor.md)<`Entity`\> \| [`AggregationCursor`](AggregationCursor.md)<`Entity`\> |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:243

___

### average

**average**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the AVG of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[average](EntityManager.md#average)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:257

___

### bulkWrite

**bulkWrite**<`Entity`\>(`entityClassOrName`, `operations`, `options?`): `Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

Perform a bulkWrite operation without a fluent API.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `operations` | [`AnyBulkWriteOperation`](../types/AnyBulkWriteOperation.md)<[`Document`](../interfaces/Document.md)\>[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`BulkWriteResult`](BulkWriteResult.md)\>

-`Promise`: 
	-`BulkWriteResult`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:112

___

### clear

**clear**<`Entity`\>(`entityClass`): `Promise`<`void`\>

Clears all the data from the given table (truncates/drops it).

Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

`Promise`<`void`\>

-`Promise`: 

**See**

https://stackoverflow.com/a/5972738/925151

#### Inherited from

[EntityManager](EntityManager.md).[clear](EntityManager.md#clear)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:335

___

### collectionIndexExists

**collectionIndexExists**<`Entity`\>(`entityClassOrName`, `indexes`): `Promise`<`boolean`\>

Retrieve all the indexes on the collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `indexes` | `string` \| `string`[] |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:170

___

### collectionIndexInformation

**collectionIndexInformation**<`Entity`\>(`entityClassOrName`, `options?`): `Promise`<`any`\>

Retrieves this collections index info.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`IndexInformationOptions`](../interfaces/IndexInformationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:174

___

### collectionIndexes

**collectionIndexes**<`Entity`\>(`entityClassOrName`): `Promise`<[`Document`](../interfaces/Document.md)\>

Retrieve all the indexes on the collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:166

___

### convertFindManyOptionsOrConditionsToMongodbQuery

`Protected` **convertFindManyOptionsOrConditionsToMongodbQuery**<`Entity`\>(`optionsOrConditions`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Converts FindManyOptions to mongodb query.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `optionsOrConditions` | `undefined` \| `any`[] \| [`MongoFindManyOptions`](../interfaces/MongoFindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> \| [`FilterOperators`](../interfaces/FilterOperators.md)<`Entity`\> |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:223

___

### convertFindOneOptionsOrConditionsToMongodbQuery

`Protected` **convertFindOneOptionsOrConditionsToMongodbQuery**<`Entity`\>(`optionsOrConditions`): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Converts FindOneOptions to mongodb query.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `optionsOrConditions` | `undefined` \| [`MongoFindOneOptions`](../types/MongoFindOneOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> |

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:227

___

### convertFindOptionsOrderToOrderCriteria

`Protected` **convertFindOptionsOrderToOrderCriteria**(`order`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Converts FindOptions into mongodb order by criteria.

#### Parameters

| Name |
| :------ |
| `order` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:231

___

### convertFindOptionsSelectToProjectCriteria

`Protected` **convertFindOptionsSelectToProjectCriteria**(`selects`): `any`

Converts FindOptions into mongodb select by criteria.

#### Parameters

| Name |
| :------ |
| `selects` | [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`any`\> \| [`FindOptionsSelectByString`](../types/FindOptionsSelectByString.md)<`any`\> |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:235

___

### convertMixedCriteria

`Protected` **convertMixedCriteria**(`metadata`, `idMap`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Ensures given id is an id for query.

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `idMap` | `any` |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:239

___

### count

**count**<`Entity`\>(`entityClassOrName`, `query?`, `options?`): `Promise`<`number`\>

Count number of matching documents in the db to a query.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query?` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[count](EntityManager.md#count)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:116

___

### countBy

**countBy**<`Entity`\>(`entityClassOrName`, `query?`, `options?`): `Promise`<`number`\>

Count number of matching documents in the db to a query.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`CountOptions`](../interfaces/CountOptions.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[countBy](EntityManager.md#countby)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:120

___

### create

**create**<`Entity`\>(`entityClass`, `plainObject?`): `Entity`

Creates a new entity instance and copies all entity properties from this object into a new entity.
Note that it copies only properties that present in entity schema.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `plainObject?` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\> |

#### Returns

`Entity`

#### Inherited from

[EntityManager](EntityManager.md).[create](EntityManager.md#create)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:96

**create**<`Entity`\>(`entityClass`, `plainObjects?`): `Entity`[]

Creates a new entities and copies all entity properties from given objects into their new entities.
Note that it copies only properties that present in entity schema.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `plainObjects?` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\>[] |

#### Returns

`Entity`[]

-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[create](EntityManager.md#create)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:101

___

### createCollectionIndex

**createCollectionIndex**<`Entity`\>(`entityClassOrName`, `fieldOrSpec`, `options?`): `Promise`<`string`\>

Creates an index on the db and collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `fieldOrSpec` | [`IndexSpecification`](../types/IndexSpecification.md) |
| `options?` | [`CreateIndexesOptions`](../interfaces/CreateIndexesOptions.md) |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:124

___

### createCollectionIndexes

**createCollectionIndexes**<`Entity`\>(`entityClassOrName`, `indexSpecs`): `Promise`<`string`[]\>

Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
Earlier version of MongoDB will throw a command not supported error.
Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `indexSpecs` | [`IndexDescription`](../interfaces/IndexDescription.md)[] |

#### Returns

`Promise`<`string`[]\>

-`Promise`: 
	-`string[]`: 
		-`string`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:130

___

### createCursor

**createCursor**<`Entity`, `T`\>(`entityClassOrName`, `query?`): [`FindCursor`](FindCursor.md)<`T`\>

Creates a cursor for a query that can be used to iterate over results from MongoDB.

| Name | Type |
| :------ | :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`FindCursor`](FindCursor.md)<`T`\>

-`FindCursor`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:94

___

### createEntityCursor

**createEntityCursor**<`Entity`\>(`entityClassOrName`, `query?`): [`FindCursor`](FindCursor.md)<`Entity`\>

Creates a cursor for a query that can be used to iterate over results from MongoDB.
This returns modified version of cursor that transforms each result into Entity model.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`FindCursor`](FindCursor.md)<`Entity`\>

-`FindCursor`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:99

___

### createQueryBuilder

**createQueryBuilder**<`Entity`\>(`entityClass`, `alias`, `queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a new query builder that can be used to build a SQL query.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `alias` | `string` |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[EntityManager](EntityManager.md).[createQueryBuilder](EntityManager.md#createquerybuilder)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:71

**createQueryBuilder**(`queryRunner?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

Creates a new query builder that can be used to build a SQL query.

#### Parameters

| Name |
| :------ |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[createQueryBuilder](EntityManager.md#createquerybuilder)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:75

___

### decrement

**decrement**<`Entity`\>(`entityClass`, `conditions`, `propertyPath`, `value`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Decrements some column by provided value of the entities matched given conditions.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `conditions` | `any` |
| `propertyPath` | `string` |
| `value` | `string` \| `number` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[decrement](EntityManager.md#decrement)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:343

___

### delete

**delete**<`Entity`\>(`target`, `criteria`): `Promise`<[`DeleteResult`](DeleteResult.md)\>

Deletes entities by a given conditions.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient DELETE query.
Does not check if entity exist in the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] |

#### Returns

`Promise`<[`DeleteResult`](DeleteResult.md)\>

-`Promise`: 
	-`DeleteResult`: 

#### Overrides

[EntityManager](EntityManager.md).[delete](EntityManager.md#delete)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:90

___

### deleteMany

**deleteMany**<`Entity`\>(`entityClassOrName`, `query`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete multiple documents on MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:134

___

### deleteOne

**deleteOne**<`Entity`\>(`entityClassOrName`, `query`, `options?`): `Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

Delete a document on MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) |

#### Returns

`Promise`<[`DeleteResult`](../interfaces/DeleteResult-1.md)\>

-`Promise`: 
	-`acknowledged`: Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.
	-`deletedCount`: The number of documents that were deleted

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:138

___

### distinct

**distinct**<`Entity`\>(`entityClassOrName`, `key`, `query`, `options?`): `Promise`<`any`\>

The distinct command returns returns a list of distinct values for the given key across a collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `key` | `string` |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:142

___

### dropCollectionIndex

**dropCollectionIndex**<`Entity`\>(`entityClassOrName`, `indexName`, `options?`): `Promise`<`any`\>

Drops an index from this collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `indexName` | `string` |
| `options?` | [`CommandOperationOptions`](../interfaces/CommandOperationOptions.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:146

___

### dropCollectionIndexes

**dropCollectionIndexes**<`Entity`\>(`entityClassOrName`): `Promise`<`any`\>

Drops all indexes from the collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:150

___

### executeFind

`Protected` **executeFind**<`Entity`\>(`entityClassOrName`, `optionsOrConditions?`): `Promise`<`Entity`[]\>

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `optionsOrConditions?` | `any`[] \| [`MongoFindManyOptions`](../interfaces/MongoFindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:249

___

### executeFindAndCount

**executeFindAndCount**<`Entity`\>(`entityClassOrName`, `optionsOrConditions?`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options or conditions.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `optionsOrConditions?` | [`MongoFindManyOptions`](../interfaces/MongoFindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:253

___

### executeFindOne

`Protected` **executeFindOne**<`Entity`\>(`entityClassOrName`, `optionsOrConditions?`, `maybeOptions?`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given conditions and/or find options.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `optionsOrConditions?` | `any` |
| `maybeOptions?` | [`MongoFindOneOptions`](../types/MongoFindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:248

___

### exists

**exists**<`Entity`\>(`entityClass`, `options?`): `Promise`<`boolean`\>

Checks whether any entity exists with the given condition

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[exists](EntityManager.md#exists)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:239

___

### filterSoftDeleted

`Protected` **filterSoftDeleted**<`Entity`\>(`cursor`, `deleteDateColumn`, `query?`): `void`

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `cursor` | [`FindCursor`](FindCursor.md)<`Entity`\> |
| `deleteDateColumn` | [`ColumnMetadata`](ColumnMetadata.md) |
| `query?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:244

___

### find

**find**<`Entity`\>(`entityClassOrName`, `optionsOrConditions?`): `Promise`<`Entity`[]\>

Finds entities that match given find options or conditions.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `optionsOrConditions?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> \| [`FilterOperators`](../interfaces/FilterOperators.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Overrides

[EntityManager](EntityManager.md).[find](EntityManager.md#find)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:33

___

### findAndCount

**findAndCount**<`Entity`\>(`entityClassOrName`, `options?`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options or conditions.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`MongoFindManyOptions`](../interfaces/MongoFindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[findAndCount](EntityManager.md#findandcount)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:39

___

### findAndCountBy

**findAndCountBy**<`Entity`\>(`entityClassOrName`, `where`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given where conditions.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `where` | `any` |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[findAndCountBy](EntityManager.md#findandcountby)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:43

___

### findBy

**findBy**<`Entity`\>(`entityClass`, `where`): `Promise`<`Entity`[]\>

Finds entities that match given find options.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[findBy](EntityManager.md#findby)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:274

___

### findByIds

**findByIds**<`Entity`\>(`entityClassOrName`, `ids`, `optionsOrConditions?`): `Promise`<`Entity`[]\>

Finds entities by ids.
Optionally find options can be applied.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `ids` | `any`[] |
| `optionsOrConditions?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> \| [`Partial`](../types/Partial.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

**Deprecated**

use `findBy` method instead.

#### Overrides

[EntityManager](EntityManager.md).[findByIds](EntityManager.md#findbyids)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:50

___

### findOne

**findOne**<`Entity`\>(`entityClassOrName`, `options`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given conditions and/or find options.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options` | [`MongoFindOneOptions`](../types/MongoFindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[findOne](EntityManager.md#findone)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:54

___

### findOneAndDelete

**findOneAndDelete**<`Entity`\>(`entityClassOrName`, `query`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `options?` | [`FindOneAndDeleteOptions`](../interfaces/FindOneAndDeleteOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:154

___

### findOneAndReplace

**findOneAndReplace**<`Entity`\>(`entityClassOrName`, `query`, `replacement`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `replacement` | [`Document`](../interfaces/Document.md) |
| `options?` | [`FindOneAndReplaceOptions`](../interfaces/FindOneAndReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:158

___

### findOneAndUpdate

**findOneAndUpdate**<`Entity`\>(`entityClassOrName`, `query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md)\>

Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../types/UpdateFilter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`FindOneAndUpdateOptions`](../interfaces/FindOneAndUpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md)\>

-`Promise`: 
	-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:162

___

### findOneBy

**findOneBy**<`Entity`\>(`entityClassOrName`, `where`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given WHERE conditions.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `where` | `any` |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Overrides

[EntityManager](EntityManager.md).[findOneBy](EntityManager.md#findoneby)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:58

___

### findOneById

**findOneById**<`Entity`\>(`entityClassOrName`, `id`): `Promise`<``null`` \| `Entity`\>

Finds entity that matches given id.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
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

[EntityManager](EntityManager.md).[findOneById](EntityManager.md#findonebyid)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:68

___

### findOneByOrFail

**findOneByOrFail**<`Entity`\>(`entityClass`, `where`): `Promise`<`Entity`\>

Finds first entity that matches given where condition.
If entity was not found in the database - rejects with error.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[findOneByOrFail](EntityManager.md#findonebyorfail)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:328

___

### findOneOrFail

**findOneOrFail**<`Entity`\>(`entityClass`, `options`): `Promise`<`Entity`\>

Finds first entity by a given find options.
If entity was not found in the database - rejects with error.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options` | [`FindOneOptions`](../interfaces/FindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[findOneOrFail](EntityManager.md#findoneorfail)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:323

___

### getCustomRepository

**getCustomRepository**<`T`\>(`customRepository`): `T`

Gets custom entity repository marked with

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `customRepository` | [`ObjectType`](../types/ObjectType.md)<`T`\> |

#### Returns

`T`

**Entity Repository**

decorator.

**Deprecated**

use Repository.extend to create custom repositories

#### Inherited from

[EntityManager](EntityManager.md).[getCustomRepository](EntityManager.md#getcustomrepository)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:373

___

### getId

**getId**(`entity`): `any`

Gets entity mixed id.

#### Parameters

| Name |
| :------ |
| `entity` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[getId](EntityManager.md#getid)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:87

**getId**(`target`, `entity`): `any`

Gets entity mixed id.

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`any`\> |
| `entity` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[getId](EntityManager.md#getid)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:91

___

### getMongoRepository

**getMongoRepository**<`Entity`\>(`target`): [`MongoRepository`](MongoRepository.md)<`Entity`\>

Gets mongodb repository for the given entity class.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

[`MongoRepository`](MongoRepository.md)<`Entity`\>

-`MongoRepository`: 

#### Inherited from

[EntityManager](EntityManager.md).[getMongoRepository](EntityManager.md#getmongorepository)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:361

___

### getRepository

**getRepository**<`Entity`\>(`target`): [`Repository`](Repository.md)<`Entity`\>

Gets repository for the given entity class or name.
If single database connection mode is used, then repository is obtained from the
repository aggregator, where each repository is individually created for this entity manager.
When single database connection is not used, repository is being obtained from the connection.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

[`Repository`](Repository.md)<`Entity`\>

-`Repository`: 

#### Inherited from

[EntityManager](EntityManager.md).[getRepository](EntityManager.md#getrepository)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:350

___

### getTreeRepository

**getTreeRepository**<`Entity`\>(`target`): [`TreeRepository`](TreeRepository.md)<`Entity`\>

Gets tree repository for the given entity class or name.
If single database connection mode is used, then repository is obtained from the
repository aggregator, where each repository is individually created for this entity manager.
When single database connection is not used, repository is being obtained from the connection.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

[`TreeRepository`](TreeRepository.md)<`Entity`\>

-`TreeRepository`: 

#### Inherited from

[EntityManager](EntityManager.md).[getTreeRepository](EntityManager.md#gettreerepository)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:357

___

### hasId

**hasId**(`entity`): `boolean`

Checks if entity has an id.

#### Parameters

| Name |
| :------ |
| `entity` | `any` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[hasId](EntityManager.md#hasid)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:79

**hasId**(`target`, `entity`): `boolean`

Checks if entity of given schema name has an id.

#### Parameters

| Name |
| :------ |
| `target` | `string` \| `Function` |
| `entity` | `any` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[hasId](EntityManager.md#hasid)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:83

___

### increment

**increment**<`Entity`\>(`entityClass`, `conditions`, `propertyPath`, `value`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Increments some column by provided value of the entities matched given conditions.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `conditions` | `any` |
| `propertyPath` | `string` |
| `value` | `string` \| `number` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[increment](EntityManager.md#increment)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:339

___

### initializeOrderedBulkOp

**initializeOrderedBulkOp**<`Entity`\>(`entityClassOrName`, `options?`): [`OrderedBulkOperation`](OrderedBulkOperation.md)

Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`OrderedBulkOperation`](OrderedBulkOperation.md)

-`OrderedBulkOperation`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:178

___

### initializeUnorderedBulkOp

**initializeUnorderedBulkOp**<`Entity`\>(`entityClassOrName`, `options?`): [`UnorderedBulkOperation`](UnorderedBulkOperation.md)

Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

[`UnorderedBulkOperation`](UnorderedBulkOperation.md)

-`UnorderedBulkOperation`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:182

___

### insert

**insert**<`Entity`\>(`target`, `entity`): `Promise`<[`InsertResult`](InsertResult.md)\>

Inserts a given entity into the database.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient INSERT query.
Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
You can execute bulk inserts using this method.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Overrides

[EntityManager](EntityManager.md).[insert](EntityManager.md#insert)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:76

___

### insertMany

**insertMany**<`Entity`\>(`entityClassOrName`, `docs`, `options?`): `Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts an array of documents into MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `docs` | [`OptionalId`](../types/OptionalId.md)<[`Document`](../interfaces/Document.md)\>[] |
| `options?` | [`BulkWriteOptions`](../interfaces/BulkWriteOptions.md) |

#### Returns

`Promise`<[`InsertManyResult`](../interfaces/InsertManyResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertManyResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:186

___

### insertOne

**insertOne**<`Entity`\>(`entityClassOrName`, `doc`, `options?`): `Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

Inserts a single document into MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `doc` | [`OptionalId`](../types/OptionalId.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`InsertOneOptions`](../interfaces/InsertOneOptions.md) |

#### Returns

`Promise`<[`InsertOneResult`](../interfaces/InsertOneResult.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`InsertOneResult`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:190

___

### isCapped

**isCapped**<`Entity`\>(`entityClassOrName`): `Promise`<`any`\>

Returns if the collection is a capped collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:194

___

### listCollectionIndexes

**listCollectionIndexes**<`Entity`\>(`entityClassOrName`, `options?`): [`ListIndexesCursor`](ListIndexesCursor.md)

Get the list of all indexes information for the collection.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `options?` | [`ListIndexesOptions`](../interfaces/ListIndexesOptions.md) |

#### Returns

[`ListIndexesCursor`](ListIndexesCursor.md)

-`ListIndexesCursor`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:198

___

### maximum

**maximum**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the MAX of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[maximum](EntityManager.md#maximum)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:265

___

### merge

**merge**<`Entity`\>(`entityClass`, `mergeIntoEntity`, `...entityLikes`): `Entity`

Merges two entities into one new entity.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `mergeIntoEntity` | `Entity` |
| `...entityLikes` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\>[] |

#### Returns

`Entity`

#### Inherited from

[EntityManager](EntityManager.md).[merge](EntityManager.md#merge)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:105

___

### minimum

**minimum**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the MIN of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[minimum](EntityManager.md#minimum)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:261

___

### preload

**preload**<`Entity`\>(`entityClass`, `entityLike`): `Promise`<`undefined` \| `Entity`\>

Creates a new entity from the given plain javascript object. If entity already exist in the database, then
it loads it (and everything related to it), replaces all values with the new ones from the given object
and returns this new entity. This new entity is actually a loaded from the db entity with all properties
replaced from the new object.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entityLike` | [`DeepPartial`](../types/DeepPartial.md)<`Entity`\> |

#### Returns

`Promise`<`undefined` \| `Entity`\>

-`Promise`: 
	-`undefined \| Entity`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[preload](EntityManager.md#preload)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:112

___

### query

**query**<`T`\>(`query`, `parameters?`): `Promise`<`T`\>

Executes raw SQL query and returns raw database results.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `query` | `string` |
| `parameters?` | `any`[] |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[query](EntityManager.md#query)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:67

___

### recover

**recover**<`Entity`\>(`entities`, `options?`): `Promise`<`Entity`[]\>

Recovers all given entities.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entities` | `Entity`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[recover](EntityManager.md#recover)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:182

**recover**<`Entity`\>(`entity`, `options?`): `Promise`<`Entity`\>

Recovers a given entity.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[recover](EntityManager.md#recover)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:186

**recover**<`Entity`, `T`\>(`targetOrEntity`, `entities`, `options?`): `Promise`<`T`[]\>

Recovers all given entities.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[recover](EntityManager.md#recover)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:190

**recover**<`Entity`, `T`\>(`targetOrEntity`, `entity`, `options?`): `Promise`<`T`\>

Recovers a given entity.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[recover](EntityManager.md#recover)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:194

___

### release

**release**(): `Promise`<`void`\>

Releases all resources used by entity manager.
This is used when entity manager is created with a single query runner,
and this single query runner needs to be released after job with entity manager is done.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[release](EntityManager.md#release)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:379

___

### remove

**remove**<`Entity`\>(`entity`, `options?`): `Promise`<`Entity`\>

Removes a given entity from the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[remove](EntityManager.md#remove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:150

**remove**<`Entity`\>(`targetOrEntity`, `entity`, `options?`): `Promise`<`Entity`\>

Removes a given entity from the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `Entity` |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[remove](EntityManager.md#remove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:154

**remove**<`Entity`\>(`entity`, `options?`): `Promise`<`Entity`\>

Removes a given entity from the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entity` | `Entity`[] |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[remove](EntityManager.md#remove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:158

**remove**<`Entity`\>(`targetOrEntity`, `entity`, `options?`): `Promise`<`Entity`[]\>

Removes a given entity from the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `Entity`[] |
| `options?` | [`RemoveOptions`](../interfaces/RemoveOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[remove](EntityManager.md#remove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:162

___

### rename

**rename**<`Entity`\>(`entityClassOrName`, `newName`, `options?`): `Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `newName` | `string` |
| `options?` | [`RenameOptions`](../interfaces/RenameOptions.md) |

#### Returns

`Promise`<[`Collection`](Collection.md)<[`Document`](../interfaces/Document.md)\>\>

-`Promise`: 
	-`Collection`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:202

___

### replaceOne

**replaceOne**<`Entity`\>(`entityClassOrName`, `query`, `doc`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Replace a document on MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `doc` | [`Document`](../interfaces/Document.md) |
| `options?` | [`ReplaceOptions`](../interfaces/ReplaceOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:206

___

### restore

**restore**<`Entity`\>(`targetOrEntity`, `criteria`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Restores entities by a given condition(s).
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient DELETE query.
Does not check if entity exist in the database.
Condition(s) cannot be empty.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `criteria` | `any` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[restore](EntityManager.md#restore)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:235

___

### save

**save**<`Entity`\>(`entities`, `options?`): `Promise`<`Entity`[]\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entities` | `Entity`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:117

**save**<`Entity`\>(`entity`, `options?`): `Promise`<`Entity`\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:122

**save**<`Entity`, `T`\>(`targetOrEntity`, `entities`, `options`): `Promise`<`T`[]\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entities` | `T`[] |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:127

**save**<`Entity`, `T`\>(`targetOrEntity`, `entities`, `options?`): `Promise`<`T` & `Entity`[]\>

Saves all given entities in the database.
If entities do not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`[]\>

-`Promise`: 
	-``T` & `Entity`[]`: 
		-``T` & `Entity``: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:134

**save**<`Entity`, `T`\>(`targetOrEntity`, `entity`, `options`): `Promise`<`T`\>

Saves a given entity in the database.
If entity does not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `T` |
| `options` | [`SaveOptions`](../interfaces/SaveOptions.md) & { `reload`: ``false``  } |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:139

**save**<`Entity`, `T`\>(`targetOrEntity`, `entity`, `options?`): `Promise`<`T` & `Entity`\>

Saves a given entity in the database.
If entity does not exist in the database then inserts, otherwise updates.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T` & `Entity`\>

-`Promise`: 
	-``T` & `Entity``: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[save](EntityManager.md#save)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:146

___

### softDelete

**softDelete**<`Entity`\>(`targetOrEntity`, `criteria`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Records the delete date of entities by a given condition(s).
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient DELETE query.
Does not check if entity exist in the database.
Condition(s) cannot be empty.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `criteria` | `any` |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[softDelete](EntityManager.md#softdelete)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:227

___

### softRemove

**softRemove**<`Entity`\>(`entities`, `options?`): `Promise`<`Entity`[]\>

Records the delete date of all given entities.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entities` | `Entity`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[softRemove](EntityManager.md#softremove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:166

**softRemove**<`Entity`\>(`entity`, `options?`): `Promise`<`Entity`\>

Records the delete date of a given entity.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entity` | `Entity` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[softRemove](EntityManager.md#softremove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:170

**softRemove**<`Entity`, `T`\>(`targetOrEntity`, `entities`, `options?`): `Promise`<`T`[]\>

Records the delete date of all given entities.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entities` | `T`[] |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[softRemove](EntityManager.md#softremove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:174

**softRemove**<`Entity`, `T`\>(`targetOrEntity`, `entity`, `options?`): `Promise`<`T`\>

Records the delete date of a given entity.

| Name |
| :------ |
| `Entity` | `object` |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `targetOrEntity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entity` | `T` |
| `options?` | [`SaveOptions`](../interfaces/SaveOptions.md) |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[softRemove](EntityManager.md#softremove)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:178

___

### stats

**stats**<`Entity`\>(`entityClassOrName`, `options?`): `Promise`<[`CollStats`](../interfaces/CollStats.md)\>

Get all the collection statistics.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
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

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:210

___

### sum

**sum**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the SUM of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../types/PickKeysByType.md)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[sum](EntityManager.md#sum)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:253

___

### transaction

**transaction**<`T`\>(`runInTransaction`): `Promise`<`T`\>

Wraps given function execution (and all operations made there) in a transaction.
All database operations must be executed using provided entity manager.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `runInTransaction` | (`entityManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[transaction](EntityManager.md#transaction)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:58

**transaction**<`T`\>(`isolationLevel`, `runInTransaction`): `Promise`<`T`\>

Wraps given function execution (and all operations made there) in a transaction.
All database operations must be executed using provided entity manager.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `isolationLevel` | [`IsolationLevel`](../types/IsolationLevel.md) |
| `runInTransaction` | (`entityManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

-`Promise`: 

#### Inherited from

[EntityManager](EntityManager.md).[transaction](EntityManager.md#transaction)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:63

___

### update

**update**<`Entity`\>(`target`, `criteria`, `partialEntity`): `Promise`<[`UpdateResult`](UpdateResult.md)\>

Updates entity partially. Entity can be found by a given conditions.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient UPDATE query.
Does not check if entity exist in the database.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `criteria` | `string` \| `number` \| `Date` \| `string`[] \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectId`](ObjectId.md) \| `number`[] \| `Date`[] \| [`ObjectId`](ObjectId.md)[] |
| `partialEntity` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Overrides

[EntityManager](EntityManager.md).[update](EntityManager.md#update)

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:83

___

### updateMany

**updateMany**<`Entity`\>(`entityClassOrName`, `query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update multiple documents on MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../types/UpdateFilter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:215

___

### updateOne

**updateOne**<`Entity`\>(`entityClassOrName`, `query`, `update`, `options?`): `Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

Update a single document on MongoDB.

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `query` | [`Filter`](../types/Filter.md)<[`Document`](../interfaces/Document.md)\> |
| `update` | [`UpdateFilter`](../types/UpdateFilter.md)<[`Document`](../interfaces/Document.md)\> |
| `options?` | [`UpdateOptions`](../interfaces/UpdateOptions.md) |

#### Returns

`Promise`<[`Document`](../interfaces/Document.md) \| [`UpdateResult`](../interfaces/UpdateResult-1.md)\>

-`Promise`: 
	-`Document \| UpdateResult`: (optional) 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:219

___

### upsert

**upsert**<`Entity`\>(`target`, `entityOrEntities`, `conflictPathsOrOptions`): `Promise`<[`InsertResult`](InsertResult.md)\>

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `entityOrEntities` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |
| `conflictPathsOrOptions` | `string`[] \| [`UpsertOptions`](../interfaces/UpsertOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[upsert](EntityManager.md#upsert)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:203

___

### watch

**watch**<`Entity`\>(`entityClassOrName`, `pipeline?`, `options?`): [`ChangeStream`](ChangeStream.md)<[`Document`](../interfaces/Document.md), [`ChangeStreamDocument`](../types/ChangeStreamDocument.md)<[`Document`](../interfaces/Document.md)\>\>

| Name |
| :------ |
| `Entity` | `object` |

#### Parameters

| Name |
| :------ |
| `entityClassOrName` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `pipeline?` | [`Document`](../interfaces/Document.md)[] |
| `options?` | [`ChangeStreamOptions`](../interfaces/ChangeStreamOptions.md) |

#### Returns

[`ChangeStream`](ChangeStream.md)<[`Document`](../interfaces/Document.md), [`ChangeStreamDocument`](../types/ChangeStreamDocument.md)<[`Document`](../interfaces/Document.md)\>\>

-`ChangeStream`: 
	-`Document`: 
	-`ChangeStreamDocument`: 
		-`Document`: 

#### Defined in

node_modules/typeorm/entity-manager/MongoEntityManager.d.ts:211

___

### withRepository

**withRepository**<`Entity`, `R`\>(`repository`): `R`

Creates a new repository instance out of a given Repository and
sets current EntityManager instance to it. Used to work with custom repositories
in transactions.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `R` | [`Repository`](Repository.md)<`any`\> |

#### Parameters

| Name |
| :------ |
| `repository` | `R` & [`Repository`](Repository.md)<`Entity`\> |

#### Returns

`R`

#### Inherited from

[EntityManager](EntityManager.md).[withRepository](EntityManager.md#withrepository)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:367
