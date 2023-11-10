# InsertResult

Result object returned by InsertQueryBuilder execution.

## Constructors

### constructor

**new InsertResult**()

## Properties

### generatedMaps

 **generatedMaps**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Generated values returned by a database.
Has entity-like structure (not just column database name and values).

#### Defined in

node_modules/typeorm/query-builder/result/InsertResult.d.ts:17

___

### identifiers

 **identifiers**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Contains inserted entity id.
Has entity-like structure (not just column database name and values).

#### Defined in

node_modules/typeorm/query-builder/result/InsertResult.d.ts:12

___

### raw

 **raw**: `any`

Raw SQL result returned by executed query.

#### Defined in

node_modules/typeorm/query-builder/result/InsertResult.d.ts:21

## Methods

### from

`Static` **from**(`queryResult`): [`InsertResult`](InsertResult.md)

#### Parameters

| Name |
| :------ |
| `queryResult` | [`QueryResult`](QueryResult.md) |

#### Returns

[`InsertResult`](InsertResult.md)

-`InsertResult`: 

#### Defined in

node_modules/typeorm/query-builder/result/InsertResult.d.ts:7
