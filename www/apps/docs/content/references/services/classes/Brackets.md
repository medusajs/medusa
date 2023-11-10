# Brackets

Syntax sugar.
Allows to use brackets in WHERE expressions for better syntax.

## Hierarchy

- **`Brackets`**

  ↳ [`NotBrackets`](NotBrackets.md)

## Constructors

### constructor

**new Brackets**(`whereFactory`)

Given WHERE query builder that will build a WHERE expression that will be taken into brackets.

#### Parameters

| Name |
| :------ |
| `whereFactory` | (`qb`: [`WhereExpressionBuilder`](../interfaces/WhereExpressionBuilder.md)) => `any` |

#### Defined in

node_modules/typeorm/query-builder/Brackets.d.ts:15

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/query-builder/Brackets.d.ts:7

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

#### Defined in

node_modules/typeorm/query-builder/Brackets.d.ts:11
