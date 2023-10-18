---
displayed_sidebar: jsClientSidebar
---

# Class: OrdersResource

## Hierarchy

- `default`

  ↳ **`OrdersResource`**

## Methods

### confirmRequest

▸ **confirmRequest**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerAcceptClaimReq`](internal-8.internal.StorePostCustomersCustomerAcceptClaimReq.md) | signed token to grant access |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)

**`Description`**

Grant access to a list of orders

#### Defined in

[packages/medusa-js/src/resources/orders.ts:78](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/orders.ts#L78)

___

### lookupOrder

▸ **lookupOrder**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StoreGetOrdersParams`](internal-8.internal.StoreGetOrdersParams.md) | details used to look up the order |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

**`Description`**

Look up an order using order details

#### Defined in

[packages/medusa-js/src/resources/orders.ts:46](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/orders.ts#L46)

___

### requestCustomerOrders

▸ **requestCustomerOrders**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerOrderClaimReq`](internal-8.internal.StorePostCustomersCustomerOrderClaimReq.md) | display ids of orders to request |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)

**`Description`**

Request access to a list of orders

#### Defined in

[packages/medusa-js/src/resources/orders.ts:64](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/orders.ts#L64)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

**`Description`**

Retrieves an order

#### Defined in

[packages/medusa-js/src/resources/orders.ts:18](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/orders.ts#L18)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-8.internal.md#storeordersres)\>

**`Description`**

Retrieves an order by cart id

#### Defined in

[packages/medusa-js/src/resources/orders.ts:32](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/orders.ts#L32)
