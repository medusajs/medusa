# Class: ReturnService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ReturnService`**

## Constructors

### constructor

• **new ReturnService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/return.js:9](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L9)

## Properties

### inventoryService\_

• **inventoryService\_**: `any`

#### Defined in

[services/return.js:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L49)

___

### returnReasonService\_

• **returnReasonService\_**: `any`

#### Defined in

[services/return.js:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L47)

___

### taxProviderService\_

• **taxProviderService\_**: `any`

#### Defined in

[services/return.js:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L39)

## Methods

### cancel

▸ **cancel**(`returnId`): `Promise`<`Return`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnId` | `string` |  |

#### Returns

`Promise`<`Return`\>

#### Defined in

[services/return.js:134](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L134)

___

### create

▸ **create**(`data`): `Promise`<`Return`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` |  |

#### Returns

`Promise`<`Return`\>

#### Defined in

[services/return.js:307](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L307)

___

### fulfill

▸ **fulfill**(`returnId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `any` |

#### Returns

`any`

#### Defined in

[services/return.js:450](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L450)

___

### getFulfillmentItems\_

▸ **getFulfillmentItems_**(`order`, `items`, `transformer`): `Promise`<`LineItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `items` | `Object` |  |
| `items.item_id` | `string` | - |
| `items.quantity` | `number` | - |
| `transformer` | `Function` |  |

#### Returns

`Promise`<`LineItem`[]\>

#### Defined in

[services/return.js:89](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L89)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` |  |
| `config` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return.js:120](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L120)

___

### receive

▸ **receive**(`return_id`, `received_items`, `refund_amount`, `allow_mismatch?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `return_id` | `string` | `undefined` |  |
| `received_items` | `Item`[] | `undefined` |  |
| `refund_amount` | `undefined` \| `number` | `undefined` |  |
| `allow_mismatch` | `bool` | `false` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return.js:524](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L524)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Return`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `any` |  |

#### Returns

`Return`

#### Defined in

[services/return.js:229](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L229)

___

### retrieveBySwap

▸ **retrieveBySwap**(`swapId`, `relations?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `swapId` | `any` | `undefined` |
| `relations` | `any`[] | `[]` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return.js:248](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L248)

___

### update

▸ **update**(`returnId`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnId` | `any` |
| `update` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/return.js:271](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L271)

___

### validateReturnLineItem\_

▸ **validateReturnLineItem_**(`item`, `quantity`, `additional`): `LineItem`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` |  |
| `quantity` | `number` |  |
| `additional` | `any` |  |

#### Returns

`LineItem`

#### Defined in

[services/return.js:191](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L191)

___

### validateReturnStatuses\_

▸ **validateReturnStatuses_**(`order`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |

#### Returns

`void`

#### Defined in

[services/return.js:161](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L161)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ReturnService`](ReturnService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`ReturnService`](ReturnService.md)

#### Defined in

[services/return.js:55](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/return.js#L55)
