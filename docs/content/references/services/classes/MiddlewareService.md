# Class: MiddlewareService

## Constructors

### constructor

• **new MiddlewareService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `any` |

#### Defined in

[services/middleware.js:7](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L7)

## Properties

### postAuthentication\_

• **postAuthentication\_**: `any`[]

#### Defined in

[services/middleware.js:8](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L8)

___

### preAuthentication\_

• **preAuthentication\_**: `any`[]

#### Defined in

[services/middleware.js:9](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L9)

___

### preCartCreation\_

• **preCartCreation\_**: `any`[]

#### Defined in

[services/middleware.js:10](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L10)

___

### routers

• **routers**: `Object`

#### Defined in

[services/middleware.js:11](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L11)

## Methods

### addPostAuthentication

▸ **addPostAuthentication**(`middleware`, `options`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `Function` |  |
| `options` | `any` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L45)

___

### addPreAuthentication

▸ **addPreAuthentication**(`middleware`, `options`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `Function` |  |
| `options` | `any` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:61](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L61)

___

### addPreCartCreation

▸ **addPreCartCreation**(`middleware`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `middleware` | `Function` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:75](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L75)

___

### addRouter

▸ **addRouter**(`path`, `router`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `any` |
| `router` | `any` |

#### Returns

`void`

#### Defined in

[services/middleware.js:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L14)

___

### getRouters

▸ **getRouters**(`path`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `any` |

#### Returns

`any`

#### Defined in

[services/middleware.js:19](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L19)

___

### usePostAuthentication

▸ **usePostAuthentication**(`app`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `ExpressApp` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:85](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L85)

___

### usePreAuthentication

▸ **usePreAuthentication**(`app`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `app` | `ExpressApp` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:96](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L96)

___

### usePreCartCreation

▸ **usePreCartCreation**(): `any`[]

#### Returns

`any`[]

#### Defined in

[services/middleware.js:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L102)

___

### validateMiddleware\_

▸ **validateMiddleware_**(`fn`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` |  |

#### Returns

`void`

#### Defined in

[services/middleware.js:28](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/middleware.js#L28)
