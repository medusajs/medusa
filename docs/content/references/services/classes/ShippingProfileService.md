# Class: ShippingProfileService

Provides layer to manipulate profiles.

**`Implements`**

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

[packages/medusa/src/services/shipping-profile.js:12](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L12)

## Methods

### addProduct

▸ **addProduct**(`profileId`, `productId`): `Promise`<`any`\>

Adds a product to a profile. The method is idempotent, so multiple calls
with the same product variant will have the same result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to add the product to. |
| `productId` | `string` | the product to add. |

#### Returns

`Promise`<`any`\>

the result of update

#### Defined in

[packages/medusa/src/services/shipping-profile.js:343](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L343)

___

### addShippingOption

▸ **addShippingOption**(`profileId`, `optionId`): `Promise`<`any`\>

Adds a shipping option to the profile. The shipping option can be used to
fulfill the products in the products field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the profile to apply the shipping option to |
| `optionId` | `string` | the option to add to the profile |

#### Returns

`Promise`<`any`\>

the result of the model update operation

#### Defined in

[packages/medusa/src/services/shipping-profile.js:361](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L361)

___

### create

▸ **create**(`profile`): `Promise`<`any`\>

Creates a new shipping profile.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profile` | `ShippingProfile` | the shipping profile to create from |

#### Returns

`Promise`<`any`\>

the result of the create operation

#### Defined in

[packages/medusa/src/services/shipping-profile.js:235](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L235)

___

### createDefault

▸ **createDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, if this does not already exist.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.js:167](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L167)

___

### createGiftCardDefault

▸ **createGiftCardDefault**(): `Promise`<`ShippingProfile`\>

Creates a default shipping profile, for gift cards if unless it already
exists.

#### Returns

`Promise`<`ShippingProfile`\>

the shipping profile

#### Defined in

[packages/medusa/src/services/shipping-profile.js:209](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L209)

___

### decorate

▸ **decorate**(`profile`, `fields`, `expandFields?`): `Profile`

Decorates a profile.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `profile` | `Profile` | `undefined` | the profile to decorate. |
| `fields` | `string`[] | `undefined` | the fields to include. |
| `expandFields` | `string`[] | `[]` | fields to expand. |

#### Returns

`Profile`

return the decorated profile.

#### Defined in

[packages/medusa/src/services/shipping-profile.js:379](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L379)

___

### delete

▸ **delete**(`profileId`): `Promise`<`any`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`any`\>

the result of the delete operation.

#### Defined in

[packages/medusa/src/services/shipping-profile.js:317](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L317)

___

### fetchCartOptions

▸ **fetchCartOptions**(`cart`): `Promise`<[`ShippingOption`]\>

Finds all the shipping profiles that cover the products in a cart, and
validates all options that are available for the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart object to find shipping options for |

#### Returns

`Promise`<[`ShippingOption`]\>

a list of the available shipping options

#### Defined in

[packages/medusa/src/services/shipping-profile.js:425](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L425)

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

[packages/medusa/src/services/shipping-profile.js:73](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L73)

___

### getProfilesInCart\_

▸ **getProfilesInCart_**(`cart`): [`string`]

Returns a list of all the productIds in the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to extract products from |

#### Returns

[`string`]

a list of product ids

#### Defined in

[packages/medusa/src/services/shipping-profile.js:406](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L406)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config object for find |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/shipping-profile.js:64](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L64)

___

### retrieve

▸ **retrieve**(`profileId`, `options?`): `Promise`<`Product`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile to get. |
| `options` | `any` | options opf the query. |

#### Returns

`Promise`<`Product`\>

the profile document.

#### Defined in

[packages/medusa/src/services/shipping-profile.js:121](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L121)

___

### retrieveDefault

▸ **retrieveDefault**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/medusa/src/services/shipping-profile.js:151](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L151)

___

### retrieveGiftCardDefault

▸ **retrieveGiftCardDefault**(): `any`

Retrieves the default gift card profile

#### Returns

`any`

the shipping profile for gift cards

#### Defined in

[packages/medusa/src/services/shipping-profile.js:192](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L192)

___

### update

▸ **update**(`profileId`, `update`): `Promise`<`any`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `profileId` | `string` | the id of the profile. Must be a string that   can be casted to an ObjectId |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/shipping-profile.js:263](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L263)

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

[packages/medusa/src/services/shipping-profile.js:41](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/shipping-profile.js#L41)
