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

[services/discount.ts:59](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L59)

## Properties

### discountConditionRepository\_

• `Private` **discountConditionRepository\_**: typeof `DiscountConditionRepository`

#### Defined in

[services/discount.ts:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L52)

___

### discountConditionService\_

• `Private` **discountConditionService\_**: `DiscountConditionService`

#### Defined in

[services/discount.ts:53](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L53)

___

### discountRepository\_

• `Private` **discountRepository\_**: typeof `DiscountRepository`

#### Defined in

[services/discount.ts:49](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L49)

___

### discountRuleRepository\_

• `Private` **discountRuleRepository\_**: typeof `DiscountRuleRepository`

#### Defined in

[services/discount.ts:50](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L50)

___

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/discount.ts:57](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L57)

___

### giftCardRepository\_

• `Private` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[services/discount.ts:51](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L51)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/discount.ts:48](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L48)

___

### productService\_

• `Private` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/discount.ts:55](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L55)

___

### regionService\_

• `Private` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/discount.ts:56](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L56)

___

### totalsService\_

• `Private` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/discount.ts:54](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L54)

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

[services/discount.ts:521](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L521)

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

[services/discount.ts:624](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L624)

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

[services/discount.ts:762](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L762)

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

[services/discount.ts:220](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L220)

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

[services/discount.ts:446](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L446)

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

[services/discount.ts:583](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L583)

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

[services/discount.ts:498](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L498)

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

[services/discount.ts:733](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L733)

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

[services/discount.ts:729](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L729)

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

[services/discount.ts:723](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L723)

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

[services/discount.ts:741](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L741)

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

[services/discount.ts:745](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L745)

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

[services/discount.ts:156](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L156)

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

[services/discount.ts:173](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L173)

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

[services/discount.ts:557](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L557)

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

[services/discount.ts:285](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L285)

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `config?`): `Promise`<`Discount`\>

Gets a discount by discount code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCode` | `string` | discount code of discount to retrieve |
| `config` | `FindConfig`<`Discount`\> | the config object containing query settings |

#### Returns

`Promise`<`Discount`\>

the discount document

#### Defined in

[services/discount.ts:313](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L313)

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

[services/discount.ts:348](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L348)

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

[services/discount.ts:665](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L665)

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

[services/discount.ts:599](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L599)

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

[services/discount.ts:138](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L138)

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

[services/discount.ts:108](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/discount.ts#L108)
