# Class: DiscountService

## Hierarchy

- `TransactionBaseService`<[`DiscountService`](DiscountService.md)\>

  ↳ **`DiscountService`**

## Constructors

### constructor

• **new DiscountService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService&lt;DiscountService\&gt;.constructor

#### Defined in

[services/discount.ts:62](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L62)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/discount.ts:52](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L52)

___

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: typeof `DiscountConditionRepository`

#### Defined in

[services/discount.ts:55](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L55)

___

### discountConditionService\_

• `Protected` `Readonly` **discountConditionService\_**: `DiscountConditionService`

#### Defined in

[services/discount.ts:56](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L56)

___

### discountRepository\_

• `Protected` `Readonly` **discountRepository\_**: typeof `DiscountRepository`

#### Defined in

[services/discount.ts:51](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L51)

___

### discountRuleRepository\_

• `Protected` `Readonly` **discountRuleRepository\_**: typeof `DiscountRuleRepository`

#### Defined in

[services/discount.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L53)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/discount.ts:60](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L60)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[services/discount.ts:54](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L54)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/discount.ts:48](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L48)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/discount.ts:58](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L58)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/discount.ts:59](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L59)

___

### totalsService\_

• `Protected` `Readonly` **totalsService\_**: [`TotalsService`](TotalsService.md)

#### Defined in

[services/discount.ts:57](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L57)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/discount.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L49)

## Methods

### addRegion

▸ **addRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `regionId` | `string` |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:477](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L477)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

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

[services/discount.ts:576](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L576)

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

[services/discount.ts:720](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L720)

___

### create

▸ **create**(`discount`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | `CreateDiscountInput` |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:182](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L182)

___

### createDynamicCode

▸ **createDynamicCode**(`discountId`, `data`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `data` | `CreateDynamicDiscountInput` |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:405](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L405)

___

### delete

▸ **delete**(`discountId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/discount.ts:537](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L537)

___

### deleteDynamicCode

▸ **deleteDynamicCode**(`discountId`, `code`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `code` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/discount.ts:456](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L456)

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

[services/discount.ts:689](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L689)

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

[services/discount.ts:685](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L685)

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

[services/discount.ts:679](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L679)

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

[services/discount.ts:697](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L697)

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

[services/discount.ts:701](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L701)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Discount`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` |  |
| `config` | `FindConfig`<`Discount`\> |  |

#### Returns

`Promise`<`Discount`[]\>

#### Defined in

[services/discount.ts:114](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L114)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`Discount`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableDiscountProps` |  |
| `config` | `FindConfig`<`Discount`\> |  |

#### Returns

`Promise`<[`Discount`[], `number`]\>

#### Defined in

[services/discount.ts:133](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L133)

___

### removeRegion

▸ **removeRegion**(`discountId`, `regionId`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `regionId` | `string` |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:512](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L512)

___

### retrieve

▸ **retrieve**(`discountId`, `config?`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `config` | `FindConfig`<`Discount`\> |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:247](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L247)

___

### retrieveByCode

▸ **retrieveByCode**(`discountCode`, `config?`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountCode` | `string` |  |
| `config` | `FindConfig`<`Discount`\> |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:276](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L276)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`discountId`, `update`): `Promise`<`Discount`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountId` | `string` |  |
| `update` | `UpdateDiscountInput` |  |

#### Returns

`Promise`<`Discount`\>

#### Defined in

[services/discount.ts:310](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L310)

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

[services/discount.ts:619](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L619)

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

[services/discount.ts:551](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L551)

___

### validateDiscountRule\_

▸ **validateDiscountRule_**<`T`\>(`discountRule`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discountRule` | `T` |  |

#### Returns

`T`

#### Defined in

[services/discount.ts:96](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/discount.ts#L96)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
