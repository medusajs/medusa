# Class: AdminOrdersResource

## Hierarchy

- `default`

  ↳ **`AdminOrdersResource`**

## Methods

### addShippingMethod

▸ **addShippingMethod**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShippingMethodsReq`](internal.AdminPostOrdersOrderShippingMethodsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:153](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L153)

___

### archive

▸ **archive**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:162](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L162)

___

### cancel

▸ **cancel**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:145](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L145)

___

### cancelClaim

▸ **cancelClaim**(`id`, `claimId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:226](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L226)

___

### cancelClaimFulfillment

▸ **cancelClaimFulfillment**(`id`, `claimId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:117](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L117)

___

### cancelFulfillment

▸ **cancelFulfillment**(`id`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:98](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L98)

___

### cancelSwap

▸ **cancelSwap**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:179](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L179)

___

### cancelSwapFulfillment

▸ **cancelSwapFulfillment**(`id`, `swapId`, `fulfillmentId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `fulfillmentId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:107](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L107)

___

### capturePayment

▸ **capturePayment**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:72](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L72)

___

### complete

▸ **complete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:64](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L64)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostOrdersReq`](internal.AdminPostOrdersReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L25)

___

### createClaim

▸ **createClaim**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsReq`](internal.AdminPostOrdersOrderClaimsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:217](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L217)

___

### createClaimShipment

▸ **createClaimShipment**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimShipmentsReq`](internal.AdminPostOrdersOrderClaimsClaimShipmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:255](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L255)

___

### createFulfillment

▸ **createFulfillment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderFulfillmentsReq`](internal.AdminPostOrdersOrderFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:89](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L89)

___

### createShipment

▸ **createShipment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderShipmentReq`](internal.AdminPostOrdersOrderShipmentReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:127](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L127)

___

### createSwap

▸ **createSwap**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsReq`](internal.AdminPostOrdersOrderSwapsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:170](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L170)

___

### createSwapShipment

▸ **createSwapShipment**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapShipmentsReq`](internal.AdminPostOrdersOrderSwapsSwapShipmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:198](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L198)

___

### deleteMetadata

▸ **deleteMetadata**(`id`, `key`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `key` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:265](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L265)

___

### fulfillClaim

▸ **fulfillClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimFulfillmentsReq`](internal.AdminPostOrdersOrderClaimsClaimFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:245](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L245)

___

### fulfillSwap

▸ **fulfillSwap**(`id`, `swapId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `payload` | [`AdminPostOrdersOrderSwapsSwapFulfillmentsReq`](internal.AdminPostOrdersOrderSwapsSwapFulfillmentsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:188](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L188)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal.md#adminorderslistres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetOrdersParams`](internal.AdminGetOrdersParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersListRes`](../modules/internal.md#adminorderslistres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:50](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L50)

___

### processSwapPayment

▸ **processSwapPayment**(`id`, `swapId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `swapId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:208](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L208)

___

### refundPayment

▸ **refundPayment**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderRefundsReq`](internal.AdminPostOrdersOrderRefundsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:80](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L80)

___

### requestReturn

▸ **requestReturn**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReturnsReq`](internal.AdminPostOrdersOrderReturnsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:136](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L136)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:42](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L42)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostOrdersOrderReq`](internal.AdminPostOrdersOrderReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:33](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L33)

___

### updateClaim

▸ **updateClaim**(`id`, `claimId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `claimId` | `string` |
| `payload` | [`AdminPostOrdersOrderClaimsClaimReq`](internal.AdminPostOrdersOrderClaimsClaimReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminOrdersRes`](../modules/internal.md#adminordersres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/orders.ts:235](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/orders.ts#L235)
