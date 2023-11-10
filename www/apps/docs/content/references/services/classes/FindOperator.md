# FindOperator

Find Operator used in Find Conditions.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- **`FindOperator`**

  ↳ [`EqualOperator`](EqualOperator.md)

## Constructors

### constructor

**new FindOperator**<`T`\>(`type`, `value`, `useParameter?`, `multipleParameters?`, `getSql?`, `objectLiteralParameters?`)

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `type` | [`FindOperatorType`](../index.md#findoperatortype) |
| `value` | [`FindOperator`](FindOperator.md)<`T`\> \| `T` |
| `useParameter?` | `boolean` |
| `multipleParameters?` | `boolean` |
| `getSql?` | [`SqlGeneratorType`](../index.md#sqlgeneratortype) |
| `objectLiteralParameters?` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:34

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:9

___

### \_getSql

 `Private` **\_getSql**: `any`

SQL generator

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:33

___

### \_multipleParameters

 `Private` **\_multipleParameters**: `any`

Indicates if multiple parameters must be used for this operator.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:29

___

### \_objectLiteralParameters

 `Private` **\_objectLiteralParameters**: `any`

ObjectLiteral parameters.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:21

___

### \_type

 `Private` **\_type**: `any`

Operator type.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:13

___

### \_useParameter

 `Private` **\_useParameter**: `any`

Indicates if parameter is used or not for this operator.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:25

___

### \_value

 `Private` **\_value**: `any`

Parameter value.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:17

## Accessors

### child

`get` **child**(): `undefined` \| [`FindOperator`](FindOperator.md)<`T`\>

Gets the child FindOperator if it exists

#### Returns

`undefined` \| [`FindOperator`](FindOperator.md)<`T`\>

-`undefined \| FindOperator<T\>`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:60

___

### getSql

`get` **getSql**(): `undefined` \| [`SqlGeneratorType`](../index.md#sqlgeneratortype)

Gets the SQL generator

#### Returns

`undefined` \| [`SqlGeneratorType`](../index.md#sqlgeneratortype)

-`undefined \| SqlGeneratorType`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:64

___

### multipleParameters

`get` **multipleParameters**(): `boolean`

Indicates if multiple parameters must be used for this operator.
Extracts final value if value is another find operator.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:44

___

### objectLiteralParameters

`get` **objectLiteralParameters**(): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Gets ObjectLiteral parameters.

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:56

___

### type

`get` **type**(): [`FindOperatorType`](../index.md#findoperatortype)

Gets the Type of this FindOperator

#### Returns

[`FindOperatorType`](../index.md#findoperatortype)

-`FindOperatorType`: List of types that FindOperator can be.

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:48

___

### useParameter

`get` **useParameter**(): `boolean`

Indicates if parameter is used or not for this operator.
Extracts final value if value is another find operator.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:39

___

### value

`get` **value**(): `T`

Gets the final value needs to be used as parameter value.

#### Returns

`T`

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:52

## Methods

### transformValue

**transformValue**(`transformer`): `void`

#### Parameters

| Name |
| :------ |
| `transformer` | [`ValueTransformer`](../interfaces/ValueTransformer.md) \| [`ValueTransformer`](../interfaces/ValueTransformer.md)[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:65
