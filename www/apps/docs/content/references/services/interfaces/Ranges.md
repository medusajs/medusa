# Ranges

## Hierarchy

- `Array`<[`Range`](Range.md)\>

  ↳ **`Ranges`**

## Properties

### [unscopables]

 `Readonly` **[unscopables]**: `Object`

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `[unscopables]?` | `boolean` | Is an object whose properties have the value 'true' when they will be absent when used in a 'with' statement. |
| `length?` | `boolean` | Gets or sets the length of the array. This is a number one higher than the highest index in the array. |
| `[iterator]?` | {} | - |
| `at?` | {} | - |
| `concat?` | {} | - |
| `copyWithin?` | {} | - |
| `entries?` | {} | - |
| `every?` | {} | - |
| `fill?` | {} | - |
| `filter?` | {} | - |
| `find?` | {} | - |
| `findIndex?` | {} | - |
| `findLast?` | {} | - |
| `findLastIndex?` | {} | - |
| `flat?` | {} | - |
| `flatMap?` | {} | - |
| `forEach?` | {} | - |
| `includes?` | {} | - |
| `indexOf?` | {} | - |
| `join?` | {} | - |
| `keys?` | {} | - |
| `lastIndexOf?` | {} | - |
| `map?` | {} | - |
| `pop?` | {} | - |
| `push?` | {} | - |
| `reduce?` | {} | - |
| `reduceRight?` | {} | - |
| `reverse?` | {} | - |
| `shift?` | {} | - |
| `slice?` | {} | - |
| `some?` | {} | - |
| `sort?` | {} | - |
| `splice?` | {} | - |
| `toLocaleString?` | {} | - |
| `toReversed?` | {} | - |
| `toSorted?` | {} | - |
| `toSpliced?` | {} | - |
| `toString?` | {} | - |
| `unshift?` | {} | - |
| `values?` | {} | - |
| `with?` | {} | - |

#### Inherited from

Array.[unscopables]

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:97

___

### length

 **length**: `number`

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### Inherited from

Array.length

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1318

___

### type

 **type**: `string`

#### Defined in

node_modules/@types/range-parser/index.d.ts:17

## Methods

### [iterator]

**[iterator]**(): [`IterableIterator`](IterableIterator.md)<[`Range`](Range.md)\>

Iterator

#### Returns

[`IterableIterator`](IterableIterator.md)<[`Range`](Range.md)\>

-`IterableIterator`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.[iterator]

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:58

___

### at

**at**(`index`): `undefined` \| [`Range`](Range.md)

Returns the item located at the specified index.

#### Parameters

| Name | Description |
| :------ | :------ |
| `index` | `number` | The zero-based index of the desired code unit. A negative index will count back from the last item. |

#### Returns

`undefined` \| [`Range`](Range.md)

-`undefined \| Range`: (optional) 

#### Inherited from

Array.at

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2022.array.d.ts:24

___

### concat

**concat**(`...items`): [`Range`](Range.md)[]

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

#### Parameters

| Name | Description |
| :------ | :------ |
| `...items` | [`ConcatArray`](ConcatArray.md)<[`Range`](Range.md)\>[] | Additional arrays and/or items to add to the end of the array. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.concat

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1342

**concat**(`...items`): [`Range`](Range.md)[]

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

#### Parameters

| Name | Description |
| :------ | :------ |
| `...items` | ([`Range`](Range.md) \| [`ConcatArray`](ConcatArray.md)<[`Range`](Range.md)\>)[] | Additional arrays and/or items to add to the end of the array. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.concat

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1348

___

### copyWithin

**copyWithin**(`target`, `start`, `end?`): [`Ranges`](Ranges.md)

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

| Name | Description |
| :------ | :------ |
| `target` | `number` | If target is negative, it is treated as length+target where length is the length of the array. |
| `start` | `number` | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
| `end?` | `number` | If not specified, length of the this object is used as its default value. |

#### Returns

[`Ranges`](Ranges.md)

-`Ranges`: 

#### Inherited from

Array.copyWithin

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.core.d.ts:62

___

### entries

**entries**(): [`IterableIterator`](IterableIterator.md)<[`number`, [`Range`](Range.md)]\>

Returns an iterable of key, value pairs for every entry in the array

#### Returns

[`IterableIterator`](IterableIterator.md)<[`number`, [`Range`](Range.md)]\>

-`IterableIterator`: 
	-`number`: (optional) 
	-`end`: 
	-`start`: 

#### Inherited from

Array.entries

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:63

___

### every

**every**<`S`\>(`predicate`, `thisArg?`): this is S[]

Determines whether all the members of an array satisfy the specified test.

| Name | Type |
| :------ | :------ |
| `S` | [`Range`](Range.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => value is S | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

this is S[]

-`this`: (optional) 

#### Inherited from

Array.every

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1425

**every**(`predicate`, `thisArg?`): `boolean`

Determines whether all the members of an array satisfy the specified test.

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `unknown` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

Array.every

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1434

___

### fill

**fill**(`value`, `start?`, `end?`): [`Ranges`](Ranges.md)

Changes all array elements from `start` to `end` index to a static `value` and returns the modified array

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | [`Range`](Range.md) | value to fill array section with |
| `start?` | `number` | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
| `end?` | `number` | index to stop filling the array at. If end is negative, it is treated as length+end. |

#### Returns

[`Ranges`](Ranges.md)

-`Ranges`: 

#### Inherited from

Array.fill

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.core.d.ts:51

___

### filter

**filter**<`S`\>(`predicate`, `thisArg?`): `S`[]

Returns the elements of an array that meet the condition specified in a callback function.

| Name | Type |
| :------ | :------ |
| `S` | [`Range`](Range.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => value is S | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`S`[]

-`S[]`: 

#### Inherited from

Array.filter

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1461

**filter**(`predicate`, `thisArg?`): [`Range`](Range.md)[]

Returns the elements of an array that meet the condition specified in a callback function.

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `unknown` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.filter

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1467

___

### find

**find**<`S`\>(`predicate`, `thisArg?`): `undefined` \| `S`

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

| Name | Type |
| :------ | :------ |
| `S` | [`Range`](Range.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `obj`: [`Range`](Range.md)[]) => value is S | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`undefined` \| `S`

-`undefined \| S`: (optional) 

#### Inherited from

Array.find

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.core.d.ts:29

**find**(`predicate`, `thisArg?`): `undefined` \| [`Range`](Range.md)

#### Parameters

| Name |
| :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `obj`: [`Range`](Range.md)[]) => `unknown` |
| `thisArg?` | `any` |

#### Returns

`undefined` \| [`Range`](Range.md)

-`undefined \| Range`: (optional) 

#### Inherited from

Array.find

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.core.d.ts:30

___

### findIndex

**findIndex**(`predicate`, `thisArg?`): `number`

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `obj`: [`Range`](Range.md)[]) => `unknown` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.findIndex

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.core.d.ts:41

___

### findLast

**findLast**<`S`\>(`predicate`, `thisArg?`): `undefined` \| `S`

Returns the value of the last element in the array where predicate is true, and undefined
otherwise.

| Name | Type |
| :------ | :------ |
| `S` | [`Range`](Range.md) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => value is S | findLast calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLast immediately returns that element value. Otherwise, findLast returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`undefined` \| `S`

-`undefined \| S`: (optional) 

#### Inherited from

Array.findLast

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:29

**findLast**(`predicate`, `thisArg?`): `undefined` \| [`Range`](Range.md)

#### Parameters

| Name |
| :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `unknown` |
| `thisArg?` | `any` |

#### Returns

`undefined` \| [`Range`](Range.md)

-`undefined \| Range`: (optional) 

#### Inherited from

Array.findLast

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:30

___

### findLastIndex

**findLastIndex**(`predicate`, `thisArg?`): `number`

Returns the index of the last element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `unknown` | findLastIndex calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.findLastIndex

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:41

___

### flat

**flat**<`A`, `D`\>(`this`, `depth?`): [`FlatArray`](../index.md#flatarray)<`A`, `D`\>[]

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

| Name | Type |
| :------ | :------ |
| `A` | `object` |
| `D` | `number` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `this` | `A` |
| `depth?` | `D` | The maximum recursion depth |

#### Returns

[`FlatArray`](../index.md#flatarray)<`A`, `D`\>[]

-`FlatArray<A, D\>[]`: 
	-`FlatArray`: 

#### Inherited from

Array.flat

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2019.array.d.ts:79

___

### flatMap

**flatMap**<`U`, `This`\>(`callback`, `thisArg?`): `U`[]

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

| Name | Type |
| :------ | :------ |
| `U` | `object` |
| `This` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `callback` | (`this`: `This`, `value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `U` \| readonly `U`[] | A function that accepts up to three arguments. The flatMap method calls the callback function one time for each element in the array. |
| `thisArg?` | `This` | An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

-`U[]`: 

#### Inherited from

Array.flatMap

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2019.array.d.ts:68

___

### forEach

**forEach**(`callbackfn`, `thisArg?`): `void`

Performs the specified action for each element in an array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `void` | A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

Array.forEach

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1449

___

### includes

**includes**(`searchElement`, `fromIndex?`): `boolean`

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

| Name | Description |
| :------ | :------ |
| `searchElement` | [`Range`](Range.md) | The element to search for. |
| `fromIndex?` | `number` | The position in this array at which to begin searching for searchElement. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

Array.includes

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2016.array.include.d.ts:25

___

### indexOf

**indexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

#### Parameters

| Name | Description |
| :------ | :------ |
| `searchElement` | [`Range`](Range.md) | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.indexOf

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1410

___

### join

**join**(`separator?`): `string`

Adds all the elements of an array into a string, separated by the specified separator string.

#### Parameters

| Name | Description |
| :------ | :------ |
| `separator?` | `string` | A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma. |

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

Array.join

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1353

___

### keys

**keys**(): [`IterableIterator`](IterableIterator.md)<`number`\>

Returns an iterable of keys in the array

#### Returns

[`IterableIterator`](IterableIterator.md)<`number`\>

-`IterableIterator`: 
	-`number`: (optional) 

#### Inherited from

Array.keys

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:68

___

### lastIndexOf

**lastIndexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.

#### Parameters

| Name | Description |
| :------ | :------ |
| `searchElement` | [`Range`](Range.md) | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.lastIndexOf

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1416

___

### map

**map**<`U`\>(`callbackfn`, `thisArg?`): `U`[]

Calls a defined callback function on each element of an array, and returns an array that contains the results.

| Name |
| :------ |
| `U` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `U` | A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

-`U[]`: 

#### Inherited from

Array.map

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1455

___

### pop

**pop**(): `undefined` \| [`Range`](Range.md)

Removes the last element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| [`Range`](Range.md)

-`undefined \| Range`: (optional) 

#### Inherited from

Array.pop

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1331

___

### push

**push**(`...items`): `number`

Appends new elements to the end of an array, and returns the new length of the array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `...items` | [`Range`](Range.md)[] | New elements to add to the array. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.push

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1336

___

### reduce

**reduce**(`callbackfn`): [`Range`](Range.md)

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`previousValue`: [`Range`](Range.md), `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => [`Range`](Range.md) | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |

#### Returns

[`Range`](Range.md)

-`end`: 
-`start`: 

#### Inherited from

Array.reduce

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1473

**reduce**(`callbackfn`, `initialValue`): [`Range`](Range.md)

#### Parameters

| Name |
| :------ |
| `callbackfn` | (`previousValue`: [`Range`](Range.md), `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => [`Range`](Range.md) |
| `initialValue` | [`Range`](Range.md) |

#### Returns

[`Range`](Range.md)

-`end`: 
-`start`: 

#### Inherited from

Array.reduce

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1474

**reduce**<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

| Name |
| :------ |
| `U` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => `U` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduce

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1480

___

### reduceRight

**reduceRight**(`callbackfn`): [`Range`](Range.md)

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`previousValue`: [`Range`](Range.md), `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => [`Range`](Range.md) | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |

#### Returns

[`Range`](Range.md)

-`end`: 
-`start`: 

#### Inherited from

Array.reduceRight

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1486

**reduceRight**(`callbackfn`, `initialValue`): [`Range`](Range.md)

#### Parameters

| Name |
| :------ |
| `callbackfn` | (`previousValue`: [`Range`](Range.md), `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => [`Range`](Range.md) |
| `initialValue` | [`Range`](Range.md) |

#### Returns

[`Range`](Range.md)

-`end`: 
-`start`: 

#### Inherited from

Array.reduceRight

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1487

**reduceRight**<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

| Name |
| :------ |
| `U` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: [`Range`](Range.md), `currentIndex`: `number`, `array`: [`Range`](Range.md)[]) => `U` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduceRight

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1493

___

### reverse

**reverse**(): [`Range`](Range.md)[]

Reverses the elements in an array in place.
This method mutates the array and returns a reference to the same array.

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.reverse

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1358

___

### shift

**shift**(): `undefined` \| [`Range`](Range.md)

Removes the first element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| [`Range`](Range.md)

-`undefined \| Range`: (optional) 

#### Inherited from

Array.shift

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1363

___

### slice

**slice**(`start?`, `end?`): [`Range`](Range.md)[]

Returns a copy of a section of an array.
For both start and end, a negative index can be used to indicate an offset from the end of the array.
For example, -2 refers to the second to last element of the array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start?` | `number` | The beginning index of the specified portion of the array. If start is undefined, then the slice begins at index 0. |
| `end?` | `number` | The end index of the specified portion of the array. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the array. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.slice

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1373

___

### some

**some**(`predicate`, `thisArg?`): `boolean`

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `predicate` | (`value`: [`Range`](Range.md), `index`: `number`, `array`: [`Range`](Range.md)[]) => `unknown` | A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

Array.some

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1443

___

### sort

**sort**(`compareFn?`): [`Ranges`](Ranges.md)

Sorts an array in place.
This method mutates the array and returns a reference to the same array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `compareFn?` | (`a`: [`Range`](Range.md), `b`: [`Range`](Range.md)) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order. ```ts [11,2,22,1].sort((a, b) => a - b) ``` |

#### Returns

[`Ranges`](Ranges.md)

-`Ranges`: 

#### Inherited from

Array.sort

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1384

___

### splice

**splice**(`start`, `deleteCount?`): [`Range`](Range.md)[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: An array containing the elements that were deleted.
	-`end`: 
	-`start`: 

#### Inherited from

Array.splice

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1391

**splice**(`start`, `deleteCount`, `...items`): [`Range`](Range.md)[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. |
| `...items` | [`Range`](Range.md)[] | Elements to insert into the array in place of the deleted elements. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: An array containing the elements that were deleted.
	-`end`: 
	-`start`: 

#### Inherited from

Array.splice

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1399

___

### toLocaleString

**toLocaleString**(): `string`

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

Array.toLocaleString

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1326

___

### toReversed

**toReversed**(): [`Range`](Range.md)[]

Returns a copy of an array with its elements reversed.

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.toReversed

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:46

___

### toSorted

**toSorted**(`compareFn?`): [`Range`](Range.md)[]

Returns a copy of an array with its elements sorted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `compareFn?` | (`a`: [`Range`](Range.md), `b`: [`Range`](Range.md)) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order. ```ts [11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22] ``` |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.toSorted

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:57

___

### toSpliced

**toSpliced**(`start`, `deleteCount`, `...items`): [`Range`](Range.md)[]

Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. |
| `...items` | [`Range`](Range.md)[] | Elements to insert into the copied array in place of the deleted elements. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: The copied array.
	-`end`: 
	-`start`: 

#### Inherited from

Array.toSpliced

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:66

**toSpliced**(`start`, `deleteCount?`): [`Range`](Range.md)[]

Copies an array and removes elements while returning the remaining elements.

#### Parameters

| Name | Description |
| :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: A copy of the original array with the remaining elements.
	-`end`: 
	-`start`: 

#### Inherited from

Array.toSpliced

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:74

___

### toString

**toString**(): `string`

Returns a string representation of an array.

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

Array.toString

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1322

___

### unshift

**unshift**(`...items`): `number`

Inserts new elements at the start of an array, and returns the new length of the array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `...items` | [`Range`](Range.md)[] | Elements to insert at the start of the array. |

#### Returns

`number`

-`number`: (optional) 

#### Inherited from

Array.unshift

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1404

___

### values

**values**(): [`IterableIterator`](IterableIterator.md)<[`Range`](Range.md)\>

Returns an iterable of values in the array

#### Returns

[`IterableIterator`](IterableIterator.md)<[`Range`](Range.md)\>

-`IterableIterator`: 
	-`end`: 
	-`start`: 

#### Inherited from

Array.values

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2015.iterable.d.ts:73

___

### with

**with**(`index`, `value`): [`Range`](Range.md)[]

Copies an array, then overwrites the value at the provided index with the
given value. If the index is negative, then it replaces from the end
of the array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `index` | `number` | The index of the value to overwrite. If the index is negative, then it replaces from the end of the array. |
| `value` | [`Range`](Range.md) | The value to write into the copied array. |

#### Returns

[`Range`](Range.md)[]

-`Range[]`: The copied array with the updated value.
	-`end`: 
	-`start`: 

#### Inherited from

Array.with

#### Defined in

docs-util/node_modules/typescript/lib/lib.es2023.array.d.ts:85
