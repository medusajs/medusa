# Class: MiddlewareService

## Constructors

### constructor

• **new MiddlewareService**()

#### Defined in

[services/middleware.ts:22](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L22)

## Properties

### postAuthentication\_

• `Protected` `Readonly` **postAuthentication\_**: `middlewareType`[]

#### Defined in

[services/middleware.ts:17](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L17)

___

### preAuthentication\_

• `Protected` `Readonly` **preAuthentication\_**: `middlewareType`[]

#### Defined in

[services/middleware.ts:18](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L18)

___

### preCartCreation\_

• `Protected` `Readonly` **preCartCreation\_**: `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Defined in

[services/middleware.ts:19](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L19)

___

### routers

• `Protected` `Readonly` **routers**: `Record`<`string`, `Router`[]\>

#### Defined in

[services/middleware.ts:20](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L20)

## Methods

### addPostAuthentication

▸ **addPostAuthentication**(`middleware`, `options`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `middlewareHandlerType` |  |
| `options` | `Record`<`string`, `unknown`\> |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:60](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L60)

___

### addPreAuthentication

▸ **addPreAuthentication**(`middleware`, `options`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `middlewareHandlerType` |  |
| `options` | `Record`<`string`, `unknown`\> |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:79](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L79)

___

### addPreCartCreation

▸ **addPreCartCreation**(`middleware`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:96](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L96)

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

[services/middleware.ts:29](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L29)

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

[services/middleware.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L34)

___

### usePostAuthentication

▸ **usePostAuthentication**(`app`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `Router` |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:106](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L106)

___

### usePreAuthentication

▸ **usePreAuthentication**(`app`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `Router` |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:117](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L117)

___

### usePreCartCreation

▸ **usePreCartCreation**(): `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Returns

`RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>[]

#### Defined in

[services/middleware.ts:123](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L123)

___

### validateMiddleware\_

▸ **validateMiddleware_**(`fn`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `unknown` |  |

#### Returns

`void`

#### Defined in

[services/middleware.ts:43](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/middleware.ts#L43)
