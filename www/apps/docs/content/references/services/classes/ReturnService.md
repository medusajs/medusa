# ReturnService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ReturnService`**

## Constructors

### constructor

**new ReturnService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-31) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/return.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L68)

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

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/return.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L66)

___

### fulfillmentProviderService\_

 `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/return.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L61)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/return.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L58)

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

[packages/medusa/src/services/return.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L63)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[packages/medusa/src/services/return.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L65)

___

### returnItemRepository\_

 `Protected` `Readonly` **returnItemRepository\_**: [`Repository`](Repository.md)<[`ReturnItem`](ReturnItem.md)\>

#### Defined in

[packages/medusa/src/services/return.ts:57](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L57)

___

### returnReasonService\_

 `Protected` `Readonly` **returnReasonService\_**: [`ReturnReasonService`](ReturnReasonService.md)

#### Defined in

[packages/medusa/src/services/return.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L62)

___

### returnRepository\_

 `Protected` `Readonly` **returnRepository\_**: [`Repository`](Repository.md)<[`Return`](Return.md)\>

#### Defined in

[packages/medusa/src/services/return.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L56)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/return.ts:60](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L60)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/return.ts:59](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L59)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/return.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L55)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

**cancel**(`returnId`): `Promise`<[`Return`](Return.md)\>

Cancels a return if possible. Returns can be canceled if it has not been received.

#### Parameters

| Name | Description |
| :------ | :------ |
| `returnId` | `string` | the id of the return to cancel. |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: the updated Return
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:184](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L184)

___

### create

**create**(`data`): `Promise`<[`Return`](Return.md)\>

Creates a return request for an order, with given items, and a shipping
method. If no refund amount is provided the refund amount is calculated from
the return lines and the shipping cost.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateReturnInput`](../index.md#createreturninput) | data to use for the return e.g. shipping_method, items or refund_amount |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: the created return
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:369](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L369)

___

### fulfill

**fulfill**(`returnId`): `Promise`<[`Return`](Return.md)\>

#### Parameters

| Name |
| :------ |
| `returnId` | `string` |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: 
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:535](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L535)

___

### getFulfillmentItems

`Protected` **getFulfillmentItems**(`order`, `items`, `transformer`): `Promise`<[`LineItem`](LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

Retrieves the order line items, given an array of items

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to get line items from |
| `items` | [`OrdersReturnItem`](OrdersReturnItem.md)[] | the items to get |
| `transformer` | [`Transformer`](../index.md#transformer) | a function to apply to each of the items retrieved from the order, should return a line item. If the transformer returns an undefined value the line item will be filtered from the returned array. |

#### Returns

`Promise`<[`LineItem`](LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }[]\>

-`Promise`: the line items generated by the transformer.
	-`[`LineItem`](LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }[]`: 
		-`[`LineItem`](LineItem.md) & { `note?`: `string` ; `reason_id?`: `string`  }`: (optional) 

#### Defined in

[packages/medusa/src/services/return.ts:107](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L107)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Return`](Return.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Return`](Return.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Return`](Return.md)\> | the config object for find |

#### Returns

`Promise`<[`Return`](Return.md)[]\>

-`Promise`: the result of the find operation
	-`Return[]`: 
		-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:147](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L147)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Return`](Return.md)[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Return`](Return.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Return`](Return.md)\> | the config object for find |

#### Returns

`Promise`<[[`Return`](Return.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`Return[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/return.ts:164](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L164)

___

### receive

**receive**(`returnId`, `receivedItems`, `refundAmount?`, `allowMismatch?`, `context?`): `Promise`<[`Return`](Return.md)\>

Registers a previously requested return as received. This will create a
refund to the customer. If the returned items don't match the requested
items the return status will be updated to requires_action. This behaviour
is useful in situations where a custom refund amount is requested, but the
returned items are not matching the requested items. Setting the
allowMismatch argument to true, will process the return, ignoring any
mismatches.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the orderId to return to |
| `receivedItems` | [`OrdersReturnItem`](OrdersReturnItem.md)[] | the items received after return. |
| `refundAmount?` | `number` | the amount to return |
| `allowMismatch` | `boolean` | false | whether to ignore return/received product mismatch |
| `context` | `object` |
| `context.locationId?` | `string` |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: the result of the update operation
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:608](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L608)

___

### retrieve

**retrieve**(`returnId`, `config?`): `Promise`<[`Return`](Return.md)\>

Retrieves a return by its id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `returnId` | `string` | the id of the return to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Return`](Return.md)\> | the config object |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: the return
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:282](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L282)

___

### retrieveBySwap

**retrieveBySwap**(`swapId`, `relations?`): `Promise`<[`Return`](Return.md)\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `swapId` | `string` |
| `relations` | `string`[] | [] |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: 
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:310](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L310)

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

### update

**update**(`returnId`, `update`): `Promise`<[`Return`](Return.md)\>

#### Parameters

| Name |
| :------ |
| `returnId` | `string` |
| `update` | [`UpdateReturnInput`](../index.md#updatereturninput) |

#### Returns

`Promise`<[`Return`](Return.md)\>

-`Promise`: 
	-`Return`: 

#### Defined in

[packages/medusa/src/services/return.ts:335](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L335)

___

### validateReturnLineItem

`Protected` **validateReturnLineItem**(`item?`, `quantity?`, `additional?`): [`DeepPartial`](../index.md#deeppartial)<[`LineItem`](LineItem.md)\>

Checks that a given quantity of a line item can be returned. Fails if the
item is undefined or if the returnable quantity of the item is lower, than
the quantity that is requested to be returned.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `item?` | [`LineItem`](LineItem.md) | the line item to check has sufficient returnable quantity. |
| `quantity` | `number` | 0 | the quantity that is requested to be returned. |
| `additional` | `object` | the quantity that is requested to be returned. |
| `additional.note?` | `string` |
| `additional.reason_id?` | `string` |

#### Returns

[`DeepPartial`](../index.md#deeppartial)<[`LineItem`](LineItem.md)\>

-`DeepPartial`: a line item where the quantity is set to the requested
  return quantity.
	-`LineItem`: 

#### Defined in

[packages/medusa/src/services/return.ts:240](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L240)

___

### validateReturnStatuses

`Protected` **validateReturnStatuses**(`order`): `void`

Checks that an order has the statuses necessary to complete a return.
fulfillment_status cannot be not_fulfilled or returned.
payment_status must be captured.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to check statuses on |

#### Returns

`void`

-`void`: (optional) 

**Throws**

when statuses are not sufficient for returns.

#### Defined in

[packages/medusa/src/services/return.ts:210](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/return.ts#L210)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ReturnService`](ReturnService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ReturnService`](ReturnService.md)

-`ReturnService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
