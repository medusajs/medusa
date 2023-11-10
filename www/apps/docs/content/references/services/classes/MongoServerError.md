# MongoServerError

An error coming from the mongo server

## Hierarchy

- [`MongoError`](MongoError.md)

  ↳ **`MongoServerError`**

## Indexable

▪ [key: `string`]: `any`

## Constructors

### constructor

**new MongoServerError**(`message`)

#### Parameters

| Name |
| :------ |
| `message` | [`ErrorDescription`](../interfaces/ErrorDescription.md) |

#### Overrides

[MongoError](MongoError.md).[constructor](MongoError.md#constructor)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4146

## Properties

### cause

 `Optional` **cause**: `Error`

#### Inherited from

[MongoError](MongoError.md).[cause](MongoError.md#cause)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3918

___

### code

 `Optional` **code**: `string` \| `number`

This is a number in MongoServerError and a string in MongoDriverError

#### Inherited from

[MongoError](MongoError.md).[code](MongoError.md#code)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3915

___

### codeName

 `Optional` **codeName**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4141

___

### connectionGeneration

 `Optional` **connectionGeneration**: `number`

#### Inherited from

[MongoError](MongoError.md).[connectionGeneration](MongoError.md#connectiongeneration)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3917

___

### errInfo

 `Optional` **errInfo**: [`Document`](../interfaces/Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4143

___

### message

 **message**: `string`

#### Inherited from

[MongoError](MongoError.md).[message](MongoError.md#message)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### ok

 `Optional` **ok**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4144

___

### stack

 `Optional` **stack**: `string`

#### Inherited from

[MongoError](MongoError.md).[stack](MongoError.md#stack)

#### Defined in

docs-util/node_modules/typescript/lib/lib.es5.d.ts:1069

___

### topologyVersion

 `Optional` **topologyVersion**: [`TopologyVersion`](../interfaces/TopologyVersion.md)

#### Inherited from

[MongoError](MongoError.md).[topologyVersion](MongoError.md#topologyversion)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3916

___

### writeConcernError

 `Optional` **writeConcernError**: [`Document`](../interfaces/Document.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4142

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

[MongoError](MongoError.md).[prepareStackTrace](MongoError.md#preparestacktrace)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

 `Static` **stackTraceLimit**: `number`

#### Inherited from

[MongoError](MongoError.md).[stackTraceLimit](MongoError.md#stacktracelimit)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:13

## Accessors

### errmsg

`get` **errmsg**(): `string`

Legacy name for server error responses

#### Returns

`string`

-`string`: (optional) 

#### Inherited from

MongoError.errmsg

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3922

___

### errorLabels

`get` **errorLabels**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Inherited from

MongoError.errorLabels

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3931

___

### name

`get` **name**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Overrides

MongoError.name

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4147

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

#### Inherited from

[MongoError](MongoError.md).[addErrorLabel](MongoError.md#adderrorlabel)

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

#### Inherited from

[MongoError](MongoError.md).[hasErrorLabel](MongoError.md#haserrorlabel)

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

[MongoError](MongoError.md).[captureStackTrace](MongoError.md#capturestacktrace)

#### Defined in

docs-util/node_modules/@types/node/globals.d.ts:4
