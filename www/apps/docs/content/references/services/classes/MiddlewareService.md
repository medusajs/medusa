# MiddlewareService

Orchestrates dynamic middleware registered through the Medusa Middleware API

## Constructors

### constructor

**new MiddlewareService**()

#### Defined in

[packages/medusa/src/services/middleware.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L22)

## Properties

### postAuthentication\_

 `Protected` `Readonly` **postAuthentication\_**: [`middlewareType`](../index.md#middlewaretype)[]

#### Defined in

[packages/medusa/src/services/middleware.ts:17](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L17)

___

### preAuthentication\_

 `Protected` `Readonly` **preAuthentication\_**: [`middlewareType`](../index.md#middlewaretype)[]

#### Defined in

[packages/medusa/src/services/middleware.ts:18](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L18)

___

### preCartCreation\_

 `Protected` `Readonly` **preCartCreation\_**: [`RequestHandler`](../interfaces/RequestHandler.md)<[`ParamsDictionary`](../interfaces/ParamsDictionary.md), `any`, `any`, [`ParsedQs`](../interfaces/ParsedQs.md), Record<`string`, `any`\>\>[]

#### Defined in

[packages/medusa/src/services/middleware.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L19)

___

### routers

 `Protected` `Readonly` **routers**: Record<`string`, [`Router`](../index.md#router)[]\>

#### Defined in

[packages/medusa/src/services/middleware.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L20)

## Methods

### addPostAuthentication

**addPostAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called after authentication is completed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `middleware` | [`middlewareHandlerType`](../index.md#middlewarehandlertype) | the middleware function. Should return a middleware function. |
| `options` | Record<`string`, `unknown`\> | the arguments that will be passed to the middleware |

#### Returns

`void`

-`void`: (optional) void

#### Defined in

[packages/medusa/src/services/middleware.ts:60](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L60)

___

### addPreAuthentication

**addPreAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called before authentication is completed.

#### Parameters

| Name | Description |
| :------ | :------ |
| `middleware` | [`middlewareHandlerType`](../index.md#middlewarehandlertype) | the middleware function. Should return a middleware function. |
| `options` | Record<`string`, `unknown`\> | the arguments that will be passed to the middleware |

#### Returns

`void`

-`void`: (optional) void

#### Defined in

[packages/medusa/src/services/middleware.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L79)

___

### addPreCartCreation

**addPreCartCreation**(`middleware`): `void`

Adds a middleware function to be called before cart creation

#### Parameters

| Name | Description |
| :------ | :------ |
| `middleware` | [`RequestHandler`](../interfaces/RequestHandler.md)<[`ParamsDictionary`](../interfaces/ParamsDictionary.md), `any`, `any`, [`ParsedQs`](../interfaces/ParsedQs.md), Record<`string`, `any`\>\> | the middleware function. Should return a middleware function. |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/middleware.ts:96](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L96)

___

### addRouter

**addRouter**(`path`, `router`): `void`

#### Parameters

| Name |
| :------ |
| `path` | `string` |
| `router` | [`Router`](../index.md#router) |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/middleware.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L29)

___

### getRouters

**getRouters**(`path`): [`Router`](../index.md#router)[]

#### Parameters

| Name |
| :------ |
| `path` | `string` |

#### Returns

[`Router`](../index.md#router)[]

-`Router[]`: 
	-`Router`: 

#### Defined in

[packages/medusa/src/services/middleware.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L34)

___

### usePostAuthentication

**usePostAuthentication**(`app`): `void`

Adds post authentication middleware to an express app.

#### Parameters

| Name | Description |
| :------ | :------ |
| `app` | [`Router`](../index.md#router) | the express app to add the middleware to |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/middleware.ts:106](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L106)

___

### usePreAuthentication

**usePreAuthentication**(`app`): `void`

Adds pre authentication middleware to an express app.

#### Parameters

| Name | Description |
| :------ | :------ |
| `app` | [`Router`](../index.md#router) | the express app to add the middleware to |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/middleware.ts:117](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L117)

___

### usePreCartCreation

**usePreCartCreation**(): [`RequestHandler`](../interfaces/RequestHandler.md)<[`ParamsDictionary`](../interfaces/ParamsDictionary.md), `any`, `any`, [`ParsedQs`](../interfaces/ParsedQs.md), Record<`string`, `any`\>\>[]

#### Returns

[`RequestHandler`](../interfaces/RequestHandler.md)<[`ParamsDictionary`](../interfaces/ParamsDictionary.md), `any`, `any`, [`ParsedQs`](../interfaces/ParsedQs.md), Record<`string`, `any`\>\>[]

-`RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any\>\>[]`: 
	-`RequestHandler`: 
		-`ParamsDictionary`: 
		-`any`: (optional) 
		-`any`: (optional) 
		-`ParsedQs`: 
		-`Record`: 

#### Defined in

[packages/medusa/src/services/middleware.ts:123](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L123)

___

### validateMiddleware\_

**validateMiddleware_**(`fn`): `void`

Validates a middleware function, throws if fn is not of type function.

#### Parameters

| Name | Description |
| :------ | :------ |
| `fn` | `unknown` | the middleware function to validate. |

#### Returns

`void`

-`void`: (optional) nothing if the middleware is a function

#### Defined in

[packages/medusa/src/services/middleware.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/middleware.ts#L43)
