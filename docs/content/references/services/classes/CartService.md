# Class: CartService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`CartService`**

## Constructors

### constructor

• **new CartService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

BaseService.constructor

#### Defined in

[cart.ts:103](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L103)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[cart.ts:83](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L83)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[cart.ts:82](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L82)

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[cart.ts:99](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L99)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[cart.ts:92](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L92)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[cart.ts:94](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L94)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[cart.ts:86](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L86)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[cart.ts:95](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L95)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[cart.ts:98](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L98)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[cart.ts:101](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L101)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[cart.ts:85](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L85)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[cart.ts:90](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L90)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[cart.ts:80](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L80)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[cart.ts:91](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L91)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[cart.ts:84](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L84)

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[cart.ts:100](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L100)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[cart.ts:88](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L88)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[cart.ts:87](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L87)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[cart.ts:89](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L89)

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[cart.ts:81](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L81)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[cart.ts:93](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L93)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[cart.ts:96](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L96)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[cart.ts:97](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L97)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `CUSTOMER_UPDATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[cart.ts:74](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L74)

## Methods

### addLineItem

▸ **addLineItem**(`cartId`, `lineItem`): `Promise`<`Cart`\>

Adds a line item to the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will add to |
| `lineItem` | `LineItem` | the line item to add. |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[cart.ts:565](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L565)

___

### addShippingMethod

▸ **addShippingMethod**(`cartId`, `optionId`, `data?`): `Promise`<`Cart`\>

Adds the shipping method to the list of shipping methods associated with
the cart. Shipping Methods are the ways that an order is shipped, whereas a
Shipping Option is a possible way to ship an order. Shipping Methods may
also have additional details in the data field such as an id for a package
shop.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to add shipping method to |
| `optionId` | `string` | id of shipping option to add as valid method |
| `data` | `Record`<`string`, `unknown`\> | the fulmillment data for the method |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[cart.ts:1554](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1554)

___

### adjustFreeShipping\_

▸ **adjustFreeShipping_**(`cart`, `shouldAdd`): `Promise`<`void`\>

Ensures shipping total on cart is correct in regards to a potential free
shipping discount
If a free shipping is present, we set shipping methods price to 0
if a free shipping was present, we set shipping methods to original amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the the cart to adjust free shipping for |
| `shouldAdd` | `boolean` | flag to indicate, if we should add or remove |

#### Returns

`Promise`<`void`\>

void

#### Defined in

[cart.ts:717](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L717)

___

### applyDiscount

▸ **applyDiscount**(`cart`, `discountCode`): `Promise`<`void`\>

Updates the cart's discounts.
If discount besides free shipping is already applied, this
will be overwritten
Throws if discount regions does not include the cart region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `discountCode` | `string` | the discount code |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[cart.ts:1077](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1077)

___

### applyGiftCard\_

▸ `Protected` **applyGiftCard_**(`cart`, `code`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `code` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[cart.ts:1041](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1041)

___

### authorizePayment

▸ **authorizePayment**(`cartId`, `context?`): `Promise`<`Cart`\>

Authorizes a payment for a cart.
Will authorize with chosen payment provider. This will return
a payment object, that we will use to update our cart payment with.
Additionally, if the payment does not require more or fails, we will
set the payment on the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to authorize payment for |
| `context` | `Record`<`string`, `unknown`\> | object containing whatever is relevant for    authorizing the payment with the payment provider. As an example,    this could be IP address or similar for fraud handling. |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[cart.ts:1216](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1216)

___

### create

▸ **create**(`data`): `Promise`<`Cart`\>

Creates a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CartCreateProps` | the data to create the cart with |

#### Returns

`Promise`<`Cart`\>

the result of the create operation

#### Defined in

[cart.ts:360](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L360)

___

### createOrFetchUserFromEmail\_

▸ `Protected` **createOrFetchUserFromEmail_**(`email`): `Promise`<`Customer`\>

Creates or fetches a user based on an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email to use |

#### Returns

`Promise`<`Customer`\>

the resultign customer object

#### Defined in

[cart.ts:919](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L919)

___

### createTaxLines

▸ **createTaxLines**(`id`): `Promise`<`Cart`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[cart.ts:1947](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1947)

___

### decorateTotals\_

▸ `Protected` **decorateTotals_**(`cart`, `totalsToSelect`, `options?`): `Promise`<`Cart`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `totalsToSelect` | `TotalField`[] |
| `options` | `TotalsConfig` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[cart.ts:238](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L238)

___

### delete

▸ **delete**(`cartId`): `Promise`<`string`\>

Deletes a cart from the database. Completed carts cannot be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to delete |

#### Returns

`Promise`<`string`\>

the deleted cart or undefined if the cart was not found.

#### Defined in

[cart.ts:1862](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1862)

___

### deleteMetadata

▸ **deleteMetadata**(`cartId`, `key`): `Promise`<`Cart`\>

Dedicated method to delete metadata for a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the cart to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`Cart`\>

resolves to the updated result.

#### Defined in

[cart.ts:1998](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1998)

___

### deletePaymentSession

▸ **deletePaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Removes a payment session from the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whoose payment session    should be removed. |

#### Returns

`Promise`<`Cart`\>

the resulting cart.

#### Defined in

[cart.ts:1462](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1462)

___

### findCustomShippingOption

▸ **findCustomShippingOption**(`cartCustomShippingOptions`, `optionId`): `undefined` \| `CustomShippingOption`

Finds the cart's custom shipping options based on the passed option id.
throws if custom options is not empty and no shipping option corresponds to optionId

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartCustomShippingOptions` | `CustomShippingOption`[] | the cart's custom shipping options |
| `optionId` | `string` | id of the normal or custom shipping option to find in the cartCustomShippingOptions |

#### Returns

`undefined` \| `CustomShippingOption`

custom shipping option

#### Defined in

[cart.ts:1658](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1658)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Cart`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCartProps` | the query object for find |
| `config` | `FindConfig`<`Cart`\> | config object |

#### Returns

`Promise`<`Cart`[]\>

the result of the find operation

#### Defined in

[cart.ts:285](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L285)

___

### refreshAdjustments\_

▸ `Protected` **refreshAdjustments_**(`cart`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |

#### Returns

`Promise`<`void`\>

#### Defined in

[cart.ts:1974](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1974)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Refreshes a payment session on a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whoose payment session    should be removed. |

#### Returns

`Promise`<`Cart`\>

the resulting cart.

#### Defined in

[cart.ts:1510](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1510)

___

### removeDiscount

▸ **removeDiscount**(`cartId`, `discountCode`): `Promise`<`Cart`\>

Removes a discount based on a discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `discountCode` | `string` | the discount code to remove |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[cart.ts:1137](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1137)

___

### removeLineItem

▸ **removeLineItem**(`cartId`, `lineItemId`): `Promise`<`Cart`\>

Removes a line item from the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will remove from |
| `lineItemId` | `string` | the line item to remove. |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[cart.ts:469](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L469)

___

### retrieve

▸ **retrieve**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`Cart`\>

Gets a cart by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to get. |
| `options` | `FindConfig`<`Cart`\> | the options to get a cart |
| `totalsConfig` | `TotalsConfig` | configuration for retrieval of totals |

#### Returns

`Promise`<`Cart`\>

the cart document.

#### Defined in

[cart.ts:308](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L308)

___

### setMetadata

▸ **setMetadata**(`cartId`, `key`, `value`): `Promise`<`Cart`\>

Dedicated method to set metadata for a cart.
To ensure that plugins does not overwrite each
others metadata fields, setMetadata is provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the cart to apply metadata to. |
| `key` | `string` | key for metadata field |
| `value` | `string` \| `number` | value for metadata field. |

#### Returns

`Promise`<`Cart`\>

resolves to the updated result.

#### Defined in

[cart.ts:1905](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1905)

___

### setPaymentSession

▸ **setPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Sets a payment method for a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to add payment method to |
| `providerId` | `string` | the id of the provider to be set to the cart |

#### Returns

`Promise`<`Cart`\>

result of update operation

#### Defined in

[cart.ts:1282](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1282)

___

### setPaymentSessions

▸ **setPaymentSessions**(`cartOrCartId`): `Promise`<`Cart`\>

Creates, updates and sets payment sessions associated with the cart. The
first time the method is called payment sessions will be created for each
provider. Additional calls will ensure that payment sessions have correct
amounts, currencies, etc. as well as make sure to filter payment sessions
that are not available for the cart's region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrCartId` | `string` \| `Cart` | the id of the cart to set payment session for |

#### Returns

`Promise`<`Cart`\>

the result of the update operation.

#### Defined in

[cart.ts:1355](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1355)

___

### setRegion\_

▸ `Protected` **setRegion_**(`cart`, `regionId`, `countryCode`): `Promise`<`void`\>

Set's the region of a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to set region on |
| `regionId` | `string` | the id of the region to set the region to |
| `countryCode` | ``null`` \| `string` | the country code to set the country to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[cart.ts:1735](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1735)

___

### transformQueryForTotals\_

▸ `Protected` **transformQueryForTotals_**(`config`): `FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[]  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `FindConfig`<`Cart`\> |

#### Returns

`FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[]  }

#### Defined in

[cart.ts:188](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L188)

___

### update

▸ **update**(`cartId`, `data`): `Promise`<`Cart`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |
| `data` | `CartUpdateProps` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[cart.ts:749](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L749)

___

### updateBillingAddress\_

▸ `Protected` **updateBillingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `addressOrId` | `string` \| `Partial`<`Address`\> | the value to set the billing address to |
| `addrRepo` | `AddressRepository` | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[cart.ts:952](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L952)

___

### updateCustomerId\_

▸ `Protected` **updateCustomerId_**(`cart`, `customerId`): `Promise`<`void`\>

Sets the customer id of a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to add email to |
| `customerId` | `string` | the customer to add to cart |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[cart.ts:901](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L901)

___

### updateLineItem

▸ **updateLineItem**(`cartId`, `lineItemId`, `lineItemUpdate`): `Promise`<`Cart`\>

Updates a cart's existing line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to update |
| `lineItemId` | `string` | the id of the line item to update. |
| `lineItemUpdate` | `LineItemUpdate` | the line item to update. Must include an id field. |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[cart.ts:652](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L652)

___

### updatePaymentSession

▸ **updatePaymentSession**(`cartId`, `update`): `Promise`<`Cart`\>

Updates the currently selected payment session.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to update the payment session for |
| `update` | `object` | the data to update the payment session with |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[cart.ts:1181](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1181)

___

### updateShippingAddress\_

▸ `Protected` **updateShippingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `addressOrId` | `string` \| `Partial`<`Address`\> | the value to set the shipping address to |
| `addrRepo` | `AddressRepository` | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[cart.ts:992](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L992)

___

### updateUnitPrices\_

▸ `Protected` **updateUnitPrices_**(`cart`, `regionId?`, `customer_id?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `regionId?` | `string` |
| `customer_id?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[cart.ts:1677](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L1677)

___

### validateLineItemShipping\_

▸ `Protected` **validateLineItemShipping_**(`shippingMethods`, `lineItem`): `boolean`

Checks if a given line item has a shipping method that can fulfill it.
Returns true if all products in the cart can be fulfilled with the current
shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | `ShippingMethod`[] | the set of shipping methods to check from |
| `lineItem` | `LineItem` | the line item |

#### Returns

`boolean`

boolean representing wheter shipping method is validated

#### Defined in

[cart.ts:535](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L535)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`CartService`](CartService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`CartService`](CartService.md)

#### Defined in

[cart.ts:153](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/cart.ts#L153)
