# Class: OrdersResource

## Hierarchy

- `default`

  ↳ **`OrdersResource`**

## Methods

### lookupOrder

▸ **lookupOrder**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

**`description`** Look up an order using order details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StoreGetOrdersParams`](internal.StoreGetOrdersParams.md) | details used to look up the order |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

#### Defined in

[packages/medusa-js/src/resources/orders.ts:35](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/orders.ts#L35)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

**`description`** Retrieves an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

#### Defined in

[packages/medusa-js/src/resources/orders.ts:13](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/orders.ts#L13)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

**`description`** Retrieves an order by cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal.md#storeordersres)\>

#### Defined in

[packages/medusa-js/src/resources/orders.ts:24](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/orders.ts#L24)
