---
displayed_sidebar: jsClientSidebar
---

# Interface: Function

[internal](../modules/internal.md).Function

Creates a new function.

## Properties

### arguments

• **arguments**: `any`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:304

___

### caller

• **caller**: [`Function`](../modules/internal.md#function)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:305

___

### length

• `Readonly` **length**: `number`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:301

___

### name

• `Readonly` **name**: `string`

Returns the name of the function. Function names are read-only and can not be changed.

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:97

___

### prototype

• **prototype**: `any`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:300

## Methods

### [hasInstance]

▸ **[hasInstance]**(`value`): `boolean`

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:162

___

### apply

▸ **apply**(`this`, `thisArg`, `argArray?`): `any`

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`Function`](../modules/internal.md#function) | - |
| `thisArg` | `any` | The object to be used as the this object. |
| `argArray?` | `any` | A set of arguments to be passed to the function. |

#### Returns

`any`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:280

___

### bind

▸ **bind**(`this`, `thisArg`, ...`argArray`): `any`

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`Function`](../modules/internal.md#function) | - |
| `thisArg` | `any` | An object to which the this keyword can refer inside the new function. |
| `...argArray` | `any`[] | A list of arguments to be passed to the new function. |

#### Returns

`any`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:295

___

### call

▸ **call**(`this`, `thisArg`, ...`argArray`): `any`

Calls a method of an object, substituting another object for the current object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`Function`](../modules/internal.md#function) | - |
| `thisArg` | `any` | The object to be used as the current object. |
| `...argArray` | `any`[] | A list of arguments to be passed to the method. |

#### Returns

`any`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:287

___

### toString

▸ **toString**(): `string`

Returns a string representation of a function.

#### Returns

`string`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:298
