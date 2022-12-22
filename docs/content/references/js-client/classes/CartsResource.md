# Class: CartsResource

## Hierarchy

- `default`

  ↳ **`CartsResource`**

## Properties

### lineItems

• **lineItems**: [`LineItemsResource`](LineItemsResource.md)

#### Defined in

[medusa-js/src/resources/carts.ts:15](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L15)

## Methods

### addShippingMethod

▸ **addShippingMethod**(`cart_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Adds a shipping method to cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | Id of cart |
| `payload` | [`StorePostCartsCartShippingMethodReq`](internal-35.StorePostCartsCartShippingMethodReq.md) | Containg id of shipping option and optional data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:24](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L24)

___

### complete

▸ **complete**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCompleteCartRes`](../modules/internal-35.md#storecompletecartres)\>

Completes a cart.
Payment authorization is attempted and if more work is required, we simply return the cart for further updates.
If payment is authorized and order is not yet created, we make sure to do so.
The completion of a cart can be performed idempotently with a provided header Idempotency-Key.
If not provuided, we will generate one for the request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCompleteCartRes`](../modules/internal-35.md#storecompletecartres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:43](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L43)

___

### create

▸ **create**(`payload?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Creates a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload?` | [`StorePostCartReq`](internal-35.StorePostCartReq.md) | is optional and can contain a region_id and items. The cart will contain the payload, if provided. Otherwise it will be empty |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:58](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L58)

___

### createPaymentSessions

▸ **createPaymentSessions**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Creates payment sessions.
Initializes the payment sessions that can be used to pay for the items of the cart.
This is usually called when a customer proceeds to checkout.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:74](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L74)

___

### deleteDiscount

▸ **deleteDiscount**(`cart_id`, `code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Removes a discount from cart.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `code` | `string` | discount code to remove |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:89](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L89)

___

### deletePaymentSession

▸ **deletePaymentSession**(`cart_id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Removes a payment session from a cart.
Can be useful in case a payment has failed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `provider_id` | `string` | the provider id of the session e.g. "stripe" |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:106](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L106)

___

### refreshPaymentSession

▸ **refreshPaymentSession**(`cart_id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Refreshes a payment session.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `provider_id` | `string` | the provider id of the session e.g. "stripe" |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:122](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L122)

___

### retrieve

▸ **retrieve**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Retrieves a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:137](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L137)

___

### setPaymentSession

▸ **setPaymentSession**(`cart_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Refreshes a payment session.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `payload` | [`StorePostCartsCartPaymentSessionReq`](internal-35.StorePostCartsCartPaymentSessionReq.md) | the provider id of the session e.g. "stripe" |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:152](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L152)

___

### update

▸ **update**(`cart_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Updates a cart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `payload` | [`StorePostCartsCartReq`](internal-35.StorePostCartsCartReq.md) | is required and can contain region_id, email, billing and shipping address |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:168](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L168)

___

### updatePaymentSession

▸ **updatePaymentSession**(`cart_id`, `provider_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

Updates the payment method

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `provider_id` | `string` | is required |
| `payload` | [`StorePostCartsCartPaymentSessionUpdateReq`](internal-35.StorePostCartsCartPaymentSessionUpdateReq.md) | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCartsRes`](../modules/internal-35.md#storecartsres)\>

#### Defined in

[medusa-js/src/resources/carts.ts:185](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/carts.ts#L185)
