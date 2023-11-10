# TransactionBaseService

## Hierarchy

- **`TransactionBaseService`**

  ↳ [`AnalyticsConfigService`](AnalyticsConfigService.md)

  ↳ [`AuthService`](AuthService.md)

  ↳ [`BatchJobService`](BatchJobService.md)

  ↳ [`CartService`](CartService.md)

  ↳ [`ClaimService`](ClaimService.md)

  ↳ [`ClaimItemService`](ClaimItemService.md)

  ↳ [`CurrencyService`](CurrencyService.md)

  ↳ [`CustomShippingOptionService`](CustomShippingOptionService.md)

  ↳ [`CustomerService`](CustomerService.md)

  ↳ [`CustomerGroupService`](CustomerGroupService.md)

  ↳ [`DiscountService`](DiscountService.md)

  ↳ [`DiscountConditionService`](DiscountConditionService.md)

  ↳ [`DraftOrderService`](DraftOrderService.md)

  ↳ [`EventBusService`](EventBusService.md)

  ↳ [`FulfillmentService`](FulfillmentService.md)

  ↳ [`FulfillmentProviderService`](FulfillmentProviderService.md)

  ↳ [`GiftCardService`](GiftCardService.md)

  ↳ [`IdempotencyKeyService`](IdempotencyKeyService.md)

  ↳ [`LineItemService`](LineItemService.md)

  ↳ [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

  ↳ [`NewTotalsService`](NewTotalsService.md)

  ↳ [`NoteService`](NoteService.md)

  ↳ [`NotificationService`](NotificationService.md)

  ↳ [`OauthService`](OauthService.md)

  ↳ [`OrderService`](OrderService.md)

  ↳ [`OrderEditService`](OrderEditService.md)

  ↳ [`OrderEditItemChangeService`](OrderEditItemChangeService.md)

  ↳ [`PaymentService`](PaymentService.md)

  ↳ [`PaymentCollectionService`](PaymentCollectionService.md)

  ↳ [`PaymentProviderService`](PaymentProviderService.md)

  ↳ [`PriceListService`](PriceListService.md)

  ↳ [`PricingService`](PricingService.md)

  ↳ [`ProductService`](ProductService.md)

  ↳ [`ProductCategoryService`](ProductCategoryService.md)

  ↳ [`ProductCollectionService`](ProductCollectionService.md)

  ↳ [`ProductTypeService`](ProductTypeService.md)

  ↳ [`ProductVariantService`](ProductVariantService.md)

  ↳ [`ProductVariantInventoryService`](ProductVariantInventoryService.md)

  ↳ [`RegionService`](RegionService.md)

  ↳ [`ReturnService`](ReturnService.md)

  ↳ [`ReturnReasonService`](ReturnReasonService.md)

  ↳ [`SalesChannelService`](SalesChannelService.md)

  ↳ [`SalesChannelInventoryService`](SalesChannelInventoryService.md)

  ↳ [`SalesChannelLocationService`](SalesChannelLocationService.md)

  ↳ [`ShippingOptionService`](ShippingOptionService.md)

  ↳ [`ShippingProfileService`](ShippingProfileService.md)

  ↳ [`StagedJobService`](StagedJobService.md)

  ↳ [`StoreService`](StoreService.md)

  ↳ [`StrategyResolverService`](StrategyResolverService.md)

  ↳ [`SwapService`](SwapService.md)

  ↳ [`SystemPaymentProviderService`](SystemPaymentProviderService.md)

  ↳ [`TaxProviderService`](TaxProviderService.md)

  ↳ [`TaxRateService`](TaxRateService.md)

  ↳ [`TotalsService`](TotalsService.md)

  ↳ [`UserService`](UserService.md)

  ↳ [`AbstractNotificationService`](AbstractNotificationService.md)

  ↳ [`AbstractPaymentService`](AbstractPaymentService.md)

  ↳ [`AbstractBatchJobStrategy`](AbstractBatchJobStrategy.md)

  ↳ [`INotificationService`](../interfaces/INotificationService.md)

  ↳ [`IBatchJobStrategy`](../interfaces/IBatchJobStrategy.md)

## Constructors

### constructor

`Protected` **new TransactionBaseService**(`__container__`, `__configModule__?`, `__moduleDeclaration__?`)

#### Parameters

| Name |
| :------ |
| `__container__` | `any` |
| `__configModule__?` | Record<`string`, `unknown`\> |
| `__moduleDeclaration__?` | Record<`string`, `unknown`\> |

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

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

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`TransactionBaseService`](TransactionBaseService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`TransactionBaseService`](TransactionBaseService.md)

-`TransactionBaseService`: 

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
