# Class: OrdersResource

## Hierarchy

- `default`

  ↳ **`OrdersResource`**

## Methods

### confirmRequest

▸ **confirmRequest**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

**`Description`**

Grant access to a list of orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerAcceptClaimReq`](internal-41.StorePostCustomersCustomerAcceptClaimReq.md) | signed token to grant access |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/orders.ts:78](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/orders.ts#L78)

___

### lookupOrder

▸ **lookupOrder**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

**`Description`**

Look up an order using order details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StoreGetOrdersParams`](internal-41.StoreGetOrdersParams.md) | details used to look up the order |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:46](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/orders.ts#L46)

___

### requestCustomerOrders

▸ **requestCustomerOrders**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

**`Description`**

Request access to a list of orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerOrderClaimReq`](internal-41.StorePostCustomersCustomerOrderClaimReq.md) | display ids of orders to request |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<`any`\>

#### Defined in

[medusa-js/src/resources/orders.ts:64](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/orders.ts#L64)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

**`Description`**

Retrieves an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:18](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/orders.ts#L18)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

**`Description`**

Retrieves an order by cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-41.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:32](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/orders.ts#L32)
