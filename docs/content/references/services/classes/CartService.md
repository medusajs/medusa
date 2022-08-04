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

[services/cart.ts:120](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L120)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/cart.ts:97](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L97)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/cart.ts:96](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L96)

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

[services/cart.ts:115](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L115)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/cart.ts:108](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L108)

___

### discountService\_

• `Protected` `Readonly` **discountService\_**: [`DiscountService`](DiscountService.md)

#### Defined in

[services/cart.ts:110](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L110)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/cart.ts:100](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L100)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[services/cart.ts:118](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L118)

___

### giftCardService\_

• `Protected` `Readonly` **giftCardService\_**: [`GiftCardService`](GiftCardService.md)

#### Defined in

[services/cart.ts:111](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L111)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[services/cart.ts:114](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L114)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[services/cart.ts:117](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L117)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/cart.ts:99](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L99)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/cart.ts:106](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L106)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/cart.ts:92](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L92)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/cart.ts:107](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L107)

___

### paymentSessionRepository\_

• `Protected` `Readonly` **paymentSessionRepository\_**: typeof `PaymentSessionRepository`

#### Defined in

[services/cart.ts:98](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L98)

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[services/cart.ts:116](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L116)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/cart.ts:102](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L102)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/cart.ts:101](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L101)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/cart.ts:105](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L105)

___

### salesChannelService\_

• `Protected` `Readonly` **salesChannelService\_**: [`SalesChannelService`](SalesChannelService.md)

#### Defined in

[services/cart.ts:104](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L104)

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/cart.ts:95](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L95)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/cart.ts:109](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L109)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[services/cart.ts:103](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L103)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/cart.ts:112](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L112)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/cart.ts:113](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L113)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/cart.ts:93](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L93)

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

[services/cart.ts:86](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L86)

## Methods

### addLineItem

▸ **addLineItem**(`cartId`, `lineItem`, `config?`): `Promise`<`Cart`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartId` | `string` | `undefined` |  |
| `lineItem` | `LineItem` | `undefined` |  |
| `config` | `Object` | `undefined` |  |
| `config.validateSalesChannels` | `boolean` | `true` | - |

#### Returns

`Promise`<`Cart`\>

#### Defined in

[services/cart.ts:606](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L606)

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

[services/cart.ts:1692](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1692)

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

[services/cart.ts:773](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L773)

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

[services/cart.ts:1209](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1209)

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

[services/cart.ts:1173](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1173)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

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

[services/cart.ts:1348](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1348)

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

[services/cart.ts:343](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L343)

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

[services/cart.ts:1051](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1051)

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

[services/cart.ts:2093](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L2093)

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

[services/cart.ts:228](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L228)

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

[services/cart.ts:2008](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L2008)

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

[services/cart.ts:2150](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L2150)

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

[services/cart.ts:1600](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1600)

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

[services/cart.ts:1796](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1796)

___

### getValidatedSalesChannel

▸ `Protected` **getValidatedSalesChannel**(`salesChannelId?`): `Promise`<`SalesChannel`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId?` | `string` |

#### Returns

`Promise`<`SalesChannel`\>

#### Defined in

[services/cart.ts:446](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L446)

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

[services/cart.ts:278](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L278)

___

### onSalesChannelChange

▸ `Protected` **onSalesChannelChange**(`cart`, `newSalesChannelId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `newSalesChannelId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/cart.ts:997](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L997)

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

[services/cart.ts:2124](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L2124)

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

[services/cart.ts:1648](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1648)

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

[services/cart.ts:1269](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1269)

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

[services/cart.ts:478](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L478)

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

[services/cart.ts:296](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L296)

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

[services/cart.ts:2051](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L2051)

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

[services/cart.ts:1419](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1419)

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

[services/cart.ts:1492](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1492)

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

[services/cart.ts:1875](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1875)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[services/cart.ts:177](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L177)

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

[services/cart.ts:816](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L816)

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

[services/cart.ts:1084](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1084)

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

[services/cart.ts:1033](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1033)

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

[services/cart.ts:708](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L708)

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

[services/cart.ts:1313](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1313)

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

[services/cart.ts:1124](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1124)

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

[services/cart.ts:1815](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L1815)

___

### validateLineItem

▸ `Protected` **validateLineItem**(`cart`, `lineItem`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` |  |
| `lineItem` | `LineItem` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[services/cart.ts:575](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L575)

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

[services/cart.ts:544](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/cart.ts#L544)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
