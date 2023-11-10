# EqualOperator

Find Operator used in Find Conditions.

## Type parameters

| Name |
| :------ |
| `T` | `object` |

## Hierarchy

- [`FindOperator`](FindOperator.md)<`T`\>

  ↳ **`EqualOperator`**

## Constructors

### constructor

**new EqualOperator**<`T`\>(`value`)

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `value` | `T` \| [`FindOperator`](FindOperator.md)<`T`\> |

#### Overrides

[FindOperator](FindOperator.md).[constructor](FindOperator.md#constructor)

#### Defined in

node_modules/typeorm/find-options/EqualOperator.d.ts:4

## Properties

### @instanceof

 `Readonly` **@instanceof**: `symbol`

#### Overrides

[FindOperator](FindOperator.md).[@instanceof](FindOperator.md#@instanceof)

#### Defined in

node_modules/typeorm/find-options/EqualOperator.d.ts:3

## Accessors

### child

`get` **child**(): `undefined` \| [`FindOperator`](FindOperator.md)<`T`\>

Gets the child FindOperator if it exists

#### Returns

`undefined` \| [`FindOperator`](FindOperator.md)<`T`\>

-`undefined \| FindOperator<T\>`: (optional) 

#### Inherited from

FindOperator.child

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:60

___

### getSql

`get` **getSql**(): `undefined` \| [`SqlGeneratorType`](../types/SqlGeneratorType.md)

Gets the SQL generator

#### Returns

`undefined` \| [`SqlGeneratorType`](../types/SqlGeneratorType.md)

-`undefined \| SqlGeneratorType`: (optional) 

#### Inherited from

FindOperator.getSql

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

#### Inherited from

FindOperator.multipleParameters

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:44

___

### objectLiteralParameters

`get` **objectLiteralParameters**(): `undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

Gets ObjectLiteral parameters.

#### Returns

`undefined` \| [`ObjectLiteral`](../interfaces/ObjectLiteral.md)

-`undefined \| ObjectLiteral`: (optional) 

#### Inherited from

FindOperator.objectLiteralParameters

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:56

___

### type

`get` **type**(): [`FindOperatorType`](../types/FindOperatorType.md)

Gets the Type of this FindOperator

#### Returns

[`FindOperatorType`](../types/FindOperatorType.md)

-`FindOperatorType`: List of types that FindOperator can be.

#### Inherited from

FindOperator.type

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

#### Inherited from

FindOperator.useParameter

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:39

___

### value

`get` **value**(): `T`

Gets the final value needs to be used as parameter value.

#### Returns

`T`

#### Inherited from

FindOperator.value

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

#### Inherited from

[FindOperator](FindOperator.md).[transformValue](FindOperator.md#transformvalue)

#### Defined in

node_modules/typeorm/find-options/FindOperator.d.ts:65
