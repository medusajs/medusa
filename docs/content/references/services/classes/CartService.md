# Class: CartService

## Hierarchy

- `TransactionBaseService`<[`CartService`](CartService.md)\>

  ↳ **`CartService`**

## Constructors

### constructor

• **new CartService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;CartService\&gt;.constructor

#### Defined in

[services/cart.ts:107](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L107)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/cart.ts:87](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L87)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/cart.ts:86](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L86)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### customShippingOptionService\_

• `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[services/cart.ts:103](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L103)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/cart.ts:96](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L96)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[services/cart.ts:98](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L98)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/cart.ts:90](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L90)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[services/cart.ts:99](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L99)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[services/cart.ts:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L102)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[services/cart.ts:105](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L105)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/cart.ts:89](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L89)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/cart.ts:94](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L94)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/cart.ts:82](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L82)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/cart.ts:95](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L95)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[services/cart.ts:88](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L88)

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[services/cart.ts:104](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L104)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/cart.ts:92](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L92)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/cart.ts:91](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L91)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/cart.ts:93](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L93)

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/cart.ts:85](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L85)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/cart.ts:97](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L97)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/cart.ts:100](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L100)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/cart.ts:101](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L101)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/cart.ts:83](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L83)

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

[services/cart.ts:76](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L76)

## Methods

### addLineItem

▸ **addLineItem**(`cartId`, `lineItem`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `lineItem` | `LineItem` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:533](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L533)

___

### addShippingMethod

▸ **addShippingMethod**(`cartId`, `optionId`, `data?`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `optionId` | `string` |  |
| `data` | `Record`<`string`, `unknown`\> |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1539](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1539)

___

### adjustFreeShipping\_

▸ `Protected` **adjustFreeShipping_**(`cart`, `shouldAdd`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `shouldAdd` | `boolean` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:685](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L685)

___

### applyDiscount

▸ **applyDiscount**(`cart`, `discountCode`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `discountCode` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1056](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1056)

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

[services/cart.ts:1020](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1020)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### authorizePayment

▸ **authorizePayment**(`cartId`, `context?`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `context` | `Record`<`string`, `unknown`\> |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1195](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1195)

___

### create

▸ **create**(`data`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CartCreateProps` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:334](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L334)

___

### createOrFetchUserFromEmail\_

▸ `Protected` **createOrFetchUserFromEmail_**(`email`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/cart.ts:898](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L898)

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

[services/cart.ts:1940](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1940)

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

[services/cart.ts:209](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L209)

___

### delete

▸ **delete**(`cartId`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1855](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1855)

___

### deleteMetadata

▸ **deleteMetadata**(`cartId`, `key`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `key` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1997](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1997)

___

### deletePaymentSession

▸ **deletePaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1447](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1447)

___

### findCustomShippingOption

▸ **findCustomShippingOption**(`cartCustomShippingOptions`, `optionId`): `undefined` \| `CustomShippingOption`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartCustomShippingOptions` | `CustomShippingOption`[] |  |
| `optionId` | `string` |  |

#### Returns

`undefined` \| `CustomShippingOption`

#### Defined in

[services/cart.ts:1643](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1643)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Cart`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCartProps` |  |
| `config` | `FindConfig`<`Cart`\> |  |

#### Returns

`Promise`<`Cart`[]\>

#### Defined in

[services/cart.ts:259](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L259)

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

[services/cart.ts:1971](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1971)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1495](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1495)

___

### removeDiscount

▸ **removeDiscount**(`cartId`, `discountCode`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `discountCode` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1116](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1116)

___

### removeLineItem

▸ **removeLineItem**(`cartId`, `lineItemId`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `lineItemId` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:437](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L437)

___

### retrieve

▸ **retrieve**(`cartId`, `options?`, `totalsConfig?`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `options` | `FindConfig`<`Cart`\> |  |
| `totalsConfig` | `TotalsConfig` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:282](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L282)

___

### setMetadata

▸ **setMetadata**(`cartId`, `key`, `value`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `key` | `string` |  |
| `value` | `string` \| `number` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1898](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1898)

___

### setPaymentSession

▸ **setPaymentSession**(`cartId`, `providerId`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `providerId` | `string` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1266](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1266)

___

### setPaymentSessions

▸ **setPaymentSessions**(`cartOrCartId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrCartId` | `string` \| `Cart` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1339](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1339)

___

### setRegion\_

▸ `Protected` **setRegion_**(`cart`, `regionId`, `countryCode`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `regionId` | `string` |  |
| `countryCode` | ``null`` \| `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:1722](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1722)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[services/cart.ts:158](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L158)

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

[services/cart.ts:728](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L728)

___

### updateBillingAddress\_

▸ `Protected` **updateBillingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> |  |
| `addrRepo` | `AddressRepository` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:931](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L931)

___

### updateCustomerId\_

▸ `Protected` **updateCustomerId_**(`cart`, `customerId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `customerId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:880](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L880)

___

### updateLineItem

▸ **updateLineItem**(`cartId`, `lineItemId`, `lineItemUpdate`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `lineItemId` | `string` |  |
| `lineItemUpdate` | `LineItemUpdate` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:620](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L620)

___

### updatePaymentSession

▸ **updatePaymentSession**(`cartId`, `update`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` |  |
| `update` | `object` |  |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:1160](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1160)

___

### updateShippingAddress\_

▸ `Protected` **updateShippingAddress_**(`cart`, `addressOrId`, `addrRepo`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `addressOrId` | `string` \| `AddressPayload` \| `Partial`<`Address`\> |  |
| `addrRepo` | `AddressRepository` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:971](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L971)

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

[services/cart.ts:1662](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L1662)

___

### validateLineItemShipping\_

▸ `Protected` **validateLineItemShipping_**(`shippingMethods`, `lineItem`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethods` | `ShippingMethod`[] |  |
| `lineItem` | `LineItem` |  |

#### Returns

`boolean`

#### Defined in

[services/cart.ts:503](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/cart.ts#L503)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CartService`](CartService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CartService`](CartService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
