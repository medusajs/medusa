---
displayed_sidebar: jsClientSidebar
---

# Class: CartService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CartService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`CartService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<[`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:54

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: `Repository`<[`Cart`](internal-3.Cart.md)\> & { `findOneWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)\> ; `findWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)[]\>  }

#### Defined in

packages/medusa/dist/services/cart.d.ts:53

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:73

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:65

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](internal-8.internal.DiscountService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:68

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:57

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:76

___

### getTotalsRelations

• `Private` **getTotalsRelations**: `any`

#### Defined in

packages/medusa/dist/services/cart.d.ts:359

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](internal-8.internal.GiftCardService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:69

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:75

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<[`LineItem`](internal-3.LineItem.md)\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<[`LineItem`](internal-3.LineItem.md) & { `return_item`: [`ReturnItem`](internal-3.ReturnItem.md)  }[]\>  }

#### Defined in

packages/medusa/dist/services/cart.d.ts:56

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](internal-8.internal.LineItemService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:63

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:72

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:64

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: `Repository`<[`PaymentSession`](internal-3.PaymentSession.md)\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:55

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: [`IPriceSelectionStrategy`](../interfaces/internal-8.internal.IPriceSelectionStrategy.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:74

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](internal-8.internal.PricingService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:78

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:59

___

### productVariantInventoryService\_

• `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:77

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:58

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:62

___

### salesChannelService\_

• `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](internal-8.internal.SalesChannelService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:61

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: `Repository`<[`ShippingMethod`](internal-3.ShippingMethod.md)\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:52

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:66

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:67

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](internal-8.internal.StoreService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:60

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:70

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/cart.d.ts:71

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `CUSTOMER_UPDATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/cart.d.ts:47

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addLineItem

▸ **addLineItem**(`cartId`, `lineItem`, `config?`): `Promise`<`void`\>

Adds a line item to the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will add to |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | the line item to add. |
| `config?` | `Object` | validateSalesChannels - should check if product belongs to the same sales channel as cart (if cart has associated sales channel) |
| `config.validateSalesChannels` | `boolean` | - |

#### Returns

`Promise`<`void`\>

the result of the update operation

**`Deprecated`**

Use [addOrUpdateLineItems](internal-8.internal.CartService.md#addorupdatelineitems) instead.

#### Defined in

packages/medusa/dist/services/cart.d.ts:146

___

### addOrUpdateLineItems

▸ **addOrUpdateLineItems**(`cartId`, `lineItems`, `config?`): `Promise`<`void`\>

Adds or update one or multiple line items to the cart. It also update all existing items in the cart
to have has_shipping to false. Finally, the adjustments will be updated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will add to |
| `lineItems` | [`LineItem`](internal-3.LineItem.md) \| [`LineItem`](internal-3.LineItem.md)[] | the line items to add. |
| `config?` | `Object` | validateSalesChannels - should check if product belongs to the same sales channel as cart (if cart has associated sales channel) |
| `config.validateSalesChannels` | `boolean` | - |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:159

___

### addShippingMethod

▸ **addShippingMethod**(`cartOrId`, `optionId`, `data?`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Adds the shipping method to the list of shipping methods associated with
the cart. Shipping Methods are the ways that an order is shipped, whereas a
Shipping Option is a possible way to ship an order. Shipping Methods may
also have additional details in the data field such as an id for a package
shop.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrId` | `string` \| [`Cart`](internal-3.Cart.md) | the id of the cart to add shipping method to |
| `optionId` | `string` | id of shipping option to add as valid method |
| `data?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the fulmillment data for the method |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:310

___

### adjustFreeShipping\_

▸ `Protected` **adjustFreeShipping_**(`cart`, `shouldAdd`): `Promise`<`void`\>

Ensures shipping total on cart is correct in regards to a potential free
shipping discount
If a free shipping is present, we set shipping methods price to 0
if a free shipping was present, we set shipping methods to original amount

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to adjust free shipping for |
| `shouldAdd` | `boolean` | flag to indicate, if we should add or remove |

#### Returns

`Promise`<`void`\>

void

#### Defined in

packages/medusa/dist/services/cart.d.ts:179

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
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to update |
| `discountCode` | `string` | the discount code |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:228

___

### applyDiscounts

▸ **applyDiscounts**(`cart`, `discountCodes`): `Promise`<`void`\>

Updates the cart's discounts.
If discount besides free shipping is already applied, this
will be overwritten
Throws if discount regions does not include the cart region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to update |
| `discountCodes` | `string`[] | the discount code(s) to apply |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:237

___

### applyGiftCard\_

▸ `Protected` **applyGiftCard_**(`cart`, `code`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |
| `code` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:219

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### authorizePayment

▸ **authorizePayment**(`cartId`, `context?`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Authorizes a payment for a cart.
Will authorize with chosen payment provider. This will return
a payment object, that we will use to update our cart payment with.
Additionally, if the payment does not require more or fails, we will
set the payment on the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to authorize payment for |
| `context?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> & { `cart_id`: `string`  } | object containing whatever is relevant for authorizing the payment with the payment provider. As an example, this could be IP address or similar for fraud handling. |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the resulting cart

#### Defined in

packages/medusa/dist/services/cart.d.ts:264

___

### create

▸ **create**(`data`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Creates a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CartCreateProps`](../modules/internal-8.md#cartcreateprops) | the data to create the cart with |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:108

___

### createOrFetchGuestCustomerFromEmail\_

▸ `Protected` **createOrFetchGuestCustomerFromEmail_**(`email`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Creates or fetches a user based on an email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email to use |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

the resultign customer object

#### Defined in

packages/medusa/dist/services/cart.d.ts:202

___

### createTaxLines

▸ **createTaxLines**(`cartOrId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrId` | `string` \| [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:344

___

### decorateTotals

▸ **decorateTotals**(`cart`, `totalsConfig?`): `Promise`<[`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Cart`](internal-3.Cart.md), ``"total"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |
| `totalsConfig?` | [`TotalsConfig`](../modules/internal-8.md#totalsconfig) |

#### Returns

`Promise`<[`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Cart`](internal-3.Cart.md), ``"total"``\>\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:346

___

### decorateTotals\_

▸ `Protected` **decorateTotals_**(`cart`, `totalsToSelect`, `options?`): `Promise`<[`Cart`](internal-3.Cart.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |
| `totalsToSelect` | [`TotalField`](../modules/internal-8.internal.md#totalfield)[] |
| `options?` | [`TotalsConfig`](../modules/internal-8.md#totalsconfig) |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

**`Deprecated`**

Use decorateTotals instead

#### Defined in

packages/medusa/dist/services/cart.d.ts:358

___

### delete

▸ **delete**(`cartId`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Deletes a cart from the database. Completed carts cannot be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to delete |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the deleted cart or undefined if the cart was not found.

#### Defined in

packages/medusa/dist/services/cart.d.ts:333

___

### deletePaymentSession

▸ **deletePaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Removes a payment session from the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whose payment session should be removed. |

#### Returns

`Promise`<`void`\>

the resulting cart.

#### Defined in

packages/medusa/dist/services/cart.d.ts:290

___

### deleteTaxLines

▸ **deleteTaxLines**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:345

___

### findCustomShippingOption

▸ **findCustomShippingOption**(`cartCustomShippingOptions`, `optionId`): `undefined` \| [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)

Finds the cart's custom shipping options based on the passed option id.
throws if custom options is not empty and no shipping option corresponds to optionId

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartCustomShippingOptions` | [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)[] | the cart's custom shipping options |
| `optionId` | `string` | id of the normal or custom shipping option to find in the cartCustomShippingOptions |

#### Returns

`undefined` \| [`CustomShippingOption`](internal-8.internal.CustomShippingOption.md)

custom shipping option

#### Defined in

packages/medusa/dist/services/cart.d.ts:318

___

### getValidatedSalesChannel

▸ `Protected` **getValidatedSalesChannel**(`salesChannelId?`): `Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId?` | `string` |

#### Returns

`Promise`<[`SalesChannel`](internal-3.SalesChannel.md)\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:109

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Cart`](internal-3.Cart.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`FilterableCartProps`](internal-8.FilterableCartProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> | config object |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:85

___

### onSalesChannelChange

▸ `Protected` **onSalesChannelChange**(`cart`, `newSalesChannelId`): `Promise`<`void`\>

Remove the cart line item that does not belongs to the newly assigned sales channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | The cart being updated |
| `newSalesChannelId` | `string` | The new sales channel being assigned to the cart |

#### Returns

`Promise`<`void`\>

void

#### Defined in

packages/medusa/dist/services/cart.d.ts:189

___

### refreshAdjustments\_

▸ `Protected` **refreshAdjustments_**(`cart`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:347

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Refreshes a payment session on a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `providerId` | `string` | the id of the provider whose payment session should be removed. |

#### Returns

`Promise`<`void`\>

the resulting cart.

#### Defined in

packages/medusa/dist/services/cart.d.ts:298

___

### removeDiscount

▸ **removeDiscount**(`cartId`, `discountCode`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Removes a discount based on a discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to remove from |
| `discountCode` | `string` | the discount code to remove |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the resulting cart

#### Defined in

packages/medusa/dist/services/cart.d.ts:244

___

### removeLineItem

▸ **removeLineItem**(`cartId`, `lineItemId`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Removes a line item from the cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart that we will remove from |
| `lineItemId` | `string` | the line item to remove. |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:116

___

### retrieve

▸ **retrieve**(`cartId`, `options?`, `totalsConfig?`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Gets a cart by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to get. |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> | the options to get a cart |
| `totalsConfig?` | [`TotalsConfig`](../modules/internal-8.md#totalsconfig) |  |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the cart document.

#### Defined in

packages/medusa/dist/services/cart.d.ts:93

___

### retrieveLegacy

▸ `Protected` **retrieveLegacy**(`cartId`, `options?`, `totalsConfig?`): `Promise`<[`Cart`](internal-3.Cart.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> |
| `totalsConfig?` | [`TotalsConfig`](../modules/internal-8.md#totalsconfig) |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

**`Deprecated`**

#### Defined in

packages/medusa/dist/services/cart.d.ts:101

___

### retrieveWithTotals

▸ **retrieveWithTotals**(`cartId`, `options?`, `totalsConfig?`): `Promise`<[`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Cart`](internal-3.Cart.md), ``"total"``\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |
| `options?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> |
| `totalsConfig?` | [`TotalsConfig`](../modules/internal-8.md#totalsconfig) |

#### Returns

`Promise`<[`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`Cart`](internal-3.Cart.md), ``"total"``\>\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:102

___

### setMetadata

▸ **setMetadata**(`cartId`, `key`, `value`): `Promise`<[`Cart`](internal-3.Cart.md)\>

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

`Promise`<[`Cart`](internal-3.Cart.md)\>

resolves to the updated result.

#### Defined in

packages/medusa/dist/services/cart.d.ts:343

___

### setPaymentSession

▸ **setPaymentSession**(`cartId`, `providerId`): `Promise`<`void`\>

Selects a payment session for a cart and creates a payment object in the external provider system

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to add payment method to |
| `providerId` | `string` | the id of the provider to be set to the cart |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:272

___

### setPaymentSessions

▸ **setPaymentSessions**(`cartOrCartId`): `Promise`<`void`\>

Creates, updates and sets payment sessions associated with the cart. The
first time the method is called payment sessions will be created for each
provider. Additional calls will ensure that payment sessions have correct
amounts, currencies, etc. as well as make sure to filter payment sessions
that are not available for the cart's region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrCartId` | `string` \| [`Cart`](internal-3.Cart.md) | the id of the cart to set payment session for |

#### Returns

`Promise`<`void`\>

the result of the update operation.

#### Defined in

packages/medusa/dist/services/cart.d.ts:282

___

### setRegion\_

▸ `Protected` **setRegion_**(`cart`, `regionId`, `countryCode`): `Promise`<`void`\>

Set's the region of a cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to set region on |
| `regionId` | `string` | the id of the region to set the region to |
| `countryCode` | ``null`` \| `string` | the country code to set the country to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:327

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### transformQueryForTotals\_

▸ `Protected` **transformQueryForTotals_**(`config`): [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> & { `totalsToSelect`: [`TotalField`](../modules/internal-8.internal.md#totalfield)[]  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> |

#### Returns

[`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Cart`](internal-3.Cart.md)\> & { `totalsToSelect`: [`TotalField`](../modules/internal-8.internal.md#totalfield)[]  }

#### Defined in

packages/medusa/dist/services/cart.d.ts:348

___

### update

▸ **update**(`cartOrId`, `data`): `Promise`<[`Cart`](internal-3.Cart.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrId` | `string` \| [`Cart`](internal-3.Cart.md) |
| `data` | [`CartUpdateProps`](../modules/internal-8.md#cartupdateprops) |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:180

___

### updateBillingAddress\_

▸ `Protected` **updateBillingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to update |
| `addressOrId` | `string` \| [`AddressPayload`](internal.AddressPayload.md) \| [`Partial`](../modules/internal-8.md#partial)<[`Address`](internal-3.Address.md)\> | the value to set the billing address to |
| `addrRepo` | `Repository`<[`Address`](internal-3.Address.md)\> | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:210

___

### updateCustomerId\_

▸ `Protected` **updateCustomerId_**(`cart`, `customerId`): `Promise`<`void`\>

Sets the customer id of a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to add email to |
| `customerId` | `string` | the customer to add to cart |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:196

___

### updateLineItem

▸ **updateLineItem**(`cartId`, `lineItemId`, `update`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Updates a cart's existing line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to update |
| `lineItemId` | `string` | the id of the line item to update. |
| `update` | [`LineItemUpdate`](../modules/internal-8.md#lineitemupdate) | - |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:169

___

### updatePaymentSession

▸ **updatePaymentSession**(`cartId`, `update`): `Promise`<[`Cart`](internal-3.Cart.md)\>

Updates the currently selected payment session.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the id of the cart to update the payment session for |
| `update` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | the data to update the payment session with |

#### Returns

`Promise`<[`Cart`](internal-3.Cart.md)\>

the resulting cart

#### Defined in

packages/medusa/dist/services/cart.d.ts:251

___

### updateShippingAddress\_

▸ `Protected` **updateShippingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's shipping address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart to update |
| `addressOrId` | `string` \| [`AddressPayload`](internal.AddressPayload.md) \| [`Partial`](../modules/internal-8.md#partial)<[`Address`](internal-3.Address.md)\> | the value to set the shipping address to |
| `addrRepo` | `Repository`<[`Address`](internal-3.Address.md)\> | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/cart.d.ts:218

___

### updateUnitPrices\_

▸ `Protected` **updateUnitPrices_**(`cart`, `regionId?`, `customer_id?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |
| `regionId?` | `string` |
| `customer_id?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/cart.d.ts:319

___

### validateLineItem

▸ `Protected` **validateLineItem**(`sales_channel_id`, `lineItem`): `Promise`<`boolean`\>

Check if line item's variant belongs to the cart's sales channel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sales_channel_id` | `Object` | the cart for the line item |
| `sales_channel_id.sales_channel_id` | ``null`` \| `string` | - |
| `lineItem` | [`LineItemValidateData`](../modules/internal-8.md#lineitemvalidatedata) | the line item being added |

#### Returns

`Promise`<`boolean`\>

a boolean indicating validation result

#### Defined in

packages/medusa/dist/services/cart.d.ts:133

___

### validateLineItemShipping\_

▸ `Protected` **validateLineItemShipping_**(`shippingMethods`, `lineItemShippingProfiledId`): `boolean`

Checks if a given line item has a shipping method that can fulfill it.
Returns true if all products in the cart can be fulfilled with the current
shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | [`ShippingMethod`](internal-3.ShippingMethod.md)[] | the set of shipping methods to check from |
| `lineItemShippingProfiledId` | `string` | - |

#### Returns

`boolean`

boolean representing whether shipping method is validated

#### Defined in

packages/medusa/dist/services/cart.d.ts:125

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CartService`](internal-8.internal.CartService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CartService`](internal-8.internal.CartService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
