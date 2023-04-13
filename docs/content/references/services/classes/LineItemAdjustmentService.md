# Class: LineItemAdjustmentService

Provides layer to manipulate line item adjustments.

## Hierarchy

- `TransactionBaseService`

  ↳ **`LineItemAdjustmentService`**

## Constructors

### constructor

• **new LineItemAdjustmentService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `LineItemAdjustmentServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/line-item-adjustment.ts:36](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L36)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### discountService

• `Private` `Readonly` **discountService**: [`DiscountService`](DiscountService.md)

#### Defined in

[medusa/src/services/line-item-adjustment.ts:34](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L34)

___

### lineItemAdjustmentRepo\_

• `Private` `Readonly` **lineItemAdjustmentRepo\_**: `Repository`<`LineItemAdjustment`\>

#### Defined in

[medusa/src/services/line-item-adjustment.ts:33](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L33)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`LineItemAdjustment`\>

Creates a line item adjustment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`LineItemAdjustment`\> | the line item adjustment to create |

#### Returns

`Promise`<`LineItemAdjustment`\>

line item adjustment

#### Defined in

[medusa/src/services/line-item-adjustment.ts:86](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L86)

___

### createAdjustmentForLineItem

▸ **createAdjustmentForLineItem**(`cart`, `lineItem`): `Promise`<`LineItemAdjustment`[]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart object holding discounts |
| `lineItem` | `LineItem` | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<`LineItemAdjustment`[]\>

a line item adjustment or undefined if no adjustment was created

#### Defined in

[medusa/src/services/line-item-adjustment.ts:262](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L262)

___

### createAdjustments

▸ **createAdjustments**(`cart`, `lineItem?`): `Promise`<`LineItemAdjustment`[] \| `LineItemAdjustment`[][]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart object holding discounts |
| `lineItem?` | `LineItem` | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<`LineItemAdjustment`[] \| `LineItemAdjustment`[][]\>

if a lineItem was given, returns a line item adjustment or undefined if no adjustment was created
otherwise returns an array of line item adjustments for each line item in the cart

#### Defined in

[medusa/src/services/line-item-adjustment.ts:290](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L290)

___

### delete

▸ **delete**(`selectorOrIds`): `Promise`<`void`\>

Deletes line item adjustments matching a selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectorOrIds` | `string` \| `string`[] \| `FilterableLineItemAdjustmentProps` & { `discount_id?`: `FindOperator`<``null`` \| `string`\>  } | the query object for find or the line item adjustment id |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

[medusa/src/services/line-item-adjustment.ts:153](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L153)

___

### generateAdjustments

▸ **generateAdjustments**(`calculationContextData`, `generatedLineItem`, `context`): `Promise`<`GeneratedAdjustment`[]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `calculationContextData` | `CalculationContextData` | the calculationContextData object holding discounts |
| `generatedLineItem` | `LineItem` | the line item for which a line item adjustment might be created |
| `context` | `AdjustmentContext` | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<`GeneratedAdjustment`[]\>

a line item adjustment or undefined if no adjustment was created

#### Defined in

[medusa/src/services/line-item-adjustment.ts:188](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L188)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`LineItemAdjustment`[]\>

Lists line item adjustments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableLineItemAdjustmentProps` | the query object for find |
| `config` | `FindConfig`<`LineItemAdjustment`\> | the config to be used for find |

#### Returns

`Promise`<`LineItemAdjustment`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/line-item-adjustment.ts:136](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L136)

___

### retrieve

▸ **retrieve**(`lineItemAdjustmentId`, `config?`): `Promise`<`LineItemAdjustment`\>

Retrieves a line item adjustment by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItemAdjustmentId` | `string` | the id of the line item adjustment to retrieve |
| `config` | `FindConfig`<`LineItemAdjustment`\> | the config to retrieve the line item adjustment by |

#### Returns

`Promise`<`LineItemAdjustment`\>

the line item adjustment.

#### Defined in

[medusa/src/services/line-item-adjustment.ts:53](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L53)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `data`): `Promise`<`LineItemAdjustment`\>

Creates a line item adjustment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the line item adjustment id to update |
| `data` | `Partial`<`LineItemAdjustment`\> | the line item adjustment to create |

#### Returns

`Promise`<`LineItemAdjustment`\>

line item adjustment

#### Defined in

[medusa/src/services/line-item-adjustment.ts:104](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item-adjustment.ts#L104)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
