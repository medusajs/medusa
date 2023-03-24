# Class: MiddlewareService

Orchestrates dynamic middleware registered through the Medusa Middleware API

## Constructors

### constructor

• **new MiddlewareService**()

#### Defined in

[packages/medusa/src/services/middleware.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L22)

## Properties

### postAuthentication\_

• `Protected` `Readonly` **postAuthentication\_**: `middlewareType`[]

#### Defined in

[packages/medusa/src/services/middleware.ts:17](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L17)

___

### preAuthentication\_

• `Protected` `Readonly` **preAuthentication\_**: `middlewareType`[]

#### Defined in

[packages/medusa/src/services/middleware.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L18)

___

### preCartCreation\_

• `Protected` `Readonly` **preCartCreation\_**: `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Defined in

[packages/medusa/src/services/middleware.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L19)

___

### routers

• `Protected` `Readonly` **routers**: `Record`<`string`, `Router`[]\>

#### Defined in

[packages/medusa/src/services/middleware.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L20)

## Methods

### addPostAuthentication

▸ **addPostAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called after authentication is completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `middlewareHandlerType` | the middleware function. Should return a   middleware function. |
| `options` | `Record`<`string`, `unknown`\> | the arguments that will be passed to the   middleware |

#### Returns

`void`

void

#### Defined in

[packages/medusa/src/services/middleware.ts:60](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L60)

___

### addPreAuthentication

▸ **addPreAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called before authentication is completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `middlewareHandlerType` | the middleware function. Should return a   middleware function. |
| `options` | `Record`<`string`, `unknown`\> | the arguments that will be passed to the   middleware |

#### Returns

`void`

void

#### Defined in

[packages/medusa/src/services/middleware.ts:79](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L79)

___

### addPreCartCreation

▸ **addPreCartCreation**(`middleware`): `void`

Adds a middleware function to be called before cart creation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | the middleware function. Should return a   middleware function. |

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/middleware.ts:96](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L96)

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

[packages/medusa/src/services/middleware.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L29)

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

[packages/medusa/src/services/middleware.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L34)

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

[packages/medusa/src/services/middleware.ts:106](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L106)

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

[packages/medusa/src/services/middleware.ts:117](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L117)

___

### usePreCartCreation

▸ **usePreCartCreation**(): `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Returns

`RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Defined in

[packages/medusa/src/services/middleware.ts:123](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L123)

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

[packages/medusa/src/services/middleware.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/middleware.ts#L43)
