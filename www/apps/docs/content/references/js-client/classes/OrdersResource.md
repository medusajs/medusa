# Class: OrdersResource

## Hierarchy

- `default`

  ↳ **`OrdersResource`**

## Methods

### confirmRequest

▸ **confirmRequest**(`payload`, `customHeaders?`): `ResponsePromise`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersCustomerAcceptClaimReq` | signed token to grant access |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`

**`Description`**

Grant access to a list of orders

#### Defined in

[orders.ts:78](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/orders.ts#L78)

___

### lookupOrder

▸ **lookupOrder**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreOrdersRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StoreGetOrdersParams` | details used to look up the order |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreOrdersRes`\>

**`Description`**

Look up an order using order details

#### Defined in

[orders.ts:46](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/orders.ts#L46)

___

### requestCustomerOrders

▸ **requestCustomerOrders**(`payload`, `customHeaders?`): `ResponsePromise`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersCustomerOrderClaimReq` | display ids of orders to request |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`

**`Description`**

Request access to a list of orders

#### Defined in

[orders.ts:64](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/orders.ts#L64)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`StoreOrdersRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreOrdersRes`\>

**`Description`**

Retrieves an order

#### Defined in

[orders.ts:18](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/orders.ts#L18)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): `ResponsePromise`<`StoreOrdersRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreOrdersRes`\>

**`Description`**

Retrieves an order by cart id

#### Defined in

[orders.ts:32](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/orders.ts#L32)
