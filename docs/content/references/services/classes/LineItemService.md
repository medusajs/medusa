# Class: LineItemService

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

[services/line-item.ts:44](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L44)

## Properties

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/line-item.ts:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L38)

___

### itemTaxLineRepo\_

• `Protected` `Readonly` **itemTaxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/line-item.ts:37](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L37)

___

### lineItemAdjustmentService\_

• `Protected` `Readonly` **lineItemAdjustmentService\_**: `LineItemAdjustmentService`

#### Defined in

[services/line-item.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L42)

___

### lineItemRepository\_

• `Protected` `Readonly` **lineItemRepository\_**: typeof `LineItemRepository`

#### Defined in

[services/line-item.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L36)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[services/line-item.ts:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L35)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[services/line-item.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L40)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/line-item.ts:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L39)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/line-item.ts:41](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L41)

## Methods

### create

▸ **create**(`data`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`LineItem`\> |  |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[services/line-item.ts:270](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L270)

___

### createReturnLines

▸ **createReturnLines**(`returnId`, `cartId`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` |  |
| `cartId` | `string` |  |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/line-item.ts:142](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L142)

___

### delete

▸ **delete**(`id`): `Promise`<`undefined` \| `LineItem`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |

#### Returns

`Promise`<`undefined` \| `LineItem`\>

#### Defined in

[services/line-item.ts:318](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L318)

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

[services/line-item.ts:195](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L195)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `selector` | `any` | `undefined` |
| `config` | `Object` | `undefined` |
| `config.order` | `Object` | `undefined` |
| `config.order.created_at` | `string` | `"DESC"` |
| `config.skip` | `number` | `0` |
| `config.take` | `number` | `50` |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/line-item.ts:90](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L90)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `Object` |  |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[services/line-item.ts:111](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L111)

___

### update

▸ **update**(`id`, `data`): `Promise`<`LineItem`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `data` | `Partial`<`LineItem`\> |  |

#### Returns

`Promise`<`LineItem`\>

#### Defined in

[services/line-item.ts:289](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L289)

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

[services/line-item.ts:68](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/line-item.ts#L68)
