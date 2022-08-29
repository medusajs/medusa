# Class: AdminOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminOrdersResource`**

## Methods

### addShippingMethod

▸ **addShippingMethod**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShippingMethodsReq`](internal-12.AdminPostOrdersOrderShippingMethodsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:144](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L144)

___

### archive

▸ **archive**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:153](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L153)

___

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:136](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L136)

___

### cancelClaim

▸ **cancelClaim**(`id`, `claimId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:217](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L217)

___

### cancelClaimFulfillment

▸ **cancelClaimFulfillment**(`id`, `claimId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:108](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L108)

___

### cancelFulfillment

▸ **cancelFulfillment**(`id`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:89](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L89)

___

### cancelSwap

▸ **cancelSwap**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:170](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L170)

___

### cancelSwapFulfillment

▸ **cancelSwapFulfillment**(`id`, `swapId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:98](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L98)

___

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:63](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L63)

___

### complete

▸ **complete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:55](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L55)

___

### createClaim

▸ **createClaim**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsReq`](internal-12.AdminPostOrdersOrderClaimsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:208](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L208)

___

### createClaimShipment

▸ **createClaimShipment**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimShipmentsReq`](internal-12.AdminPostOrdersOrderClaimsClaimShipmentsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:246](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L246)

___

### createFulfillment

▸ **createFulfillment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderFulfillmentsReq`](internal-12.AdminPostOrdersOrderFulfillmentsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:80](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L80)

___

### createShipment

▸ **createShipment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShipmentReq`](internal-12.AdminPostOrdersOrderShipmentReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:118](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L118)

___

### createSwap

▸ **createSwap**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsReq`](internal-12.AdminPostOrdersOrderSwapsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:161](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L161)

___

### createSwapShipment

▸ **createSwapShipment**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapShipmentsReq`](internal-12.AdminPostOrdersOrderSwapsSwapShipmentsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:189](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L189)

___

### fulfillClaim

▸ **fulfillClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimFulfillmentsReq`](internal-12.AdminPostOrdersOrderClaimsClaimFulfillmentsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:236](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L236)

___

### fulfillSwap

▸ **fulfillSwap**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapFulfillmentsReq`](internal-12.AdminPostOrdersOrderSwapsSwapFulfillmentsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:179](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L179)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal-12.md#adminorderslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetOrdersParams`](internal-12.AdminGetOrdersParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal-12.md#adminorderslistres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:41](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L41)

___

### processSwapPayment

▸ **processSwapPayment**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:199](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L199)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderRefundsReq`](internal-12.AdminPostOrdersOrderRefundsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:71](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L71)

___

### requestReturn

▸ **requestReturn**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReturnsReq`](internal-12.AdminPostOrdersOrderReturnsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:127](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L127)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:33](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L33)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReq`](internal-12.AdminPostOrdersOrderReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:24](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L24)

___

### updateClaim

▸ **updateClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimReq`](internal-12.AdminPostOrdersOrderClaimsClaimReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal-12.md#adminordersres)\>

#### Defined in

[medusa-js/src/resources/admin/orders.ts:226](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/admin/orders.ts#L226)
