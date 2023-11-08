# CartService

## Hierarchy

- `TransactionBaseService`

  ↳ **`CartService`**

## Constructors

### constructor

**new CartService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/cart.ts:141](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L141)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

 `Protected` `Readonly` **addressRepository\_**: `Repository`<`Address`\>

#### Defined in

[medusa/src/services/cart.ts:114](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L114)

___

### cartRepository\_

 `Protected` `Readonly` **cartRepository\_**: `Repository`<`Cart`\> & { `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations  }

#### Defined in

[medusa/src/services/cart.ts:113](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L113)

___

### customShippingOptionService\_

 `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[medusa/src/services/cart.ts:133](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L133)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/cart.ts:125](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L125)

___

### discountService\_

 `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[medusa/src/services/cart.ts:128](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L128)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/cart.ts:117](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L117)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/cart.ts:136](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L136)

___

### giftCardService\_

 `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[medusa/src/services/cart.ts:129](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L129)

___

### lineItemAdjustmentService\_

 `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[medusa/src/services/cart.ts:135](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L135)

___

### lineItemRepository\_

 `Protected` `Readonly` **lineItemRepository\_**: `Repository`<`LineItem`\> & { `findByReturn`: Method findByReturn  }

#### Defined in

[medusa/src/services/cart.ts:116](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L116)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[medusa/src/services/cart.ts:123](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L123)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[medusa/src/services/cart.ts:132](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L132)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/cart.ts:124](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L124)

___

### paymentSessionRepository\_

 `Protected` `Readonly` **paymentSessionRepository\_**: `Repository`<`PaymentSession`\>

#### Defined in

[medusa/src/services/cart.ts:115](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L115)

___

### priceSelectionStrategy\_

 `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[medusa/src/services/cart.ts:134](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L134)

___

### pricingService\_

 `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[medusa/src/services/cart.ts:139](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L139)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/cart.ts:119](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L119)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[medusa/src/services/cart.ts:138](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L138)

___

### productVariantService\_

 `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/cart.ts:118](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L118)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/cart.ts:122](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L122)

___

### salesChannelService\_

 `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](SalesChannelService.md)

#### Defined in

[medusa/src/services/cart.ts:121](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L121)

___

### shippingMethodRepository\_

 `Protected` `Readonly` **shippingMethodRepository\_**: `Repository`<`ShippingMethod`\>

#### Defined in

[medusa/src/services/cart.ts:112](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L112)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[medusa/src/services/cart.ts:126](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L126)

___

### shippingProfileService\_

 `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[medusa/src/services/cart.ts:127](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L127)

___

### storeService\_

 `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[medusa/src/services/cart.ts:120](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L120)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/cart.ts:130](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L130)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/cart.ts:131](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L131)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `CUSTOMER_UPDATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/cart.ts:106](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L106)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addLineItem

**addLineItem**(`cartId`, `lineItem`, `config?`): `Promise`<`void`\>

Adds a line item to the cart.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will add to |
| `lineItem` | `LineItem` | the line item to add. |
| `config` | `object` | validateSalesChannels - should check if product belongs to the same sales channel as cart (if cart has associated sales channel) |
| `config.validateSalesChannels` | `boolean` | `true` |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

**Deprecated**

Use [addOrUpdateLineItems](CartService.md#addorupdatelineitems) instead.

#### Defined in

[medusa/src/services/cart.ts:652](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L652)

___

### addOrUpdateLineItems

**addOrUpdateLineItems**(`cartId`, `lineItems`, `config?`): `Promise`<`void`\>

Adds or update one or multiple line items to the cart. It also update all existing items in the cart
to have has_shipping to false. Finally, the adjustments will be updated.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will add to |
| `lineItems` | `LineItem` \| `LineItem`[] | the line items to add. |
| `config` | `object` | validateSalesChannels - should check if product belongs to the same sales channel as cart (if cart has associated sales channel) |
| `config.validateSalesChannels` | `boolean` | `true` |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[medusa/src/services/cart.ts:792](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L792)

___

### addShippingMethod

**addShippingMethod**(`cartOrId`, `optionId`, `data?`): `Promise`<`Cart`\>

Adds the shipping method to the list of shipping methods associated with
the cart. Shipping Methods are the ways that an order is shipped, whereas a
Shipping Option is a possible way to ship an order. Shipping Methods may
also have additional details in the data field such as an id for a package
shop.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrId` | `string` \| `Cart` | the id of the cart to add shipping method to |
| `optionId` | `string` | id of shipping option to add as valid method |
| `data` | Record<`string`, `unknown`\> | the fulmillment data for the method |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the result of the update operation
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:2177](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2177)

___

### adjustFreeShipping\_

`Protected` **adjustFreeShipping_**(`cart`, `shouldAdd`): `Promise`<`void`\>

Ensures shipping total on cart is correct in regards to a potential free
shipping discount
If a free shipping is present, we set shipping methods price to 0
if a free shipping was present, we set shipping methods to original amount

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to adjust free shipping for |
| `shouldAdd` | `boolean` | flag to indicate, if we should add or remove |

#### Returns

`Promise`<`void`\>

-`Promise`: void

#### Defined in

[medusa/src/services/cart.ts:1111](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1111)

___

### applyDiscount

**applyDiscount**(`cart`, `discountCode`): `Promise`<`void`\>

Updates the cart's discounts.
If discount besides free shipping is already applied, this
will be overwritten
Throws if discount regions does not include the cart region

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `discountCode` | `string` | the discount code |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:1522](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1522)

___

### applyDiscounts

**applyDiscounts**(`cart`, `discountCodes`): `Promise`<`void`\>

Updates the cart's discounts.
If discount besides free shipping is already applied, this
will be overwritten
Throws if discount regions does not include the cart region

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `discountCodes` | `string`[] | the discount code(s) to apply |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:1534](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1534)

___

### applyGiftCard\_

`Protected` **applyGiftCard_**(`cart`, `code`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `cart` | `Cart` |
| `code` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:1487](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1487)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authorizePayment

**authorizePayment**(`cartId`, `context?`): `Promise`<`Cart`\>

Authorizes a payment for a cart.
Will authorize with chosen payment provider. This will return
a payment object, that we will use to update our cart payment with.
Additionally, if the payment does not require more or fails, we will
set the payment on the cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to authorize payment for |
| `context` | Record<`string`, `unknown`\> & { `cart_id`: `string`  } | object containing whatever is relevant for authorizing the payment with the payment provider. As an example, this could be IP address or similar for fraud handling. |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the resulting cart
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:1701](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1701)

___

### create

**create**(`data`): `Promise`<`Cart`\>

Creates a cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | `CartCreateProps` | the data to create the cart with |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the result of the create operation
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:350](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L350)

___

### createOrFetchGuestCustomerFromEmail\_

`Protected` **createOrFetchGuestCustomerFromEmail_**(`email`): `Promise`<`Customer`\>

Creates or fetches a user based on an email.

#### Parameters

| Name | Description |
| :------ | :------ |
| `email` | `string` | the email to use |

#### Returns

`Promise`<`Customer`\>

-`Promise`: the resultign customer object
	-`Customer`: 

#### Defined in

[medusa/src/services/cart.ts:1373](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1373)

___

### createTaxLines

**createTaxLines**(`cartOrId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `cartOrId` | `string` \| `Cart` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:2628](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2628)

___

### decorateTotals

**decorateTotals**(`cart`, `totalsConfig?`): `Promise`<`WithRequiredProperty`<`Cart`, ``"total"``\>\>

#### Parameters

| Name |
| :------ |
| `cart` | `Cart` |
| `totalsConfig` | `TotalsConfig` |

#### Returns

`Promise`<`WithRequiredProperty`<`Cart`, ``"total"``\>\>

-`Promise`: 
	-`WithRequiredProperty`: 
		-`Cart`: 
		-```"total"```: (optional) 

#### Defined in

[medusa/src/services/cart.ts:2680](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2680)

___

### decorateTotals\_

`Protected` **decorateTotals_**(`cart`, `totalsToSelect`, `options?`): `Promise`<`Cart`\>

#### Parameters

| Name |
| :------ |
| `cart` | `Cart` |
| `totalsToSelect` | `TotalField`[] |
| `options` | `TotalsConfig` |

#### Returns

`Promise`<`Cart`\>

-`Promise`: 
	-`Cart`: 

**Deprecated**

Use decorateTotals instead

#### Defined in

[medusa/src/services/cart.ts:2863](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2863)

___

### delete

**delete**(`cartId`): `Promise`<`Cart`\>

Deletes a cart from the database. Completed carts cannot be deleted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to delete |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the deleted cart or undefined if the cart was not found.
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:2547](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2547)

___

### deletePaymentSession

**deletePaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Removes a payment session from the cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whose payment session should be removed. |

#### Returns

`Promise`<`void`\>

-`Promise`: the resulting cart.

#### Defined in

[medusa/src/services/cart.ts:2070](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2070)

___

### deleteTaxLines

**deleteTaxLines**(`id`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:2660](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2660)

___

### findCustomShippingOption

**findCustomShippingOption**(`cartCustomShippingOptions`, `optionId`): `undefined` \| `CustomShippingOption`

Finds the cart's custom shipping options based on the passed option id.
throws if custom options is not empty and no shipping option corresponds to optionId

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartCustomShippingOptions` | `CustomShippingOption`[] | the cart's custom shipping options |
| `optionId` | `string` | id of the normal or custom shipping option to find in the cartCustomShippingOptions |

#### Returns

`undefined` \| `CustomShippingOption`

-`undefined \| CustomShippingOption`: (optional) custom shipping option

#### Defined in

[medusa/src/services/cart.ts:2310](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2310)

___

### getTotalsRelations

`Private` **getTotalsRelations**(`config`): `string`[]

#### Parameters

| Name |
| :------ |
| `config` | `FindConfig`<`Cart`\> |

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

[medusa/src/services/cart.ts:2914](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2914)

___

### getValidatedSalesChannel

`Protected` **getValidatedSalesChannel**(`salesChannelId?`): `Promise`<`SalesChannel`\>

#### Parameters

| Name |
| :------ |
| `salesChannelId?` | `string` |

#### Returns

`Promise`<`SalesChannel`\>

-`Promise`: 
	-`SalesChannel`: 

#### Defined in

[medusa/src/services/cart.ts:488](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L488)

___

### list

**list**(`selector`, `config?`): `Promise`<`Cart`[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `FilterableCartProps` | the query object for find |
| `config` | `FindConfig`<`Cart`\> | config object |

#### Returns

`Promise`<`Cart`[]\>

-`Promise`: the result of the find operation
	-`Cart[]`: 
		-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:207](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L207)

___

### onSalesChannelChange

`Protected` **onSalesChannelChange**(`cart`, `newSalesChannelId`): `Promise`<`void`\>

Remove the cart line item that does not belongs to the newly assigned sales channel

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | The cart being updated |
| `newSalesChannelId` | `string` | The new sales channel being assigned to the cart |

#### Returns

`Promise`<`void`\>

-`Promise`: void

#### Defined in

[medusa/src/services/cart.ts:1319](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1319)

___

### refreshAdjustments\_

`Protected` **refreshAdjustments_**(`cart`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `cart` | `Cart` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:2787](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2787)

___

### refreshPaymentSession

**refreshPaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Refreshes a payment session on a cart

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whose payment session should be removed. |

#### Returns

`Promise`<`void`\>

-`Promise`: the resulting cart.

#### Defined in

[medusa/src/services/cart.ts:2122](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2122)

___

### removeDiscount

**removeDiscount**(`cartId`, `discountCode`): `Promise`<`Cart`\>

Removes a discount based on a discount code.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `discountCode` | `string` | the discount code to remove |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the resulting cart
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:1612](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1612)

___

### removeLineItem

**removeLineItem**(`cartId`, `lineItemId`): `Promise`<`Cart`\>

Removes a line item from the cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart that we will remove from |
| `lineItemId` | `string` | the line item to remove. |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the result of the update operation
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:520](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L520)

___

### retrieve

**retrieve**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`Cart`\>

Gets a cart by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to get. |
| `options` | `FindConfig`<`Cart`\> | the options to get a cart |
| `totalsConfig` | `TotalsConfig` |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the cart document.
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:224](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L224)

___

### retrieveLegacy

`Protected` **retrieveLegacy**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`Cart`\>

#### Parameters

| Name |
| :------ |
| `cartId` | `string` |
| `options` | `FindConfig`<`Cart`\> |
| `totalsConfig` | `TotalsConfig` |

#### Returns

`Promise`<`Cart`\>

-`Promise`: 
	-`Cart`: 

**Deprecated**

#### Defined in

[medusa/src/services/cart.ts:287](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L287)

___

### retrieveWithTotals

**retrieveWithTotals**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`WithRequiredProperty`<`Cart`, ``"total"``\>\>

#### Parameters

| Name |
| :------ |
| `cartId` | `string` |
| `options` | `FindConfig`<`Cart`\> |
| `totalsConfig` | `TotalsConfig` |

#### Returns

`Promise`<`WithRequiredProperty`<`Cart`, ``"total"``\>\>

-`Promise`: 
	-`WithRequiredProperty`: 
		-`Cart`: 
		-```"total"```: (optional) 

#### Defined in

[medusa/src/services/cart.ts:315](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L315)

___

### setMetadata

**setMetadata**(`cartId`, `key`, `value`): `Promise`<`Cart`\>

Dedicated method to set metadata for a cart.
To ensure that plugins does not overwrite each
others metadata fields, setMetadata is provided.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the cart to apply metadata to. |
| `key` | `string` | key for metadata field |
| `value` | `string` \| `number` | value for metadata field. |

#### Returns

`Promise`<`Cart`\>

-`Promise`: resolves to the updated result.
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:2588](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2588)

___

### setPaymentSession

**setPaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Selects a payment session for a cart and creates a payment object in the external provider system

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to add payment method to |
| `providerId` | `string` | the id of the provider to be set to the cart |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:1775](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1775)

___

### setPaymentSessions

**setPaymentSessions**(`cartOrCartId`): `Promise`<`void`\>

Creates, updates and sets payment sessions associated with the cart. The
first time the method is called payment sessions will be created for each
provider. Additional calls will ensure that payment sessions have correct
amounts, currencies, etc. as well as make sure to filter payment sessions
that are not available for the cart's region.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrCartId` | `string` \| `Cart` | the id of the cart to set payment session for |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation.

#### Defined in

[medusa/src/services/cart.ts:1891](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1891)

___

### setRegion\_

`Protected` **setRegion_**(`cart`, `regionId`, `countryCode`): `Promise`<`void`\>

Set's the region of a cart.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to set region on |
| `regionId` | `string` | the id of the region to set the region to |
| `countryCode` | ``null`` \| `string` | the country code to set the country to |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[medusa/src/services/cart.ts:2408](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2408)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### transformQueryForTotals\_

`Protected` **transformQueryForTotals_**(`config`): `FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[]  }

#### Parameters

| Name |
| :------ |
| `config` | `FindConfig`<`Cart`\> |

#### Returns

`FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[]  }

-``FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[]  }`: (optional) 

#### Defined in

[medusa/src/services/cart.ts:2805](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2805)

___

### update

**update**(`cartOrId`, `data`): `Promise`<`Cart`\>

#### Parameters

| Name |
| :------ |
| `cartOrId` | `string` \| `Cart` |
| `data` | `CartUpdateProps` |

#### Returns

`Promise`<`Cart`\>

-`Promise`: 
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:1152](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1152)

___

### updateBillingAddress\_

`Protected` **updateBillingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's billing address.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> | the value to set the billing address to |
| `addrRepo` | `Repository`<`Address`\> | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[medusa/src/services/cart.ts:1400](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1400)

___

### updateCustomerId\_

`Protected` **updateCustomerId_**(`cart`, `customerId`): `Promise`<`void`\>

Sets the customer id of a cart

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to add email to |
| `customerId` | `string` | the customer to add to cart |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[medusa/src/services/cart.ts:1355](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1355)

___

### updateLineItem

**updateLineItem**(`cartId`, `lineItemId`, `update`): `Promise`<`Cart`\>

Updates a cart's existing line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to update |
| `lineItemId` | `string` | the id of the line item to update. |
| `update` | `LineItemUpdate` |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the result of the update operation
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:999](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L999)

___

### updatePaymentSession

**updatePaymentSession**(`cartId`, `update`): `Promise`<`Cart`\>

Updates the currently selected payment session.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartId` | `string` | the id of the cart to update the payment session for |
| `update` | Record<`string`, `unknown`\> | the data to update the payment session with |

#### Returns

`Promise`<`Cart`\>

-`Promise`: the resulting cart
	-`Cart`: 

#### Defined in

[medusa/src/services/cart.ts:1663](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1663)

___

### updateShippingAddress\_

`Protected` **updateShippingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's shipping address.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | `Cart` | the cart to update |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> | the value to set the shipping address to |
| `addrRepo` | `Repository`<`Address`\> | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[medusa/src/services/cart.ts:1438](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L1438)

___

### updateUnitPrices\_

`Protected` **updateUnitPrices_**(`cart`, `regionId?`, `customer_id?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `cart` | `Cart` |
| `regionId?` | `string` |
| `customer_id?` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/cart.ts:2329](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L2329)

___

### validateLineItem

`Protected` **validateLineItem**(`sales_channel_id`, `lineItem`): `Promise`<`boolean`\>

Check if line item's variant belongs to the cart's sales channel.

#### Parameters

| Name | Description |
| :------ | :------ |
| `sales_channel_id` | `object` | the cart for the line item |
| `sales_channel_id.sales_channel_id` | ``null`` \| `string` |
| `lineItem` | `LineItemValidateData` | the line item being added |

#### Returns

`Promise`<`boolean`\>

-`Promise`: a boolean indicating validation result
	-`boolean`: (optional) 

#### Defined in

[medusa/src/services/cart.ts:618](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L618)

___

### validateLineItemShipping\_

`Protected` **validateLineItemShipping_**(`shippingMethods`, `lineItemShippingProfiledId`): `boolean`

Checks if a given line item has a shipping method that can fulfill it.
Returns true if all products in the cart can be fulfilled with the current
shipping methods.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod`[] | the set of shipping methods to check from |
| `lineItemShippingProfiledId` | `string` |

#### Returns

`boolean`

-`boolean`: (optional) boolean representing whether shipping method is validated

#### Defined in

[medusa/src/services/cart.ts:589](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/cart.ts#L589)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`CartService`](CartService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CartService`](CartService.md)

-`CartService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
