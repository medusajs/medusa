# DeleteResult

Result object returned by DeleteQueryBuilder execution.

## Constructors

### constructor

**new DeleteResult**()

## Properties

### affected

 `Optional` **affected**: ``null`` \| `number`

Number of affected rows/documents
Not all drivers support this

#### Defined in

node_modules/typeorm/query-builder/result/DeleteResult.d.ts:15

___

### raw

 **raw**: `any`

Raw SQL result returned by executed query.

#### Defined in

node_modules/typeorm/query-builder/result/DeleteResult.d.ts:10

## Methods

### from

`Static` **from**(`queryResult`): [`DeleteResult`](DeleteResult.md)

#### Parameters

| Name |
| :------ |
| `queryResult` | [`QueryResult`](QueryResult.md) |

#### Returns

[`DeleteResult`](DeleteResult.md)

-`DeleteResult`: 

#### Defined in

node_modules/typeorm/query-builder/result/DeleteResult.d.ts:6
