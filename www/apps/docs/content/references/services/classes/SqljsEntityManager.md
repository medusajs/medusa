# SqljsEntityManager

A special EntityManager that includes import/export and load/save function
that are unique to Sql.js.

## Hierarchy

- [`EntityManager`](EntityManager.md)

  ↳ **`SqljsEntityManager`**

## Constructors

### constructor

**new SqljsEntityManager**(`connection`, `queryRunner?`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Overrides

[EntityManager](EntityManager.md).[constructor](EntityManager.md#constructor)

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:11

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Overrides

[EntityManager](EntityManager.md).[@instanceof](EntityManager.md#@instanceof)

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:9

___

### connection

 `Readonly` **connection**: [`DataSource`](DataSource.md)

Connection used by this entity manager.

#### Inherited from

[EntityManager](EntityManager.md).[connection](EntityManager.md#connection)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:34

___

### driver

 `Private` **driver**: `any`

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:10

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

 `Protected` **repositories**: `Map`<[`EntityTarget`](../index.md#entitytarget)<`any`\>, [`Repository`](Repository.md)<`any`\>\>

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

## Methods

### average

**average**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the AVG of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../index.md#pickkeysbytype)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: 
	-```null`` \| number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[average](EntityManager.md#average)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:257

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

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

### count

**count**<`Entity`\>(`entityClass`, `options?`): `Promise`<`number`\>

Counts entities that match given options.
Useful for pagination.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[count](EntityManager.md#count)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:244

___

### countBy

**countBy**<`Entity`\>(`entityClass`, `where`): `Promise`<`number`\>

Counts entities that match given conditions.
Useful for pagination.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[countBy](EntityManager.md#countby)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:249

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `plainObject?` | [`DeepPartial`](../index.md#deeppartial)<`Entity`\> |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `plainObjects?` | [`DeepPartial`](../index.md#deeppartial)<`Entity`\>[] |

#### Returns

`Entity`[]

-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[create](EntityManager.md#create)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:101

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

**delete**<`Entity`\>(`targetOrEntity`, `criteria`): `Promise`<[`DeleteResult`](DeleteResult.md)\>

Deletes entities by a given condition(s).
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `criteria` | `any` |

#### Returns

`Promise`<[`DeleteResult`](DeleteResult.md)\>

-`Promise`: 
	-`DeleteResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[delete](EntityManager.md#delete)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:219

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

### exportDatabase

**exportDatabase**(): `Uint8Array`

Returns the current database definition.

#### Returns

`Uint8Array`

-`Uint8Array`: 

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:25

___

### find

**find**<`Entity`\>(`entityClass`, `options?`): `Promise`<`Entity`[]\>

Finds entities that match given find options.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Inherited from

[EntityManager](EntityManager.md).[find](EntityManager.md#find)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:270

___

### findAndCount

**findAndCount**<`Entity`\>(`entityClass`, `options?`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given find options.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `options?` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[findAndCount](EntityManager.md#findandcount)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:280

___

### findAndCountBy

**findAndCountBy**<`Entity`\>(`entityClass`, `where`): `Promise`<[`Entity`[], `number`]\>

Finds entities that match given WHERE conditions.
Also counts all entities that match given conditions,
but ignores pagination settings (from and take options).

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[findAndCountBy](EntityManager.md#findandcountby)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:286

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

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

**findByIds**<`Entity`\>(`entityClass`, `ids`): `Promise`<`Entity`[]\>

Finds entities with ids.
Optionally find options or conditions can be applied.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

[EntityManager](EntityManager.md).[findByIds](EntityManager.md#findbyids)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:297

___

### findOne

**findOne**<`Entity`\>(`entityClass`, `options`): `Promise`<``null`` \| `Entity`\>

Finds first entity by a given find options.
If entity was not found in the database - returns null.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `options` | [`FindOneOptions`](../interfaces/FindOneOptions.md)<`Entity`\> |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[findOne](EntityManager.md#findone)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:302

___

### findOneBy

**findOneBy**<`Entity`\>(`entityClass`, `where`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given where condition.
If entity was not found in the database - returns null.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Inherited from

[EntityManager](EntityManager.md).[findOneBy](EntityManager.md#findoneby)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:307

___

### findOneById

**findOneById**<`Entity`\>(`entityClass`, `id`): `Promise`<``null`` \| `Entity`\>

Finds first entity that matches given id.
If entity was not found in the database - returns null.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

[EntityManager](EntityManager.md).[findOneById](EntityManager.md#findonebyid)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:318

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `where` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `customRepository` | [`ObjectType`](../index.md#objecttype)<`T`\> |

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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`any`\> |
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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

### insert

**insert**<`Entity`\>(`target`, `entity`): `Promise`<[`InsertResult`](InsertResult.md)\>

Inserts a given entity into the database.
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient INSERT query.
Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
You can execute bulk inserts using this method.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `entity` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[insert](EntityManager.md#insert)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:202

___

### loadDatabase

**loadDatabase**(`fileNameOrLocalStorageOrData`): `Promise`<`void`\>

Loads either the definition from a file (Node.js) or localstorage (browser)
or uses the given definition to open a new database.

#### Parameters

| Name |
| :------ |
| `fileNameOrLocalStorageOrData` | `string` \| `Uint8Array` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:16

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../index.md#pickkeysbytype)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `mergeIntoEntity` | `Entity` |
| `...entityLikes` | [`DeepPartial`](../index.md#deeppartial)<`Entity`\>[] |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../index.md#pickkeysbytype)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

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
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `entityLike` | [`DeepPartial`](../index.md#deeppartial)<`Entity`\> |

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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

### saveDatabase

**saveDatabase**(`fileNameOrLocalStorage?`): `Promise`<`void`\>

Saves the current database to a file (Node.js) or localstorage (browser)
if fileNameOrLocalStorage is not set options.location is used.

#### Parameters

| Name |
| :------ |
| `fileNameOrLocalStorage?` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/entity-manager/SqljsEntityManager.d.ts:21

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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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
| `targetOrEntity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
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

### sum

**sum**<`Entity`\>(`entityClass`, `columnName`, `where?`): `Promise`<``null`` \| `number`\>

Return the SUM of a column

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityClass` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `columnName` | [`PickKeysByType`](../index.md#pickkeysbytype)<`Entity`, `number`\> |
| `where?` | [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\> \| [`FindOptionsWhere`](../index.md#findoptionswhere)<`Entity`\>[] |

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
| `isolationLevel` | [`IsolationLevel`](../index.md#isolationlevel) |
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

Updates entity partially. Entity can be found by a given condition(s).
Unlike save method executes a primitive operation without cascades, relations and other operations included.
Executes fast and efficient UPDATE query.
Does not check if entity exist in the database.
Condition(s) cannot be empty.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `criteria` | `any` |
| `partialEntity` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

`Promise`<[`UpdateResult`](UpdateResult.md)\>

-`Promise`: 
	-`UpdateResult`: 

#### Inherited from

[EntityManager](EntityManager.md).[update](EntityManager.md#update)

#### Defined in

node_modules/typeorm/entity-manager/EntityManager.d.ts:211

___

### upsert

**upsert**<`Entity`\>(`target`, `entityOrEntities`, `conflictPathsOrOptions`): `Promise`<[`InsertResult`](InsertResult.md)\>

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `entityOrEntities` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |
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
