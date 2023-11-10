# DiscountService

Provides layer to manipulate discounts.

**Implements**

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`DiscountService`**

## Constructors

### constructor

**new DiscountService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `Object` |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/discount.ts:71](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L71)

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

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:58](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L58)

___

### discountConditionRepository\_

 `Protected` `Readonly` **discountConditionRepository\_**: [`Repository`](Repository.md)<[`DiscountCondition`](DiscountCondition.md)\> & { `addConditionResources`: Method addConditionResources ; `canApplyForCustomer`: Method canApplyForCustomer ; `findOneWithDiscount`: Method findOneWithDiscount ; `getJoinTableResourceIdentifiers`: Method getJoinTableResourceIdentifiers ; `isValidForProduct`: Method isValidForProduct ; `queryConditionTable`: Method queryConditionTable ; `removeConditionResources`: Method removeConditionResources  }

#### Defined in

[packages/medusa/src/services/discount.ts:62](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L62)

___

### discountConditionService\_

 `Protected` `Readonly` **discountConditionService\_**: [`DiscountConditionService`](DiscountConditionService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:63](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L63)

___

### discountRepository\_

 `Protected` `Readonly` **discountRepository\_**: [`Repository`](Repository.md)<[`Discount`](Discount.md)\>

#### Defined in

[packages/medusa/src/services/discount.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L57)

___

### discountRuleRepository\_

 `Protected` `Readonly` **discountRuleRepository\_**: [`Repository`](Repository.md)<[`DiscountRule`](DiscountRule.md)\>

#### Defined in

[packages/medusa/src/services/discount.ts:59](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L59)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L68)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/discount.ts:69](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L69)

___

### giftCardRepository\_

 `Protected` `Readonly` **giftCardRepository\_**: [`Repository`](Repository.md)<[`GiftCard`](GiftCard.md)\> & { `listGiftCardsAndCount`: Method listGiftCardsAndCount  }

#### Defined in

[packages/medusa/src/services/discount.ts:60](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L60)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:65](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L65)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L66)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:67](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L67)

___

### totalsService\_

 `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[packages/medusa/src/services/discount.ts:64](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L64)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

### addRegion

**addRegion**(`discountId`, `regionId`): `Promise`<[`Discount`](Discount.md)\>

Adds a region to the discount regions array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to add |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the result of the update operation
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:503](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L503)

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

### calculateDiscountForLineItem

**calculateDiscountForLineItem**(`discountId`, `lineItem`, `calculationContextData`): `Promise`<`number`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` |
| `lineItem` | [`LineItem`](LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `calculationContextData` | [`CalculationContextData`](../types/CalculationContextData.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:599](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L599)

___

### canApplyForCustomer

**canApplyForCustomer**(`discountRuleId`, `customerId`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `discountRuleId` | `string` |
| `customerId` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:791](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L791)

___

### create

**create**(`discount`): `Promise`<[`Discount`](Discount.md)\>

Creates a discount with provided data given that the data is validated.
Normalizes discount code to uppercase.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`CreateDiscountInput`](../types/CreateDiscountInput.md) | the discount data to create |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the result of the create operation
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:178](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L178)

___

### createDynamicCode

**createDynamicCode**(`discountId`, `data`): `Promise`<[`Discount`](Discount.md)\>

Creates a dynamic code for a discount id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `data` | [`CreateDynamicDiscountInput`](../types/CreateDynamicDiscountInput.md) | the object containing a code to identify the discount by |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the newly created dynamic code
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:431](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L431)

___

### delete

**delete**(`discountId`): `Promise`<`void`\>

Deletes a discount idempotently

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | id of discount to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the delete operation

#### Defined in

[packages/medusa/src/services/discount.ts:563](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L563)

___

### deleteDynamicCode

**deleteDynamicCode**(`discountId`, `code`): `Promise`<`void`\>

Deletes a dynamic code for a discount id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `code` | `string` | the code to identify the discount by |

#### Returns

`Promise`<`void`\>

-`Promise`: the newly created dynamic code

#### Defined in

[packages/medusa/src/services/discount.ts:482](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L482)

___

### hasCustomersGroupCondition

**hasCustomersGroupCondition**(`discount`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:744](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L744)

___

### hasExpired

**hasExpired**(`discount`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:760](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L760)

___

### hasNotStarted

**hasNotStarted**(`discount`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:756](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L756)

___

### hasReachedLimit

**hasReachedLimit**(`discount`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:750](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L750)

___

### isDisabled

**isDisabled**(`discount`): `boolean`

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:768](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L768)

___

### isValidForRegion

**isValidForRegion**(`discount`, `region_id`): `Promise`<`boolean`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |
| `region_id` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:772](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L772)

___

### list

**list**(`selector?`, `config?`): `Promise`<[`Discount`](Discount.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterableDiscountProps`](FilterableDiscountProps.md) | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Discount`](Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](Discount.md)[]\>

-`Promise`: the result of the find operation
	-`Discount[]`: 
		-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:125](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L125)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[[`Discount`](Discount.md)[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterableDiscountProps`](FilterableDiscountProps.md) | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Discount`](Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[[`Discount`](Discount.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`Discount[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:142](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L142)

___

### listByCodes

**listByCodes**(`discountCodes`, `config?`): `Promise`<[`Discount`](Discount.md)[]\>

List all the discounts corresponding to the given codes

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountCodes` | `string`[] | discount codes of discounts to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Discount`](Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](Discount.md)[]\>

-`Promise`: the discounts
	-`Discount[]`: 
		-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:307](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L307)

___

### removeRegion

**removeRegion**(`discountId`, `regionId`): `Promise`<[`Discount`](Discount.md)\>

Removes a region from the discount regions array.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to remove |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the result of the update operation
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:538](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L538)

___

### retrieve

**retrieve**(`discountId`, `config?`): `Promise`<[`Discount`](Discount.md)\>

Gets a discount by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | id of discount to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Discount`](Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the discount
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:244](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L244)

___

### retrieveByCode

**retrieveByCode**(`discountCode`, `config?`): `Promise`<[`Discount`](Discount.md)\>

Gets the discount by discount code.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountCode` | `string` | discount code of discount to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Discount`](Discount.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the discount
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:278](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L278)

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

**update**(`discountId`, `update`): `Promise`<[`Discount`](Discount.md)\>

Updates a discount.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountId` | `string` | discount id of discount to update |
| `update` | [`UpdateDiscountInput`](../types/UpdateDiscountInput.md) | the data to update the discount with |

#### Returns

`Promise`<[`Discount`](Discount.md)\>

-`Promise`: the result of the update operation
	-`Discount`: 

#### Defined in

[packages/medusa/src/services/discount.ts:338](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L338)

___

### validateDiscountForCartOrThrow

**validateDiscountForCartOrThrow**(`cart`, `discount`): `Promise`<`void`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | [`Cart`](Cart.md) | A cart represents a virtual shopping bag. It can be used to complete an order, a swap, or a claim. |
| `discount` | [`Discount`](Discount.md) \| [`Discount`](Discount.md)[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/discount.ts:672](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L672)

___

### validateDiscountForProduct

**validateDiscountForProduct**(`discountRuleId`, `productId?`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `discountRuleId` | `string` |
| `productId?` | `string` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/discount.ts:577](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L577)

___

### validateDiscountRule\_

**validateDiscountRule_**<`T`\>(`discountRule`): `T`

Creates a discount rule with provided data given that the data is validated.

| Name | Type |
| :------ | :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `discountRule` | `T` | the discount rule to create |

#### Returns

`T`

#### Defined in

[packages/medusa/src/services/discount.ts:107](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/discount.ts#L107)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`DiscountService`](DiscountService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`DiscountService`](DiscountService.md)

-`DiscountService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
