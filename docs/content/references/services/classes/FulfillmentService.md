# Class: FulfillmentService

## Hierarchy

- `TransactionBaseService`<[`FulfillmentService`](FulfillmentService.md)\>

  ↳ **`FulfillmentService`**

## Constructors

### constructor

• **new FulfillmentService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;FulfillmentService\&gt;.constructor

#### Defined in

[services/fulfillment.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L47)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[services/fulfillment.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L42)

___

### fulfillmentRepository\_

• `Protected` `Readonly` **fulfillmentRepository\_**: typeof `FulfillmentRepository`

#### Defined in

[services/fulfillment.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L43)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/fulfillment.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L45)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/fulfillment.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/fulfillment.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L36)

___

### shippingProfileService\_

• `Protected` `Readonly` **shippingProfileService\_**: [`ShippingProfileService`](ShippingProfileService.md)

#### Defined in

[services/fulfillment.ts:41](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L41)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/fulfillment.ts:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L39)

___

### trackingLinkRepository\_

• `Protected` `Readonly` **trackingLinkRepository\_**: typeof `TrackingLinkRepository`

#### Defined in

[services/fulfillment.ts:44](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L44)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/fulfillment.ts:37](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L37)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentOrId`): `Promise`<`Fulfillment`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentOrId` | `string` \| `Fulfillment` |  |

#### Returns

`Promise`<`Fulfillment`\>

#### Defined in

[services/fulfillment.ts:254](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L254)

___

### createFulfillment

▸ **createFulfillment**(`order`, `itemsToFulfill`, `custom?`): `Promise`<`Fulfillment`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `CreateFulfillmentOrder` |  |
| `itemsToFulfill` | `FulFillmentItemType`[] |  |
| `custom` | `Partial`<`Fulfillment`\> |  |

#### Returns

`Promise`<`Fulfillment`[]\>

#### Defined in

[services/fulfillment.ts:199](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L199)

___

### createShipment

▸ **createShipment**(`fulfillmentId`, `trackingLinks`, `config?`): `Promise`<`Fulfillment`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fulfillmentId` | `string` |  |
| `trackingLinks` | { `tracking_number`: `string`  }[] |  |
| `config` | `CreateShipmentConfig` |  |

#### Returns

`Promise`<`Fulfillment`\>

#### Defined in

[services/fulfillment.ts:304](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L304)

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`): `Promise`<(``null`` \| `LineItem`)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `CreateFulfillmentOrder` |  |
| `items` | `FulFillmentItemType`[] |  |

#### Returns

`Promise`<(``null`` \| `LineItem`)[]\>

#### Defined in

[services/fulfillment.ts:109](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L109)

___

### partitionItems\_

▸ **partitionItems_**(`shippingMethods`, `items`): `FulfillmentItemPartition`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod`[] |
| `items` | `LineItem`[] |

#### Returns

`FulfillmentItemPartition`[]

#### Defined in

[services/fulfillment.ts:71](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L71)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Fulfillment`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`Fulfillment`\> |  |

#### Returns

`Promise`<`Fulfillment`\>

#### Defined in

[services/fulfillment.ts:166](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L166)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### validateFulfillmentLineItem\_

▸ **validateFulfillmentLineItem_**(`item`, `quantity`): ``null`` \| `LineItem`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `undefined` \| `LineItem` |  |
| `quantity` | `number` |  |

#### Returns

``null`` \| `LineItem`

#### Defined in

[services/fulfillment.ts:134](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/fulfillment.ts#L134)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`FulfillmentService`](FulfillmentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`FulfillmentService`](FulfillmentService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
