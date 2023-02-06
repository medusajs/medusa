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

[packages/medusa/src/services/line-item.ts:60](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L60)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:51](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L51)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/line-item.ts:56](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L56)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:50](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L50)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:57](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L57)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:49](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L49)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/line-item.ts:46](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L46)

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:54](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L54)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:53](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L53)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:52](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L52)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:55](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L55)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:58](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L58)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L47)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### cloneTo

▸ **cloneTo**(`ids`, `data?`, `options?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ids` | `string` \| `string`[] |
| `data` | `Object` |
| `data.adjustments?` | (`undefined` \| { id?: string \| undefined; item\_id?: string \| undefined; item?: { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; ... 37 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 38 more ...; updated\_at?: { ...; }...)[] |
| `data.allow_discounts?` | `boolean` |
| `data.cart?` | { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; customer?: { ...; } \| ... 1 more ... \| undefined; ... 15 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: ... |
| `data.cart_id?` | `string` |
| `data.claim_order?` | { payment\_status?: ClaimPaymentStatus \| undefined; fulfillment\_status?: ClaimFulfillmentStatus \| undefined; claim\_items?: ({ images?: ({ ...; } \| undefined)[] \| undefined; ... 14 more ...; updated\_at?: { ...; } \| undefined; } \| undefined)[] \| undefined; ... 17 more ...; id?: string \| undefined; } |
| `data.claim_order_id?` | `string` |
| `data.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.description?` | ``null`` \| `string` |
| `data.discount_total?` | ``null`` \| `number` |
| `data.fulfilled_quantity?` | ``null`` \| `number` |
| `data.gift_card_total?` | ``null`` \| `number` |
| `data.has_shipping?` | ``null`` \| `boolean` |
| `data.id?` | `string` |
| `data.includes_tax?` | `boolean` |
| `data.is_giftcard?` | `boolean` |
| `data.is_return?` | `boolean` |
| `data.metadata?` | { [x: string]: unknown; } |
| `data.order?` | { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; payment\_status?: PaymentStatus \| undefined; ... 48 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.order_edit?` | ``null`` \| { order\_id?: string \| undefined; order?: { readonly object?: "order" \| undefined; status?: OrderStatus \| undefined; fulfillment\_status?: FulfillmentStatus \| undefined; ... 49 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 27 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.order_edit_id?` | ``null`` \| `string` |
| `data.order_id?` | ``null`` \| `string` |
| `data.original_item_id?` | ``null`` \| `string` |
| `data.original_tax_total?` | ``null`` \| `number` |
| `data.original_total?` | ``null`` \| `number` |
| `data.quantity?` | `number` |
| `data.refundable?` | ``null`` \| `number` |
| `data.returned_quantity?` | ``null`` \| `number` |
| `data.shipped_quantity?` | ``null`` \| `number` |
| `data.should_merge?` | `boolean` |
| `data.subtotal?` | ``null`` \| `number` |
| `data.swap?` | { fulfillment\_status?: SwapFulfillmentStatus \| undefined; payment\_status?: SwapPaymentStatus \| undefined; order\_id?: string \| undefined; ... 20 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.swap_id?` | `string` |
| `data.tax_lines?` | (`undefined` \| { item\_id?: string \| undefined; item?: { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; ... 37 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 38 more ...; updated\_at?: { ...; } \| undefined; } \| undefin...)[] |
| `data.tax_total?` | ``null`` \| `number` |
| `data.thumbnail?` | ``null`` \| `string` |
| `data.title?` | `string` |
| `data.total?` | ``null`` \| `number` |
| `data.unit_price?` | `number` |
| `data.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } |
| `data.variant?` | { title?: string \| undefined; product\_id?: string \| undefined; product?: { title?: string \| undefined; subtitle?: string \| null \| undefined; description?: string \| null \| undefined; ... 29 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 22 more ...; updated\_at?: { ...; } \| undefined; } |
| `data.variant_id?` | ``null`` \| `string` |
| `options` | `Object` |
| `options.setOriginalLineItemId?` | `boolean` |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[packages/medusa/src/services/line-item.ts:489](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L489)

___

### create

▸ **create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Create a line item

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `LineItem` \| `LineItem`[] |
| `TResult` | `T` extends `LineItem` ? `LineItem` : `LineItem`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | the line item object to create |

#### Returns

`Promise`<`TResult`\>

the created line item

#### Defined in

[packages/medusa/src/services/line-item.ts:370](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L370)

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

[packages/medusa/src/services/line-item.ts:135](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L135)

___

### createTaxLine

▸ **createTaxLine**(`args`): `LineItemTaxLine`

Create a line item tax line.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | tax line partial passed to the repo create method |
| `args.code?` | ``null`` \| `string` | - |
| `args.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `args.id?` | `string` | - |
| `args.item?` | { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 36 more ...; updated\_at?: {... | - |
| `args.item_id?` | `string` | - |
| `args.metadata?` | { [x: string]: unknown; } | - |
| `args.name?` | `string` | - |
| `args.rate?` | `number` | - |
| `args.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`LineItemTaxLine`

a new line item tax line

#### Defined in

[packages/medusa/src/services/line-item.ts:481](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L481)

___

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| `LineItem`\>

Deletes a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item.ts:441](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L441)

___

### deleteWithTaxLines

▸ **deleteWithTaxLines**(`id`): `Promise`<`undefined` \| `LineItem`\>

Deletes a line item with the tax lines.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item.ts:460](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L460)

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
| `variantIdOrData` | `string` \| `T` |
| `regionIdOrContext` | `T` extends `string` ? `string` : `GenerateLineItemContext` |
| `quantity?` | `number` |
| `context` | `GenerateLineItemContext` |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[packages/medusa/src/services/line-item.ts:196](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L196)

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

[packages/medusa/src/services/line-item.ts:299](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L299)

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

[packages/medusa/src/services/line-item.ts:88](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L88)

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

[packages/medusa/src/services/line-item.ts:108](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L108)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

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

[packages/medusa/src/services/line-item.ts:398](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L398)

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

[packages/medusa/src/services/line-item.ts:560](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/line-item.ts#L560)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
