# UpdateResult

Result object returned by UpdateQueryBuilder execution.

## Constructors

### constructor

**new UpdateResult**()

## Properties

### affected

 `Optional` **affected**: `number`

Number of affected rows/documents
Not all drivers support this

#### Defined in

node_modules/typeorm/query-builder/result/UpdateResult.d.ts:16

___

### generatedMaps

 **generatedMaps**: [`ObjectLiteral`](../interfaces/ObjectLiteral.md)[]

Generated values returned by a database.
Has entity-like structure (not just column database name and values).

#### Defined in

node_modules/typeorm/query-builder/result/UpdateResult.d.ts:25

___

### raw

 **raw**: `any`

Raw SQL result returned by executed query.

#### Defined in

node_modules/typeorm/query-builder/result/UpdateResult.d.ts:11

## Methods

### from

`Static` **from**(`queryResult`): [`UpdateResult`](UpdateResult.md)

#### Parameters

| Name |
| :------ |
| `queryResult` | [`QueryResult`](QueryResult.md) |

#### Returns

[`UpdateResult`](UpdateResult.md)

-`UpdateResult`: 

#### Defined in

node_modules/typeorm/query-builder/result/UpdateResult.d.ts:7
