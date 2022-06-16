# Class: CartService

## Hierarchy

- `TransactionBaseService`<[`CartService`](CartService.md)\>

  ↳ **`CartService`**

## Constructors

### constructor

• **new CartService**(`__namedParameters`)

#### Parameters

| Name                | Type                   |
| :------------------ | :--------------------- |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;CartService\&gt;.constructor

#### Defined in

[services/cart.ts:106](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L106)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/cart.ts:86](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L86)

---

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/cart.ts:85](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L85)

---

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

---

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

---

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[services/cart.ts:102](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L102)

---

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/cart.ts:95](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L95)

---

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[services/cart.ts:97](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L97)

---

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/cart.ts:89](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L89)

---

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[services/cart.ts:98](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L98)

---

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[services/cart.ts:101](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L101)

---

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[services/cart.ts:104](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L104)

---

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/cart.ts:88](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L88)

---

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/cart.ts:93](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L93)

---

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/cart.ts:81](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L81)

---

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/cart.ts:94](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L94)

---

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[services/cart.ts:87](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L87)

---

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[services/cart.ts:103](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L103)

---

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/cart.ts:91](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L91)

---

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/cart.ts:90](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L90)

---

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/cart.ts:92](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L92)

---

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/cart.ts:84](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L84)

---

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/cart.ts:96](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L96)

---

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/cart.ts:99](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L99)

---

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/cart.ts:100](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L100)

---

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/cart.ts:82](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L82)

---

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name               | Type     |
| :----------------- | :------- |
| `CREATED`          | `string` |
| `CUSTOMER_UPDATED` | `string` |
| `UPDATED`          | `string` |

#### Defined in

[services/cart.ts:75](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L75)

## Methods

### addLineItem

▸ **addLineItem**(`cartId`, `lineItem`): `Promise`<`Cart`\>

Adds a line item to the cart.

#### Parameters

| Name       | Type       | Description                            |
| :--------- | :--------- | :------------------------------------- |
| `cartId`   | `string`   | the id of the cart that we will add to |
| `lineItem` | `LineItem` | the line item to add.                  |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[services/cart.ts:528](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L528)

---

### addShippingMethod

▸ **addShippingMethod**(`cartId`, `optionId`, `data?`): `Promise`<`Cart`\>

Adds the shipping method to the list of shipping methods associated with
the cart. Shipping Methods are the ways that an order is shipped, whereas a
Shipping Option is a possible way to ship an order. Shipping Methods may
also have additional details in the data field such as an id for a package
shop.

#### Parameters

| Name       | Type                           | Description                                  |
| :--------- | :----------------------------- | :------------------------------------------- |
| `cartId`   | `string`                       | the id of the cart to add shipping method to |
| `optionId` | `string`                       | id of shipping option to add as valid method |
| `data`     | `Record`<`string`, `unknown`\> | the fulmillment data for the method          |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[services/cart.ts:1522](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1522)

---

### adjustFreeShipping\_

▸ `Protected` **adjustFreeShipping\_**(`cart`, `shouldAdd`): `Promise`<`void`\>

Ensures shipping total on cart is correct in regards to a potential free
shipping discount
If a free shipping is present, we set shipping methods price to 0
if a free shipping was present, we set shipping methods to original amount

#### Parameters

| Name        | Type      | Description                                  |
| :---------- | :-------- | :------------------------------------------- |
| `cart`      | `Cart`    | the the cart to adjust free shipping for     |
| `shouldAdd` | `boolean` | flag to indicate, if we should add or remove |

#### Returns

`Promise`<`void`\>

void

#### Defined in

[services/cart.ts:680](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L680)

---

### applyDiscount

▸ **applyDiscount**(`cart`, `discountCode`): `Promise`<`void`\>

Updates the cart's discounts.
If discount besides free shipping is already applied, this
will be overwritten
Throws if discount regions does not include the cart region

#### Parameters

| Name           | Type     | Description        |
| :------------- | :------- | :----------------- |
| `cart`         | `Cart`   | the cart to update |
| `discountCode` | `string` | the discount code  |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/cart.ts:1044](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1044)

---

### applyGiftCard\_

▸ `Protected` **applyGiftCard\_**(`cart`, `code`): `Promise`<`void`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `cart` | `Cart`   |
| `code` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1008](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1008)

---

### atomicPhase\_

▸ `Protected` **atomicPhase\_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name      |
| :-------- |
| `TResult` |
| `TError`  |

#### Parameters

| Name                           | Type                                                                       | Description                                  |
| :----------------------------- | :------------------------------------------------------------------------- | :------------------------------------------- |
| `work`                         | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\>           | the transactional work to be done            |
| `isolationOrErrorHandler?`     | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\>                     | Potential error handler                      |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

---

### authorizePayment

▸ **authorizePayment**(`cartId`, `context?`): `Promise`<`Cart`\>

Authorizes a payment for a cart.
Will authorize with chosen payment provider. This will return
a payment object, that we will use to update our cart payment with.
Additionally, if the payment does not require more or fails, we will
set the payment on the cart.

#### Parameters

| Name      | Type                           | Description                                                                                                                                                          |
| :-------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cartId`  | `string`                       | the id of the cart to authorize payment for                                                                                                                          |
| `context` | `Record`<`string`, `unknown`\> | object containing whatever is relevant for authorizing the payment with the payment provider. As an example, this could be IP address or similar for fraud handling. |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[services/cart.ts:1183](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1183)

---

### create

▸ **create**(`data`): `Promise`<`Cart`\>

Creates a cart.

#### Parameters

| Name   | Type              | Description                      |
| :----- | :---------------- | :------------------------------- |
| `data` | `CartCreateProps` | the data to create the cart with |

#### Returns

`Promise`<`Cart`\>

the result of the create operation

#### Defined in

[services/cart.ts:329](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L329)

---

### createOrFetchUserFromEmail\_

▸ `Protected` **createOrFetchUserFromEmail\_**(`email`): `Promise`<`Customer`\>

Creates or fetches a user based on an email.

#### Parameters

| Name    | Type     | Description      |
| :------ | :------- | :--------------- |
| `email` | `string` | the email to use |

#### Returns

`Promise`<`Customer`\>

the resultign customer object

#### Defined in

[services/cart.ts:886](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L886)

---

### createTaxLines

▸ **createTaxLines**(`id`): `Promise`<`Cart`\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1919](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1919)

---

### decorateTotals\_

▸ `Protected` **decorateTotals\_**(`cart`, `totalsToSelect`, `options?`): `Promise`<`Cart`\>

#### Parameters

| Name             | Type           |
| :--------------- | :------------- |
| `cart`           | `Cart`         |
| `totalsToSelect` | `TotalField`[] |
| `options`        | `TotalsConfig` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:207](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L207)

---

### delete

▸ **delete**(`cartId`): `Promise`<`Cart`\>

Deletes a cart from the database. Completed carts cannot be deleted.

#### Parameters

| Name     | Type     | Description                  |
| :------- | :------- | :--------------------------- |
| `cartId` | `string` | the id of the cart to delete |

#### Returns

`Promise`<`Cart`\>

the deleted cart or undefined if the cart was not found.

#### Defined in

[services/cart.ts:1834](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1834)

---

### deleteMetadata

▸ **deleteMetadata**(`cartId`, `key`): `Promise`<`Cart`\>

Dedicated method to delete metadata for a cart.

#### Parameters

| Name     | Type     | Description                       |
| :------- | :------- | :-------------------------------- |
| `cartId` | `string` | the cart to delete metadata from. |
| `key`    | `string` | key for metadata field            |

#### Returns

`Promise`<`Cart`\>

resolves to the updated result.

#### Defined in

[services/cart.ts:1972](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1972)

---

### deletePaymentSession

▸ **deletePaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Removes a payment session from the cart.

#### Parameters

| Name         | Type     | Description                                                      |
| :----------- | :------- | :--------------------------------------------------------------- |
| `cartId`     | `string` | the id of the cart to remove from                                |
| `providerId` | `string` | the id of the provider whoose payment session should be removed. |

#### Returns

`Promise`<`Cart`\>

the resulting cart.

#### Defined in

[services/cart.ts:1430](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1430)

---

### findCustomShippingOption

▸ **findCustomShippingOption**(`cartCustomShippingOptions`, `optionId`): `undefined` \| `CustomShippingOption`

Finds the cart's custom shipping options based on the passed option id.
throws if custom options is not empty and no shipping option corresponds to optionId

#### Parameters

| Name                        | Type                     | Description                                                                         |
| :-------------------------- | :----------------------- | :---------------------------------------------------------------------------------- |
| `cartCustomShippingOptions` | `CustomShippingOption`[] | the cart's custom shipping options                                                  |
| `optionId`                  | `string`                 | id of the normal or custom shipping option to find in the cartCustomShippingOptions |

#### Returns

`undefined` \| `CustomShippingOption`

custom shipping option

#### Defined in

[services/cart.ts:1626](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1626)

---

### list

▸ **list**(`selector`, `config?`): `Promise`<`Cart`[]\>

#### Parameters

| Name       | Type                  | Description               |
| :--------- | :-------------------- | :------------------------ |
| `selector` | `FilterableCartProps` | the query object for find |
| `config`   | `FindConfig`<`Cart`\> | config object             |

#### Returns

`Promise`<`Cart`[]\>

the result of the find operation

#### Defined in

[services/cart.ts:254](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L254)

---

### refreshAdjustments\_

▸ `Protected` **refreshAdjustments\_**(`cart`): `Promise`<`void`\>

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `cart` | `Cart` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1946](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1946)

---

### refreshPaymentSession

▸ **refreshPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Refreshes a payment session on a cart

#### Parameters

| Name         | Type     | Description                                                      |
| :----------- | :------- | :--------------------------------------------------------------- |
| `cartId`     | `string` | the id of the cart to remove from                                |
| `providerId` | `string` | the id of the provider whoose payment session should be removed. |

#### Returns

`Promise`<`Cart`\>

the resulting cart.

#### Defined in

[services/cart.ts:1478](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1478)

---

### removeDiscount

▸ **removeDiscount**(`cartId`, `discountCode`): `Promise`<`Cart`\>

Removes a discount based on a discount code.

#### Parameters

| Name           | Type     | Description                       |
| :------------- | :------- | :-------------------------------- |
| `cartId`       | `string` | the id of the cart to remove from |
| `discountCode` | `string` | the discount code to remove       |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[services/cart.ts:1104](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1104)

---

### removeLineItem

▸ **removeLineItem**(`cartId`, `lineItemId`): `Promise`<`Cart`\>

Removes a line item from the cart.

#### Parameters

| Name         | Type     | Description                                 |
| :----------- | :------- | :------------------------------------------ |
| `cartId`     | `string` | the id of the cart that we will remove from |
| `lineItemId` | `string` | the line item to remove.                    |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[services/cart.ts:432](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L432)

---

### retrieve

▸ **retrieve**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`Cart`\>

Gets a cart by id.

#### Parameters

| Name           | Type                  | Description                           |
| :------------- | :-------------------- | :------------------------------------ |
| `cartId`       | `string`              | the id of the cart to get.            |
| `options`      | `FindConfig`<`Cart`\> | the options to get a cart             |
| `totalsConfig` | `TotalsConfig`        | configuration for retrieval of totals |

#### Returns

`Promise`<`Cart`\>

the cart document.

#### Defined in

[services/cart.ts:277](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L277)

---

### setMetadata

▸ **setMetadata**(`cartId`, `key`, `value`): `Promise`<`Cart`\>

Dedicated method to set metadata for a cart.
To ensure that plugins does not overwrite each
others metadata fields, setMetadata is provided.

#### Parameters

| Name     | Type                 | Description                    |
| :------- | :------------------- | :----------------------------- |
| `cartId` | `string`             | the cart to apply metadata to. |
| `key`    | `string`             | key for metadata field         |
| `value`  | `string` \| `number` | value for metadata field.      |

#### Returns

`Promise`<`Cart`\>

resolves to the updated result.

#### Defined in

[services/cart.ts:1877](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1877)

---

### setPaymentSession

▸ **setPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

Sets a payment method for a cart.

#### Parameters

| Name         | Type     | Description                                  |
| :----------- | :------- | :------------------------------------------- |
| `cartId`     | `string` | the id of the cart to add payment method to  |
| `providerId` | `string` | the id of the provider to be set to the cart |

#### Returns

`Promise`<`Cart`\>

result of update operation

#### Defined in

[services/cart.ts:1249](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1249)

---

### setPaymentSessions

▸ **setPaymentSessions**(`cartOrCartId`): `Promise`<`void`\>

Creates, updates and sets payment sessions associated with the cart. The
first time the method is called payment sessions will be created for each
provider. Additional calls will ensure that payment sessions have correct
amounts, currencies, etc. as well as make sure to filter payment sessions
that are not available for the cart's region.

#### Parameters

| Name           | Type               | Description                                   |
| :------------- | :----------------- | :-------------------------------------------- |
| `cartOrCartId` | `string` \| `Cart` | the id of the cart to set payment session for |

#### Returns

`Promise`<`void`\>

the result of the update operation.

#### Defined in

[services/cart.ts:1322](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1322)

---

### setRegion\_

▸ `Protected` **setRegion\_**(`cart`, `regionId`, `countryCode`): `Promise`<`void`\>

Set's the region of a cart.

#### Parameters

| Name          | Type               | Description                               |
| :------------ | :----------------- | :---------------------------------------- |
| `cart`        | `Cart`             | the cart to set region on                 |
| `regionId`    | `string`           | the id of the region to set the region to |
| `countryCode` | `null` \| `string` | the country code to set the country to    |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/cart.ts:1705](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1705)

---

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction\_**(`err`): `boolean`

#### Parameters

| Name  | Type                                                   |
| :---- | :----------------------------------------------------- |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string` } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

---

### transformQueryForTotals\_

▸ `Protected` **transformQueryForTotals\_**(`config`): `FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[] }

#### Parameters

| Name     | Type                  |
| :------- | :-------------------- |
| `config` | `FindConfig`<`Cart`\> |

#### Returns

`FindConfig`<`Cart`\> & { `totalsToSelect`: `TotalField`[] }

#### Defined in

[services/cart.ts:157](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L157)

---

### update

▸ **update**(`cartId`, `data`): `Promise`<`Cart`\>

#### Parameters

| Name     | Type              |
| :------- | :---------------- |
| `cartId` | `string`          |
| `data`   | `CartUpdateProps` |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:716](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L716)

---

### updateBillingAddress\_

▸ `Protected` **updateBillingAddress\_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's billing address.

#### Parameters

| Name          | Type                                                  | Description                               |
| :------------ | :---------------------------------------------------- | :---------------------------------------- |
| `cart`        | `Cart`                                                | the cart to update                        |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> | the value to set the billing address to   |
| `addrRepo`    | `AddressRepository`                                   | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/cart.ts:919](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L919)

---

### updateCustomerId\_

▸ `Protected` **updateCustomerId\_**(`cart`, `customerId`): `Promise`<`void`\>

Sets the customer id of a cart

#### Parameters

| Name         | Type     | Description                 |
| :----------- | :------- | :-------------------------- |
| `cart`       | `Cart`   | the cart to add email to    |
| `customerId` | `string` | the customer to add to cart |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/cart.ts:868](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L868)

---

### updateLineItem

▸ **updateLineItem**(`cartId`, `lineItemId`, `lineItemUpdate`): `Promise`<`Cart`\>

Updates a cart's existing line item.

#### Parameters

| Name             | Type             | Description                                        |
| :--------------- | :--------------- | :------------------------------------------------- |
| `cartId`         | `string`         | the id of the cart to update                       |
| `lineItemId`     | `string`         | the id of the line item to update.                 |
| `lineItemUpdate` | `LineItemUpdate` | the line item to update. Must include an id field. |

#### Returns

`Promise`<`Cart`\>

the result of the update operation

#### Defined in

[services/cart.ts:615](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L615)

---

### updatePaymentSession

▸ **updatePaymentSession**(`cartId`, `update`): `Promise`<`Cart`\>

Updates the currently selected payment session.

#### Parameters

| Name     | Type     | Description                                          |
| :------- | :------- | :--------------------------------------------------- |
| `cartId` | `string` | the id of the cart to update the payment session for |
| `update` | `object` | the data to update the payment session with          |

#### Returns

`Promise`<`Cart`\>

the resulting cart

#### Defined in

[services/cart.ts:1148](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1148)

---

### updateShippingAddress\_

▸ `Protected` **updateShippingAddress\_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

Updates the cart's shipping address.

#### Parameters

| Name          | Type                                                  | Description                               |
| :------------ | :---------------------------------------------------- | :---------------------------------------- |
| `cart`        | `Cart`                                                | the cart to update                        |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> | the value to set the shipping address to  |
| `addrRepo`    | `AddressRepository`                                   | the repository to use for address updates |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[services/cart.ts:959](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L959)

---

### updateUnitPrices\_

▸ `Protected` **updateUnitPrices\_**(`cart`, `regionId?`, `customer_id?`): `Promise`<`void`\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cart`         | `Cart`   |
| `regionId?`    | `string` |
| `customer_id?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1645](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L1645)

---

### validateLineItemShipping\_

▸ `Protected` **validateLineItemShipping\_**(`shippingMethods`, `lineItem`): `boolean`

Checks if a given line item has a shipping method that can fulfill it.
Returns true if all products in the cart can be fulfilled with the current
shipping methods.

#### Parameters

| Name              | Type               | Description                               |
| :---------------- | :----------------- | :---------------------------------------- |
| `shippingMethods` | `ShippingMethod`[] | the set of shipping methods to check from |
| `lineItem`        | `LineItem`         | the line item                             |

#### Returns

`boolean`

boolean representing wheter shipping method is validated

#### Defined in

[services/cart.ts:498](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/cart.ts#L498)

---

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CartService`](CartService.md)

#### Parameters

| Name                  | Type            |
| :-------------------- | :-------------- |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CartService`](CartService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
