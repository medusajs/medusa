# InsertQueryBuilder

Allows to build complex sql queries in a fashion way and execute those queries.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

## Hierarchy

- [`QueryBuilder`](QueryBuilder.md)<`Entity`\>

  ↳ **`InsertQueryBuilder`**

## Constructors

### constructor

**new InsertQueryBuilder**<`Entity`\>(`queryBuilder`)

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

**new InsertQueryBuilder**<`Entity`\>(`connection`, `queryRunner?`)

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

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:12

___

### connection

 `Readonly` **connection**: [`DataSource`](DataSource.md)

Connection on which QueryBuilder was created.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[connection](QueryBuilder.md#connection)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:29

___

### expressionMap

 `Readonly` **expressionMap**: [`QueryExpressionMap`](QueryExpressionMap.md)

Contains all properties of the QueryBuilder that needs to be build a final query.

#### Inherited from

[QueryBuilder](QueryBuilder.md).[expressionMap](QueryBuilder.md#expressionmap)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:33

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

**addCommonTableExpression**(`queryBuilder`, `alias`, `options?`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Adds CTE to query

#### Parameters

| Name |
| :------ |
| `queryBuilder` | `string` \| [`QueryBuilder`](QueryBuilder.md)<`any`\> |
| `alias` | `string` |
| `options?` | [`QueryBuilderCteOptions`](../interfaces/QueryBuilderCteOptions.md) |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[addCommonTableExpression](QueryBuilder.md#addcommontableexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:209

___

### callListeners

**callListeners**(`enabled`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Indicates if listeners and subscribers must be called before and after query execution.
Enabled by default.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[callListeners](QueryBuilder.md#calllisteners)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:201

___

### clone

**clone**(): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Clones query builder as it is.
Note: it uses new query runner, if you want query builder that uses exactly same query runner,
you can create query builder using its constructor, for example new SelectQueryBuilder(queryBuilder)
where queryBuilder is cloned QueryBuilder.

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[clone](QueryBuilder.md#clone)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:178

___

### comment

**comment**(`comment`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Includes a Query comment in the query builder.  This is helpful for debugging purposes,
such as finding a specific query in the database server's logs, or for categorization using
an APM product.

#### Parameters

| Name |
| :------ |
| `comment` | `string` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[comment](QueryBuilder.md#comment)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:184

___

### createColumnNamesExpression

`Protected` **createColumnNamesExpression**(): `string`

Creates a columns string where values must be inserted to for INSERT INTO expression.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:102

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
| `entityTarget` | [`EntityTarget`](../index.md#entitytarget)<`any`\> \| (`qb`: [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](SelectQueryBuilder.md)<`any`\> |
| `aliasName?` | `string` |

#### Returns

[`Alias`](Alias.md)

-`Alias`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createFromAlias](QueryBuilder.md#createfromalias)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:223

___

### createInsertExpression

`Protected` **createInsertExpression**(): `string`

Creates INSERT express used to perform insert query.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:94

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

**createQueryBuilder**(): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Creates a completely new query builder.
Uses same query runner as current QueryBuilder.

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

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
| `returningType` | [`ReturningType`](../index.md#returningtype) |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[createReturningExpression](QueryBuilder.md#createreturningexpression)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:245

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

### createValuesExpression

`Protected` **createValuesExpression**(): `string`

Creates list of values needs to be inserted in the VALUES expression.

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:106

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
| `condition` | [`WhereClauseCondition`](../index.md#whereclausecondition) |
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

**disableEscaping**(): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Disables escaping.

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[disableEscaping](QueryBuilder.md#disableescaping)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:188

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

**execute**(): `Promise`<[`InsertResult`](InsertResult.md)\>

Executes sql generated by query builder and returns raw database results.

#### Returns

`Promise`<[`InsertResult`](InsertResult.md)\>

-`Promise`: 
	-`InsertResult`: 

#### Overrides

[QueryBuilder](QueryBuilder.md).[execute](QueryBuilder.md#execute)

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:20

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

### getInsertedColumns

`Protected` **getInsertedColumns**(): [`ColumnMetadata`](ColumnMetadata.md)[]

Gets list of columns where values must be inserted to.

#### Returns

[`ColumnMetadata`](ColumnMetadata.md)[]

-`ColumnMetadata[]`: 
	-`ColumnMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:98

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

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:16

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

### getValueSets

`Protected` **getValueSets**(): [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Gets array of values need to be inserted into the target table.

#### Returns

[`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

-`ObjectLiteral[]`: 
	-`ObjectLiteral`: Interface of the simple literal object with any string keys.

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:110

___

### getWhereCondition

`Protected` **getWhereCondition**(`where`): [`WhereClauseCondition`](../index.md#whereclausecondition)

#### Parameters

| Name |
| :------ |
| `where` | `string` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[] \| [`Brackets`](Brackets.md) \| [`NotBrackets`](NotBrackets.md) \| (`qb`: [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>) => `string` |

#### Returns

[`WhereClauseCondition`](../index.md#whereclausecondition)

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

`Protected` **getWherePredicateCondition**(`aliasPath`, `parameterValue`): [`WhereClauseCondition`](../index.md#whereclausecondition)

#### Parameters

| Name |
| :------ |
| `aliasPath` | `string` |
| `parameterValue` | `any` |

#### Returns

[`WhereClauseCondition`](../index.md#whereclausecondition)

-`WhereClauseCondition`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[getWherePredicateCondition](QueryBuilder.md#getwherepredicatecondition)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:268

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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`T`\> |
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
| `target` | [`EntityTarget`](../index.md#entitytarget)<`T`\> |
| `relation` | `string`[] |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[hasRelation](QueryBuilder.md#hasrelation)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:124

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

### into

**into**<`T`\>(`entityTarget`, `columns?`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`T`\>

Specifies INTO which entity's table insertion will be executed.

| Name | Type |
| :------ | :------ |
| `T` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Parameters

| Name |
| :------ |
| `entityTarget` | [`EntityTarget`](../index.md#entitytarget)<`T`\> |
| `columns?` | `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`T`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:24

___

### isOverridingAutoIncrementBehavior

`Protected` **isOverridingAutoIncrementBehavior**(`column`): `boolean`

Checks if column is an auto-generated primary key, but the current insertion specifies a value for it.

#### Parameters

| Name |
| :------ |
| `column` | [`ColumnMetadata`](ColumnMetadata.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:116

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

#### Inherited from

[QueryBuilder](QueryBuilder.md).[obtainQueryRunner](QueryBuilder.md#obtainqueryrunner)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:273

___

### onConflict

**onConflict**(`statement`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Adds additional ON CONFLICT statement supported in postgres and cockroach.

#### Parameters

| Name |
| :------ |
| `statement` | `string` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

**Deprecated**

Use `orIgnore` or `orUpdate`

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:68

___

### orIgnore

**orIgnore**(`statement?`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Adds additional ignore statement supported in databases.

#### Parameters

| Name |
| :------ |
| `statement?` | `string` \| `boolean` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:72

___

### orUpdate

**orUpdate**(`statement?`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

#### Parameters

| Name |
| :------ |
| `statement?` | `object` |
| `statement.columns?` | `string`[] |
| `statement.conflict_target?` | `string` \| `string`[] |
| `statement.overwrite?` | `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

**Deprecated**

`.orUpdate({ columns: [ "is_updated" ] }).setParameter("is_updated", value)`

is now `.orUpdate(["is_updated"])`

`.orUpdate({ conflict_target: ['date'], overwrite: ['title'] })`

is now `.orUpdate(['title'], ['date'])`

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:85

**orUpdate**(`overwrite`, `conflictTarget?`, `orUpdateOptions?`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

#### Parameters

| Name |
| :------ |
| `overwrite` | `string`[] |
| `conflictTarget?` | `string` \| `string`[] |
| `orUpdateOptions?` | [`InsertOrUpdateOptions`](../index.md#insertorupdateoptions) |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:90

___

### output

**output**(`columns`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.
This will return given column values.

#### Parameters

| Name |
| :------ |
| `columns` | `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:33

**output**(`output`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.
Returning is a SQL string containing returning statement.

#### Parameters

| Name |
| :------ |
| `output` | `string` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:38

**output**(`output`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.

#### Parameters

| Name |
| :------ |
| `output` | `string` \| `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:42

___

### printSql

**printSql**(): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Prints sql to stdout using console.log.

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

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
| `entityTarget` | [`EntityTarget`](../index.md#entitytarget)<`T`\> |
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

### returning

**returning**(`columns`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.
This will return given column values.

#### Parameters

| Name |
| :------ |
| `columns` | `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:47

**returning**(`returning`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.
Returning is a SQL string containing returning statement.

#### Parameters

| Name |
| :------ |
| `returning` | `string` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:52

**returning**(`returning`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Optional returning/output clause.

#### Parameters

| Name |
| :------ |
| `returning` | `string` \| `string`[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:56

___

### select

**select**(): [`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

Creates SELECT query.
Replaces all previous selections if they exist.

#### Returns

[`SelectQueryBuilder`](SelectQueryBuilder.md)<`Entity`\>

-`SelectQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:66

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

#### Inherited from

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:71

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

#### Inherited from

[QueryBuilder](QueryBuilder.md).[select](QueryBuilder.md#select)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:76

___

### setNativeParameters

**setNativeParameters**(`parameters`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Adds native parameters from the given object.

#### Parameters

| Name |
| :------ |
| `parameters` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

**Deprecated**

Use `setParameters` instead

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setNativeParameters](QueryBuilder.md#setnativeparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:145

___

### setParameter

**setParameter**(`key`, `value`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Sets parameter name and its value.

The key for this parameter may contain numbers, letters, underscores, or periods.

#### Parameters

| Name |
| :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setParameter](QueryBuilder.md#setparameter)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:134

___

### setParameters

**setParameters**(`parameters`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Adds all parameters from the given object.

#### Parameters

| Name |
| :------ |
| `parameters` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setParameters](QueryBuilder.md#setparameters)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:138

___

### setQueryRunner

**setQueryRunner**(`queryRunner`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Sets or overrides query builder's QueryRunner.

#### Parameters

| Name |
| :------ |
| `queryRunner` | [`QueryRunner`](../interfaces/QueryRunner.md) |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[setQueryRunner](QueryBuilder.md#setqueryrunner)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:196

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
| `updateSet` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

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
| `entity` | [`EntityTarget`](../index.md#entitytarget)<`Entity`\> |
| `updateSet?` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

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
| `updateSet?` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> |

#### Returns

[`UpdateQueryBuilder`](UpdateQueryBuilder.md)<`Entity`\>

-`UpdateQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[update](QueryBuilder.md#update)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:96

___

### updateEntity

**updateEntity**(`enabled`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Indicates if entity must be updated after insertion operations.
This may produce extra query or use RETURNING / OUTPUT statement (depend on database).
Enabled by default.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:62

___

### useTransaction

**useTransaction**(`enabled`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

If set to true the query will be wrapped into a transaction.

#### Parameters

| Name |
| :------ |
| `enabled` | `boolean` |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Inherited from

[QueryBuilder](QueryBuilder.md).[useTransaction](QueryBuilder.md#usetransaction)

#### Defined in

node_modules/typeorm/query-builder/QueryBuilder.d.ts:205

___

### values

**values**(`values`): [`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

Values needs to be inserted into table.

#### Parameters

| Name |
| :------ |
| `values` | [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\> \| [`_QueryDeepPartialEntity`](../index.md#_querydeeppartialentity)<[`ObjectLiteral`](../interfaces/ObjectLiteral.md) extends `Entity` ? `unknown` : `Entity`\>[] |

#### Returns

[`InsertQueryBuilder`](InsertQueryBuilder.md)<`Entity`\>

-`InsertQueryBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/InsertQueryBuilder.d.ts:28
