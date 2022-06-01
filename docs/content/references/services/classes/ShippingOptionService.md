# Class: ShippingOptionService

Provides layer to manipulate profiles.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ShippingOptionService`**

## Constructors

### constructor

• **new ShippingOptionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/shipping-option.js:9](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L9)

## Methods

### addRequirement

▸ **addRequirement**(`optionId`, `requirement`): `Promise`<`any`\>

Adds a requirement to a shipping option. Only 1 requirement of each type
is allowed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option to add the requirement to. |
| `requirement` | `ShippingRequirement` | the requirement for the option. |

#### Returns

`Promise`<`any`\>

the result of update

#### Defined in

[services/shipping-option.js:594](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L594)

___

### create

▸ **create**(`data`): `Promise`<`ShippingOption`\>

Creates a new shipping option. Used both for outbound and inbound shipping
options. The difference is registered by the `is_return` field which
defaults to false.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ShippingOption` | the data to create shipping options |

#### Returns

`Promise`<`ShippingOption`\>

the result of the create operation

#### Defined in

[services/shipping-option.js:350](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L350)

___

### createShippingMethod

▸ **createShippingMethod**(`optionId`, `data`, `config`): `ShippingMethod`

Creates a shipping method for a given cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option to use for the method. |
| `data` | `any` | the optional provider data to use. |
| `config` | `any` | the cart to create the shipping method for. |

#### Returns

`ShippingMethod`

the resulting shipping method.

#### Defined in

[services/shipping-option.js:231](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L231)

___

### decorate

▸ **decorate**(`optionId`, `fields?`, `expandFields?`): `ShippingOption`

Decorates a shipping option.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `optionId` | `ShippingOption` | `undefined` | the shipping option to decorate using optionId. |
| `fields` | `string`[] | `[]` | the fields to include. |
| `expandFields` | `string`[] | `[]` | fields to expand. |

#### Returns

`ShippingOption`

the decorated ShippingOption.

#### Defined in

[services/shipping-option.js:645](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L645)

___

### delete

▸ **delete**(`optionId`): `Promise`<`any`\>

Deletes a profile with a given profile id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the profile to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`any`\>

the result of the delete operation.

#### Defined in

[services/shipping-option.js:566](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L566)

___

### deleteShippingMethods

▸ **deleteShippingMethods**(`shippingMethods`): `Promise`<`any`\>

Removes a given shipping method

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | `any` | the shipping method to remove |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/shipping-option.js:213](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L213)

___

### getPrice\_

▸ **getPrice_**(`option`, `data`, `cart`): `Promise`<`number`\>

Returns the amount to be paid for a shipping method. Will ask the
fulfillment provider to calculate the price if the shipping option has the
price type "calculated".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `ShippingOption` | the shipping option to retrieve the price   for. |
| `data` | `ShippingData` | the shipping data to retrieve the price. |
| `cart` | `any` | the context in which the price should be   retrieved. |

#### Returns

`Promise`<`number`\>

the price of the shipping option.

#### Defined in

[services/shipping-option.js:697](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L697)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | config object |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/shipping-option.js:123](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L123)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | config object |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/shipping-option.js:135](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L135)

___

### removeRequirement

▸ **removeRequirement**(`requirementId`): `Promise`<`any`\>

Removes a requirement from a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirementId` | `string` | the id of the requirement to remove |

#### Returns

`Promise`<`any`\>

the result of update

#### Defined in

[services/shipping-option.js:620](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L620)

___

### retrieve

▸ **retrieve**(`optionId`, `options?`): `Promise`<`Product`\>

Gets a profile by id.
Throws in case of DB Error and if profile was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the profile to get. |
| `options` | `any` | the options to get a profile |

#### Returns

`Promise`<`Product`\>

the profile document.

#### Defined in

[services/shipping-option.js:149](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L149)

___

### setMetadata\_

▸ **setMetadata_**(`option`, `metadata`): `Promise`<`any`\>

Dedicated method to set metadata for a shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `any` | the option to set metadata for. |
| `metadata` | `any` | object for metadata field |

#### Returns

`Promise`<`any`\>

resolves to the updated result.

#### Defined in

[services/shipping-option.js:664](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L664)

___

### update

▸ **update**(`optionId`, `update`): `Promise`<`any`\>

Updates a profile. Metadata updates and product updates should use
dedicated methods, e.g. `setMetadata`, etc. The function
will throw errors if metadata or product updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the id of the option. Must be a string that   can be casted to an ObjectId |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/shipping-option.js:464](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L464)

___

### updateShippingMethod

▸ **updateShippingMethod**(`id`, `update`): `Promise`<`ShippingMethod`\>

Updates a shipping method's associations. Useful when a cart is completed
and its methods should be copied to an order/swap entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the shipping method to update |
| `update` | `any` | the values to update the method with |

#### Returns

`Promise`<`ShippingMethod`\>

the resulting shipping method

#### Defined in

[services/shipping-option.js:184](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L184)

___

### validateCartOption

▸ **validateCartOption**(`option`, `cart`): `ShippingOption`

Checks if a given option id is a valid option for a cart. If it is the
option is returned with the correct price. Throws when region_ids do not
match, or when the shipping option requirements are not satisfied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | `any` | the option object to check |
| `cart` | `Cart` | the cart object to check against |

#### Returns

`ShippingOption`

the validated shipping option

#### Defined in

[services/shipping-option.js:309](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L309)

___

### validatePriceType\_

▸ **validatePriceType_**(`priceType`, `option`): `Promise`<`ShippingOptionPrice`\>

Validates a shipping option price

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceType` | `ShippingOptionPrice` | the price to validate |
| `option` | `ShippingOption` | the option to validate against |

#### Returns

`Promise`<`ShippingOptionPrice`\>

the validated price

#### Defined in

[services/shipping-option.js:431](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L431)

___

### validateRequirement\_

▸ **validateRequirement_**(`requirement`, `optionId`): `ShippingRequirement`

Validates a requirement

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requirement` | `ShippingRequirement` | the requirement to validate |
| `optionId` | `string` | the id to validate the requirement |

#### Returns

`ShippingRequirement`

a validated shipping requirement

#### Defined in

[services/shipping-option.js:63](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L63)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ShippingOptionService`](ShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/shipping-option.js:38](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/shipping-option.js#L38)
