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

[packages/medusa/src/services/line-item.ts:47](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L47)

## Properties

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:41](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L41)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:40](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L40)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[packages/medusa/src/services/line-item.ts:45](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L45)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[packages/medusa/src/services/line-item.ts:39](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L39)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/line-item.ts:38](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L38)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:43](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L43)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:42](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L42)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/line-item.ts:44](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L44)

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

[packages/medusa/src/services/line-item.ts:269](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L269)

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

[packages/medusa/src/services/line-item.ts:141](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L141)

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

[packages/medusa/src/services/line-item.ts:336](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L336)

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

[packages/medusa/src/services/line-item.ts:317](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L317)

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
| `context.metadata?` | `Record`<`string`, `unknown`\> |
| `context.unit_price?` | `number` |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[packages/medusa/src/services/line-item.ts:194](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L194)

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

[packages/medusa/src/services/line-item.ts:93](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L93)

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

[packages/medusa/src/services/line-item.ts:113](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L113)

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

[packages/medusa/src/services/line-item.ts:288](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L288)

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

[packages/medusa/src/services/line-item.ts:71](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/line-item.ts#L71)
