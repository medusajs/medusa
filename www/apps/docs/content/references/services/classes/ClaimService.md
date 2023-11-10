# ClaimService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ClaimService`**

## Constructors

### constructor

**new ClaimService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-4.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/claim.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L87)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

 `Protected` `Readonly` **addressRepository\_**: [`Repository`](Repository.md)<[`Address`](Address.md)\>

#### Defined in

[packages/medusa/src/services/claim.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L69)

___

### claimItemService\_

 `Protected` `Readonly` **claimItemService\_**: [`ClaimItemService`](ClaimItemService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:73](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L73)

___

### claimRepository\_

 `Protected` `Readonly` **claimRepository\_**: [`Repository`](Repository.md)<[`ClaimOrder`](ClaimOrder.md)\>

#### Defined in

[packages/medusa/src/services/claim.ts:70](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L70)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:74](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L74)

___

### fulfillmentProviderService\_

 `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:75](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L75)

___

### fulfillmentService\_

 `Protected` `Readonly` **fulfillmentService\_**: [`FulfillmentService`](FulfillmentService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:76](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L76)

___

### lineItemRepository\_

 `Protected` `Readonly` **lineItemRepository\_**: [`Repository`](Repository.md)<[`LineItem`](LineItem.md)\> & { `findByReturn`: Method findByReturn  }

#### Defined in

[packages/medusa/src/services/claim.ts:72](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L72)

___

### lineItemService\_

 `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L77)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:78](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L78)

___

### productVariantInventoryService\_

 `Protected` `Readonly` **productVariantInventoryService\_**: [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:85](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L85)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:79](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L79)

___

### returnService\_

 `Protected` `Readonly` **returnService\_**: [`ReturnService`](ReturnService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:80](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L80)

___

### shippingMethodRepository\_

 `Protected` `Readonly` **shippingMethodRepository\_**: [`Repository`](Repository.md)<[`ShippingMethod`](ShippingMethod.md)\>

#### Defined in

[packages/medusa/src/services/claim.ts:71](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L71)

___

### shippingOptionService\_

 `Protected` `Readonly` **shippingOptionService\_**: [`ShippingOptionService`](ShippingOptionService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:81](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L81)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:82](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L82)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/claim.ts:83](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L83)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

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

[packages/medusa/src/services/claim.ts:60](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L60)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cancel

**cancel**(`id`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: 
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:815](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L815)

___

### cancelFulfillment

**cancelFulfillment**(`fulfillmentId`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name |
| :------ |
| `fulfillmentId` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: 
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:663](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L663)

___

### create

**create**(`data`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

Creates a Claim on an Order. Claims consists of items that are claimed and
optionally items to be sent as replacement for the claimed items. The
shipping address that the new items will be shipped to

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`CreateClaimInput`](../types/CreateClaimInput.md) | the object containing all data required to create a claim |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: created claim
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:332](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L332)

___

### createFulfillment

**createFulfillment**(`id`, `config?`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the object containing all data required to create a claim |
| `config` | `object` | config object |
| `config.location_id?` | `string` |
| `config.metadata?` | Record<`string`, `unknown`\> | config metadata |
| `config.no_notification?` | `boolean` | config no notification |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: created claim
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:513](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L513)

___

### createShipment

**createShipment**(`id`, `fulfillmentId`, `trackingLinks?`, `config?`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `id` | `string` |
| `fulfillmentId` | `string` |
| `trackingLinks` | { `tracking_number`: `string`  }[] | [] |
| `config` | `object` |
| `config.metadata` | `object` |
| `config.no_notification` | `undefined` | undefined |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: 
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:735](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L735)

___

### getRefundTotalForClaimLinesOnOrder

`Protected` **getRefundTotalForClaimLinesOnOrder**(`order`, `claimItems`): `Promise`<`number`\>

Finds claim line items on an order and calculates the refund amount.
There are three places too look:
- Order items
- Swap items
- Claim items (from previous claims)
Note, it will attempt to return early from each of these places to avoid having to iterate over all items every time.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to find claim lines on |
| `claimItems` | [`CreateClaimItemInput`](../types/CreateClaimItemInput.md)[] | the claim items to match against |

#### Returns

`Promise`<`number`\>

-`Promise`: the refund amount
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/claim.ts:274](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L274)

___

### list

**list**(`selector`, `config?`): `Promise`<[`ClaimOrder`](ClaimOrder.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ClaimOrder`](ClaimOrder.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)[]\>

-`Promise`: the result of the find operation
	-`ClaimOrder[]`: 
		-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:871](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L871)

___

### processRefund

**processRefund**(`id`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: 
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:689](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L689)

___

### retrieve

**retrieve**(`claimId`, `config?`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

Gets an order by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `claimId` | `string` | id of the claim order to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ClaimOrder`](ClaimOrder.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: the order document
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:890](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L890)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`id`, `data`): `Promise`<[`ClaimOrder`](ClaimOrder.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `data` | [`UpdateClaimInput`](../types/UpdateClaimInput.md) |

#### Returns

`Promise`<[`ClaimOrder`](ClaimOrder.md)\>

-`Promise`: 
	-`ClaimOrder`: 

#### Defined in

[packages/medusa/src/services/claim.ts:126](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L126)

___

### validateCreateClaimInput

`Protected` **validateCreateClaimInput**(`data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateClaimInput`](../types/CreateClaimInput.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/claim.ts:207](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/claim.ts#L207)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ClaimService`](ClaimService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ClaimService`](ClaimService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
