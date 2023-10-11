---
displayed_sidebar: jsClientSidebar
---

# Class: TransactionBaseService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).TransactionBaseService

## Hierarchy

- **`TransactionBaseService`**

  ↳ [`IBatchJobStrategy`](../interfaces/internal-8.internal.IBatchJobStrategy.md)

  ↳ [`AbstractBatchJobStrategy`](internal-8.internal.AbstractBatchJobStrategy.md)

  ↳ [`AbstractCartCompletionStrategy`](internal-8.internal.AbstractCartCompletionStrategy.md)

  ↳ [`IFileService`](../interfaces/internal-8.internal.IFileService.md)

  ↳ [`AbstractFileService`](internal-8.internal.AbstractFileService.md)

  ↳ [`INotificationService`](../interfaces/internal-8.internal.INotificationService.md)

  ↳ [`AbstractNotificationService`](internal-8.internal.AbstractNotificationService.md)

  ↳ [`PaymentService`](../interfaces/internal-8.internal.PaymentService.md)

  ↳ [`AbstractPaymentService`](internal-8.internal.AbstractPaymentService.md)

  ↳ [`AbstractPriceSelectionStrategy`](internal-8.internal.AbstractPriceSelectionStrategy.md)

  ↳ [`AnalyticsConfigService`](internal-8.internal.AnalyticsConfigService.md)

  ↳ [`AuthService`](internal-8.internal.AuthService.md)

  ↳ [`BatchJobService`](internal-8.internal.BatchJobService.md)

  ↳ [`CartService`](internal-8.internal.CartService.md)

  ↳ [`ClaimService`](internal-8.internal.ClaimService.md)

  ↳ [`ClaimItemService`](internal-8.internal.ClaimItemService.md)

  ↳ [`CurrencyService`](internal-8.internal.CurrencyService.md)

  ↳ [`CustomShippingOptionService`](internal-8.internal.CustomShippingOptionService.md)

  ↳ [`CustomerService`](internal-8.internal.CustomerService.md)

  ↳ [`CustomerGroupService`](internal-8.internal.CustomerGroupService.md)

  ↳ [`DiscountService`](internal-8.internal.DiscountService.md)

  ↳ [`DiscountConditionService`](internal-8.internal.DiscountConditionService.md)

  ↳ [`DraftOrderService`](internal-8.internal.DraftOrderService.md)

  ↳ [`EventBusService`](internal-8.internal.EventBusService.md)

  ↳ [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

  ↳ [`GiftCardService`](internal-8.internal.GiftCardService.md)

  ↳ [`IdempotencyKeyService`](internal-8.internal.IdempotencyKeyService.md)

  ↳ [`LineItemService`](internal-8.internal.LineItemService.md)

  ↳ [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

  ↳ [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

  ↳ [`NoteService`](internal-8.internal.NoteService.md)

  ↳ [`NotificationService`](internal-8.internal.NotificationService.md)

  ↳ [`OauthService`](internal-8.internal.OauthService.md)

  ↳ [`OrderService`](internal-8.internal.OrderService.md)

  ↳ [`OrderEditService`](internal-8.internal.OrderEditService.md)

  ↳ [`OrderEditItemChangeService`](internal-8.internal.OrderEditItemChangeService.md)

  ↳ [`PaymentCollectionService`](internal-8.internal.PaymentCollectionService.md)

  ↳ [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

  ↳ [`PriceListService`](internal-8.internal.PriceListService.md)

  ↳ [`PricingService`](internal-8.internal.PricingService.md)

  ↳ [`ProductService`](internal-8.internal.ProductService.md)

  ↳ [`ProductCategoryService`](internal-8.internal.ProductCategoryService.md)

  ↳ [`ProductCollectionService`](internal-8.internal.ProductCollectionService.md)

  ↳ [`ProductTypeService`](internal-8.internal.ProductTypeService.md)

  ↳ [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

  ↳ [`ProductVariantInventoryService`](internal-8.internal.ProductVariantInventoryService.md)

  ↳ [`RegionService`](internal-8.internal.RegionService.md)

  ↳ [`ReturnService`](internal-8.internal.ReturnService.md)

  ↳ [`ReturnReasonService`](internal-8.internal.ReturnReasonService.md)

  ↳ [`SalesChannelService`](internal-8.internal.SalesChannelService.md)

  ↳ [`SalesChannelInventoryService`](internal-8.internal.SalesChannelInventoryService.md)

  ↳ [`SalesChannelLocationService`](internal-8.internal.SalesChannelLocationService.md)

  ↳ [`ShippingOptionService`](internal-8.internal.ShippingOptionService.md)

  ↳ [`ShippingProfileService`](internal-8.internal.ShippingProfileService.md)

  ↳ [`StagedJobService`](internal-8.internal.StagedJobService.md)

  ↳ [`StoreService`](internal-8.internal.StoreService.md)

  ↳ [`StrategyResolverService`](internal-8.internal.StrategyResolverService.md)

  ↳ [`SwapService`](internal-8.internal.SwapService.md)

  ↳ [`SystemPaymentProviderService`](internal-8.internal.SystemPaymentProviderService.md)

  ↳ [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

  ↳ [`TaxRateService`](internal-8.internal.TaxRateService.md)

  ↳ [`TotalsService`](internal-8.internal.TotalsService.md)

  ↳ [`UserService`](internal-8.internal.UserService.md)

  ↳ [`FulfillmentService`](internal-8.FulfillmentService.md)

  ↳ [`PaymentService`](internal-8.PaymentService.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
