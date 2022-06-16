# Class: MiddlewareService

Orchestrates dynamic middleware registered through the Medusa Middleware API

## Constructors

### constructor

• **new MiddlewareService**(`container`)

#### Parameters

| Name        | Type  |
| :---------- | :---- |
| `container` | `any` |

#### Defined in

[services/middleware.js:7](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L7)

## Properties

### postAuthentication\_

• **postAuthentication\_**: `any`[]

#### Defined in

[services/middleware.js:8](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L8)

---

### preAuthentication\_

• **preAuthentication\_**: `any`[]

#### Defined in

[services/middleware.js:9](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L9)

---

### preCartCreation\_

• **preCartCreation\_**: `any`[]

#### Defined in

[services/middleware.js:10](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L10)

---

### routers

• **routers**: `Object`

#### Defined in

[services/middleware.js:11](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L11)

## Methods

### addPostAuthentication

▸ **addPostAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called after authentication is completed.

#### Parameters

| Name         | Type       | Description                                                   |
| :----------- | :--------- | :------------------------------------------------------------ |
| `middleware` | `Function` | the middleware function. Should return a middleware function. |
| `options`    | `any`      | the arguments that will be passed to the middleware           |

#### Returns

`void`

#### Defined in

[services/middleware.js:45](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L45)

---

### addPreAuthentication

▸ **addPreAuthentication**(`middleware`, `options`): `void`

Adds a middleware function to be called before authentication is completed.

#### Parameters

| Name         | Type       | Description                                                   |
| :----------- | :--------- | :------------------------------------------------------------ |
| `middleware` | `Function` | the middleware function. Should return a middleware function. |
| `options`    | `any`      | the arguments that will be passed to the middleware           |

#### Returns

`void`

#### Defined in

[services/middleware.js:61](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L61)

---

### addPreCartCreation

▸ **addPreCartCreation**(`middleware`): `void`

Adds a middleware function to be called before cart creation

#### Parameters

| Name         | Type       | Description                                                   |
| :----------- | :--------- | :------------------------------------------------------------ |
| `middleware` | `Function` | the middleware function. Should return a middleware function. |

#### Returns

`void`

#### Defined in

[services/middleware.js:75](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L75)

---

### addRouter

▸ **addRouter**(`path`, `router`): `void`

#### Parameters

| Name     | Type  |
| :------- | :---- |
| `path`   | `any` |
| `router` | `any` |

#### Returns

`void`

#### Defined in

[services/middleware.js:14](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L14)

---

### getRouters

▸ **getRouters**(`path`): `any`

#### Parameters

| Name   | Type  |
| :----- | :---- |
| `path` | `any` |

#### Returns

`any`

#### Defined in

[services/middleware.js:19](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L19)

---

### usePostAuthentication

▸ **usePostAuthentication**(`app`): `void`

Adds post authentication middleware to an express app.

#### Parameters

| Name  | Type         | Description                              |
| :---- | :----------- | :--------------------------------------- |
| `app` | `ExpressApp` | the express app to add the middleware to |

#### Returns

`void`

#### Defined in

[services/middleware.js:85](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L85)

---

### usePreAuthentication

▸ **usePreAuthentication**(`app`): `void`

Adds pre authentication middleware to an express app.

#### Parameters

| Name  | Type         | Description                              |
| :---- | :----------- | :--------------------------------------- |
| `app` | `ExpressApp` | the express app to add the middleware to |

#### Returns

`void`

#### Defined in

[services/middleware.js:96](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L96)

---

### usePreCartCreation

▸ **usePreCartCreation**(): `any`[]

#### Returns

`any`[]

#### Defined in

[services/middleware.js:102](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L102)

---

### validateMiddleware\_

▸ **validateMiddleware\_**(`fn`): `void`

Validates a middleware function, throws if fn is not of type function.

#### Parameters

| Name | Type       | Description                          |
| :--- | :--------- | :----------------------------------- |
| `fn` | `Function` | the middleware function to validate. |

#### Returns

`void`

#### Defined in

[services/middleware.js:28](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/middleware.js#L28)
