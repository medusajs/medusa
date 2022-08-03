# Class: PaymentProviderService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`PaymentProviderService`**

## Constructors

### constructor

• **new PaymentProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `any` |

#### Overrides

BaseService.constructor

#### Defined in

[services/payment-provider.js:8](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L8)

## Properties

### manager\_

• **manager\_**: `any`

#### Defined in

[services/payment-provider.js:14](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L14)

___

### paymentRepository\_

• **paymentRepository\_**: `any`

#### Defined in

[services/payment-provider.js:18](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L18)

___

### paymentSessionRepository\_

• **paymentSessionRepository\_**: `any`

#### Defined in

[services/payment-provider.js:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L16)

___

### refundRepository\_

• **refundRepository\_**: `any`

#### Defined in

[services/payment-provider.js:20](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L20)

## Methods

### authorizePayment

▸ **authorizePayment**(`paymentSession`, `context`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `any` |
| `context` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:283](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L283)

___

### cancelPayment

▸ **cancelPayment**(`paymentObj`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:324](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L324)

___

### capturePayment

▸ **capturePayment**(`paymentObj`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentObj` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:343](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L343)

___

### createPayment

▸ **createPayment**(`cart`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:246](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L246)

___

### createSession

▸ **createSession**(`providerId`, `cart`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` |  |
| `cart` | `Cart` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:121](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L121)

___

### deleteSession

▸ **deleteSession**(`paymentSession`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentSession` | `any` |

#### Returns

`any`

#### Defined in

[services/payment-provider.js:202](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L202)

___

### getStatus

▸ **getStatus**(`payment`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:338](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L338)

___

### list

▸ **list**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L47)

___

### listPayments

▸ **listPayments**(`selector`, `config?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `selector` | `any` | `undefined` |
| `config` | `Object` | `undefined` |
| `config.order` | `Object` | `undefined` |
| `config.order.created_at` | `string` | `"DESC"` |
| `config.skip` | `number` | `0` |
| `config.take` | `number` | `50` |

#### Returns

`any`

#### Defined in

[services/payment-provider.js:80](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L80)

___

### refreshSession

▸ **refreshSession**(`paymentSession`, `cart`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `PaymentSession` |  |
| `cart` | `Cart` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:152](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L152)

___

### refundPayment

▸ **refundPayment**(`payObjs`, `amount`, `reason`, `note`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payObjs` | `any` |
| `amount` | `any` |
| `reason` | `any` |
| `note` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:358](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L358)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/payment-provider.js:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L35)

___

### retrievePayment

▸ **retrievePayment**(`id`, `relations?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `any` | `undefined` |
| `relations` | `any`[] | `[]` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:54](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L54)

___

### retrieveProvider

▸ **retrieveProvider**(`providerId`): `PaymentService`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `providerId` | `string` |  |

#### Returns

`PaymentService`

#### Defined in

[services/payment-provider.js:228](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L228)

___

### retrieveRefund

▸ **retrieveRefund**(`id`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `config` | `Object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:422](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L422)

___

### retrieveSession

▸ **retrieveSession**(`id`, `relations?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `any` | `undefined` |
| `relations` | `any`[] | `[]` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:89](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L89)

___

### updatePayment

▸ **updatePayment**(`paymentId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentId` | `any` |
| `update` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:266](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L266)

___

### updateSession

▸ **updateSession**(`paymentSession`, `cart`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentSession` | `PaymentSession` |  |
| `cart` | `Cart` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:188](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L188)

___

### updateSessionData

▸ **updateSessionData**(`paySession`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paySession` | `any` |
| `update` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/payment-provider.js:308](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L308)

___

### withTransaction

▸ **withTransaction**(`manager`): [`PaymentProviderService`](PaymentProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `manager` | `any` |

#### Returns

[`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/payment-provider.js:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/payment-provider.js#L23)
