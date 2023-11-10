# MongoError

## Hierarchy

- `Error`

  ↳ **`MongoError`**

  ↳↳ [`MongoServerError`](MongoServerError.md)

## Constructors

### constructor

**new MongoError**(`message`)

#### Parameters

| Name |
| :------ |
| `message` | `string` \| `Error` |

#### Overrides

Error.constructor

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3919

## Properties

### cause

 `Optional` **cause**: `Error`

#### Overrides

Error.cause

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3918

___

### code

 `Optional` **code**: `string` \| `number`

This is a number in MongoServerError and a string in MongoDriverError

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3915

___

### connectionGeneration

 `Optional` **connectionGeneration**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3917

___

### message

 **message**: `string`

#### Inherited from

Error.message

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### stack

 `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1069

___

### topologyVersion

 `Optional` **topologyVersion**: [`TopologyVersion`](../interfaces/TopologyVersion.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3916

___

### prepareStackTrace

 `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: [`CallSite`](../interfaces/CallSite.md)[]) => `any`

#### Type declaration

(`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name |
| :------ |
| `err` | `Error` |
| `stackTraces` | [`CallSite`](../interfaces/CallSite.md)[] |

##### Returns

`any`

-`any`: (optional) 

**See**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

 `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:13

## Accessors

### errmsg

`get` **errmsg**(): `string`

Legacy name for server error responses

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3922

___

### errorLabels

`get` **errorLabels**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3931

___

### name

`get` **name**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

Error.name

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3920

## Methods

### addErrorLabel

**addErrorLabel**(`label`): `void`

#### Parameters

| Name |
| :------ |
| `label` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3930

___

### hasErrorLabel

**hasErrorLabel**(`label`): `boolean`

Checks the error to see if it has an error label

#### Parameters

| Name | Description |
| :------ | :------ |
| `label` | `string` | The error label to check for |

#### Returns

`boolean`

-`boolean`: (optional) returns true if the error has the provided error label

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3929

___

### captureStackTrace

`Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name |
| :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

-`void`: (optional) 

#### Inherited from

Error.captureStackTrace

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:4
