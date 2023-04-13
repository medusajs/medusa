# Class: LineItemService

## Hierarchy

- `TransactionBaseService`

  ↳ **`LineItemService`**

## Constructors

### constructor

• **new LineItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/line-item.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L56)

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

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: `Repository`<`Cart`\>

#### Defined in

[medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L47)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/line-item.ts:52](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L52)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: `Repository`<`LineItemTaxLine`\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: `LineItemTaxLine`[]) => `Promise`<`LineItemTaxLine`[]\>  }

#### Defined in

[medusa/src/services/line-item.ts:46](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L46)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[medusa/src/services/line-item.ts:53](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L53)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: `Repository`<`LineItem`\> & { `findByReturn`: (`returnId`: `string`) => `Promise`<`LineItem` & { `return_item`: `ReturnItem`  }[]\>  }

#### Defined in

[medusa/src/services/line-item.ts:45](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L45)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[medusa/src/services/line-item.ts:50](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L50)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/line-item.ts:49](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L49)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/line-item.ts:48](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L48)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/line-item.ts:51](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L51)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/line-item.ts:54](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L54)

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

### cloneTo

▸ **cloneTo**(`ids`, `data?`, `options?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string` \| `string`[] |
| `data` | `DeepPartial`<`LineItem`\> |
| `options` | `Object` |
| `options.setOriginalLineItemId?` | `boolean` |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[medusa/src/services/line-item.ts:503](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L503)

___

### create

▸ **create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Create a line item

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `LineItem` \| `LineItem`[] |
| `TResult` | `T` extends `LineItem`[] ? `LineItem`[] : `LineItem` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | the line item object to create |

#### Returns

`Promise`<`TResult`\>

the created line item

#### Defined in

[medusa/src/services/line-item.ts:382](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L382)

___

### createReturnLines

▸ **createReturnLines**(`returnId`, `cartId`): `Promise`<`LineItem`[]\>

Creates return line items for a given cart based on the return items in a
return.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` | the id to generate return items from. |
| `cartId` | `string` | the cart to assign the return line items to. |

#### Returns

`Promise`<`LineItem`[]\>

the created line items

#### Defined in

[medusa/src/services/line-item.ts:130](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L130)

___

### createTaxLine

▸ **createTaxLine**(`args`): `LineItemTaxLine`

Create a line item tax line.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `DeepPartial`<`LineItemTaxLine`\> | tax line partial passed to the repo create method |

#### Returns

`LineItemTaxLine`

a new line item tax line

#### Defined in

[medusa/src/services/line-item.ts:495](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L495)

___

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| ``null`` \| `LineItem`\>

Deletes a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| `LineItem`\>

the result of the delete operation

#### Defined in

[medusa/src/services/line-item.ts:455](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L455)

___

### deleteWithTaxLines

▸ **deleteWithTaxLines**(`id`): `Promise`<`undefined` \| ``null`` \| `LineItem`\>

Deletes a line item with the tax lines.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| `LineItem`\>

the result of the delete operation

#### Defined in

[medusa/src/services/line-item.ts:474](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L474)

___

### generate

▸ **generate**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`, `context?`): `Promise`<`TResult`\>

Generate a single or multiple line item without persisting the data into the db

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| `GenerateInputData` \| `GenerateInputData`[] |
| `TResult` | `T` extends `string` ? `LineItem` : `T` extends `LineItem` ? `LineItem` : `LineItem`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantIdOrData` | `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : `GenerateLineItemContext` |
| `quantity?` | `number` |
| `context` | `GenerateLineItemContext` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[medusa/src/services/line-item.ts:191](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L191)

___

### generateLineItem

▸ `Protected` **generateLineItem**(`variant`, `quantity`, `context`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variant` | `Object` |
| `variant.id` | `string` |
| `variant.product` | `Object` |
| `variant.product.discountable` | `boolean` |
| `variant.product.is_giftcard` | `boolean` |
| `variant.product.thumbnail` | ``null`` \| `string` |
| `variant.product.title` | `string` |
| `variant.product_id` | `string` |
| `variant.title` | `string` |
| `quantity` | `number` |
| `context` | `GenerateLineItemContext` & { `variantPricing`: `ProductVariantPricing`  } |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[medusa/src/services/line-item.ts:306](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L306)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`LineItem`\> |
| `config` | `FindConfig`<`LineItem`\> |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[medusa/src/services/line-item.ts:83](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L83)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`LineItem`\>

Retrieves a line item by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to retrieve |
| `config` | `Object` | the config to be used at query building |

#### Returns

`Promise`<`LineItem`\>

the line item

#### Defined in

[medusa/src/services/line-item.ts:104](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L104)

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

▸ **update**(`idOrSelector`, `data`): `Promise`<`LineItem`[]\>

Updates a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idOrSelector` | `string` \| `Selector`<`LineItem`\> | the id or selector of the line item(s) to update |
| `data` | `Partial`<`LineItem`\> | the properties to update the line item(s) |

#### Returns

`Promise`<`LineItem`[]\>

the updated line item(s)

#### Defined in

[medusa/src/services/line-item.ts:412](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L412)

___

### validateGenerateArguments

▸ `Protected` **validateGenerateArguments**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| `GenerateInputData` \| `GenerateInputData`[] |
| `TResult` | `T` extends `string` ? `LineItem` : `T` extends `LineItem` ? `LineItem` : `LineItem`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantIdOrData` | `string` \| `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : `GenerateLineItemContext` |
| `quantity?` | `number` |

#### Returns

`void`

#### Defined in

[medusa/src/services/line-item.ts:574](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/line-item.ts#L574)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`LineItemService`](LineItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemService`](LineItemService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
