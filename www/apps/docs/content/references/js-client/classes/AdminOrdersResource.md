---
displayed_sidebar: jsClientSidebar
---

# Class: AdminOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminOrdersResource`**

## Methods

### addShippingMethod

▸ **addShippingMethod**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShippingMethodsReq`](internal-8.internal.AdminPostOrdersOrderShippingMethodsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:152](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L152)

___

### archive

▸ **archive**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:161](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L161)

___

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:144](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L144)

___

### cancelClaim

▸ **cancelClaim**(`id`, `claimId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:225](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L225)

___

### cancelClaimFulfillment

▸ **cancelClaimFulfillment**(`id`, `claimId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:116](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L116)

___

### cancelFulfillment

▸ **cancelFulfillment**(`id`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:97](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L97)

___

### cancelSwap

▸ **cancelSwap**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:178](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L178)

___

### cancelSwapFulfillment

▸ **cancelSwapFulfillment**(`id`, `swapId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:106](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L106)

___

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:71](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L71)

___

### complete

▸ **complete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:63](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L63)

___

### createClaim

▸ **createClaim**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsReq`](internal-8.internal.AdminPostOrdersOrderClaimsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:216](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L216)

___

### createClaimShipment

▸ **createClaimShipment**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimShipmentsReq`](internal-8.internal.AdminPostOrdersOrderClaimsClaimShipmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:254](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L254)

___

### createFulfillment

▸ **createFulfillment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderFulfillmentsReq`](internal-8.internal.AdminPostOrdersOrderFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:88](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L88)

___

### createShipment

▸ **createShipment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShipmentReq`](internal-8.internal.AdminPostOrdersOrderShipmentReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:126](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L126)

___

### createSwap

▸ **createSwap**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsReq`](internal-8.internal.AdminPostOrdersOrderSwapsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:169](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L169)

___

### createSwapShipment

▸ **createSwapShipment**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapShipmentsReq`](internal-8.internal.AdminPostOrdersOrderSwapsSwapShipmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:197](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L197)

___

### fulfillClaim

▸ **fulfillClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimFulfillmentsReq`](internal-8.internal.AdminPostOrdersOrderClaimsClaimFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:244](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L244)

___

### fulfillSwap

▸ **fulfillSwap**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapFulfillmentsReq`](internal-8.internal.AdminPostOrdersOrderSwapsSwapFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:187](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L187)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal-8.internal.md#adminorderslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetOrdersParams`](internal-8.internal.AdminGetOrdersParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal-8.internal.md#adminorderslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:49](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L49)

___

### processSwapPayment

▸ **processSwapPayment**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:207](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L207)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderRefundsReq`](internal-8.internal.AdminPostOrdersOrderRefundsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:79](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L79)

___

### requestReturn

▸ **requestReturn**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReturnsReq`](internal-8.internal.AdminPostOrdersOrderReturnsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:135](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L135)

___

### retrieve

▸ **retrieve**(`id`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `query?` | [`FindParams`](internal-6.FindParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:34](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L34)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReq`](internal-8.internal.AdminPostOrdersOrderReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:25](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L25)

___

### updateClaim

▸ **updateClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimReq`](internal-8.internal.AdminPostOrdersOrderClaimsClaimReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-8.internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:234](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/orders.ts#L234)
