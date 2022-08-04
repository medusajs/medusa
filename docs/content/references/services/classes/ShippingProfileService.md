# Class: ShippingProfileService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ShippingProfileService`**

## Constructors

### constructor

• **new ShippingProfileService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/shipping-profile.js:12](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L12)

## Methods

### addProduct

▸ **addProduct**(`profileId`, `productId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` |  |
| `productId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:343](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L343)

___

### addShippingOption

▸ **addShippingOption**(`profileId`, `optionId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` |  |
| `optionId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:361](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L361)

___

### create

▸ **create**(`profile`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | `ShippingProfile` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:235](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L235)

___

### createDefault

▸ **createDefault**(): `Promise`<`ShippingProfile`\>

#### Returns

`Promise`<`ShippingProfile`\>

#### Defined in

[services/shipping-profile.js:167](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L167)

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

#### Returns

`Promise`<`ShippingProfile`\>

#### Defined in

[services/shipping-profile.js:209](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L209)

___

### decorate

▸ **decorate**(`profile`, `fields`, `expandFields?`): `Profile`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `profile` | `Profile` | `undefined` |  |
| `fields` | `string`[] | `undefined` |  |
| `expandFields` | `string`[] | `[]` |  |

#### Returns

`Profile`

#### Defined in

[services/shipping-profile.js:379](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L379)

___

### delete

▸ **delete**(`profileId`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:317](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L317)

___

### fetchCartOptions

▸ **fetchCartOptions**(`cart`): `Promise`<[`ShippingOption`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |

#### Returns

`Promise`<[`ShippingOption`]\>

#### Defined in

[services/shipping-profile.js:425](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L425)

___

### fetchOptionsByProductIds

▸ **fetchOptionsByProductIds**(`productIds`, `filter`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `any` |
| `filter` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[services/shipping-profile.js:73](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L73)

___

### getProfilesInCart\_

▸ **getProfilesInCart_**(`cart`): [`string`]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |

#### Returns

[`string`]

#### Defined in

[services/shipping-profile.js:406](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L406)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:64](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L64)

___

### retrieve

▸ **retrieve**(`profileId`, `options?`): `Promise`<`Product`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` |  |
| `options` | `any` |  |

#### Returns

`Promise`<`Product`\>

#### Defined in

[services/shipping-profile.js:121](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L121)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:151](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L151)

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `any`

#### Returns

`any`

#### Defined in

[services/shipping-profile.js:192](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L192)

___

### update

▸ **update**(`profileId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-profile.js:263](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L263)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ShippingProfileService`](ShippingProfileService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[services/shipping-profile.js:41](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/shipping-profile.js#L41)
