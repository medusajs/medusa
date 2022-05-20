# Class: DiscountService

Provides layer to manipulate discounts.

**`implements`** {BaseService}

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`DiscountService`**

## Constructors

### constructor

• **new DiscountService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[discount.ts:51](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L51)

## Properties

### discountConditionRepository\_

• `Private` **discountConditionRepository\_**: typeof `DiscountConditionRepository`

#### Defined in

[discount.ts:45](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L45)

___

### discountRepository\_

• `Private` **discountRepository\_**: typeof `DiscountRepository`

#### Defined in

[discount.ts:42](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L42)

___

### discountRuleRepository\_

• `Private` **discountRuleRepository\_**: typeof `DiscountRuleRepository`

#### Defined in

[discount.ts:43](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L43)

___

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[discount.ts:49](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L49)

___

### giftCardRepository\_

• `Private` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[discount.ts:44](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L44)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[discount.ts:41](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L41)

___

### productService\_

• `Private` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[discount.ts:47](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L47)

___

### regionService\_

• `Private` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[discount.ts:48](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L48)

___

### totalsService\_

• `Private` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[discount.ts:46](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L46)

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

[discount.ts:498](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L498)

___

### calculateDiscountForLineItem

▸ **calculateDiscountForLineItem**(`discountId`, `lineItem`, `cart`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `lineItem` | `LineItem` |
| `cart` | `Cart` |

#### Returns

`Promise`<`number`\>

#### Defined in

[discount.ts:698](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L698)

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

[discount.ts:832](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L832)

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

[discount.ts:225](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L225)

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

[discount.ts:423](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L423)

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

[discount.ts:560](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L560)

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

[discount.ts:475](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L475)

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

[discount.ts:807](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L807)

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

[discount.ts:803](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L803)

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

[discount.ts:797](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L797)

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

[discount.ts:811](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L811)

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

[discount.ts:815](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L815)

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

[discount.ts:161](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L161)

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

[discount.ts:178](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L178)

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

[discount.ts:534](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L534)

___

### resolveConditionType\_

▸ **resolveConditionType_**(`data`): `undefined` \| { `resource_ids`: `string`[] ; `type`: `DiscountConditionType`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `UpsertDiscountConditionInput` |

#### Returns

`undefined` \| { `resource_ids`: `string`[] ; `type`: `DiscountConditionType`  }

#### Defined in

[discount.ts:576](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L576)

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

[discount.ts:284](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L284)

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `relations?`): `Promise`<`Discount`\>

Gets a discount by discount code.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `discountCode` | `string` | `undefined` | discount code of discount to retrieve |
| `relations` | `string`[] | `[]` | list of relations |

#### Returns

`Promise`<`Discount`\>

the discount document

#### Defined in

[discount.ts:312](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L312)

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

[discount.ts:348](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L348)

___

### upsertDiscountCondition\_

▸ **upsertDiscountCondition_**(`discountId`, `data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountId` | `string` |
| `data` | `UpsertDiscountConditionInput` |

#### Returns

`Promise`<`void`\>

#### Defined in

[discount.ts:613](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L613)

___

### validateDiscountForCartOrThrow

▸ **validateDiscountForCartOrThrow**(`cart`, `discount`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cart` | `Cart` |
| `discount` | `Discount` |

#### Returns

`Promise`<`void`\>

#### Defined in

[discount.ts:739](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L739)

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

[discount.ts:673](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L673)

___

### validateDiscountRule\_

▸ **validateDiscountRule_**(`discountRule`): `DiscountRule`

Creates a discount rule with provided data given that the data is validated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountRule` | `any` | the discount rule to create |

#### Returns

`DiscountRule`

the result of the create operation

#### Defined in

[discount.ts:125](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L125)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`DiscountService`](DiscountService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`DiscountService`](DiscountService.md)

#### Defined in

[discount.ts:96](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/discount.ts#L96)
