# Class: LineItemService

Provides layer to manipulate line items.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`LineItemService`**

## Constructors

### constructor

• **new LineItemService**(`__namedParameters`)

#### Parameters

| Name                | Type                   |
| :------------------ | :--------------------- |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

BaseService.constructor

#### Defined in

[services/line-item.ts:38](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L38)

## Properties

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/line-item.ts:32](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L32)

---

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/line-item.ts:31](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L31)

---

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[services/line-item.ts:36](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L36)

---

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/line-item.ts:30](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L30)

---

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[services/line-item.ts:29](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L29)

---

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/line-item.ts:34](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L34)

---

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/line-item.ts:33](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L33)

---

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/line-item.ts:35](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L35)

## Methods

### create

▸ **create**(`data`): `Promise`<`LineItem`\>

Create a line item

#### Parameters

| Name   | Type                   | Description                    |
| :----- | :--------------------- | :----------------------------- |
| `data` | `Partial`<`LineItem`\> | the line item object to create |

#### Returns

`Promise`<`LineItem`\>

the created line item

#### Defined in

[services/line-item.ts:261](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L261)

---

### createReturnLines

▸ **createReturnLines**(`returnId`, `cartId`): `Promise`<`LineItem`[]\>

Creates return line items for a given cart based on the return items in a
return.

#### Parameters

| Name       | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `returnId` | `string` | the id to generate return items from.        |
| `cartId`   | `string` | the cart to assign the return line items to. |

#### Returns

`Promise`<`LineItem`[]\>

the created line items

#### Defined in

[services/line-item.ts:133](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L133)

---

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| `LineItem`\>

Deletes a line item.

#### Parameters

| Name | Type     | Description                       |
| :--- | :------- | :-------------------------------- |
| `id` | `string` | the id of the line item to delete |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

the result of the delete operation

#### Defined in

[services/line-item.ts:309](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L309)

---

### generate

▸ **generate**(`variantId`, `regionId`, `quantity`, `context?`): `Promise`<`LineItem`\>

#### Parameters

| Name                   | Type                           |
| :--------------------- | :----------------------------- |
| `variantId`            | `string`                       |
| `regionId`             | `string`                       |
| `quantity`             | `number`                       |
| `context`              | `Object`                       |
| `context.cart?`        | `Cart`                         |
| `context.customer_id?` | `string`                       |
| `context.metadata?`    | `Record`<`string`, `unknown`\> |
| `context.unit_price?`  | `number`                       |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[services/line-item.ts:186](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L186)

---

### list

▸ **list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name                      | Type     | Default value |
| :------------------------ | :------- | :------------ |
| `selector`                | `any`    | `undefined`   |
| `config`                  | `Object` | `undefined`   |
| `config.order`            | `Object` | `undefined`   |
| `config.order.created_at` | `string` | `"DESC"`      |
| `config.skip`             | `number` | `0`           |
| `config.take`             | `number` | `50`          |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/line-item.ts:81](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L81)

---

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`LineItem`\>

Retrieves a line item by its id.

#### Parameters

| Name     | Type     | Description                             |
| :------- | :------- | :-------------------------------------- |
| `id`     | `string` | the id of the line item to retrieve     |
| `config` | `Object` | the config to be used at query building |

#### Returns

`Promise`<`LineItem`\>

the line item

#### Defined in

[services/line-item.ts:102](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L102)

---

### update

▸ **update**(`id`, `data`): `Promise`<`LineItem`\>

Updates a line item

#### Parameters

| Name   | Type                   | Description                           |
| :----- | :--------------------- | :------------------------------------ |
| `id`   | `string`               | the id of the line item to update     |
| `data` | `Partial`<`LineItem`\> | the properties to update on line item |

#### Returns

`Promise`<`LineItem`\>

the update line item

#### Defined in

[services/line-item.ts:280](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L280)

---

### withTransaction

▸ **withTransaction**(`transactionManager`): [`LineItemService`](LineItemService.md)

#### Parameters

| Name                 | Type            |
| :------------------- | :-------------- |
| `transactionManager` | `EntityManager` |

#### Returns

[`LineItemService`](LineItemService.md)

#### Defined in

[services/line-item.ts:60](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/line-item.ts#L60)
