# LineItemService

## Hierarchy

- `TransactionBaseService`

  ↳ **`LineItemService`**

## Constructors

### constructor

**new LineItemService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/line-item.ts:57](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L57)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cartRepository\_

 `Protected` `Readonly` **cartRepository\_**: `Repository`<`Cart`\> & { `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations  }

#### Defined in

[medusa/src/services/line-item.ts:48](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L48)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/line-item.ts:53](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L53)

___

### itemTaxLineRepo\_

 `Protected` `Readonly` **itemTaxLineRepo\_**: `Repository`<`LineItemTaxLine`\> & { `deleteForCart`: Method deleteForCart ; `upsertLines`: Method upsertLines  }

#### Defined in

[medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L47)

___

### lineItemAdjustmentService\_

 `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[medusa/src/services/line-item.ts:54](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L54)

___

### lineItemRepository\_

 `Protected` `Readonly` **lineItemRepository\_**: `Repository`<`LineItem`\> & { `findByReturn`: Method findByReturn  }

#### Defined in

[medusa/src/services/line-item.ts:46](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L46)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### pricingService\_

 `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[medusa/src/services/line-item.ts:51](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L51)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/line-item.ts:50](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L50)

___

### productVariantService\_

 `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/line-item.ts:49](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L49)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/line-item.ts:52](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L52)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/line-item.ts:55](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L55)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

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
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### cloneTo

**cloneTo**(`ids`, `data?`, `options?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name |
| :------ |
| `ids` | `string` \| `string`[] |
| `data` | `DeepPartial`<`LineItem`\> |
| `options` | `object` |
| `options.setOriginalLineItemId?` | `boolean` |

#### Returns

`Promise`<`LineItem`[]\>

-`Promise`: 
	-`LineItem[]`: 
		-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:541](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L541)

___

### create

**create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Create a line item

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TResult` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | `T` | the line item object to create |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the created line item

#### Defined in

[medusa/src/services/line-item.ts:421](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L421)

___

### createReturnLines

**createReturnLines**(`returnId`, `cartId`): `Promise`<`LineItem`[]\>

Creates return line items for a given cart based on the return items in a
return.

#### Parameters

| Name | Description |
| :------ | :------ |
| `returnId` | `string` | the id to generate return items from. |
| `cartId` | `string` | the cart to assign the return line items to. |

#### Returns

`Promise`<`LineItem`[]\>

-`Promise`: the created line items
	-`LineItem[]`: 
		-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:131](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L131)

___

### createTaxLine

**createTaxLine**(`args`): `LineItemTaxLine`

Create a line item tax line.

#### Parameters

| Name | Description |
| :------ | :------ |
| `args` | `DeepPartial`<`LineItemTaxLine`\> | tax line partial passed to the repo create method |

#### Returns

`LineItemTaxLine`

-`LineItemTaxLine`: a new line item tax line

#### Defined in

[medusa/src/services/line-item.ts:533](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L533)

___

### delete

**delete**(`id`): `Promise`<`undefined` \| ``null`` \| `LineItem`\>

Deletes a line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| `LineItem`\>

-`Promise`: the result of the delete operation
	-`undefined \| ``null`` \| LineItem`: (optional) 

#### Defined in

[medusa/src/services/line-item.ts:494](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L494)

___

### deleteWithTaxLines

**deleteWithTaxLines**(`id`): `Promise`<`undefined` \| ``null`` \| `LineItem`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| ``null`` \| `LineItem`\>

-`Promise`: the result of the delete operation
	-`undefined \| ``null`` \| LineItem`: (optional) 

**Deprecated**

no the cascade on the entity takes care of it
Deletes a line item with the tax lines.

#### Defined in

[medusa/src/services/line-item.ts:516](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L516)

___

### generate

**generate**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`, `context?`): `Promise`<`TResult`\>

Generate a single or multiple line item without persisting the data into the db

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TResult` | `object` |

#### Parameters

| Name |
| :------ |
| `variantIdOrData` | `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : `GenerateLineItemContext` |
| `quantity?` | `number` |
| `context` | `GenerateLineItemContext` |

#### Returns

`Promise`<`TResult`\>

-`Promise`: 

#### Defined in

[medusa/src/services/line-item.ts:192](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L192)

___

### generateLineItem

`Protected` **generateLineItem**(`variant`, `quantity`, `context`): `Promise`<`LineItem`\>

#### Parameters

| Name |
| :------ |
| `variant` | `object` |
| `variant.id` | `string` |
| `variant.product` | `object` |
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

-`Promise`: 
	-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:337](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L337)

___

### list

**list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name |
| :------ |
| `selector` | `Selector`<`LineItem`\> |
| `config` | `FindConfig`<`LineItem`\> |

#### Returns

`Promise`<`LineItem`[]\>

-`Promise`: 
	-`LineItem[]`: 
		-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:84](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L84)

___

### retrieve

**retrieve**(`id`, `config?`): `Promise`<`LineItem`\>

Retrieves a line item by its id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the line item to retrieve |
| `config` | `object` | the config to be used at query building |

#### Returns

`Promise`<`LineItem`\>

-`Promise`: the line item
	-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:105](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L105)

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

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`idOrSelector`, `data`): `Promise`<`LineItem`[]\>

Updates a line item

#### Parameters

| Name | Description |
| :------ | :------ |
| `idOrSelector` | `string` \| `Selector`<`LineItem`\> | the id or selector of the line item(s) to update |
| `data` | `Partial`<`LineItem`\> | the properties to update the line item(s) |

#### Returns

`Promise`<`LineItem`[]\>

-`Promise`: the updated line item(s)
	-`LineItem[]`: 
		-`LineItem`: 

#### Defined in

[medusa/src/services/line-item.ts:451](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L451)

___

### validateGenerateArguments

`Protected` **validateGenerateArguments**<`T`, `TResult`\>(`variantIdOrData`, `regionIdOrContext`, `quantity?`): `void`

| Name | Type |
| :------ | :------ |
| `T` | `object` |
| `TResult` | `object` |

#### Parameters

| Name |
| :------ |
| `variantIdOrData` | `string` \| `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : `GenerateLineItemContext` |
| `quantity?` | `number` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[medusa/src/services/line-item.ts:612](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/line-item.ts#L612)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`LineItemService`](LineItemService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemService`](LineItemService.md)

-`LineItemService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
