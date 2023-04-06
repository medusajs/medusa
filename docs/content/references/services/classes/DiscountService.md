# Class: DiscountService

Provides layer to manipulate discounts.

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`DiscountService`**

## Constructors

### constructor

• **new DiscountService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/discount.ts:65](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L65)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/discount.ts:52](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L52)

___

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: `Repository`<`DiscountCondition`\> & { `addConditionResources`: (`conditionId`: `string`, `resourceIds`: (`string` \| { `id`: `string`  })[], `type`: `DiscountConditionType`, `overrideExisting`: `boolean`) => `Promise`<(`DiscountConditionProduct` \| `DiscountConditionProductType` \| `DiscountConditionProductCollection` \| `DiscountConditionProductTag` \| `DiscountConditionCustomerGroup`)[]\> ; `canApplyForCustomer`: (`discountRuleId`: `string`, `customerId`: `string`) => `Promise`<`boolean`\> ; `findOneWithDiscount`: (`conditionId`: `string`, `discountId`: `string`) => `Promise`<`undefined` \| `DiscountCondition` & { `discount`: `Discount`  }\> ; `getJoinTableResourceIdentifiers`: (`type`: `string`) => { `conditionTable`: `DiscountConditionResourceType` ; `joinTable`: `string` ; `joinTableForeignKey`: `DiscountConditionJoinTableForeignKey` ; `joinTableKey`: `string` ; `resourceKey`: `string`  } ; `isValidForProduct`: (`discountRuleId`: `string`, `productId`: `string`) => `Promise`<`boolean`\> ; `queryConditionTable`: (`__namedParameters`: `Object`) => `Promise`<`number`\> ; `removeConditionResources`: (`id`: `string`, `type`: `DiscountConditionType`, `resourceIds`: (`string` \| { `id`: `string`  })[]) => `Promise`<`void` \| `DeleteResult`\>  }

#### Defined in

[medusa/src/services/discount.ts:56](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L56)

___

### discountConditionService\_

• `Protected` `Readonly` **discountConditionService\_**: [`DiscountConditionService`](DiscountConditionService.md)

#### Defined in

[medusa/src/services/discount.ts:57](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L57)

___

### discountRepository\_

• `Protected` `Readonly` **discountRepository\_**: `Repository`<`Discount`\>

#### Defined in

[medusa/src/services/discount.ts:51](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L51)

___

### discountRuleRepository\_

• `Protected` `Readonly` **discountRuleRepository\_**: `Repository`<`DiscountRule`\>

#### Defined in

[medusa/src/services/discount.ts:53](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L53)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/discount.ts:62](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L62)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/discount.ts:63](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L63)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: `Repository`<`GiftCard`\> & { `listGiftCardsAndCount`: (`query`: `ExtendedFindConfig`<`GiftCard`\>, `q?`: `string`) => `Promise`<[`GiftCard`[], `number`]\>  }

#### Defined in

[medusa/src/services/discount.ts:54](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L54)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[medusa/src/services/discount.ts:59](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L59)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/discount.ts:60](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L60)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/discount.ts:61](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L61)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[medusa/src/services/discount.ts:58](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L58)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addRegion

▸ **addRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

Adds a region to the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to add |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[medusa/src/services/discount.ts:497](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L497)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculateDiscountForLineItem

▸ **calculateDiscountForLineItem**(`discountId`, `lineItem`, `calculationContextData`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `lineItem` | `LineItem` |
| `calculationContextData` | `CalculationContextData` |

#### Returns

`Promise`<`number`\>

#### Defined in

[medusa/src/services/discount.ts:599](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L599)

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

[medusa/src/services/discount.ts:778](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L778)

___

### create

▸ **create**(`discount`): `Promise`<`Discount`\>

Creates a discount with provided data given that the data is validated.
Normalizes discount code to uppercase.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | `CreateDiscountInput` | the discount data to create |

#### Returns

`Promise`<`Discount`\>

the result of the create operation

#### Defined in

[medusa/src/services/discount.ts:172](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L172)

___

### createDynamicCode

▸ **createDynamicCode**(`discountId`, `data`): `Promise`<`Discount`\>

Creates a dynamic code for a discount id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | the id of the discount to create a code for |
| `data` | `CreateDynamicDiscountInput` | the object containing a code to identify the discount by |

#### Returns

`Promise`<`Discount`\>

the newly created dynamic code

#### Defined in

[medusa/src/services/discount.ts:425](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L425)

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

[medusa/src/services/discount.ts:557](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L557)

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

[medusa/src/services/discount.ts:476](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L476)

___

### hasExpired

▸ **hasExpired**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[medusa/src/services/discount.ts:747](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L747)

___

### hasNotStarted

▸ **hasNotStarted**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[medusa/src/services/discount.ts:743](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L743)

___

### hasReachedLimit

▸ **hasReachedLimit**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[medusa/src/services/discount.ts:737](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L737)

___

### isDisabled

▸ **isDisabled**(`discount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |

#### Returns

`boolean`

#### Defined in

[medusa/src/services/discount.ts:755](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L755)

___

### isValidForRegion

▸ **isValidForRegion**(`discount`, `region_id`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discount` | `Discount` |
| `region_id` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[medusa/src/services/discount.ts:759](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L759)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Discount`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` | the query object for find |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/discount.ts:119](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L119)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`Discount`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` | the query object for find |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<[`Discount`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/discount.ts:136](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L136)

___

### listByCodes

▸ **listByCodes**(`discountCodes`, `config?`): `Promise`<`Discount`[]\>

List all the discounts corresponding to the given codes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCodes` | `string`[] | discount codes of discounts to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`[]\>

the discounts

#### Defined in

[medusa/src/services/discount.ts:301](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L301)

___

### removeRegion

▸ **removeRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

Removes a region from the discount regions array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount |
| `regionId` | `string` | id of region to remove |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[medusa/src/services/discount.ts:532](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L532)

___

### retrieve

▸ **retrieve**(`discountId`, `config?`): `Promise`<`Discount`\>

Gets a discount by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | id of discount to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`\>

the discount

#### Defined in

[medusa/src/services/discount.ts:238](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L238)

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `config?`): `Promise`<`Discount`\>

Gets the discount by discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCode` | `string` | discount code of discount to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`\>

the discount

#### Defined in

[medusa/src/services/discount.ts:272](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L272)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`discountId`, `update`): `Promise`<`Discount`\>

Updates a discount.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` | discount id of discount to update |
| `update` | `UpdateDiscountInput` | the data to update the discount with |

#### Returns

`Promise`<`Discount`\>

the result of the update operation

#### Defined in

[medusa/src/services/discount.ts:332](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L332)

___

### validateDiscountForCartOrThrow

▸ **validateDiscountForCartOrThrow**(`cart`, `discount`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `discount` | `Discount` \| `Discount`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/discount.ts:672](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L672)

___

### validateDiscountForProduct

▸ **validateDiscountForProduct**(`discountRuleId`, `productId`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountRuleId` | `string` |
| `productId` | `undefined` \| `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[medusa/src/services/discount.ts:571](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L571)

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

[medusa/src/services/discount.ts:101](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/services/discount.ts#L101)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DiscountService`](DiscountService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DiscountService`](DiscountService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/66c59d54f/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
