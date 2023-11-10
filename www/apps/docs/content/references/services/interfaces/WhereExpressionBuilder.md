# WhereExpressionBuilder

Query Builders can implement this interface to support where expression

## Implemented by

- [`DeleteQueryBuilder`](../classes/DeleteQueryBuilder.md)
- [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)
- [`SoftDeleteQueryBuilder`](../classes/SoftDeleteQueryBuilder.md)
- [`UpdateQueryBuilder`](../classes/UpdateQueryBuilder.md)

## Methods

### andWhere

**andWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:46

**andWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`Brackets`](../classes/Brackets.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:51

**andWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:56

**andWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md)[] |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:61

**andWhere**(`subQuery`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new AND WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `subQuery` | (`qb`: [`WhereExpressionBuilder`](WhereExpressionBuilder.md)) => `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:66

___

### andWhereInIds

**andWhereInIds**(`ids`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

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

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:111

___

### orWhere

**orWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:71

**orWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`Brackets`](../classes/Brackets.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:76

**orWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:81

**orWhere**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md)[] |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:86

**orWhere**(`subQuery`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Adds new OR WHERE condition in the query builder.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `subQuery` | (`qb`: [`WhereExpressionBuilder`](WhereExpressionBuilder.md)) => `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:91

___

### orWhereInIds

**orWhereInIds**(`ids`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

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

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:120

___

### where

**where**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:13

**where**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`Brackets`](../classes/Brackets.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:20

**where**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md) |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:27

**where**(`where`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `where` | [`ObjectLiteral`](ObjectLiteral.md)[] |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:34

**where**(`subQuery`, `parameters?`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.
Additionally you can add parameters used in where expression.

#### Parameters

| Name |
| :------ |
| `subQuery` | (`qb`: [`WhereExpressionBuilder`](WhereExpressionBuilder.md)) => `string` |
| `parameters?` | [`ObjectLiteral`](ObjectLiteral.md) |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:41

___

### whereInIds

**whereInIds**(`ids`): [`WhereExpressionBuilder`](WhereExpressionBuilder.md)

Sets WHERE condition in the query builder with a condition for the given ids.
If you had previously WHERE expression defined,
calling this function will override previously set WHERE conditions.

Ids are mixed.
It means if you have single primary key you can pass a simple id values, for example [1, 2, 3].
If you have multiple primary keys you need to pass object with property names and values specified,
for example [{ firstId: 1, secondId: 2 }, { firstId: 2, secondId: 3 }, ...]

#### Parameters

| Name |
| :------ |
| `ids` | `any` |

#### Returns

[`WhereExpressionBuilder`](WhereExpressionBuilder.md)

-`WhereExpressionBuilder`: 

#### Defined in

node_modules/typeorm/query-builder/WhereExpressionBuilder.d.ts:102
