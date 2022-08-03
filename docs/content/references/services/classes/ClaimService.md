# Class: ClaimService

## Hierarchy

- `TransactionBaseService`<[`ClaimService`](ClaimService.md), `InjectedDependencies`\>

  ↳ **`ClaimService`**

## Constructors

### constructor

• **new ClaimService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;
  ClaimService,
  InjectedDependencies
\&gt;.constructor

#### Defined in

[services/claim.ts:85](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L85)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/claim.ts:68](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L68)

___

### claimItemService\_

• `Protected` `Readonly` **claimItemService\_**: [`ClaimItemService`](ClaimItemService.md)

#### Defined in

[services/claim.ts:72](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L72)

___

### claimRepository\_

• `Protected` `Readonly` **claimRepository\_**: typeof `ClaimRepository`

#### Defined in

[services/claim.ts:69](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L69)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `InjectedDependencies`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/claim.ts:73](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L73)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[services/claim.ts:74](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L74)

___

### fulfillmentService\_

• `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[services/claim.ts:75](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L75)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: [`InventoryService`](InventoryService.md)

#### Defined in

[services/claim.ts:76](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L76)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/claim.ts:71](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L71)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/claim.ts:77](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L77)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/claim.ts:65](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L65)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[services/claim.ts:78](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L78)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/claim.ts:79](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L79)

___

### returnService\_

• `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[services/claim.ts:80](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L80)

___

### shippingMethodRepository\_

• `Protected` `Readonly` **shippingMethodRepository\_**: typeof `ShippingMethodRepository`

#### Defined in

[services/claim.ts:70](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L70)

___

### shippingOptionService\_

• `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[services/claim.ts:81](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L81)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/claim.ts:82](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L82)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/claim.ts:83](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L83)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/claim.ts:66](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L66)

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/claim.ts:56](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L56)

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

### cancel

▸ **cancel**(`id`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:753](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L753)

___

### cancelFulfillment

▸ **cancelFulfillment**(`fulfillmentId`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fulfillmentId` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:602](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L602)

___

### create

▸ **create**(`data`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateClaimInput` |  |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:217](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L217)

___

### createFulfillment

▸ **createFulfillment**(`id`, `config?`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `Object` |  |
| `config.metadata?` | `Record`<`string`, `unknown`\> |  |
| `config.no_notification?` | `boolean` |  |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:456](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L456)

___

### createShipment

▸ **createShipment**(`id`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `fulfillmentId` | `string` | `undefined` |
| `trackingLinks` | { `tracking_number`: `string`  }[] | `[]` |
| `config` | `Object` | `undefined` |
| `config.metadata` | `Object` | `{}` |
| `config.no_notification` | `undefined` | `undefined` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:674](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L674)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ClaimOrder`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `FindConfig`<`ClaimOrder`\> |  |

#### Returns

`Promise`<`ClaimOrder`[]\>

#### Defined in

[services/claim.ts:809](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L809)

___

### processRefund

▸ **processRefund**(`id`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:628](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L628)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`ClaimOrder`\> |  |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:834](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L834)

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

### update

▸ **update**(`id`, `data`): `Promise`<`ClaimOrder`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateClaimInput` |

#### Returns

`Promise`<`ClaimOrder`\>

#### Defined in

[services/claim.ts:127](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim.ts#L127)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimService`](ClaimService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimService`](ClaimService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
