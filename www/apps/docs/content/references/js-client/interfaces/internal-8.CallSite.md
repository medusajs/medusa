---
displayed_sidebar: jsClientSidebar
---

# Interface: CallSite

[internal](../modules/internal-8.md).CallSite

## Methods

### getColumnNumber

▸ **getColumnNumber**(): ``null`` \| `number`

Current column number [if this function was defined in a script]

#### Returns

``null`` \| `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:173

___

### getEvalOrigin

▸ **getEvalOrigin**(): `undefined` \| `string`

A call site object representing the location where eval was called
[if this function was created using a call to eval]

#### Returns

`undefined` \| `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:179

___

### getFileName

▸ **getFileName**(): `undefined` \| `string`

Name of the script [if this function was defined in a script]

#### Returns

`undefined` \| `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:163

___

### getFunction

▸ **getFunction**(): `undefined` \| `Function`

Current function

#### Returns

`undefined` \| `Function`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:145

___

### getFunctionName

▸ **getFunctionName**(): ``null`` \| `string`

Name of the current function, typically its name property.
If a name property is not available an attempt will be made to try
to infer a name from the function's context.

#### Returns

``null`` \| `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:152

___

### getLineNumber

▸ **getLineNumber**(): ``null`` \| `number`

Current line number [if this function was defined in a script]

#### Returns

``null`` \| `number`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:168

___

### getMethodName

▸ **getMethodName**(): ``null`` \| `string`

Name of the property [of "this" or one of its prototypes] that holds
the current function

#### Returns

``null`` \| `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:158

___

### getThis

▸ **getThis**(): `unknown`

Value of "this"

#### Returns

`unknown`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:132

___

### getTypeName

▸ **getTypeName**(): ``null`` \| `string`

Type of "this" as a string.
This is the name of the function stored in the constructor field of
"this", if available.  Otherwise the object's [[Class]] internal
property.

#### Returns

``null`` \| `string`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:140

___

### isConstructor

▸ **isConstructor**(): `boolean`

Is this a constructor call?

#### Returns

`boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:199

___

### isEval

▸ **isEval**(): `boolean`

Does this call take place in code defined by a call to eval?

#### Returns

`boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:189

___

### isNative

▸ **isNative**(): `boolean`

Is this call in native V8 code?

#### Returns

`boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:194

___

### isToplevel

▸ **isToplevel**(): `boolean`

Is this a toplevel invocation, that is, is "this" the global object?

#### Returns

`boolean`

#### Defined in

packages/medusa-js/node_modules/@types/node/globals.d.ts:184
