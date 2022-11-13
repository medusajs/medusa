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

[packages/medusa/src/services/line-item-adjustment.ts:44](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L44)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### discountService

• `Private` `Readonly` **discountService**: [`DiscountService`](DiscountService.md)

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:42](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L42)

___

### lineItemAdjustmentRepo\_

• `Private` `Readonly` **lineItemAdjustmentRepo\_**: typeof `LineItemAdjustmentRepository`

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:41](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L41)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:38](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L38)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:39](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L39)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/line-item-adjustment.ts:88](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L88)

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

[packages/medusa/src/services/line-item-adjustment.ts:249](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L249)

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

[packages/medusa/src/services/line-item-adjustment.ts:277](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L277)

___

### delete

▸ **delete**(`selectorOrIds`): `Promise`<`void`\>

Deletes line item adjustments matching a selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectorOrIds` | `string` \| `string`[] \| `FilterableLineItemAdjustmentProps` | the query object for find or the line item adjustment id |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:153](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L153)

___

### generateAdjustments

▸ **generateAdjustments**(`cart`, `generatedLineItem`, `context`): `Promise`<`GeneratedAdjustment`[]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | `Cart` | the cart object holding discounts |
| `generatedLineItem` | `LineItem` | the line item for which a line item adjustment might be created |
| `context` | `AdjustmentContext` | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<`GeneratedAdjustment`[]\>

a line item adjustment or undefined if no adjustment was created

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:182](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L182)

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

[packages/medusa/src/services/line-item-adjustment.ts:136](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L136)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`LineItemAdjustment`\>

Retrieves a line item adjustment by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item adjustment to retrieve |
| `config` | `FindConfig`<`LineItemAdjustment`\> | the config to retrieve the line item adjustment by |

#### Returns

`Promise`<`LineItemAdjustment`\>

the line item adjustment.

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:63](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L63)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/line-item-adjustment.ts:105](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/services/line-item-adjustment.ts#L105)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/a4dd26e13/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
