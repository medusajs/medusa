# Class: LineItemService

Provides layer to manipulate line items.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`LineItemService`**

## Constructors

### constructor

• **new LineItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

BaseService.constructor

#### Defined in

[packages/medusa/src/services/line-item.ts:52](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L52)

## Properties

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:44](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L44)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/line-item.ts:49](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L49)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:43](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L43)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[packages/medusa/src/services/line-item.ts:50](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L50)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:42](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L42)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/line-item.ts:41](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L41)

___

### pricingService\_

• `Protected` `Readonly` **pricingService\_**: [`PricingService`](PricingService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L47)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:46](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L46)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:45](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L45)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:48](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L48)

## Methods

### create

▸ **create**(`data`): `Promise`<`LineItem`\>

Create a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`LineItem`\> | the line item object to create |

#### Returns

`Promise`<`LineItem`\>

the created line item

#### Defined in

[packages/medusa/src/services/line-item.ts:292](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L292)

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

[packages/medusa/src/services/line-item.ts:149](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L149)

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
| `args.item?` | { cart\_id?: string \| undefined; cart?: { readonly object?: "cart" \| undefined; email?: string \| undefined; billing\_address\_id?: string \| undefined; billing\_address?: { customer\_id?: string \| ... 1 more ... \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 34 more ...; updated\_at?: {... | - |
| `args.item_id?` | `string` | - |
| `args.metadata?` | { [x: string]: unknown; } | - |
| `args.name?` | `string` | - |
| `args.rate?` | `number` | - |
| `args.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`LineItemTaxLine`

a new line item tax line

#### Defined in

[packages/medusa/src/services/line-item.ts:359](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L359)

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

[packages/medusa/src/services/line-item.ts:340](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L340)

___

### generate

▸ **generate**(`variantId`, `regionId`, `quantity`, `context?`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantId` | `string` |
| `regionId` | `string` |
| `quantity` | `number` |
| `context` | `Object` |
| `context.cart?` | `Cart` |
| `context.customer_id?` | `string` |
| `context.includes_tax?` | `boolean` |
| `context.metadata?` | `Record`<`string`, `unknown`\> |
| `context.unit_price?` | `number` |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[packages/medusa/src/services/line-item.ts:202](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L202)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `any` |
| `config` | `FindConfig`<`LineItem`\> |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[packages/medusa/src/services/line-item.ts:101](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L101)

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

[packages/medusa/src/services/line-item.ts:121](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L121)

___

### update

▸ **update**(`id`, `data`): `Promise`<`LineItem`\>

Updates a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the line item to update |
| `data` | `Partial`<`LineItem`\> | the properties to update on line item |

#### Returns

`Promise`<`LineItem`\>

the update line item

#### Defined in

[packages/medusa/src/services/line-item.ts:311](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L311)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`LineItemService`](LineItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`LineItemService`](LineItemService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:78](https://github.com/medusajs/medusa/blob/6225aa57b/packages/medusa/src/services/line-item.ts#L78)
