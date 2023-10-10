---
displayed_sidebar: jsClientSidebar
---

# Class: MiddlewareService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).MiddlewareService

Orchestrates dynamic middleware registered through the Medusa Middleware API

## Properties

### postAuthentication\_

• `Protected` `Readonly` **postAuthentication\_**: [`middlewareType`](../modules/internal-8.md#middlewaretype)[]

#### Defined in

packages/medusa/dist/services/middleware.d.ts:11

___

### preAuthentication\_

• `Protected` `Readonly` **preAuthentication\_**: [`middlewareType`](../modules/internal-8.md#middlewaretype)[]

#### Defined in

packages/medusa/dist/services/middleware.d.ts:12

___

### preCartCreation\_

• `Protected` `Readonly` **preCartCreation\_**: `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, [`Record`](../modules/internal.md#record)<`string`, `any`\>\>[]

#### Defined in

packages/medusa/dist/services/middleware.d.ts:13

___

### routers

• `Protected` `Readonly` **routers**: [`Record`](../modules/internal.md#record)<`string`, `Router`[]\>

#### Defined in

packages/medusa/dist/services/middleware.d.ts:14

## Methods

### addPostAuthentication

▸ **addPostAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called after authentication is completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`middlewareHandlerType`](../modules/internal-8.md#middlewarehandlertype) | the middleware function. Should return a middleware function. |
| `options` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the arguments that will be passed to the middleware |

#### Returns

`void`

void

#### Defined in

packages/medusa/dist/services/middleware.d.ts:32

___

### addPreAuthentication

▸ **addPreAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called before authentication is completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | [`middlewareHandlerType`](../modules/internal-8.md#middlewarehandlertype) | the middleware function. Should return a middleware function. |
| `options` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the arguments that will be passed to the middleware |

#### Returns

`void`

void

#### Defined in

packages/medusa/dist/services/middleware.d.ts:41

___

### addPreCartCreation

▸ **addPreCartCreation**(`middleware`): `void`

Adds a middleware function to be called before cart creation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, [`Record`](../modules/internal.md#record)<`string`, `any`\>\> | the middleware function. Should return a middleware function. |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/middleware.d.ts:48

___

### addRouter

▸ **addRouter**(`path`, `router`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `router` | `Router` |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/middleware.d.ts:16

___

### getRouters

▸ **getRouters**(`path`): `Router`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Router`[]

#### Defined in

packages/medusa/dist/services/middleware.d.ts:17

___

### usePostAuthentication

▸ **usePostAuthentication**(`app`): `void`

Adds post authentication middleware to an express app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `Router` | the express app to add the middleware to |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/middleware.d.ts:54

___

### usePreAuthentication

▸ **usePreAuthentication**(`app`): `void`

Adds pre authentication middleware to an express app.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `Router` | the express app to add the middleware to |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/middleware.d.ts:60

___

### usePreCartCreation

▸ **usePreCartCreation**(): `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, [`Record`](../modules/internal.md#record)<`string`, `any`\>\>[]

#### Returns

`RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, [`Record`](../modules/internal.md#record)<`string`, `any`\>\>[]

#### Defined in

packages/medusa/dist/services/middleware.d.ts:61

___

### validateMiddleware\_

▸ **validateMiddleware_**(`fn`): `void`

Validates a middleware function, throws if fn is not of type function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `unknown` | the middleware function to validate. |

#### Returns

`void`

nothing if the middleware is a function

#### Defined in

packages/medusa/dist/services/middleware.d.ts:23
