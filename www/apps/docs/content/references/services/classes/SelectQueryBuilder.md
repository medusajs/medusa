# SelectQueryBuilder

Allows to build complex sql queries in a fashion way and execute those queries.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

## Hierarchy

- [`QueryBuilder`](QueryBuilder.md)<`Entity`\>

  ↳ **`SelectQueryBuilder`**

## Implements

- [`WhereExpressionBuilder`](../interfaces/WhereExpressionBuilder.md)

## Constructors

### constructor

**new SelectQueryBuilder**<`Entity`\>(`queryBuilder`)

QueryBuilder can be initialized from given Connection and QueryRunner objects or from given other QueryBuilder.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `queryBuilder` | [`QueryBuilder`](QueryBuilder.md)<`any`\> |

#### Inherited from

[QueryBuilder](QueryBuilder.md).[constructor](QueryBuilder.md#constructor)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:49

**new SelectQueryBuilder**<`Entity`\>(`connection`, `queryRunner?`)

QueryBuilder can be initialized from given Connection and QueryRunner objects or from given other QueryBuilder.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |
| `queryRunner?` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Inherited from

[QueryBuilder](QueryBuilder.md).[constructor](QueryBuilder.md#constructor)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:53

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Overrides

[QueryBuilder](QueryBuilder.md).[@instanceof](QueryBuilder.md#@instanceof)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:24

___

### computeCountExpression

 `Private` **computeCountExpression**: `any`

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:657

___

### conditions

 `Protected` **conditions**: `string`

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:35

___

### connection

 `Readonly` **connection**: [`DataSource`](DataSource.md)

Connection on which QueryBuilder was created.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[connection](QueryBuilder.md#connection)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:29

___

### createTableLockExpression

 `Private` **createTableLockExpression**: `any`

Creates "LOCK" part of SELECT Query after table Clause
ex.
 SELECT 1
 FROM USER U WITH (NOLOCK)
 JOIN ORDER O WITH (NOLOCK)
     ON U.ID=O.OrderID

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:646

___

### expressionMap

 `Readonly` **expressionMap**: [`QueryExpressionMap`](QueryExpressionMap.md)

Contains all properties of the QueryBuilder that needs to be build a final query.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[expressionMap](QueryBuilder.md#expressionmap)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:33

___

### findOptions

 `Protected` **findOptions**: [`FindManyOptions`](../interfaces/FindManyOptions.md)<`any`\>

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:25

___

### joins

 `Protected` **joins**: { `alias`: `string` ; `parentAlias`: `string` ; `relationMetadata`: [`RelationMetadata`](RelationMetadata.md) ; `select`: `boolean` ; `selection`: `undefined` \| [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`any`\> ; `type`: ``"inner"`` \| ``"left"``  }[]

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:27

___

### orderBys

 `Protected` **orderBys**: { `alias`: `string` ; `direction`: ``"ASC"`` \| ``"DESC"`` ; `nulls?`: ``"NULLS FIRST"`` \| ``"NULLS LAST"``  }[]

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:36

___

### parentQueryBuilder

 `Protected` **parentQueryBuilder**: [`QueryBuilder`](QueryBuilder.md)<`any`\>

If QueryBuilder was created in a subquery mode then its parent QueryBuilder (who created subquery) will be stored here.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[parentQueryBuilder](QueryBuilder.md#parentquerybuilder)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:41

___

### queryRunner

 `Protected` `Optional` **queryRunner**: [`QueryRunner`](../interfaces/QueryRunner.md)

Query runner used to execute query builder query.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[queryRunner](QueryBuilder.md#queryrunner)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:37

___

### relationMetadatas

 `Protected` **relationMetadatas**: [`RelationMetadata`](RelationMetadata.md)[]

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:41

___

### selects

 `Protected` **selects**: `string`[]

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:26

## Accessors

### alias

`get` **alias**(): `string`

Gets the main alias string used in this query builder.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

QueryBuilder.alias

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:61

## Methods

### addCommonTableExpression

**addCommonTableExpression**(`queryBuilder`, `alias`, `options?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds CTE to query

#### Parameters

| Name |
| :------ |
| `queryBuilder` | `string` \| [`QueryBuilder`](QueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `options?` | [`QueryBuilderCteOptions`](../interfaces/QueryBuilderCteOptions.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[addCommonTableExpression](QueryBuilder.md#addcommontableexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:209

___

### addFrom

**addFrom**<`T`\>(`entityTarget`, `aliasName`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

Specifies FROM which entity's table select/update/delete will be executed.
Also sets a main string alias of the selection data.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `aliasName` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:113

**addFrom**<`T`\>(`entityTarget`, `aliasName`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

Specifies FROM which entity's table select/update/delete will be executed.
Also sets a main string alias of the selection data.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../types/EntityTarget.md)<`T`\> |
| `aliasName` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:118

___

### addGroupBy

**addGroupBy**(`groupBy`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds GROUP BY condition in the query builder.

#### Parameters

| Name |
| :------ |
| `groupBy` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:477

___

### addOrderBy

**addOrderBy**(`sort`, `order?`, `nulls?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds ORDER BY condition in the query builder.

#### Parameters

| Name |
| :------ |
| `sort` | `string` |
| `order?` | ``"ASC"`` \| ``"DESC"`` |
| `nulls?` | ``"NULLS FIRST"`` \| ``"NULLS LAST"`` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:505

___

### addSelect

**addSelect**(`selection`, `selectionAliasName?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new selection to the SELECT query.

#### Parameters

| Name |
| :------ |
| `selection` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `selectionAliasName?` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:74

**addSelect**(`selection`, `selectionAliasName?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new selection to the SELECT query.

#### Parameters

| Name |
| :------ |
| `selection` | `string` |
| `selectionAliasName?` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:78

**addSelect**(`selection`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new selection to the SELECT query.

#### Parameters

| Name |
| :------ |
| `selection` | `string`[] |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:82

___

### andHaving

**andHaving**(`having`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new AND HAVING condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `having` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:456

___

### andWhere

**andWhere**(`where`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`Brackets`](Brackets.md) \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>) => `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[andWhere](../interfaces/WhereExpressionBuilder.md#andwhere)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:400

___

### andWhereExists

**andWhereExists**(`subQuery`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds a new AND where EXISTS clause

#### Parameters

| Name |
| :------ |
| `subQuery` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:413

___

### andWhereInIds

**andWhereInIds**(`ids`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new AND WHERE with conditions for the given ids.

Ids are mixed.
It means if you have single primary key you can pass a simple id values, for example [1, 2, 3].
If you have multiple primary keys you need to pass object with property names and values specified,
for example [{ firstId: 1, secondId: 2 }, { firstId: 2, secondId: 3 }, ...]

#### Parameters

| Name |
| :------ |
| `ids` | `any` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[andWhereInIds](../interfaces/WhereExpressionBuilder.md#andwhereinids)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:435

___

### applyFindOptions

`Protected` **applyFindOptions**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:660

___

### buildEagerRelations

`Protected` **buildEagerRelations**(`relations`, `selection`, `metadata`, `alias`, `embedPrefix?`): `void`

#### Parameters

| Name |
| :------ |
| `relations` | [`FindOptionsRelations`](../types/FindOptionsRelations.md)<`any`\> |
| `selection` | `undefined` \| [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`any`\> |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `alias` | `string` |
| `embedPrefix?` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:688

___

### buildEscapedEntityColumnSelects

`Protected` **buildEscapedEntityColumnSelects**(`aliasName`, `metadata`): [`SelectQuery`](../interfaces/SelectQuery.md)[]

#### Parameters

| Name |
| :------ |
| `aliasName` | `string` |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Returns

[`SelectQuery`](../interfaces/SelectQuery.md)[]

-`SelectQuery[]`: 
	-`aliasName`: (optional) 
	-`selection`: 
	-`virtual`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:655

___

### buildOrder

`Protected` **buildOrder**(`order`, `metadata`, `alias`, `embedPrefix?`): `void`

#### Parameters

| Name |
| :------ |
| `order` | [`FindOptionsOrder`](../types/FindOptionsOrder.md)<`any`\> |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `alias` | `string` |
| `embedPrefix?` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:689

___

### buildRelations

`Protected` **buildRelations**(`relations`, `selection`, `metadata`, `alias`, `embedPrefix?`): `void`

#### Parameters

| Name |
| :------ |
| `relations` | [`FindOptionsRelations`](../types/FindOptionsRelations.md)<`any`\> |
| `selection` | `undefined` \| [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`any`\> |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `alias` | `string` |
| `embedPrefix?` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:687

___

### buildSelect

`Protected` **buildSelect**(`select`, `metadata`, `alias`, `embedPrefix?`): `void`

#### Parameters

| Name |
| :------ |
| `select` | [`FindOptionsSelect`](../types/FindOptionsSelect.md)<`any`\> |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `alias` | `string` |
| `embedPrefix?` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:686

___

### buildWhere

`Protected` **buildWhere**(`where`, `metadata`, `alias`, `embedPrefix?`): `string`

#### Parameters

| Name |
| :------ |
| `where` | [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`any`\> \| [`FindOptionsWhere`](../types/FindOptionsWhere.md)<`any`\>[] |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `alias` | `string` |
| `embedPrefix?` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:690

___

### cache

**cache**(`enabled`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Enables or disables query result caching.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:599

**cache**(`milliseconds`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Enables query result caching and sets in milliseconds in which cache will expire.
If not set then global caching time will be used.

#### Parameters

| Name |
| :------ |
| `milliseconds` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:604

**cache**(`id`, `milliseconds?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Enables query result caching and sets cache id and milliseconds in which cache will expire.

#### Parameters

| Name |
| :------ |
| `id` | `any` |
| `milliseconds?` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:608

___

### callListeners

**callListeners**(`enabled`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Indicates if listeners and subscribers must be called before and after query execution.
Enabled by default.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[callListeners](QueryBuilder.md#calllisteners)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:201

___

### clone

**clone**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Clones query builder as it is.
Note: it uses new query runner, if you want query builder that uses exactly same query runner,
you can create query builder using its constructor, for example new SelectQueryBuilder(queryBuilder)
where queryBuilder is cloned QueryBuilder.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[clone](QueryBuilder.md#clone)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:178

___

### comment

**comment**(`comment`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Includes a Query comment in the query builder.  This is helpful for debugging purposes,
such as finding a specific query in the database server's logs, or for categorization using
an APM product.

#### Parameters

| Name |
| :------ |
| `comment` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[comment](QueryBuilder.md#comment)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:184

___

### concatRelationMetadata

**concatRelationMetadata**(`relationMetadata`): `void`

#### Parameters

| Name |
| :------ |
| `relationMetadata` | [`RelationMetadata`](RelationMetadata.md) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:661

___

### createComment

`Protected` **createComment**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createComment](QueryBuilder.md#createcomment)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:233

___

### createCteExpression

`Protected` **createCteExpression**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createCteExpression](QueryBuilder.md#createcteexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:256

___

### createFromAlias

`Protected` **createFromAlias**(`entityTarget`, `aliasName?`): [`Alias`](Alias.md)

Specifies FROM which entity's table select/update/delete will be executed.
Also sets a main string alias of the selection data.

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../types/EntityTarget.md)<`any`\> \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `aliasName?` | `string` |

#### Returns

[`Alias`](Alias.md)

-`Alias`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createFromAlias](QueryBuilder.md#createfromalias)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:223

___

### createGroupByExpression

`Protected` **createGroupByExpression**(): `string`

Creates "GROUP BY" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:629

___

### createHavingExpression

`Protected` **createHavingExpression**(): `string`

Creates "HAVING" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:654

___

### createJoinExpression

`Protected` **createJoinExpression**(): `string`

Creates "JOIN" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:625

___

### createLimitOffsetExpression

`Protected` **createLimitOffsetExpression**(): `string`

Creates "LIMIT" and "OFFSET" parts of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:637

___

### createLockExpression

`Protected` **createLockExpression**(): `string`

Creates "LOCK" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:650

___

### createOrderByCombinedWithSelectExpression

`Protected` **createOrderByCombinedWithSelectExpression**(`parentAlias`): [`string`, [`OrderByCondition`](../types/OrderByCondition.md)]

#### Parameters

| Name |
| :------ |
| `parentAlias` | `string` |

#### Returns

[`string`, [`OrderByCondition`](../types/OrderByCondition.md)]

-`[`string`, [`OrderByCondition`](../types/OrderByCondition.md)]`: 
	-`string`: (optional) 
	-`OrderByCondition`: Special object that defines order condition for ORDER BY in sql. Example: { "name": "ASC", "id": "DESC" }
		-`__type`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:669

___

### createOrderByExpression

`Protected` **createOrderByExpression**(): `string`

Creates "ORDER BY" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:633

___

### createParameter

`Protected` **createParameter**(`value`): `string`

#### Parameters

| Name |
| :------ |
| `value` | `any` |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createParameter](QueryBuilder.md#createparameter)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:139

___

### createPropertyPath

`Protected` **createPropertyPath**(`metadata`, `entity`, `prefix?`): `string`[]

Creates a property paths for a given ObjectLiteral.

#### Parameters

| Name |
| :------ |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `prefix?` | `string` |

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createPropertyPath](QueryBuilder.md#createpropertypath)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:266

___

### createQueryBuilder

**createQueryBuilder**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates a completely new query builder.
Uses same query runner as current QueryBuilder.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createQueryBuilder](QueryBuilder.md#createquerybuilder)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:171

___

### createReturningExpression

`Protected` **createReturningExpression**(`returningType`): `string`

Creates "RETURNING" / "OUTPUT" expression.

#### Parameters

| Name |
| :------ |
| `returningType` | [`ReturningType`](../types/ReturningType.md) |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createReturningExpression](QueryBuilder.md#createreturningexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:245

___

### createSelectDistinctExpression

`Protected` **createSelectDistinctExpression**(): `string`

Creates select | select distinct part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:621

___

### createSelectExpression

`Protected` **createSelectExpression**(): `string`

Creates "SELECT FROM" part of SQL query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:617

___

### createTimeTravelQuery

`Protected` **createTimeTravelQuery**(): `string`

Time travel queries for CockroachDB

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createTimeTravelQuery](QueryBuilder.md#createtimetravelquery)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:237

___

### createWhereClausesExpression

`Protected` **createWhereClausesExpression**(`clauses`): `string`

#### Parameters

| Name |
| :------ |
| `clauses` | [`WhereClause`](../interfaces/WhereClause.md)[] |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createWhereClausesExpression](QueryBuilder.md#createwhereclausesexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:251

___

### createWhereConditionExpression

`Protected` **createWhereConditionExpression**(`condition`, `alwaysWrap?`): `string`

Computes given where argument - transforms to a where string all forms it can take.

#### Parameters

| Name |
| :------ |
| `condition` | [`WhereClauseCondition`](../types/WhereClauseCondition.md) |
| `alwaysWrap?` | `boolean` |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createWhereConditionExpression](QueryBuilder.md#createwhereconditionexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:255

___

### createWhereExpression

`Protected` **createWhereExpression**(): `string`

Creates "WHERE" expression.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createWhereExpression](QueryBuilder.md#createwhereexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:241

___

### delete

**delete**(): [`DeleteQueryBuilder`](DeleteQueryBuilder.md)<`Entity`\>

Creates DELETE query.

#### Returns

[`DeleteQueryBuilder`](DeleteQueryBuilder.md)<`Entity`\>

-`DeleteQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[delete](QueryBuilder.md#delete)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:100

___

### disableEscaping

**disableEscaping**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Disables escaping.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[disableEscaping](QueryBuilder.md#disableescaping)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:188

___

### distinct

**distinct**(`distinct?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets whether the selection is DISTINCT.

#### Parameters

| Name |
| :------ |
| `distinct?` | `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:91

___

### distinctOn

**distinctOn**(`distinctOn`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets the distinct on clause for Postgres.

#### Parameters

| Name |
| :------ |
| `distinctOn` | `string`[] |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:95

___

### escape

**escape**(`name`): `string`

Escapes table name, column name or alias name using current database's escaping character.

#### Parameters

| Name |
| :------ |
| `name` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[escape](QueryBuilder.md#escape)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:192

___

### execute

**execute**(): `Promise`<`any`\>

Executes sql generated by query builder and returns raw database results.

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[execute](QueryBuilder.md#execute)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:166

___

### executeCountQuery

`Protected` **executeCountQuery**(`queryRunner`): `Promise`<`number`\>

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:658

___

### executeEntitiesAndRawResults

`Protected` **executeEntitiesAndRawResults**(`queryRunner`): `Promise`<{ `entities`: `Entity`[] ; `raw`: `any`[]  }\>

Executes sql generated by query builder and returns object with raw results and entities created from them.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`Promise`<{ `entities`: `Entity`[] ; `raw`: `any`[]  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:665

___

### executeExistsQuery

`Protected` **executeExistsQuery**(`queryRunner`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:659

___

### findEntityColumnSelects

`Protected` **findEntityColumnSelects**(`aliasName`, `metadata`): [`SelectQuery`](../interfaces/SelectQuery.md)[]

#### Parameters

| Name |
| :------ |
| `aliasName` | `string` |
| `metadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Returns

[`SelectQuery`](../interfaces/SelectQuery.md)[]

-`SelectQuery[]`: 
	-`aliasName`: (optional) 
	-`selection`: 
	-`virtual`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:656

___

### from

**from**<`T`\>(`entityTarget`, `aliasName`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

Specifies FROM which entity's table select/update/delete will be executed.
Also sets a main string alias of the selection data.
Removes all previously set from-s.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `aliasName` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:102

**from**<`T`\>(`entityTarget`, `aliasName`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

Specifies FROM which entity's table select/update/delete will be executed.
Also sets a main string alias of the selection data.
Removes all previously set from-s.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../types/EntityTarget.md)<`T`\> |
| `aliasName` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`T`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:108

___

### fromDummy

**fromDummy**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:96

___

### getCount

**getCount**(): `Promise`<`number`\>

Gets count - number of entities selected by sql generated by this query builder.
Count excludes all limitations set by offset, limit, skip, and take.

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:581

___

### getExists

**getExists**(): `Promise`<`boolean`\>

Gets exists
Returns whether any rows exists matching current query.

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:586

___

### getExistsCondition

`Protected` **getExistsCondition**(`subQuery`): [`string`, `any`[]]

#### Parameters

| Name |
| :------ |
| `subQuery` | `any` |

#### Returns

[`string`, `any`[]]

-`[`string`, `any`[]]`: 
	-`string`: (optional) 
	-`any[]`: 
		-`any`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getExistsCondition](QueryBuilder.md#getexistscondition)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:261

___

### getMainTableName

`Protected` **getMainTableName**(): `string`

Gets name of the table where insert should be performed.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getMainTableName](QueryBuilder.md#getmaintablename)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:218

___

### getMany

**getMany**(): `Promise`<`Entity`[]\>

Gets entities returned by execution of generated query builder sql.

#### Returns

`Promise`<`Entity`[]\>

-`Promise`: 
	-`Entity[]`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:576

___

### getManyAndCount

**getManyAndCount**(): `Promise`<[`Entity`[], `number`]\>

Executes built SQL query and returns entities and overall entities count (without limitation).
This method is useful to build pagination.

#### Returns

`Promise`<[`Entity`[], `number`]\>

-`Promise`: 
	-`Entity[]`: 
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:591

___

### getOne

**getOne**(): `Promise`<``null`` \| `Entity`\>

Gets single entity returned by execution of generated query builder sql.

#### Returns

`Promise`<``null`` \| `Entity`\>

-`Promise`: 
	-```null`` \| Entity`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:568

___

### getOneOrFail

**getOneOrFail**(): `Promise`<`Entity`\>

Gets the first entity returned by execution of generated query builder sql or rejects the returned promise on error.

#### Returns

`Promise`<`Entity`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:572

___

### getParameters

**getParameters**(): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Gets all parameters.

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getParameters](QueryBuilder.md#getparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:149

___

### getPredicates

`Protected` **getPredicates**(`where`): [`Generator`](../interfaces/Generator.md)<`any`[], `void`, `unknown`\>

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`Generator`](../interfaces/Generator.md)<`any`[], `void`, `unknown`\>

-`Generator`: 
	-`any[]`: 
		-`any`: (optional) 
	-`void`: (optional) 
	-`unknown`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getPredicates](QueryBuilder.md#getpredicates)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:267

___

### getQuery

**getQuery**(): `string`

Gets generated SQL query without parameters being replaced.

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[QueryBuilder](QueryBuilder.md).[getQuery](QueryBuilder.md#getquery)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:45

___

### getQueryAndParameters

**getQueryAndParameters**(): [`string`, `any`[]]

Gets query to be executed with all parameters used in it.

#### Returns

[`string`, `any`[]]

-`[`string`, `any`[]]`: 
	-`string`: (optional) 
	-`any[]`: 
		-`any`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getQueryAndParameters](QueryBuilder.md#getqueryandparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:162

___

### getRawAndEntities

**getRawAndEntities**<`T`\>(): `Promise`<{ `entities`: `Entity`[] ; `raw`: `T`[]  }\>

Executes sql generated by query builder and returns object with raw results and entities created from them.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Returns

`Promise`<{ `entities`: `Entity`[] ; `raw`: `T`[]  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:561

___

### getRawMany

**getRawMany**<`T`\>(): `Promise`<`T`[]\>

Gets all raw results returned by execution of generated query builder sql.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Returns

`Promise`<`T`[]\>

-`Promise`: 
	-`T[]`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:557

___

### getRawOne

**getRawOne**<`T`\>(): `Promise`<`undefined` \| `T`\>

Gets first raw result returned by execution of generated query builder sql.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Returns

`Promise`<`undefined` \| `T`\>

-`Promise`: 
	-`undefined \| T`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:553

___

### getReturningColumns

`Protected` **getReturningColumns**(): [`ColumnMetadata`](ColumnMetadata.md)[]

If returning / output cause is set to array of column names,
then this method will return all column metadatas of those column names.

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getReturningColumns](QueryBuilder.md#getreturningcolumns)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:250

___

### getSql

**getSql**(): `string`

Gets generated sql that will be executed.
Parameters in the query are escaped for the currently used driver.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getSql](QueryBuilder.md#getsql)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:158

___

### getTableName

`Protected` **getTableName**(`tablePath`): `string`

Gets escaped table name with schema name if SqlServer driver used with custom
schema name, otherwise returns escaped table name.

#### Parameters

| Name |
| :------ |
| `tablePath` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getTableName](QueryBuilder.md#gettablename)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:214

___

### getWhereCondition

`Protected` **getWhereCondition**(`where`): [`WhereClauseCondition`](../types/WhereClauseCondition.md)

#### Parameters

| Name |
| :------ |
| `where` | `string` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`Brackets`](Brackets.md) \| [`NotBrackets`](NotBrackets.md) \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>) => `string` |

#### Returns

[`WhereClauseCondition`](../types/WhereClauseCondition.md)

-`WhereClauseCondition`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getWhereCondition](QueryBuilder.md#getwherecondition)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:269

___

### getWhereInIdsCondition

`Protected` **getWhereInIdsCondition**(`ids`): [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`Brackets`](Brackets.md)

Creates "WHERE" condition for an in-ids condition.

#### Parameters

| Name |
| :------ |
| `ids` | `any` |

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`Brackets`](Brackets.md)

-`ObjectLiteral \| Brackets`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getWhereInIdsCondition](QueryBuilder.md#getwhereinidscondition)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:260

___

### getWherePredicateCondition

`Protected` **getWherePredicateCondition**(`aliasPath`, `parameterValue`): [`WhereClauseCondition`](../types/WhereClauseCondition.md)

#### Parameters

| Name |
| :------ |
| `aliasPath` | `string` |
| `parameterValue` | `any` |

#### Returns

[`WhereClauseCondition`](../types/WhereClauseCondition.md)

-`WhereClauseCondition`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getWherePredicateCondition](QueryBuilder.md#getwherepredicatecondition)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:268

___

### groupBy

**groupBy**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets GROUP BY condition in the query builder.
If you had previously GROUP BY expression defined,
calling this function will override previously set GROUP BY conditions.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:467

**groupBy**(`groupBy`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets GROUP BY condition in the query builder.
If you had previously GROUP BY expression defined,
calling this function will override previously set GROUP BY conditions.

#### Parameters

| Name |
| :------ |
| `groupBy` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:473

___

### hasCommonTableExpressions

`Protected` **hasCommonTableExpressions**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[hasCommonTableExpressions](QueryBuilder.md#hascommontableexpressions)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:274

___

### hasParameter

**hasParameter**(`key`): `boolean`

Check the existence of a parameter for this query builder.

#### Parameters

| Name |
| :------ |
| `key` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[hasParameter](QueryBuilder.md#hasparameter)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:128

___

### hasRelation

**hasRelation**<`T`\>(`target`, `relation`): `boolean`

Checks if given relation exists in the entity.
Returns true if relation exists, false otherwise.

todo: move this method to manager? or create a shortcut?

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`T`\> |
| `relation` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[hasRelation](QueryBuilder.md#hasrelation)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:117

**hasRelation**<`T`\>(`target`, `relation`): `boolean`

Checks if given relations exist in the entity.
Returns true if relation exists, false otherwise.

todo: move this method to manager? or create a shortcut?

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `target` | [`EntityTarget`](../types/EntityTarget.md)<`T`\> |
| `relation` | `string`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[hasRelation](QueryBuilder.md#hasrelation)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:124

___

### having

**having**(`having`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets HAVING condition in the query builder.
If you had previously HAVING expression defined,
calling this function will override previously set HAVING conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `having` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:451

___

### innerJoin

**innerJoin**(`subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs (without selection) given subquery.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:124

**innerJoin**(`property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs (without selection) entity's property.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:131

**innerJoin**(`entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs (without selection) given entity's table.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:137

**innerJoin**(`tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs (without selection) given table.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:143

___

### innerJoinAndMapMany

**innerJoinAndMapMany**(`mapToProperty`, `subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs given subquery, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:227

**innerJoinAndMapMany**(`mapToProperty`, `property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:236

**innerJoinAndMapMany**(`mapToProperty`, `entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:244

**innerJoinAndMapMany**(`mapToProperty`, `tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:252

___

### innerJoinAndMapOne

**innerJoinAndMapOne**(`mapToProperty`, `subQueryFactory`, `alias`, `condition?`, `parameters?`, `mapAsEntity?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs given subquery, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `mapAsEntity?` | `string` \| `Function` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:261

**innerJoinAndMapOne**(`mapToProperty`, `property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:270

**innerJoinAndMapOne**(`mapToProperty`, `entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:278

**innerJoinAndMapOne**(`mapToProperty`, `tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:286

___

### innerJoinAndSelect

**innerJoinAndSelect**(`subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs given subquery and adds all selection properties to SELECT..
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:174

**innerJoinAndSelect**(`property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity's property and adds all selection properties to SELECT.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:181

**innerJoinAndSelect**(`entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs entity and adds all selection properties to SELECT.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:187

**innerJoinAndSelect**(`tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

INNER JOINs table and adds all selection properties to SELECT.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:193

___

### insert

**insert**(): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Creates INSERT query.

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[insert](QueryBuilder.md#insert)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:80

___

### join

`Protected` **join**(`direction`, `entityOrProperty`, `aliasName`, `condition?`, `parameters?`, `mapToProperty?`, `isMappingMany?`, `mapAsEntity?`): `void`

#### Parameters

| Name |
| :------ |
| `direction` | ``"INNER"`` \| ``"LEFT"`` |
| `entityOrProperty` | `string` \| `Function` \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `aliasName` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `mapToProperty?` | `string` |
| `isMappingMany?` | `boolean` |
| `mapAsEntity?` | `string` \| `Function` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:613

___

### leftJoin

**leftJoin**(`subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs (without selection) given subquery.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:149

**leftJoin**(`property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs (without selection) entity's property.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:156

**leftJoin**(`entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs (without selection) entity's table.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:162

**leftJoin**(`tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs (without selection) given table.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:168

___

### leftJoinAndMapMany

**leftJoinAndMapMany**(`mapToProperty`, `subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs given subquery, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:295

**leftJoinAndMapMany**(`mapToProperty`, `property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:304

**leftJoinAndMapMany**(`mapToProperty`, `entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:312

**leftJoinAndMapMany**(`mapToProperty`, `tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there are multiple rows of selecting data, and mapped result will be an array.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:320

___

### leftJoinAndMapOne

**leftJoinAndMapOne**(`mapToProperty`, `subQueryFactory`, `alias`, `condition?`, `parameters?`, `mapAsEntity?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs given subquery, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `mapAsEntity?` | `string` \| `Function` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:329

**leftJoinAndMapOne**(`mapToProperty`, `property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:338

**leftJoinAndMapOne**(`mapToProperty`, `entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:346

**leftJoinAndMapOne**(`mapToProperty`, `tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
This is extremely useful when you want to select some data and map it to some virtual property.
It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:354

___

### leftJoinAndSelect

**leftJoinAndSelect**(`subQueryFactory`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs given subquery and adds all selection properties to SELECT..
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `subQueryFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:199

**leftJoinAndSelect**(`property`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity's property and adds all selection properties to SELECT.
Given entity property should be a relation.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `property` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:206

**leftJoinAndSelect**(`entity`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs entity and adds all selection properties to SELECT.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `entity` | `string` \| `Function` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:212

**leftJoinAndSelect**(`tableName`, `alias`, `condition?`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs table and adds all selection properties to SELECT.
You also need to specify an alias of the joined data.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `alias` | `string` |
| `condition?` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:218

___

### limit

**limit**(`limit?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Set's LIMIT - maximum number of rows to be selected.
NOTE that it may not work as you expect if you are using joins.
If you want to implement pagination, and you are having join in your query,
then use instead take method instead.

#### Parameters

| Name |
| :------ |
| `limit?` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:512

___

### loadAllRelationIds

**loadAllRelationIds**(`options?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Loads all relation ids for all relations of the selected entity.
All relation ids will be mapped to relation property themself.
If array of strings is given then loads only relation ids of the given properties.

#### Parameters

| Name |
| :------ |
| `options?` | `object` |
| `options.disableMixedMap?` | `boolean` |
| `options.relations?` | `string`[] |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:385

___

### loadRawResults

`Protected` **loadRawResults**(`queryRunner`): `Promise`<`any`\>

Loads raw results from the database.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

`Promise`<`any`\>

-`Promise`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:673

___

### loadRelationCountAndMap

**loadRelationCountAndMap**(`mapToProperty`, `relationName`, `aliasName?`, `queryBuilderFactory?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Counts number of entities of entity's relation and maps the value into some entity's property.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `relationName` | `string` |
| `aliasName?` | `string` |
| `queryBuilderFactory?` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:379

___

### loadRelationIdAndMap

**loadRelationIdAndMap**(`mapToProperty`, `relationName`, `options?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs relation id and maps it into some entity's property.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `relationName` | `string` |
| `options?` | `object` |
| `options.disableMixedMap?` | `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:367

**loadRelationIdAndMap**(`mapToProperty`, `relationName`, `alias`, `queryBuilderFactory`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

LEFT JOINs relation id and maps it into some entity's property.
Optionally, you can add condition and parameters used in condition.

#### Parameters

| Name |
| :------ |
| `mapToProperty` | `string` |
| `relationName` | `string` |
| `alias` | `string` |
| `queryBuilderFactory` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:374

___

### maxExecutionTime

**maxExecutionTime**(`milliseconds`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Set max execution time.

#### Parameters

| Name |
| :------ |
| `milliseconds` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:87

___

### mergeExpressionMap

`Protected` **mergeExpressionMap**(`expressionMap`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Merges into expression map given expression map properties.

#### Parameters

| Name |
| :------ |
| `expressionMap` | [`Partial`](../types/Partial.md)<[`QueryExpressionMap`](QueryExpressionMap.md)\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:677

___

### normalizeNumber

`Protected` **normalizeNumber**(`num`): `any`

Normalizes a give number - converts to int if possible.

#### Parameters

| Name |
| :------ |
| `num` | `any` |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:681

___

### obtainQueryRunner

`Protected` **obtainQueryRunner**(): [`QueryRunner`](../interfaces/QueryRunner.md)

Creates a query builder used to execute sql queries inside this query builder.

#### Returns

[`QueryRunner`](../interfaces/QueryRunner.md)

-`broadcaster`: Broadcaster used on this query runner to broadcast entity events.
	-`queryRunner`: 
-`connection`: Connection used by this query runner.
	-`@instanceof`: 
	-`driver`: Database driver used by this connection.
		-`cteCapabilities`: 
		-`dataTypeDefaults`: Default values of length, precision and scale depends on column data type. Used in the cases when length/precision/scale is not specified by user.
		-`database`: (optional) Database name used to perform all write queries. todo: probably move into query runner.
		-`dummyTableName`: (optional) Dummy table name
		-`isReplicated`: Indicates if replication is enabled.
		-`mappedDataTypes`: Orm has special columns and we need to know what database column types should be for those types. Column types are driver dependant.
		-`maxAliasLength`: (optional) Max length allowed by the DBMS for aliases (execution of queries).
		-`options`: Connection options.
		-`schema`: (optional) Schema name used to perform all write queries.
		-`spatialTypes`: Gets list of spatial column data types.
		-`supportedDataTypes`: Gets list of supported column data types by a driver.
		-`supportedOnDeleteTypes`: (optional) Returns list of supported onDelete types by driver
		-`supportedOnUpdateTypes`: (optional) Returns list of supported onUpdate types by driver
		-`supportedUpsertTypes`: Returns type of upsert supported by driver if any
		-`transactionSupport`: Represent transaction support by this driver
		-`treeSupport`: Indicates if tree tables are supported by this driver.
		-`version`: (optional) Database version/release. Often requires a SQL query to the DB, so it is not always set
		-`withLengthColumnTypes`: Gets list of column data types that support length by a driver.
		-`withPrecisionColumnTypes`: Gets list of column data types that support precision by a driver.
		-`withScaleColumnTypes`: Gets list of column data types that support scale by a driver.
	-`entityMetadatas`: All entity metadatas that are registered for this connection.
		-`@instanceof`: 
		-`afterInsertListeners`: Listener metadatas with "AFTER INSERT" type.
		-`afterLoadListeners`: Listener metadatas with "AFTER LOAD" type.
		-`afterRecoverListeners`: Listener metadatas with "AFTER RECOVER" type.
		-`afterRemoveListeners`: Listener metadatas with "AFTER REMOVE" type.
		-`afterSoftRemoveListeners`: Listener metadatas with "AFTER SOFT REMOVE" type.
		-`afterUpdateListeners`: Listener metadatas with "AFTER UPDATE" type.
		-`allEmbeddeds`: All embeddeds - embeddeds from this entity metadata and from all child embeddeds, etc.
		-`ancestorColumns`: Ancestor columns used only in closure junction tables.
		-`beforeInsertListeners`: Listener metadatas with "AFTER INSERT" type.
		-`beforeRecoverListeners`: Listener metadatas with "BEFORE RECOVER" type.
		-`beforeRemoveListeners`: Listener metadatas with "AFTER REMOVE" type.
		-`beforeSoftRemoveListeners`: Listener metadatas with "BEFORE SOFT REMOVE" type.
		-`beforeUpdateListeners`: Listener metadatas with "AFTER UPDATE" type.
		-`checks`: Entity's check metadatas.
		-`childEntityMetadatas`: Children entity metadatas. Used in inheritance patterns.
		-`closureJunctionTable`: If entity's table is a closure-typed table, then this entity will have a closure junction table metadata.
		-`columns`: Columns of the entity, including columns that are coming from the embeddeds of this entity.
		-`connection`: Connection where this entity metadata is created.
		-`createDateColumn`: (optional) Gets entity column which contains a create date value.
		-`database`: (optional) Database name.
		-`deleteDateColumn`: (optional) Gets entity column which contains a delete date value.
		-`dependsOn`: (optional) View's dependencies. Used in views
		-`descendantColumns`: Descendant columns used only in closure junction tables.
		-`discriminatorColumn`: (optional) Gets the discriminator column used to store entity identificator in single-table inheritance tables.
		-`discriminatorValue`: (optional) If this entity metadata is a child table of some table, it should have a discriminator value. Used to store a value in a discriminator column.
		-`eagerRelations`: List of eager relations this metadata has.
		-`embeddeds`: Entity's embedded metadatas.
		-`engine`: (optional) Table's database engine type (like "InnoDB", "MyISAM", etc).
		-`exclusions`: Entity's exclusion metadatas.
		-`expression`: (optional) View's expression. Used in views
		-`foreignKeys`: Entity's foreign key metadatas.
		-`generatedColumns`: Gets the column with generated flag.
		-`givenTableName`: (optional) Original user-given table name (taken from schema or @Entity(tableName) decorator). If user haven't specified a table name this property will be undefined.
		-`hasMultiplePrimaryKeys`: Checks if entity's table has multiple primary columns.
		-`hasNonNullableRelations`: Checks if there any non-nullable column exist in this entity.
		-`hasUUIDGeneratedColumns`: Indicates if this entity metadata has uuid generated columns.
		-`indices`: Entity's index metadatas.
		-`inheritancePattern`: (optional) If this entity metadata's table using one of the inheritance patterns, then this will contain what pattern it uses.
		-`inheritanceTree`: All "inheritance tree" from a target entity. For example for target Post < ContentModel < Unit it will be an array of [Post, ContentModel, Unit]. It also contains child entities for single table inheritance.
		-`inverseColumns`: In the case if this entity metadata is junction table's entity metadata, this will contain all referenced columns of inverse entity.
		-`isAlwaysUsingConstructor`: Indicates if the entity should be instantiated using the constructor or via allocating a new object via `Object.create()`.
		-`isClosureJunction`: Checks if this table is a junction table of the closure table. This type is for tables that contain junction metadata of the closure tables.
		-`isJunction`: Indicates if this entity metadata of a junction table, or not. Junction table is a table created by many-to-many relationship. Its also possible to understand if entity is junction via tableType.
		-`lazyRelations`: List of eager relations this metadata has.
		-`listeners`: Entity listener metadatas.
		-`manyToManyRelations`: Gets only many-to-many relations of the entity.
		-`manyToOneRelations`: Gets only many-to-one relations of the entity.
		-`materializedPathColumn`: (optional) Materialized path column. Used only in tree entities with materialized path pattern applied.
		-`name`: Entity's name. Equal to entity target class's name if target is set to table. If target class is not then then it equals to table name.
		-`nestedSetLeftColumn`: (optional) Nested set's left value column. Used only in tree entities with nested set pattern applied.
		-`nestedSetRightColumn`: (optional) Nested set's right value column. Used only in tree entities with nested set pattern applied.
		-`nonVirtualColumns`: All columns except for virtual columns.
		-`objectIdColumn`: (optional) Gets the object id column used with mongodb database.
		-`oneToManyRelations`: Gets only one-to-many relations of the entity.
		-`oneToOneRelations`: Gets only one-to-one relations of the entity.
		-`orderBy`: (optional) Specifies a default order by used for queries from this table when no explicit order by is specified.
		-`ownColumns`: Entity's column metadatas defined by user.
		-`ownIndices`: Entity's own indices.
		-`ownListeners`: Entity's own listener metadatas.
		-`ownRelations`: Entity's relation metadatas.
		-`ownUniques`: Entity's own uniques.
		-`ownerColumns`: In the case if this entity metadata is junction table's entity metadata, this will contain all referenced columns of owner entity.
		-`ownerManyToManyRelations`: Gets only owner many-to-many relations of the entity.
		-`ownerOneToOneRelations`: Gets only owner one-to-one relations of the entity.
		-`parentClosureEntityMetadata`: If this is entity metadata for a junction closure table then its owner closure table metadata will be set here.
		-`parentEntityMetadata`: Parent's entity metadata. Used in inheritance patterns.
		-`primaryColumns`: Gets the primary columns.
		-`propertiesMap`: Map of columns and relations of the entity. example: Post{ id: number, name: string, counterEmbed: { count: number }, category: Category }. This method will create following object: { id: "id", counterEmbed: { count: "counterEmbed.count" }, category: "category" }
		-`relationCounts`: Entity's relation id metadatas.
		-`relationIds`: Entity's relation id metadatas.
		-`relations`: Relations of the entity, including relations that are coming from the embeddeds of this entity.
		-`relationsWithJoinColumns`: Gets only owner one-to-one and many-to-one relations.
		-`schema`: (optional) Schema name. Used in Postgres and Sql Server.
		-`synchronize`: Indicates if schema will be synchronized for this entity or not.
		-`tableMetadataArgs`: Metadata arguments used to build this entity metadata.
		-`tableName`: Entity table name in the database. This is final table name of the entity. This name already passed naming strategy, and generated based on multiple criteria, including user table name and global table prefix.
		-`tableNameWithoutPrefix`: Gets the table name without global table prefix. When querying table you need a table name with prefix, but in some scenarios, for example when you want to name a junction table that contains names of two other tables, you may want a table name without prefix.
		-`tablePath`: Entity table path. Contains database name, schema name and table name. E.g. myDB.mySchema.myTable
		-`tableType`: Table type. Tables can be closure, junction, etc.
		-`target`: Target class to which this entity metadata is bind. Note, that when using table inheritance patterns target can be different rather then table's target. For virtual tables which lack of real entity (like junction tables) target is equal to their table name.
		-`targetName`: Gets the name of the target.
		-`treeChildrenRelation`: (optional) Tree children relation. Used only in tree-tables.
		-`treeLevelColumn`: (optional) Special column that stores tree level in tree entities.
		-`treeOptions`: (optional) Indicates if this entity is a tree, what options of tree it has.
		-`treeParentRelation`: (optional) Tree parent relation. Used only in tree-tables.
		-`treeType`: (optional) Indicates if this entity is a tree, what type of tree it is.
		-`uniques`: Entity's unique metadatas.
		-`updateDateColumn`: (optional) Gets entity column which contains an update date value.
		-`versionColumn`: (optional) Gets entity column which contains an entity version.
		-`withoutRowid`: (optional) Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
		-`getInverseEntityMetadata`: 
	-`entityMetadatasMap`: All entity metadatas that are registered for this connection. This is a copy of #.entityMetadatas property -> used for more performant searches.
	-`isInitialized`: Indicates if DataSource is initialized or not.
	-`logger`: Logger used to log orm events.
	-`manager`: EntityManager of this connection.
		-`@instanceof`: 
		-`callAggregateFun`: 
		-`connection`: Connection used by this entity manager.
		-`plainObjectToEntityTransformer`: Plain to object transformer used in create and merge operations.
		-`queryRunner`: (optional) Custom query runner to be used for operations in this entity manager. Used only in non-global entity manager.
		-`repositories`: Once created and then reused by repositories. Created as a future replacement for the #repositories to provide a bit more perf optimization.
		-`treeRepositories`: Once created and then reused by repositories.
	-`metadataTableName`: Name for the metadata table
	-`migrations`: Migration instances that are registered for this connection.
		-`name`: (optional) Optional migration name, defaults to class name.
		-`transaction`: (optional) Optional flag to determine whether to run the migration in a transaction or not. Can only be used when `migrationsTransactionMode` is either "each" or "none" Defaults to `true` when `migrationsTransactionMode` is "each" Defaults to `false` when `migrationsTransactionMode` is "none"
	-`name`: Connection name.
	-`namingStrategy`: Naming strategy used in the connection.
		-`materializedPathColumnName`: Column name for materialized paths.
		-`name`: (optional) Naming strategy name.
		-`nestedSetColumnNames`: Column names for nested sets.
	-`options`: Connection options.
	-`queryResultCache`: (optional) Used to work with query result cache.
	-`relationIdLoader`: 
		-`connection`: 
		-`queryRunner`: (optional) 
	-`relationLoader`: Used to load relations and work with lazy relations.
		-`connection`: 
	-`subscribers`: Entity subscriber instances that are registered for this connection.
-`data`: Stores temporarily user data. Useful for sharing data with subscribers.
-`isReleased`: Indicates if connection for this query runner is released. Once its released, query runner cannot run queries anymore.
-`isTransactionActive`: Indicates if transaction is in progress.
-`loadedTables`: All synchronized tables in the database.
	-`@instanceof`: 
	-`checks`: Table check constraints.
		-`@instanceof`: 
		-`columnNames`: (optional) Column that contains this constraint.
		-`expression`: (optional) Check expression.
		-`name`: (optional) Constraint name.
	-`columns`: Table columns.
		-`@instanceof`: 
		-`asExpression`: (optional) Generated column expression.
		-`charset`: (optional) Defines column character set.
		-`collation`: (optional) Defines column collation.
		-`comment`: (optional) Column's comment.
		-`default`: (optional) Column's default value.
		-`enum`: (optional) Array of possible enumerated values.
		-`enumName`: (optional) Exact name of enum
		-`generatedIdentity`: (optional) Identity column type. Supports only in Postgres 10+.
		-`generatedType`: (optional) Generated column type.
		-`generationStrategy`: (optional) Specifies generation strategy if this column will use auto increment. `rowid` option supported only in CockroachDB.
		-`isArray`: Indicates if column stores array.
		-`isGenerated`: Indicates if column is auto-generated sequence.
		-`isNullable`: Indicates if column is NULL, or is NOT NULL in the database.
		-`isPrimary`: Indicates if column is a primary key.
		-`isUnique`: Indicates if column has unique value.
		-`length`: Column type's length. Used only on some column types. For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
		-`name`: Column name.
		-`onUpdate`: (optional) ON UPDATE trigger. Works only for MySQL.
		-`precision`: (optional) The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values.
		-`primaryKeyConstraintName`: (optional) Name of the primary key constraint for primary column.
		-`scale`: (optional) The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision.
		-`spatialFeatureType`: (optional) Spatial Feature Type (Geometry, Point, Polygon, etc.)
		-`srid`: (optional) SRID (Spatial Reference ID (EPSG code))
		-`type`: Column type.
		-`unsigned`: Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
		-`width`: (optional) Column type's display width. Used only on some column types in MySQL. For example, INT(4) specifies an INT with a display width of four digits.
		-`zerofill`: Puts ZEROFILL attribute on to numeric column. Works only for MySQL. If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column
	-`database`: (optional) Database name that this table resides in if it applies.
	-`engine`: (optional) Table engine.
	-`exclusions`: Table exclusion constraints.
		-`@instanceof`: 
		-`expression`: (optional) Exclusion expression.
		-`name`: (optional) Constraint name.
	-`foreignKeys`: Table foreign keys.
		-`@instanceof`: 
		-`columnNames`: Column names which included by this foreign key.
		-`deferrable`: (optional) Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start or at the end of a transaction
		-`name`: (optional) Name of the foreign key constraint.
		-`onDelete`: (optional) "ON DELETE" of this foreign key, e.g. what action database should perform when referenced stuff is being deleted.
		-`onUpdate`: (optional) "ON UPDATE" of this foreign key, e.g. what action database should perform when referenced stuff is being updated.
		-`referencedColumnNames`: Column names which included by this foreign key.
		-`referencedDatabase`: (optional) Database of Table referenced in the foreign key.
		-`referencedSchema`: (optional) Database of Table referenced in the foreign key.
		-`referencedTableName`: Table referenced in the foreign key.
	-`indices`: Table indices.
		-`@instanceof`: 
		-`columnNames`: Columns included in this index.
		-`isFulltext`: The FULLTEXT modifier indexes the entire column and does not allow prefixing. Works only in MySQL.
		-`isNullFiltered`: NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value. In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than a normal index that includes NULL values. Works only in Spanner.
		-`isSpatial`: The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values. Works only in MySQL.
		-`isUnique`: Indicates if this index is unique.
		-`name`: (optional) Index name.
		-`parser`: (optional) Fulltext parser. Works only in MySQL.
		-`where`: Index filter condition.
	-`justCreated`: Indicates if table was just created. This is needed, for example to check if we need to skip primary keys creation for new tables.
	-`name`: May contain database name, schema name and table name, unless they're the current database. E.g. myDB.mySchema.myTable
	-`schema`: (optional) Schema name that this table resides in if it applies.
	-`uniques`: Table unique constraints.
		-`@instanceof`: 
		-`columnNames`: Columns that contains this constraint.
		-`deferrable`: (optional) Set this foreign key constraint as "DEFERRABLE" e.g. check constraints at start or at the end of a transaction
		-`name`: (optional) Constraint name.
	-`withoutRowid`: (optional) Enables Sqlite "WITHOUT ROWID" modifier for the "CREATE TABLE" statement
-`loadedViews`: All synchronized views in the database.
	-`@instanceof`: 
	-`database`: (optional) Database name that this view resides in if it applies.
	-`expression`: View definition.
	-`indices`: View Indices
		-`@instanceof`: 
		-`columnNames`: Columns included in this index.
		-`isFulltext`: The FULLTEXT modifier indexes the entire column and does not allow prefixing. Works only in MySQL.
		-`isNullFiltered`: NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value. In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than a normal index that includes NULL values. Works only in Spanner.
		-`isSpatial`: The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values. Works only in MySQL.
		-`isUnique`: Indicates if this index is unique.
		-`name`: (optional) Index name.
		-`parser`: (optional) Fulltext parser. Works only in MySQL.
		-`where`: Index filter condition.
	-`materialized`: Indicates if view is materialized.
	-`name`: View name
	-`schema`: (optional) Schema name that this view resides in if it applies.
-`manager`: Entity manager working only with this query runner.
	-`@instanceof`: 
	-`callAggregateFun`: 
	-`connection`: Connection used by this entity manager.
		-`@instanceof`: 
		-`driver`: Database driver used by this connection.
		-`entityMetadatas`: All entity metadatas that are registered for this connection.
		-`entityMetadatasMap`: All entity metadatas that are registered for this connection. This is a copy of #.entityMetadatas property -> used for more performant searches.
		-`isInitialized`: Indicates if DataSource is initialized or not.
		-`logger`: Logger used to log orm events.
		-`manager`: EntityManager of this connection.
		-`metadataTableName`: Name for the metadata table
		-`migrations`: Migration instances that are registered for this connection.
		-`name`: Connection name.
		-`namingStrategy`: Naming strategy used in the connection.
		-`options`: Connection options.
		-`queryResultCache`: (optional) Used to work with query result cache.
		-`relationIdLoader`: 
		-`relationLoader`: Used to load relations and work with lazy relations.
		-`subscribers`: Entity subscriber instances that are registered for this connection.
	-`plainObjectToEntityTransformer`: Plain to object transformer used in create and merge operations.
		-`groupAndTransform`: Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated we need to group our result and we must have some unique id (primary key in our case)
	-`queryRunner`: (optional) Custom query runner to be used for operations in this entity manager. Used only in non-global entity manager.
		-`broadcaster`: Broadcaster used on this query runner to broadcast entity events.
		-`connection`: Connection used by this query runner.
		-`data`: Stores temporarily user data. Useful for sharing data with subscribers.
		-`isReleased`: Indicates if connection for this query runner is released. Once its released, query runner cannot run queries anymore.
		-`isTransactionActive`: Indicates if transaction is in progress.
		-`loadedTables`: All synchronized tables in the database.
		-`loadedViews`: All synchronized views in the database.
		-`manager`: Entity manager working only with this query runner.
	-`repositories`: Once created and then reused by repositories. Created as a future replacement for the #repositories to provide a bit more perf optimization.
	-`treeRepositories`: Once created and then reused by repositories.
		-`manager`: Entity Manager used by this repository.
		-`queryRunner`: (optional) Query runner provider used for this repository.
		-`target`: Entity target that is managed by this repository. If this repository manages entity from schema, then it returns a name of that schema instead.
-`addColumn`: 
-`addColumns`: 
-`afterMigration`: 
-`beforeMigration`: 
-`changeColumn`: 
-`changeColumns`: 
-`clearDatabase`: 
-`clearSqlMemory`: 
-`clearTable`: 
-`commitTransaction`: 
-`connect`: 
-`createCheckConstraint`: 
-`createCheckConstraints`: 
-`createDatabase`: 
-`createExclusionConstraint`: 
-`createExclusionConstraints`: 
-`createForeignKey`: 
-`createForeignKeys`: 
-`createIndex`: 
-`createIndices`: 
-`createPrimaryKey`: 
-`createSchema`: 
-`createTable`: 
-`createUniqueConstraint`: 
-`createUniqueConstraints`: 
-`createView`: 
-`disableSqlMemory`: 
-`dropCheckConstraint`: 
-`dropCheckConstraints`: 
-`dropColumn`: 
-`dropColumns`: 
-`dropDatabase`: 
-`dropExclusionConstraint`: 
-`dropExclusionConstraints`: 
-`dropForeignKey`: 
-`dropForeignKeys`: 
-`dropIndex`: 
-`dropIndices`: 
-`dropPrimaryKey`: 
-`dropSchema`: 
-`dropTable`: 
-`dropUniqueConstraint`: 
-`dropUniqueConstraints`: 
-`dropView`: 
-`enableSqlMemory`: 
-`executeMemoryDownSql`: 
-`executeMemoryUpSql`: 
-`getCurrentDatabase`: 
-`getCurrentSchema`: 
-`getDatabases`: 
-`getMemorySql`: 
-`getReplicationMode`: 
-`getSchemas`: 
-`getTable`: 
-`getTables`: 
-`getView`: 
-`getViews`: 
-`hasColumn`: 
-`hasDatabase`: 
-`hasSchema`: 
-`hasTable`: 
-`query`: 
-`release`: 
-`renameColumn`: 
-`renameTable`: 
-`rollbackTransaction`: 
-`startTransaction`: 
-`stream`: 
-`updatePrimaryKeys`: 

#### Overrides

[QueryBuilder](QueryBuilder.md).[obtainQueryRunner](QueryBuilder.md#obtainqueryrunner)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:685

___

### offset

**offset**(`offset?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Set's OFFSET - selection offset.
NOTE that it may not work as you expect if you are using joins.
If you want to implement pagination, and you are having join in your query,
then use instead skip method instead.

#### Parameters

| Name |
| :------ |
| `offset?` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:519

___

### orHaving

**orHaving**(`having`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new OR HAVING condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `having` | `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:461

___

### orWhere

**orWhere**(`where`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`Brackets`](Brackets.md) \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>) => `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[orWhere](../interfaces/WhereExpressionBuilder.md#orwhere)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:405

___

### orWhereExists

**orWhereExists**(`subQuery`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds a new OR where EXISTS clause

#### Parameters

| Name |
| :------ |
| `subQuery` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:417

___

### orWhereInIds

**orWhereInIds**(`ids`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new OR WHERE with conditions for the given ids.

Ids are mixed.
It means if you have single primary key you can pass a simple id values, for example [1, 2, 3].
If you have multiple primary keys you need to pass object with property names and values specified,
for example [{ firstId: 1, secondId: 2 }, { firstId: 2, secondId: 3 }, ...]

#### Parameters

| Name |
| :------ |
| `ids` | `any` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[orWhereInIds](../interfaces/WhereExpressionBuilder.md#orwhereinids)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:444

___

### orderBy

**orderBy**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets ORDER BY condition in the query builder.
If you had previously ORDER BY expression defined,
calling this function will override previously set ORDER BY conditions.

Calling order by without order set will remove all previously set order bys.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:489

**orderBy**(`sort`, `order?`, `nulls?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets ORDER BY condition in the query builder.
If you had previously ORDER BY expression defined,
calling this function will override previously set ORDER BY conditions.

#### Parameters

| Name |
| :------ |
| `sort` | `string` |
| `order?` | ``"ASC"`` \| ``"DESC"`` |
| `nulls?` | ``"NULLS FIRST"`` \| ``"NULLS LAST"`` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:495

**orderBy**(`order`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets ORDER BY condition in the query builder.
If you had previously ORDER BY expression defined,
calling this function will override previously set ORDER BY conditions.

#### Parameters

| Name |
| :------ |
| `order` | [`OrderByCondition`](../types/OrderByCondition.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:501

___

### printSql

**printSql**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Prints sql to stdout using console.log.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[printSql](QueryBuilder.md#printsql)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:153

___

### relation

**relation**(`propertyPath`): [`RelationQueryBuilder`](RelationQueryBuilder.md)<`Entity`\>

Sets entity's relation with which this query builder gonna work.

#### Parameters

| Name |
| :------ |
| `propertyPath` | `string` |

#### Returns

[`RelationQueryBuilder`](RelationQueryBuilder.md)<`Entity`\>

-`RelationQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[relation](QueryBuilder.md#relation)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:106

**relation**<`T`\>(`entityTarget`, `propertyPath`): [`RelationQueryBuilder`](RelationQueryBuilder.md)<`T`\>

Sets entity's relation with which this query builder gonna work.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../types/EntityTarget.md)<`T`\> |
| `propertyPath` | `string` |

#### Returns

[`RelationQueryBuilder`](RelationQueryBuilder.md)<`T`\>

-`RelationQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[relation](QueryBuilder.md#relation)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:110

___

### replacePropertyNames

`Protected` **replacePropertyNames**(`statement`): `string`

#### Parameters

| Name |
| :------ |
| `statement` | `string` |

#### Returns

`string`

-`string`: (optional) 

**Deprecated**

this way of replace property names is too slow.
 Instead, we'll replace property names at the end - once query is build.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[replacePropertyNames](QueryBuilder.md#replacepropertynames)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:228

___

### replacePropertyNamesForTheWholeQuery

`Protected` **replacePropertyNamesForTheWholeQuery**(`statement`): `string`

Replaces all entity's propertyName to name in the given SQL string.

#### Parameters

| Name |
| :------ |
| `statement` | `string` |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[replacePropertyNamesForTheWholeQuery](QueryBuilder.md#replacepropertynamesforthewholequery)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:232

___

### restore

**restore**(): [`SoftDeleteQueryBuilder`](SoftDeleteQueryBuilder.md)<`any`\>

#### Returns

[`SoftDeleteQueryBuilder`](SoftDeleteQueryBuilder.md)<`any`\>

-`SoftDeleteQueryBuilder`: 
	-`any`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[restore](QueryBuilder.md#restore)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:102

___

### select

**select**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates SELECT query.
Replaces all previous selections if they exist.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Overrides

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:55

**select**(`selection`, `selectionAliasName?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates SELECT query.
Replaces all previous selections if they exist.

#### Parameters

| Name |
| :------ |
| `selection` | (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `selectionAliasName?` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Overrides

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:60

**select**(`selection`, `selectionAliasName?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates SELECT query and selects given data.
Replaces all previous selections if they exist.

#### Parameters

| Name |
| :------ |
| `selection` | `string` |
| `selectionAliasName?` | `string` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Overrides

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:65

**select**(`selection`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates SELECT query and selects given data.
Replaces all previous selections if they exist.

#### Parameters

| Name |
| :------ |
| `selection` | `string`[] |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Overrides

QueryBuilder.select

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:70

___

### setFindOptions

**setFindOptions**(`findOptions`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

#### Parameters

| Name |
| :------ |
| `findOptions` | [`FindManyOptions`](../interfaces/FindManyOptions.md)<`Entity`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:46

___

### setLock

**setLock**(`lockMode`, `lockVersion`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets locking mode.

#### Parameters

| Name |
| :------ |
| `lockMode` | ``"optimistic"`` |
| `lockVersion` | `number` \| `Date` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:537

**setLock**(`lockMode`, `lockVersion?`, `lockTables?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets locking mode.

#### Parameters

| Name |
| :------ |
| `lockMode` | ``"pessimistic_read"`` \| ``"pessimistic_write"`` \| ``"dirty_read"`` \| ``"pessimistic_partial_write"`` \| ``"pessimistic_write_or_fail"`` \| ``"for_no_key_update"`` \| ``"for_key_share"`` |
| `lockVersion?` | `undefined` |
| `lockTables?` | `string`[] |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:541

___

### setNativeParameters

**setNativeParameters**(`parameters`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds native parameters from the given object.

#### Parameters

| Name |
| :------ |
| `parameters` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

**Deprecated**

Use `setParameters` instead

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setNativeParameters](QueryBuilder.md#setnativeparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:145

___

### setOnLocked

**setOnLocked**(`onLocked`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets lock handling by adding NO WAIT or SKIP LOCKED.

#### Parameters

| Name |
| :------ |
| `onLocked` | ``"nowait"`` \| ``"skip_locked"`` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:545

___

### setOption

**setOption**(`option`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets extra options that can be used to configure how query builder works.

#### Parameters

| Name |
| :------ |
| `option` | [`SelectQueryBuilderOption`](../types/SelectQueryBuilderOption.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:612

___

### setParameter

**setParameter**(`key`, `value`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets parameter name and its value.

The key for this parameter may contain numbers, letters, underscores, or periods.

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setParameter](QueryBuilder.md#setparameter)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:134

___

### setParameters

**setParameters**(`parameters`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds all parameters from the given object.

#### Parameters

| Name |
| :------ |
| `parameters` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setParameters](QueryBuilder.md#setparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:138

___

### setQueryRunner

**setQueryRunner**(`queryRunner`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets or overrides query builder's QueryRunner.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setQueryRunner](QueryBuilder.md#setqueryrunner)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:196

___

### skip

**skip**(`skip?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets number of entities to skip.

#### Parameters

| Name |
| :------ |
| `skip?` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:527

___

### softDelete

**softDelete**(): [`SoftDeleteQueryBuilder`](SoftDeleteQueryBuilder.md)<`any`\>

#### Returns

[`SoftDeleteQueryBuilder`](SoftDeleteQueryBuilder.md)<`any`\>

-`SoftDeleteQueryBuilder`: 
	-`any`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[softDelete](QueryBuilder.md#softdelete)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:101

___

### stream

**stream**(): `Promise`<[`ReadStream`](ReadStream.md)\>

Executes built SQL query and returns raw data stream.

#### Returns

`Promise`<[`ReadStream`](ReadStream.md)\>

-`Promise`: 
	-`ReadStream`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:595

___

### subQuery

**subQuery**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

Creates a subquery - query that can be used inside other queries.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:50

___

### take

**take**(`take?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets maximal number of entities to take.

#### Parameters

| Name |
| :------ |
| `take?` | `number` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:523

___

### timeTravelQuery

**timeTravelQuery**(`timeTravelFn?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Enables time travelling for the current query (only supported by cockroach currently)

#### Parameters

| Name |
| :------ |
| `timeTravelFn?` | `string` \| `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:481

___

### update

**update**(): [`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

Creates UPDATE query and applies given update values.

#### Returns

[`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

-`UpdateQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[update](QueryBuilder.md#update)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:84

**update**(`updateSet`): [`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

Creates UPDATE query and applies given update values.

#### Parameters

| Name |
| :------ |
| `updateSet` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

[`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

-`UpdateQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[update](QueryBuilder.md#update)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:88

**update**<`Entity`\>(`entity`, `updateSet?`): [`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

Creates UPDATE query for the given entity and applies given update values.

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entity` | [`EntityTarget`](../types/EntityTarget.md)<`Entity`\> |
| `updateSet?` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

[`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

-`UpdateQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[update](QueryBuilder.md#update)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:92

**update**(`tableName`, `updateSet?`): [`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

Creates UPDATE query for the given table name and applies given update values.

#### Parameters

| Name |
| :------ |
| `tableName` | `string` |
| `updateSet?` | [`_QueryDeepPartialEntity`](../types/QueryDeepPartialEntity.md)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

[`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

-`UpdateQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[update](QueryBuilder.md#update)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:96

___

### useIndex

**useIndex**(`index`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Set certain index to be used by the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `index` | `string` | Name of index to be used. |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:533

___

### useTransaction

**useTransaction**(`enabled`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

If set to true the query will be wrapped into a transaction.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[useTransaction](QueryBuilder.md#usetransaction)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:205

___

### where

**where**(`where`, `parameters?`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`Brackets`](Brackets.md) \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>) => `string` |
| `parameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[where](../interfaces/WhereExpressionBuilder.md#where)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:395

___

### whereExists

**whereExists**(`subQuery`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Sets a new where EXISTS clause

#### Parameters

| Name |
| :------ |
| `subQuery` | [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:409

___

### whereInIds

**whereInIds**(`ids`): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Adds new AND WHERE with conditions for the given ids.

Ids are mixed.
It means if you have single primary key you can pass a simple id values, for example [1, 2, 3].
If you have multiple primary keys you need to pass object with property names and values specified,
for example [{ firstId: 1, secondId: 2 }, { firstId: 2, secondId: 3 }, ...]

#### Parameters

| Name |
| :------ |
| `ids` | `any` |

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Implementation of

[WhereExpressionBuilder](../interfaces/WhereExpressionBuilder.md).[whereInIds](../interfaces/WhereExpressionBuilder.md#whereinids)

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:426

___

### withDeleted

**withDeleted**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Disables the global condition of "non-deleted" for the entity with delete date columns.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/SelectQueryBuilder.d.ts:549
