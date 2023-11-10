# Long

A class representing a 64-bit integer

**Remarks**

The internal representation of a long is the two given signed, 32-bit values.
We use 32-bit pieces because these are the size of integers on which
Javascript performs bit-operations.  For operations like addition and
multiplication, we split each number into 16 bit pieces, which can easily be
multiplied within Javascript's floating-point representation without overflow
or change in sign.
In the algorithms below, we frequently reduce the negative case to the
positive case by negating the input(s) and then post-processing the result.
Note that we must ALWAYS check specially whether those values are MIN_VALUE
(-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
a positive number, it overflows back into a negative).  Not handling this
case would often result in infinite recursion.
Common constant values ZERO, ONE, NEG_ONE, etc. are found as static properties on this class.

## Hierarchy

- [`BSONValue`](BSONValue.md)

  ↳ **`Long`**

## Constructors

### constructor

**new Long**(`low?`, `high?`, `unsigned?`)

Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 See the from* functions below for more convenient ways of constructing Longs.

Acceptable signatures are:
- Long(low, high, unsigned?)
- Long(bigint, unsigned?)
- Long(string, unsigned?)

#### Parameters

| Name | Description |
| :------ | :------ |
| `low?` | `string` \| `number` \| `bigint` | The low (signed) 32 bits of the long |
| `high?` | `number` \| `boolean` | The high (signed) 32 bits of the long |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Overrides

[BSONValue](BSONValue.md).[constructor](BSONValue.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:511

## Properties

### high

 **high**: `number`

The high 32 bits as a signed value.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:489

___

### low

 **low**: `number`

The low 32 bits as a signed value.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:493

___

### unsigned

 **unsigned**: `boolean`

Whether unsigned or not.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:497

___

### MAX\_UNSIGNED\_VALUE

 `Static` **MAX\_UNSIGNED\_VALUE**: [`Long`](Long.md)

Maximum unsigned value.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:514

___

### MAX\_VALUE

 `Static` **MAX\_VALUE**: [`Long`](Long.md)

Maximum signed value.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:526

___

### MIN\_VALUE

 `Static` **MIN\_VALUE**: [`Long`](Long.md)

Minimum signed value.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:528

___

### NEG\_ONE

 `Static` **NEG\_ONE**: [`Long`](Long.md)

Signed negative one.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:524

___

### ONE

 `Static` **ONE**: [`Long`](Long.md)

Signed one.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:520

___

### TWO\_PWR\_24

 `Static` **TWO\_PWR\_24**: [`Long`](Long.md)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:512

___

### UONE

 `Static` **UONE**: [`Long`](Long.md)

Unsigned one.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:522

___

### UZERO

 `Static` **UZERO**: [`Long`](Long.md)

Unsigned zero.

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:518

___

### ZERO

 `Static` **ZERO**: [`Long`](Long.md)

Signed zero

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:516

## Accessors

### \_\_isLong\_\_

`get` **__isLong__**(): `boolean`

An indicator used to reliably determine if an object is a Long or not.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:485

___

### \_bsontype

`get` **_bsontype**(): ``"Long"``

#### Returns

``"Long"``

-```"Long"```: (optional) 

#### Overrides

BSONValue.\_bsontype

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:483

## Methods

### add

**add**(`addend`): [`Long`](Long.md)

Returns the sum of this and the specified Long.

#### Parameters

| Name |
| :------ |
| `addend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:603

___

### and

**and**(`other`): [`Long`](Long.md)

Returns the sum of this and the specified Long.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: Sum

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:608

___

### comp

**comp**(`other`): ``0`` \| ``1`` \| ``-1``

This is an alias of [Long.compare](Long.md#compare)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

``0`` \| ``1`` \| ``-1``

-```0`` \| ``1`` \| ``-1```: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:615

___

### compare

**compare**(`other`): ``0`` \| ``1`` \| ``-1``

Compares this Long's value with the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

``0`` \| ``1`` \| ``-1``

-```0`` \| ``1`` \| ``-1```: (optional) 0 if they are the same, 1 if the this is greater and -1 if the given one is greater

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:613

___

### div

**div**(`divisor`): [`Long`](Long.md)

This is an alias of [Long.divide](Long.md#divide)

#### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:622

___

### divide

**divide**(`divisor`): [`Long`](Long.md)

Returns this Long divided by the specified. The result is signed if this Long is signed or unsigned if this Long is unsigned.

#### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: Quotient

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:620

___

### eq

**eq**(`other`): `boolean`

This is an alias of [Long.equals](Long.md#equals)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:629

___

### equals

**equals**(`other`): `boolean`

Tests if this Long's value equals the specified's.

#### Parameters

| Name | Description |
| :------ | :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Other value |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:627

___

### eqz

**eqz**(): `boolean`

This is an alias of [Long.isZero](Long.md#iszero)

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:769

___

### ge

**ge**(`other`): `boolean`

This is an alias of [Long.greaterThanOrEqual](Long.md#greaterthanorequal)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:649

___

### getHighBits

**getHighBits**(): `number`

Gets the high 32 bits as a signed integer.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:631

___

### getHighBitsUnsigned

**getHighBitsUnsigned**(): `number`

Gets the high 32 bits as an unsigned integer.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:633

___

### getLowBits

**getLowBits**(): `number`

Gets the low 32 bits as a signed integer.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:635

___

### getLowBitsUnsigned

**getLowBitsUnsigned**(): `number`

Gets the low 32 bits as an unsigned integer.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:637

___

### getNumBitsAbs

**getNumBitsAbs**(): `number`

Gets the number of bits needed to represent the absolute value of this Long.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:639

___

### greaterThan

**greaterThan**(`other`): `boolean`

Tests if this Long's value is greater than the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:641

___

### greaterThanOrEqual

**greaterThanOrEqual**(`other`): `boolean`

Tests if this Long's value is greater than or equal the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:645

___

### gt

**gt**(`other`): `boolean`

This is an alias of [Long.greaterThan](Long.md#greaterthan)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:643

___

### gte

**gte**(`other`): `boolean`

This is an alias of [Long.greaterThanOrEqual](Long.md#greaterthanorequal)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:647

___

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

[BSONValue](BSONValue.md).[inspect](BSONValue.md#inspect)

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:776

___

### isEven

**isEven**(): `boolean`

Tests if this Long's value is even.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:651

___

### isNegative

**isNegative**(): `boolean`

Tests if this Long's value is negative.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:653

___

### isOdd

**isOdd**(): `boolean`

Tests if this Long's value is odd.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:655

___

### isPositive

**isPositive**(): `boolean`

Tests if this Long's value is positive.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:657

___

### isZero

**isZero**(): `boolean`

Tests if this Long's value equals zero.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:659

___

### le

**le**(`other`): `boolean`

This is an alias of [Long.lessThanOrEqual](Long.md#lessthanorequal)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:771

___

### lessThan

**lessThan**(`other`): `boolean`

Tests if this Long's value is less than the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:661

___

### lessThanOrEqual

**lessThanOrEqual**(`other`): `boolean`

Tests if this Long's value is less than or equal the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:665

___

### lt

**lt**(`other`): `boolean`

This is an alias of [Long#lessThan](Long.md#lessthan).

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:663

___

### lte

**lte**(`other`): `boolean`

This is an alias of [Long.lessThanOrEqual](Long.md#lessthanorequal)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:667

___

### mod

**mod**(`divisor`): [`Long`](Long.md)

This is an alias of [Long.modulo](Long.md#modulo)

#### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:671

___

### modulo

**modulo**(`divisor`): [`Long`](Long.md)

Returns this Long modulo the specified.

#### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:669

___

### mul

**mul**(`multiplier`): [`Long`](Long.md)

This is an alias of [Long.multiply](Long.md#multiply)

#### Parameters

| Name |
| :------ |
| `multiplier` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:681

___

### multiply

**multiply**(`multiplier`): [`Long`](Long.md)

Returns the product of this and the specified Long.

#### Parameters

| Name | Description |
| :------ | :------ |
| `multiplier` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Multiplier |

#### Returns

[`Long`](Long.md)

-`Long`: Product

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:679

___

### ne

**ne**(`other`): `boolean`

This is an alias of [Long.notEquals](Long.md#notequals)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:693

___

### neg

**neg**(): [`Long`](Long.md)

This is an alias of [Long.negate](Long.md#negate)

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:685

___

### negate

**negate**(): [`Long`](Long.md)

Returns the Negation of this Long's value.

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:683

___

### neq

**neq**(`other`): `boolean`

This is an alias of [Long.notEquals](Long.md#notequals)

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:691

___

### not

**not**(): [`Long`](Long.md)

Returns the bitwise NOT of this Long.

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:687

___

### notEquals

**notEquals**(`other`): `boolean`

Tests if this Long's value differs from the specified's.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:689

___

### or

**or**(`other`): [`Long`](Long.md)

Returns the bitwise OR of this Long and the specified.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:697

___

### rem

**rem**(`divisor`): [`Long`](Long.md)

This is an alias of [Long.modulo](Long.md#modulo)

#### Parameters

| Name |
| :------ |
| `divisor` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:673

___

### shiftLeft

**shiftLeft**(`numBits`): [`Long`](Long.md)

Returns this Long with bits shifted to the left by the given amount.

#### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

#### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:703

___

### shiftRight

**shiftRight**(`numBits`): [`Long`](Long.md)

Returns this Long with bits arithmetically shifted to the right by the given amount.

#### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

#### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:711

___

### shiftRightUnsigned

**shiftRightUnsigned**(`numBits`): [`Long`](Long.md)

Returns this Long with bits logically shifted to the right by the given amount.

#### Parameters

| Name | Description |
| :------ | :------ |
| `numBits` | `number` \| [`Long`](Long.md) | Number of bits |

#### Returns

[`Long`](Long.md)

-`Long`: Shifted Long

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:719

___

### shl

**shl**(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftLeft](Long.md#shiftleft)

#### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:705

___

### shr

**shr**(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRight](Long.md#shiftright)

#### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:713

___

### shr\_u

**shr_u**(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRightUnsigned](Long.md#shiftrightunsigned)

#### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:721

___

### shru

**shru**(`numBits`): [`Long`](Long.md)

This is an alias of [Long.shiftRightUnsigned](Long.md#shiftrightunsigned)

#### Parameters

| Name |
| :------ |
| `numBits` | `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:723

___

### sub

**sub**(`subtrahend`): [`Long`](Long.md)

This is an alias of [Long.subtract](Long.md#subtract)

#### Parameters

| Name |
| :------ |
| `subtrahend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:731

___

### subtract

**subtract**(`subtrahend`): [`Long`](Long.md)

Returns the difference of this and the specified Long.

#### Parameters

| Name | Description |
| :------ | :------ |
| `subtrahend` | `string` \| `number` \| [`Long`](Long.md) \| [`Timestamp`](Timestamp.md) | Subtrahend |

#### Returns

[`Long`](Long.md)

-`Long`: Difference

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:729

___

### toBigInt

**toBigInt**(): `bigint`

Converts the Long to a BigInt (arbitrary precision).

#### Returns

`bigint`

-`bigint`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:737

___

### toBytes

**toBytes**(`le?`): `number`[]

Converts this Long to its byte representation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `le?` | `boolean` | Whether little or big endian, defaults to big endian |

#### Returns

`number`[]

-`number[]`: Byte representation
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:743

___

### toBytesBE

**toBytesBE**(): `number`[]

Converts this Long to its big endian byte representation.

#### Returns

`number`[]

-`number[]`: Big endian byte representation
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:753

___

### toBytesLE

**toBytesLE**(): `number`[]

Converts this Long to its little endian byte representation.

#### Returns

`number`[]

-`number[]`: Little endian byte representation
	-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:748

___

### toExtendedJSON

**toExtendedJSON**(`options?`): `number` \| [`LongExtended`](../interfaces/LongExtended.md)

#### Parameters

| Name |
| :------ |
| `options?` | [`EJSONOptions`](../types/EJSONOptions.md) |

#### Returns

`number` \| [`LongExtended`](../interfaces/LongExtended.md)

-`number \| LongExtended`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:772

___

### toInt

**toInt**(): `number`

Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:733

___

### toNumber

**toNumber**(): `number`

Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:735

___

### toSigned

**toSigned**(): [`Long`](Long.md)

Converts this Long to signed.

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:757

___

### toString

**toString**(`radix?`): `string`

Converts the Long to a string written in the specified radix.

#### Parameters

| Name | Description |
| :------ | :------ |
| `radix?` | `number` | Radix (2-36), defaults to 10 |

#### Returns

`string`

-`string`: (optional) 

**Throws**

RangeError If `radix` is out of range

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:763

___

### toUnsigned

**toUnsigned**(): [`Long`](Long.md)

Converts this Long to unsigned.

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:765

___

### xor

**xor**(`other`): [`Long`](Long.md)

Returns the bitwise XOR of this Long and the given one.

#### Parameters

| Name |
| :------ |
| `other` | `string` \| `number` \| [`Long`](Long.md) |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:767

___

### fromBigInt

`Static` **fromBigInt**(`value`, `unsigned?`): [`Long`](Long.md)

Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `bigint` | The number in question |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:558

___

### fromBits

`Static` **fromBits**(`lowBits`, `highBits`, `unsigned?`): [`Long`](Long.md)

Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits.
Each is assumed to use 32 bits.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lowBits` | `number` | The low 32 bits |
| `highBits` | `number` | The high 32 bits |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:537

___

### fromBytes

`Static` **fromBytes**(`bytes`, `unsigned?`, `le?`): [`Long`](Long.md)

Creates a Long from its byte representation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `bytes` | `number`[] | Byte representation |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |
| `le?` | `boolean` | Whether little or big endian, defaults to big endian |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:574

___

### fromBytesBE

`Static` **fromBytesBE**(`bytes`, `unsigned?`): [`Long`](Long.md)

Creates a Long from its big endian byte representation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `bytes` | `number`[] | Big endian byte representation |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:588

___

### fromBytesLE

`Static` **fromBytesLE**(`bytes`, `unsigned?`): [`Long`](Long.md)

Creates a Long from its little endian byte representation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `bytes` | `number`[] | Little endian byte representation |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:581

___

### fromExtendedJSON

`Static` **fromExtendedJSON**(`doc`, `options?`): `number` \| `bigint` \| [`Long`](Long.md)

#### Parameters

| Name |
| :------ |
| `doc` | `object` |
| `doc.$numberLong` | `string` |
| `options?` | [`EJSONOptions`](../types/EJSONOptions.md) |

#### Returns

`number` \| `bigint` \| [`Long`](Long.md)

-`number \| bigint \| Long`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:773

___

### fromInt

`Static` **fromInt**(`value`, `unsigned?`): [`Long`](Long.md)

Returns a Long representing the given 32 bit integer value.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | The 32 bit integer in question |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:544

___

### fromNumber

`Static` **fromNumber**(`value`, `unsigned?`): [`Long`](Long.md)

Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | The number in question |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:551

___

### fromString

`Static` **fromString**(`str`, `unsigned?`, `radix?`): [`Long`](Long.md)

Returns a Long representation of the given string, written using the specified radix.

#### Parameters

| Name | Description |
| :------ | :------ |
| `str` | `string` | The textual representation of the Long |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |
| `radix?` | `number` | The radix in which the text is written (2-36), defaults to 10 |

#### Returns

[`Long`](Long.md)

-`Long`: The corresponding Long value

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:566

___

### fromValue

`Static` **fromValue**(`val`, `unsigned?`): [`Long`](Long.md)

Converts the specified value to a Long.

#### Parameters

| Name | Description |
| :------ | :------ |
| `val` | `string` \| `number` \| { `high`: `number` ; `low`: `number` ; `unsigned?`: `boolean`  } |
| `unsigned?` | `boolean` | Whether unsigned or not, defaults to signed |

#### Returns

[`Long`](Long.md)

-`Long`: 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:597

___

### isLong

`Static` **isLong**(`value`): value is Long

Tests if the specified object is a Long.

#### Parameters

| Name |
| :------ |
| `value` | `unknown` |

#### Returns

value is Long

-`value`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/bson.typings.d.ts:592
