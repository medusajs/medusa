# QueryExpressionMap

Contains all properties of the QueryBuilder that needs to be build a final query.

## Constructors

### constructor

**new QueryExpressionMap**(`connection`)

#### Parameters

| Name |
| :------ |
| `connection` | [`DataSource`](DataSource.md) |

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:275

## Properties

### aliasNamePrefixingEnabled

 **aliasNamePrefixingEnabled**: `boolean`

Indicates if property names are prefixed with alias names during property replacement.
By default this is enabled, however we need this because aliases are not supported in UPDATE and DELETE queries,
but user can use them in WHERE expressions.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:197

___

### aliases

 **aliases**: [`Alias`](Alias.md)[]

All aliases (including main alias) used in the query.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:37

___

### cache

 **cache**: `boolean`

Indicates if query result cache is enabled or not.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:201

___

### cacheDuration

 **cacheDuration**: `number`

Time in milliseconds in which cache will expire.
If not set then global caching time will be used.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:206

___

### cacheId

 **cacheId**: `string`

Cache id.
Used to identifier your cache queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:211

___

### callListeners

 **callListeners**: `boolean`

Indicates if listeners and subscribers must be called before and after query execution.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:242

___

### comment

 `Optional` **comment**: `string`

Query Comment to include extra information for debugging or other purposes.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:261

___

### commonTableExpressions

 **commonTableExpressions**: { `alias`: `string` ; `options`: [`QueryBuilderCteOptions`](../interfaces/QueryBuilderCteOptions.md) ; `queryBuilder`: `string` \| [`QueryBuilder`](QueryBuilder.md)<`any`\>  }[]

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:270

___

### connection

 `Protected` **connection**: [`DataSource`](DataSource.md)

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:21

___

### disableEscaping

 **disableEscaping**: `boolean`

Indicates if alias, table names and column names will be escaped by driver, or not.

todo: rename to isQuotingDisabled, also think if it should be named "escaping"

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:176

___

### enableRelationIdValues

 **enableRelationIdValues**: `boolean`

Indicates if virtual columns should be included in entity result.

todo: what to do with it? is it properly used? what about persistence?

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:182

___

### extraAppendedAndWhereCondition

 **extraAppendedAndWhereCondition**: `string`

Extra where condition appended to the end of original where conditions with AND keyword.
Original condition will be wrapped into brackets.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:187

___

### extraReturningColumns

 **extraReturningColumns**: [`ColumnMetadata`](ColumnMetadata.md)[]

Extra returning columns to be added to the returning statement if driver supports it.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:73

___

### groupBys

 **groupBys**: `string`[]

GROUP BY queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:123

___

### havings

 **havings**: { `condition`: `string` ; `type`: ``"and"`` \| ``"simple"`` \| ``"or"``  }[]

HAVING queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:112

___

### insertColumns

 **insertColumns**: `string`[]

List of columns where data should be inserted.
Used in INSERT query.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:229

___

### joinAttributes

 **joinAttributes**: [`JoinAttribute`](JoinAttribute.md)[]

JOIN queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:96

___

### limit

 `Optional` **limit**: `number`

LIMIT query.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:127

___

### locallyGenerated

 **locallyGenerated**: `object`

Items from an entity that have been locally generated & are recorded here for later use.
Examples include the UUID generation when the database does not natively support it.
These are included in the entity index order.

#### Index signature

▪ [key: `number`]: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:267

___

### lockMode

 `Optional` **lockMode**: ``"optimistic"`` \| ``"pessimistic_read"`` \| ``"pessimistic_write"`` \| ``"dirty_read"`` \| ``"pessimistic_partial_write"`` \| ``"pessimistic_write_or_fail"`` \| ``"for_no_key_update"`` \| ``"for_key_share"``

Locking mode.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:149

___

### lockTables

 `Optional` **lockTables**: `string`[]

Tables to be specified in the "FOR UPDATE OF" clause, referred by their alias

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:157

___

### lockVersion

 `Optional` **lockVersion**: `number` \| `Date`

Current version of the entity, used for locking.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:153

___

### mainAlias

 `Optional` **mainAlias**: [`Alias`](Alias.md)

Main alias is a main selection object selected by QueryBuilder.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:33

___

### maxExecutionTime

 **maxExecutionTime**: `number`

Max execution time in millisecond.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:49

___

### nativeParameters

 **nativeParameters**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Extra parameters.

**Deprecated**

Use standard parameters instead

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:257

___

### of

 **of**: `any`

Entity (target) which relations will be updated.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:224

___

### offset

 `Optional` **offset**: `number`

OFFSET query.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:131

___

### onConflict

 **onConflict**: `string`

Optional on conflict statement used in insertion query in postgres.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:77

___

### onIgnore

 **onIgnore**: `boolean`

Optional on ignore statement used in insertion query in databases.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:81

___

### onLocked

 `Optional` **onLocked**: ``"nowait"`` \| ``"skip_locked"``

Modify behavior when encountering locked rows. NOWAIT or SKIP LOCKED

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:161

___

### onUpdate

 **onUpdate**: `Object`

Optional on update statement used in insertion query in databases.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `columns?` | `string`[] |
| `conflict?` | `string` \| `string`[] |
| `indexPredicate?` | `string` |
| `overwrite?` | `string`[] |
| `skipUpdateIfNoValuesChanged?` | `boolean` |
| `upsertType?` | [`UpsertType`](../types/UpsertType.md) |

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:85

___

### options

 **options**: [`SelectQueryBuilderOption`](../types/SelectQueryBuilderOption.md)[]

Options that define QueryBuilder behaviour.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:215

___

### orderBys

 **orderBys**: [`OrderByCondition`](../types/OrderByCondition.md)

ORDER BY queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:119

___

### parameters

 **parameters**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Parameters used to be escaped in final query.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:170

___

### queryEntity

 **queryEntity**: `boolean`

Indicates if QueryBuilder used to select entities and not a raw results.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:29

___

### queryType

 **queryType**: ``"select"`` \| ``"insert"`` \| ``"update"`` \| ``"delete"`` \| ``"relation"`` \| ``"soft-delete"`` \| ``"restore"``

Represents query type. QueryBuilder is able to build SELECT, UPDATE and DELETE queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:41

___

### relationCountAttributes

 **relationCountAttributes**: [`RelationCountAttribute`](RelationCountAttribute.md)[]

Relation count queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:104

___

### relationIdAttributes

 **relationIdAttributes**: [`RelationIdAttribute`](RelationIdAttribute.md)[]

RelationId queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:100

___

### relationLoadStrategy

 **relationLoadStrategy**: ``"join"`` \| ``"query"``

Strategy to load relations.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:25

___

### relationPropertyPath

 **relationPropertyPath**: `string`

Property path of relation to work with.
Used in relational query builder.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:220

___

### returning

 **returning**: `string` \| `string`[]

Optional returning (or output) clause for insert, update or delete queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:69

___

### selectDistinct

 **selectDistinct**: `boolean`

Whether SELECT is DISTINCT.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:53

___

### selectDistinctOn

 **selectDistinctOn**: `string`[]

SELECT DISTINCT ON query (postgres).

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:57

___

### selects

 **selects**: [`SelectQuery`](../interfaces/SelectQuery.md)[]

Data needs to be SELECT-ed.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:45

___

### skip

 `Optional` **skip**: `number`

Number of rows to skip of result using pagination.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:135

___

### subQuery

 **subQuery**: `boolean`

Indicates if query builder creates a subquery.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:191

___

### take

 `Optional` **take**: `number`

Number of rows to take using pagination.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:139

___

### timeTravel

 `Optional` **timeTravel**: `string` \| `boolean`

Indicates if query should be time travel query
https://www.cockroachlabs.com/docs/stable/as-of-system-time.html

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:251

___

### updateEntity

 **updateEntity**: `boolean`

Indicates if entity must be updated after insertion / updation.
This may produce extra query or use RETURNING / OUTPUT statement (depend on database).

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:238

___

### useIndex

 `Optional` **useIndex**: `string`

Use certain index for the query.

SELECT * FROM table_name USE INDEX (col1_index, col2_index) WHERE col1=1 AND col2=2 AND col3=3;

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:145

___

### useTransaction

 **useTransaction**: `boolean`

Indicates if query must be wrapped into transaction.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:246

___

### valuesSet

 `Optional` **valuesSet**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md) \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

If update query was used, it needs "update set" - properties which will be updated by this query.
If insert query was used, it needs "insert set" - values that needs to be inserted.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:65

___

### whereEntities

 **whereEntities**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Used if user wants to update or delete a specific entities.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:233

___

### wheres

 **wheres**: [`WhereClause`](../interfaces/WhereClause.md)[]

WHERE queries.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:108

___

### withDeleted

 **withDeleted**: `boolean`

Indicates if soft-deleted rows should be included in entity result.
By default the soft-deleted rows are not included.

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:166

## Accessors

### allOrderBys

`get` **allOrderBys**(): [`OrderByCondition`](../types/OrderByCondition.md)

Get all ORDER BY queries - if order by is specified by user then it uses them,
otherwise it uses default entity order by if it was set.

#### Returns

[`OrderByCondition`](../types/OrderByCondition.md)

-`OrderByCondition`: Special object that defines order condition for ORDER BY in sql. Example: { "name": "ASC", "id": "DESC" }
	-`__type`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:280

___

### relationMetadata

`get` **relationMetadata**(): [`RelationMetadata`](RelationMetadata.md)

Gets relation metadata of the relation this query builder works with.

todo: add proper exceptions

#### Returns

[`RelationMetadata`](RelationMetadata.md)

-`RelationMetadata`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:307

## Methods

### clone

**clone**(): [`QueryExpressionMap`](QueryExpressionMap.md)

Copies all properties of the current QueryExpressionMap into a new one.
Useful when QueryBuilder needs to create a copy of itself.

#### Returns

[`QueryExpressionMap`](QueryExpressionMap.md)

-`QueryExpressionMap`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:312

___

### createAlias

**createAlias**(`options`): [`Alias`](Alias.md)

Creates a new alias and adds it to the current expression map.

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.metadata?` | [`EntityMetadata`](EntityMetadata.md) |
| `options.name?` | `string` |
| `options.subQuery?` | `string` |
| `options.tablePath?` | `string` |
| `options.target?` | `string` \| `Function` |
| `options.type` | ``"join"`` \| ``"select"`` \| ``"from"`` \| ``"other"`` |

#### Returns

[`Alias`](Alias.md)

-`Alias`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:288

___

### findAliasByName

**findAliasByName**(`aliasName`): [`Alias`](Alias.md)

Finds alias with the given name.
If alias was not found it throw an exception.

#### Parameters

| Name |
| :------ |
| `aliasName` | `string` |

#### Returns

[`Alias`](Alias.md)

-`Alias`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:300

___

### findColumnByAliasExpression

**findColumnByAliasExpression**(`aliasExpression`): `undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

#### Parameters

| Name |
| :------ |
| `aliasExpression` | `string` |

#### Returns

`undefined` \| [`ColumnMetadata`](ColumnMetadata.md)

-`undefined \| ColumnMetadata`: (optional) 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:301

___

### setMainAlias

**setMainAlias**(`alias`): [`Alias`](Alias.md)

Creates a main alias and adds it to the current expression map.

#### Parameters

| Name |
| :------ |
| `alias` | [`Alias`](Alias.md) |

#### Returns

[`Alias`](Alias.md)

-`Alias`: 

#### Defined in

node_modules/typeorm/query-builder/QueryExpressionMap.d.ts:284
