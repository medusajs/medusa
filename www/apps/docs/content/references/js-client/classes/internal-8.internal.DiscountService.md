---
displayed_sidebar: jsClientSidebar
---

# Class: DiscountService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).DiscountService

Provides layer to manipulate discounts.

**`Implements`**

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`DiscountService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:22

___

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: `Repository`<[`DiscountCondition`](internal-3.DiscountCondition.md)\> & { `addConditionResources`: (`conditionId`: `string`, `resourceIds`: (`string` \| { `id`: `string`  })[], `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md), `overrideExisting?`: `boolean`) => `Promise`<([`DiscountConditionCustomerGroup`](internal-8.internal.DiscountConditionCustomerGroup.md) \| [`DiscountConditionProduct`](internal-8.internal.DiscountConditionProduct.md) \| [`DiscountConditionProductCollection`](internal-8.internal.DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](internal-8.internal.DiscountConditionProductTag.md) \| [`DiscountConditionProductType`](internal-8.internal.DiscountConditionProductType.md))[]\> ; `canApplyForCustomer`: (`discountRuleId`: `string`, `customerId`: `string`) => `Promise`<`boolean`\> ; `findOneWithDiscount`: (`conditionId`: `string`, `discountId`: `string`) => `Promise`<`undefined` \| [`DiscountCondition`](internal-3.DiscountCondition.md) & { `discount`: [`Discount`](internal-3.Discount.md)  }\> ; `getJoinTableResourceIdentifiers`: (`type`: `string`) => { `conditionTable`: [`DiscountConditionResourceType`](../modules/internal-8.md#discountconditionresourcetype) ; `joinTable`: `string` ; `joinTableForeignKey`: [`DiscountConditionJoinTableForeignKey`](../enums/internal-8.DiscountConditionJoinTableForeignKey.md) ; `joinTableKey`: `string` ; `relatedTable`: `string` ; `resourceKey`: `string`  } ; `isValidForProduct`: (`discountRuleId`: `string`, `productId`: `string`) => `Promise`<`boolean`\> ; `queryConditionTable`: (`__namedParameters`: { `conditionId`: `any` ; `resourceId`: `any` ; `type`: `any`  }) => `Promise`<`number`\> ; `removeConditionResources`: (`id`: `string`, `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md), `resourceIds`: (`string` \| { `id`: `string`  })[]) => `Promise`<`void` \| `DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/discount.d.ts:25

___

### discountConditionService\_

• `Protected` `Readonly` **discountConditionService\_**: [`DiscountConditionService`](internal-8.internal.DiscountConditionService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:26

___

### discountRepository\_

• `Protected` `Readonly` **discountRepository\_**: `Repository`<[`Discount`](internal-3.Discount.md)\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:21

___

### discountRuleRepository\_

• `Protected` `Readonly` **discountRuleRepository\_**: `Repository`<[`DiscountRule`](internal-3.DiscountRule.md)\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:23

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:31

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:32

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: `Repository`<[`GiftCard`](internal-3.GiftCard.md)\> & { `listGiftCardsAndCount`: (`query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`GiftCard`](internal-3.GiftCard.md)\>, `q?`: `string`) => `Promise`<[[`GiftCard`](internal-3.GiftCard.md)[], `number`]\>  }

#### Defined in

packages/medusa/dist/services/discount.d.ts:24

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:28

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:29

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:30

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](internal-8.internal.TotalsService.md)

#### Defined in

packages/medusa/dist/services/discount.d.ts:27

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addRegion

▸ **addRegion**(`discountId`, `regionId`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Adds a region to the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to add |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:123

___

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

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### calculateDiscountForLineItem

▸ **calculateDiscountForLineItem**(`discountId`, `lineItem`, `calculationContextData`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) |
| `calculationContextData` | [`CalculationContextData`](../modules/internal-8.md#calculationcontextdata) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:138

___

### canApplyForCustomer

▸ **canApplyForCustomer**(`discountRuleId`, `customerId`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountRuleId` | `string` |
| `customerId` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:146

___

### create

▸ **create**(`discount`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Creates a discount with provided data given that the data is validated.
Normalizes discount code to uppercase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | [`CreateDiscountInput`](../modules/internal-8.md#creatediscountinput) | the discount data to create |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:74

___

### createDynamicCode

▸ **createDynamicCode**(`discountId`, `data`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Creates a dynamic code for a discount id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `data` | [`CreateDynamicDiscountInput`](../modules/internal-8.md#createdynamicdiscountinput) | the object containing a code to identify the discount by |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the newly created dynamic code

#### Defined in

packages/medusa/dist/services/discount.d.ts:109

___

### delete

▸ **delete**(`discountId`): `Promise`<`void`\>

Deletes a discount idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount to delete |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:136

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`discountId`, `code`): `Promise`<`void`\>

Deletes a dynamic code for a discount id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `code` | `string` | the code to identify the discount by |

#### Returns

`Promise`<`void`\>

the newly created dynamic code

#### Defined in

packages/medusa/dist/services/discount.d.ts:116

___

### hasCustomersGroupCondition

▸ **hasCustomersGroupCondition**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/services/discount.d.ts:140

___

### hasExpired

▸ **hasExpired**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/services/discount.d.ts:143

___

### hasNotStarted

▸ **hasNotStarted**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/services/discount.d.ts:142

___

### hasReachedLimit

▸ **hasReachedLimit**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/services/discount.d.ts:141

___

### isDisabled

▸ **isDisabled**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`boolean`

#### Defined in

packages/medusa/dist/services/discount.d.ts:144

___

### isValidForRegion

▸ **isValidForRegion**(`discount`, `region_id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) |
| `region_id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:145

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`Discount`](internal-3.Discount.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`FilterableDiscountProps`](internal-8.FilterableDiscountProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Discount`](internal-3.Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:61

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`Discount`](internal-3.Discount.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`FilterableDiscountProps`](internal-8.FilterableDiscountProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Discount`](internal-3.Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[[`Discount`](internal-3.Discount.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:67

___

### listByCodes

▸ **listByCodes**(`discountCodes`, `config?`): `Promise`<[`Discount`](internal-3.Discount.md)[]\>

List all the discounts corresponding to the given codes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCodes` | `string`[] | discount codes of discounts to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Discount`](internal-3.Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)[]\>

the discounts

#### Defined in

packages/medusa/dist/services/discount.d.ts:95

___

### removeRegion

▸ **removeRegion**(`discountId`, `regionId`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Removes a region from the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to remove |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:130

___

### retrieve

▸ **retrieve**(`discountId`, `config?`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Gets a discount by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Discount`](internal-3.Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the discount

#### Defined in

packages/medusa/dist/services/discount.d.ts:81

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `config?`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Gets the discount by discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCode` | `string` | discount code of discount to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Discount`](internal-3.Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the discount

#### Defined in

packages/medusa/dist/services/discount.d.ts:88

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`discountId`, `update`): `Promise`<[`Discount`](internal-3.Discount.md)\>

Updates a discount.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | discount id of discount to update |
| `update` | [`UpdateDiscountInput`](../modules/internal-8.md#updatediscountinput) | the data to update the discount with |

#### Returns

`Promise`<[`Discount`](internal-3.Discount.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:102

___

### validateDiscountForCartOrThrow

▸ **validateDiscountForCartOrThrow**(`cart`, `discount`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) |
| `discount` | [`Discount`](internal-3.Discount.md) \| [`Discount`](internal-3.Discount.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:139

___

### validateDiscountForProduct

▸ **validateDiscountForProduct**(`discountRuleId`, `productId?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountRuleId` | `string` |
| `productId?` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/discount.d.ts:137

___

### validateDiscountRule\_

▸ **validateDiscountRule_**<`T`\>(`discountRule`): `T`

Creates a discount rule with provided data given that the data is validated.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountRule` | `T` | the discount rule to create |

#### Returns

`T`

the result of the create operation

#### Defined in

packages/medusa/dist/services/discount.d.ts:52

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DiscountService`](internal-8.internal.DiscountService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DiscountService`](internal-8.internal.DiscountService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
