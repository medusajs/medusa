# SwapService

Handles swaps

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`SwapService`**

## Constructors

### constructor

**new SwapService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedProps`](../index.md#injectedprops) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/swap.ts:92](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L92)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cartService\_

 `Protected` `Readonly` **cartService\_**: [`CartService`](CartService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:78](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L78)

___

### customShippingOptionService\_

 `Protected` `Readonly` **customShippingOptionService\_**: [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:88](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L88)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L79)

___

### fulfillmentService\_

 `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L84)

___

### lineItemAdjustmentService\_

 `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:87](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L87)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:83](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L83)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### orderService\_

 `Protected` `Readonly` **orderService\_**: [`OrderService`](OrderService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:80](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L80)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:86](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L86)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:90](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L90)

___

### returnService\_

 `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L81)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:85](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L85)

___

### swapRepository\_

 `Protected` `Readonly` **swapRepository\_**: [`Repository`](Repository.md)<[`Swap`](Swap.md)\>

#### Defined in

[packages/medusa/src/services/swap.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L76)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/swap.ts:82](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L82)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `FULFILLMENT_CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `PAYMENT_COMPLETED` | `string` |
| `PROCESS_REFUND_FAILED` | `string` |
| `RECEIVED` | `string` |
| `REFUND_PROCESSED` | `string` |
| `SHIPMENT_CREATED` | `string` |

#### Defined in

[packages/medusa/src/services/swap.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L64)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### areReturnItemsValid

`Protected` **areReturnItemsValid**(`returnItems`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `returnItems` | [`WithRequiredProperty`](../index.md#withrequiredproperty)<[`Partial`](../index.md#partial)<[`ReturnItem`](ReturnItem.md)\>, ``"item_id"``\>[] |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/swap.ts:1241](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L1241)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancel

**cancel**(`swapId`): `Promise`<[`Swap`](Swap.md)\>

Cancels a given swap if possible. A swap can only be canceled if all
related returns, fulfillments, and payments have been canceled. If a swap
is associated with a refund, it cannot be canceled.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | the id of the swap to cancel. |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the canceled swap.
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:858](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L858)

___

### cancelFulfillment

**cancelFulfillment**(`fulfillmentId`): `Promise`<[`Swap`](Swap.md)\>

Cancels a fulfillment (if related to a swap)

#### Parameters

| Name | Description |
| :------ | :------ |
| `fulfillmentId` | `string` | the ID of the fulfillment to cancel |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: updated swap
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:1060](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L1060)

___

### create

**create**(`order`, `returnItems`, `additionalItems?`, `returnShipping?`, `custom?`): `Promise`<[`Swap`](Swap.md)\>

Creates a swap from an order, with given return items, additional items
and an optional return shipping method.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to base the swap off |
| `returnItems` | [`WithRequiredProperty`](../index.md#withrequiredproperty)<[`Partial`](../index.md#partial)<[`ReturnItem`](ReturnItem.md)\>, ``"item_id"``\>[] | the items to return in the swap |
| `additionalItems?` | [`Pick`](../index.md#pick)<[`LineItem`](LineItem.md), ``"variant_id"`` \| ``"quantity"``\>[] | the items to send to the customer |
| `returnShipping?` | `object` | an optional shipping method for returning the returnItems |
| `returnShipping.option_id` | `string` |
| `returnShipping.price?` | `number` |
| `custom` | `object` | contains relevant custom information. This object may include no_notification which will disable sending notification when creating swap. If set, it overrules the attribute inherited from the order |
| `custom.allow_backorder?` | `boolean` |
| `custom.idempotency_key?` | `string` |
| `custom.location_id?` | `string` |
| `custom.no_notification?` | `boolean` |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the newly created swap
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:322](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L322)

___

### createCart

**createCart**(`swapId`, `customShippingOptions?`, `context?`): `Promise`<[`Swap`](Swap.md)\>

Creates a cart from the given swap. The cart can be used to pay
for differences associated with the swap. The swap represented by the
swapId must belong to the order. Fails if there is already a cart on the
swap.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `swapId` | `string` | the id of the swap to create the cart from |
| `customShippingOptions` | { `option_id`: `string` ; `price`: `number`  }[] | [] | the shipping options |
| `context` | `object` |
| `context.sales_channel_id?` | `string` |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the swap with its cart_id prop set to the id of the new cart.
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:578](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L578)

___

### createFulfillment

**createFulfillment**(`swapId`, `config?`): `Promise`<[`Swap`](Swap.md)\>

Fulfills the additional items associated with the swap. Will call the
fulfillment providers associated with the shipping methods.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | the id of the swap to fulfill, |
| `config` | [`CreateShipmentConfig`](../index.md#createshipmentconfig) | optional configurations, includes optional metadata to attach to the shipment, and a no_notification flag. |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the updated swap with new status and fulfillments.
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:920](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L920)

___

### createShipment

**createShipment**(`swapId`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`Swap`](Swap.md)\>

Marks a fulfillment as shipped and attaches tracking numbers.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | the id of the swap that has been shipped. |
| `fulfillmentId` | `string` | the id of the specific fulfillment that has been shipped |
| `trackingLinks?` | { `tracking_number`: `string`  }[] | the tracking numbers associated with the shipment |
| `config` | [`CreateShipmentConfig`](../index.md#createshipmentconfig) | optional configurations, includes optional metadata to attach to the shipment, and a noNotification flag. |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the updated swap with new fulfillments and status.
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:1091](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L1091)

___

### deleteMetadata

**deleteMetadata**(`swapId`, `key`): `Promise`<[`Swap`](Swap.md)\>

Dedicated method to delete metadata for a swap.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: resolves to the updated result.
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:1169](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L1169)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Swap`](Swap.md)[]\>

List swaps.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Swap`](Swap.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`Swap`](Swap.md)[]\>

-`Promise`: the result of the find operation
	-`Swap[]`: 
		-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:274](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L274)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Swap`](Swap.md)[], `number`]\>

List swaps.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Swap`](Swap.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`Swap`](Swap.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`Swap[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/swap.ts:294](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L294)

___

### processDifference

**processDifference**(`swapId`): `Promise`<[`Swap`](Swap.md)\>

Process difference for the requested swap.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | id of a swap being processed |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: processed swap
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:422](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L422)

___

### registerCartCompletion

**registerCartCompletion**(`swapId`): `Promise`<[`Swap`](Swap.md)\>

Register a cart completion

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | The id of the swap |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: swap related to the cart
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:725](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L725)

___

### registerReceived

**registerReceived**(`id`): `Promise`<[`Swap`](Swap.md)\>

Registers the swap return items as received so that they cannot be used
as a part of other swaps/returns.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `any` | the id of the order with the swap. |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the resulting order
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:1207](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L1207)

___

### retrieve

**retrieve**(`swapId`, `config?`): `Promise`<[`Swap`](Swap.md)\>

Retrieves a swap with the given id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | the id of the swap to retrieve |
| `config` | [`Omit`](../index.md#omit)<[`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } | the configuration to retrieve the swap |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the swap
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:204](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L204)

___

### retrieveByCartId

**retrieveByCartId**(`cartId`, `relations?`): `Promise`<[`Swap`](Swap.md)\>

Retrieves a swap based on its associated cart id

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | the cart id that the swap's cart has |
| `relations` | `undefined` \| `string`[] | [] | the relations to retrieve swap |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: the swap
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:247](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L247)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### transformQueryForCart

`Protected` **transformQueryForCart**(`config`): [`Omit`](../index.md#omit)<[`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof [`Cart`](Cart.md)[]  }

Transform find config object for retrieval.

#### Parameters

| Name | Description |
| :------ | :------ |
| `config` | [`Omit`](../index.md#omit)<[`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } | parsed swap find config |

#### Returns

[`Omit`](../index.md#omit)<[`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof [`Cart`](Cart.md)[]  }

-`[`Omit`](../index.md#omit)<[`FindConfig`](../interfaces/FindConfig.md)<[`Swap`](Swap.md)\>, ``"select"``\> & { `select?`: `string`[]  } & { `cartRelations`: `undefined` \| `string`[] ; `cartSelects`: `undefined` \| keyof [`Cart`](Cart.md)[]  }`: (optional) transformed find swap config

#### Defined in

[packages/medusa/src/services/swap.ts:131](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L131)

___

### update

**update**(`swapId`, `update`): `Promise`<[`Swap`](Swap.md)\>

Update the swap record.

#### Parameters

| Name | Description |
| :------ | :------ |
| `swapId` | `string` | id of a swap to update |
| `update` | [`Partial`](../index.md#partial)<[`Swap`](Swap.md)\> | new data |

#### Returns

`Promise`<[`Swap`](Swap.md)\>

-`Promise`: updated swap record
	-`Swap`: 

#### Defined in

[packages/medusa/src/services/swap.ts:545](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/swap.ts#L545)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`SwapService`](SwapService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`SwapService`](SwapService.md)

-`SwapService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
