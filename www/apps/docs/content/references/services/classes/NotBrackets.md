# NotBrackets

Syntax sugar.
Allows to use negate brackets in WHERE expressions for better syntax.

## Hierarchy

- [`Brackets`](Brackets.md)

  ↳ **`NotBrackets`**

## Constructors

### constructor

**new NotBrackets**(`whereFactory`)

Given WHERE query builder that will build a WHERE expression that will be taken into brackets.

#### Parameters

| Name |
| :------ |
| `whereFactory` | (`qb`: [`WhereExpressionBuilder`](../interfaces/WhereExpressionBuilder.md)) => `any` |

#### Inherited from

[Brackets](Brackets.md).[constructor](Brackets.md#constructor)

#### Defined in

node_modules/typeorm/query-builder/Brackets.d.ts:15

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Overrides

[Brackets](Brackets.md).[@instanceof](Brackets.md#@instanceof)

#### Defined in

node_modules/typeorm/query-builder/NotBrackets.d.ts:7

___

### whereFactory

 **whereFactory**: (`qb`: [`WhereExpressionBuilder`](../interfaces/WhereExpressionBuilder.md)) => `any`

#### Type declaration

(`qb`): `any`

WHERE expression that will be taken into brackets.

##### Parameters

| Name |
| :------ |
| `qb` | [`WhereExpressionBuilder`](../interfaces/WhereExpressionBuilder.md) |

##### Returns

`any`

-`any`: (optional) 

#### Inherited from

[Brackets](Brackets.md).[whereFactory](Brackets.md#wherefactory)

#### Defined in

node_modules/typeorm/query-builder/Brackets.d.ts:11
