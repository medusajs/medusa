# Class: OrdersResource

## Hierarchy

- `default`

  ↳ **`OrdersResource`**

## Methods

### lookupOrder

▸ **lookupOrder**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

**`Description`**

Look up an order using order details

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StoreGetOrdersParams`](internal-35.StoreGetOrdersParams.md) | details used to look up the order |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:41](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/orders.ts#L41)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

**`Description`**

Retrieves an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/orders.ts#L13)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cart_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

**`Description`**

Retrieves an order by cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart_id` | `string` | is required |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreOrdersRes`](../modules/internal-35.md#storeordersres)\>

#### Defined in

[medusa-js/src/resources/orders.ts:27](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/orders.ts#L27)
