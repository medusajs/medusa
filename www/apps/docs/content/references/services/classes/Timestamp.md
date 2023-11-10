# Timestamp

## Hierarchy

- [`LongWithoutOverridesClass`](../index.md#longwithoutoverridesclass)

  ↳ **`Timestamp`**

## Constructors

### constructor

**new Timestamp**(`int`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `int` | `bigint` | A 64-bit bigint representing the Timestamp. |

#### Overrides

LongWithoutOverridesClass.constructor

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:976

**new Timestamp**(`long`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `long` | [`Long`](Long.md) | A 64-bit Long representing the Timestamp. |

#### Overrides

LongWithoutOverridesClass.constructor

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:980

**new Timestamp**(`value`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `object` | A pair of two values indicating timestamp and increment. |
| `value.i` | `number` |
| `value.t` | `number` |

#### Overrides

LongWithoutOverridesClass.constructor

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:984

## Properties

### \_\_isLong\_\_

 **\_\_isLong\_\_**: `boolean`

#### Inherited from

LongWithoutOverridesClass.\_\_isLong\_\_

___

### add

 **add**: (`addend`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`addend`): [`Long`](Long.md)

Returns the sum of this and the specified Long.

##### Parameters

| Name |
| :------ |
| `addend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.add

___

### and

 **and**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`other`): [`Long`](Long.md)

Returns the sum of this and the specified Long.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: Sum

#### Inherited from

LongWithoutOverridesClass.and

___

### comp

 **comp**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => ``0`` \| ``1`` \| ``-1``

#### Type declaration

(`other`): ``0`` \| ``1`` \| ``-1``

This is an alias of [Long.compare](Long.md#compare)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

``0`` \| ``1`` \| ``-1``

-```0`` \| ``1`` \| ``-1```: (optional) 

#### Inherited from

LongWithoutOverridesClass.comp

___

### compare

 **compare**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => ``0`` \| ``1`` \| ``-1``

#### Type declaration

(`other`): ``0`` \| ``1`` \| ``-1``

Compares this Long's value with the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

``0`` \| ``1`` \| ``-1``

-```0`` \| ``1`` \| ``-1```: (optional) 0 if they are the same, 1 if the this is greater and -1 if the given one is greater

#### Inherited from

LongWithoutOverridesClass.compare

___

### div

 **div**: (`divisor`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`divisor`): [`Long`](Long.md)

This is an alias of [Long.divide](Long.md#divide)

##### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.div

___

### divide

 **divide**: (`divisor`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`divisor`): [`Long`](Long.md)

Returns this Long divided by the specified. The result is signed if this Long is signed or unsigned if this Long is unsigned.

##### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: Quotient

#### Inherited from

LongWithoutOverridesClass.divide

___

### eq

 **eq**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.equals](Long.md#equals)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.eq

___

### equals

 **equals**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value equals the specified's.

##### Parameters

| Name | Description |
| :------ | :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Other value |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.equals

___

### eqz

 **eqz**: () => `boolean`

#### Type declaration

(): `boolean`

This is an alias of [Long.isZero](Long.md#iszero)

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.eqz

___

### ge

 **ge**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.greaterThanOrEqual](Long.md#greaterthanorequal)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.ge

___

### getHighBits

 **getHighBits**: () => `number`

#### Type declaration

(): `number`

Gets the high 32 bits as a signed integer.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.getHighBits

___

### getHighBitsUnsigned

 **getHighBitsUnsigned**: () => `number`

#### Type declaration

(): `number`

Gets the high 32 bits as an unsigned integer.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.getHighBitsUnsigned

___

### getLowBits

 **getLowBits**: () => `number`

#### Type declaration

(): `number`

Gets the low 32 bits as a signed integer.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.getLowBits

___

### getLowBitsUnsigned

 **getLowBitsUnsigned**: () => `number`

#### Type declaration

(): `number`

Gets the low 32 bits as an unsigned integer.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.getLowBitsUnsigned

___

### getNumBitsAbs

 **getNumBitsAbs**: () => `number`

#### Type declaration

(): `number`

Gets the number of bits needed to represent the absolute value of this Long.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.getNumBitsAbs

___

### greaterThan

 **greaterThan**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value is greater than the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.greaterThan

___

### greaterThanOrEqual

 **greaterThanOrEqual**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value is greater than or equal the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.greaterThanOrEqual

___

### gt

 **gt**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.greaterThan](Long.md#greaterthan)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.gt

___

### gte

 **gte**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.greaterThanOrEqual](Long.md#greaterthanorequal)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.gte

___

### high

 **high**: `number`

#### Inherited from

LongWithoutOverridesClass.high

___

### isEven

 **isEven**: () => `boolean`

#### Type declaration

(): `boolean`

Tests if this Long's value is even.

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.isEven

___

### isNegative

 **isNegative**: () => `boolean`

#### Type declaration

(): `boolean`

Tests if this Long's value is negative.

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.isNegative

___

### isOdd

 **isOdd**: () => `boolean`

#### Type declaration

(): `boolean`

Tests if this Long's value is odd.

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.isOdd

___

### isPositive

 **isPositive**: () => `boolean`

#### Type declaration

(): `boolean`

Tests if this Long's value is positive.

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.isPositive

___

### isZero

 **isZero**: () => `boolean`

#### Type declaration

(): `boolean`

Tests if this Long's value equals zero.

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.isZero

___

### le

 **le**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.lessThanOrEqual](Long.md#lessthanorequal)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.le

___

### lessThan

 **lessThan**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value is less than the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.lessThan

___

### lessThanOrEqual

 **lessThanOrEqual**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value is less than or equal the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.lessThanOrEqual

___

### low

 **low**: `number`

#### Inherited from

LongWithoutOverridesClass.low

___

### lt

 **lt**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long#lessThan](Long.md#lessthan).

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.lt

___

### lte

 **lte**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.lessThanOrEqual](Long.md#lessthanorequal)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.lte

___

### mod

 **mod**: (`divisor`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`divisor`): [`Long`](Long.md)

This is an alias of [Long.modulo](Long.md#modulo)

##### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.mod

___

### modulo

 **modulo**: (`divisor`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`divisor`): [`Long`](Long.md)

Returns this Long modulo the specified.

##### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.modulo

___

### mul

 **mul**: (`multiplier`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`multiplier`): [`Long`](Long.md)

This is an alias of [Long.multiply](Long.md#multiply)

##### Parameters

| Name |
| :------ |
| `multiplier` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.mul

___

### multiply

 **multiply**: (`multiplier`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`multiplier`): [`Long`](Long.md)

Returns the product of this and the specified Long.

##### Parameters

| Name | Description |
| :------ | :------ |
| `multiplier` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Multiplier |

##### Returns

[`Long`](Long.md)

-`Long`: Product

#### Inherited from

LongWithoutOverridesClass.multiply

___

### ne

 **ne**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.notEquals](Long.md#notequals)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.ne

___

### neg

 **neg**: () => [`Long`](Long.md)

#### Type declaration

(): [`Long`](Long.md)

This is an alias of [Long.negate](Long.md#negate)

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.neg

___

### negate

 **negate**: () => [`Long`](Long.md)

#### Type declaration

(): [`Long`](Long.md)

Returns the Negation of this Long's value.

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.negate

___

### neq

 **neq**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

This is an alias of [Long.notEquals](Long.md#notequals)

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.neq

___

### not

 **not**: () => [`Long`](Long.md)

#### Type declaration

(): [`Long`](Long.md)

Returns the bitwise NOT of this Long.

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.not

___

### notEquals

 **notEquals**: (`other`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => `boolean`

#### Type declaration

(`other`): `boolean`

Tests if this Long's value differs from the specified's.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

LongWithoutOverridesClass.notEquals

___

### or

 **or**: (`other`: `string` \| `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`other`): [`Long`](Long.md)

Returns the bitwise OR of this Long and the specified.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.or

___

### rem

 **rem**: (`divisor`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`divisor`): [`Long`](Long.md)

This is an alias of [Long.modulo](Long.md#modulo)

##### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.rem

___

### shiftLeft

 **shiftLeft**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

Returns this Long with bits shifted to the left by the given amount.

##### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

##### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Inherited from

LongWithoutOverridesClass.shiftLeft

___

### shiftRight

 **shiftRight**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

Returns this Long with bits arithmetically shifted to the right by the given amount.

##### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

##### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Inherited from

LongWithoutOverridesClass.shiftRight

___

### shiftRightUnsigned

 **shiftRightUnsigned**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

Returns this Long with bits logically shifted to the right by the given amount.

##### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

##### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Inherited from

LongWithoutOverridesClass.shiftRightUnsigned

___

### shl

 **shl**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftLeft](Long.md#shiftleft)

##### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.shl

___

### shr

 **shr**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRight](Long.md#shiftright)

##### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.shr

___

### shr\_u

 **shr\_u**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRightUnsigned](Long.md#shiftrightunsigned)

##### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.shr\_u

___

### shru

 **shru**: (`numBits`: `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRightUnsigned](Long.md#shiftrightunsigned)

##### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.shru

___

### sub

 **sub**: (`subtrahend`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`subtrahend`): [`Long`](Long.md)

This is an alias of [Long.subtract](Long.md#subtract)

##### Parameters

| Name |
| :------ |
| `subtrahend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.sub

___

### subtract

 **subtract**: (`subtrahend`: `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md)) => [`Long`](Long.md)

#### Type declaration

(`subtrahend`): [`Long`](Long.md)

Returns the difference of this and the specified Long.

##### Parameters

| Name | Description |
| :------ | :------ |
| `subtrahend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Subtrahend |

##### Returns

[`Long`](Long.md)

-`Long`: Difference

#### Inherited from

LongWithoutOverridesClass.subtract

___

### toBigInt

 **toBigInt**: () => `bigint`

#### Type declaration

(): `bigint`

Converts the Long to a BigInt (arbitrary precision).

##### Returns

`bigint`

-`bigint`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toBigInt

___

### toBytes

 **toBytes**: (`le?`: `boolean`) => `number`[]

#### Type declaration

(`le?`): `number`[]

Converts this Long to its byte representation.

##### Parameters

| Name | Description |
| :------ | :------ |
| `le?` | `boolean` | Whether little or big endian, defaults to big endian |

##### Returns

`number`[]

-`number[]`: Byte representation
	-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toBytes

___

### toBytesBE

 **toBytesBE**: () => `number`[]

#### Type declaration

(): `number`[]

Converts this Long to its big endian byte representation.

##### Returns

`number`[]

-`number[]`: Big endian byte representation
	-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toBytesBE

___

### toBytesLE

 **toBytesLE**: () => `number`[]

#### Type declaration

(): `number`[]

Converts this Long to its little endian byte representation.

##### Returns

`number`[]

-`number[]`: Little endian byte representation
	-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toBytesLE

___

### toInt

 **toInt**: () => `number`

#### Type declaration

(): `number`

Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toInt

___

### toNumber

 **toNumber**: () => `number`

#### Type declaration

(): `number`

Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).

##### Returns

`number`

-`number`: (optional) 

#### Inherited from

LongWithoutOverridesClass.toNumber

___

### toSigned

 **toSigned**: () => [`Long`](Long.md)

#### Type declaration

(): [`Long`](Long.md)

Converts this Long to signed.

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.toSigned

___

### toString

 **toString**: (`radix?`: `number`) => `string`

#### Type declaration

(`radix?`): `string`

Converts the Long to a string written in the specified radix.

##### Parameters

| Name | Description |
| :------ | :------ |
| `radix?` | `number` | Radix (2-36), defaults to 10 |

##### Returns

`string`

-`string`: (optional) 

**Throws**

RangeError If `radix` is out of range

#### Inherited from

LongWithoutOverridesClass.toString

___

### toUnsigned

 **toUnsigned**: () => [`Long`](Long.md)

#### Type declaration

(): [`Long`](Long.md)

Converts this Long to unsigned.

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.toUnsigned

___

### unsigned

 **unsigned**: `boolean`

#### Inherited from

LongWithoutOverridesClass.unsigned

___

### xor

 **xor**: (`other`: `string` \| `number` \| [`Long`](Long.md)) => [`Long`](Long.md)

#### Type declaration

(`other`): [`Long`](Long.md)

Returns the bitwise XOR of this Long and the given one.

##### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) |

##### Returns

[`Long`](Long.md)

-`Long`: 

#### Inherited from

LongWithoutOverridesClass.xor

___

### MAX\_VALUE

 `Static` `Readonly` **MAX\_VALUE**: [`Long`](Long.md)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:972

## Accessors

### \_bsontype

`get` **_bsontype**(): ``"Timestamp"``

#### Returns

``"Timestamp"``

-```"Timestamp"```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:971

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1009

___

### toJSON

**toJSON**(): { `$timestamp`: `string`  }

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `$timestamp` | `string` |

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:988

___

### fromBits

`Static` **fromBits**(`lowBits`, `highBits`): [`Timestamp`](Timestamp.md)

Returns a Timestamp for the given high and low bits. Each is assumed to use 32 bits.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lowBits` | `number` | the low 32-bits. |
| `highBits` | `number` | the high 32-bits. |

#### Returns

[`Timestamp`](Timestamp.md)

-`Timestamp`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1001

___

### fromInt

`Static` **fromInt**(`value`): [`Timestamp`](Timestamp.md)

Returns a Timestamp represented by the given (32-bit) integer value.

#### Parameters

| Name |
| :------ |
| `value` | `number` |

#### Returns

[`Timestamp`](Timestamp.md)

-`Timestamp`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:992

___

### fromNumber

`Static` **fromNumber**(`value`): [`Timestamp`](Timestamp.md)

Returns a Timestamp representing the given number value, provided that it is a finite number. Otherwise, zero is returned.

#### Parameters

| Name |
| :------ |
| `value` | `number` |

#### Returns

[`Timestamp`](Timestamp.md)

-`Timestamp`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:994

___

### fromString

`Static` **fromString**(`str`, `optRadix`): [`Timestamp`](Timestamp.md)

Returns a Timestamp from the given string, optionally using the given radix.

#### Parameters

| Name | Description |
| :------ | :------ |
| `str` | `string` | the textual representation of the Timestamp. |
| `optRadix` | `number` | the radix in which the text is written. |

#### Returns

[`Timestamp`](Timestamp.md)

-`Timestamp`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:1008
