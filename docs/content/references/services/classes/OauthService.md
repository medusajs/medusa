# Class: OauthService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`OauthService`**

## Constructors

### constructor

• **new OauthService**(`cradle`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cradle` | `any` |

#### Overrides

OauthService.constructor

#### Defined in

[services/oauth.js:10](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L10)

## Properties

### container\_

• **container\_**: `any`

#### Defined in

[services/oauth.js:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L15)

___

### eventBus\_

• **eventBus\_**: `any`

#### Defined in

[services/oauth.js:17](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L17)

___

### manager

• **manager**: `any`

#### Defined in

[services/oauth.js:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L14)

___

### oauthRepository\_

• **oauthRepository\_**: `any`

#### Defined in

[services/oauth.js:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L16)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TOKEN_GENERATED` | `string` |
| `TOKEN_REFRESHED` | `string` |

#### Defined in

[services/oauth.js:5](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L5)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/oauth.js:32](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L32)

___

### generateToken

▸ **generateToken**(`appName`, `code`, `state`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `any` |
| `code` | `any` |
| `state` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/oauth.js:66](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L66)

___

### list

▸ **list**(`selector`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `any` |

#### Returns

`any`

#### Defined in

[services/oauth.js:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L27)

___

### refreshToken

▸ **refreshToken**(`appName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/oauth.js:96](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L96)

___

### registerOauthApp

▸ **registerOauthApp**(`appDetails`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appDetails` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/oauth.js:56](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L56)

___

### retrieveByName

▸ **retrieveByName**(`appName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `any` |

#### Returns

`any`

#### Defined in

[services/oauth.js:20](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L20)

___

### update

▸ **update**(`id`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `update` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/oauth.js:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/oauth.js#L45)
