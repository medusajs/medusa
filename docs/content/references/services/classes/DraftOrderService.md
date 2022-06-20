# Class: DraftOrderService

Handles draft orders

**`implements`** {BaseService}

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`DraftOrderService`**

## Constructors

### constructor

• **new DraftOrderService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/draft-order.js:15](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L15)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/draft-order.js:10](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L10)

## Methods

### create

▸ **create**(`data`): `Promise`<`DraftOrder`\>

Creates a draft order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | data to create draft order from |

#### Returns

`Promise`<`DraftOrder`\>

the created draft order

#### Defined in

[services/draft-order.js:233](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L233)

___

### delete

▸ **delete**(`draftOrderId`): `Promise`<`any`\>

Deletes draft order idempotently.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `draftOrderId` | `string` | id of draft order to delete |

#### Returns

`Promise`<`any`\>

empty promise

#### Defined in

[services/draft-order.js:135](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L135)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`DraftOrder`\>

Lists draft orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query object for find |
| `config` | `any` | configurable attributes for find |

#### Returns

`Promise`<`DraftOrder`\>

list of draft orders

#### Defined in

[services/draft-order.js:215](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L215)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<`DraftOrder`[]\>

Lists draft orders alongside the count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | query selector to filter draft orders |
| `config` | `any` | query config |

#### Returns

`Promise`<`DraftOrder`[]\>

draft orders

#### Defined in

[services/draft-order.js:161](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L161)

___

### registerCartCompletion

▸ **registerCartCompletion**(`doId`, `orderId`): `Promise`<`any`\>

Registers a draft order as completed, when an order has been completed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `doId` | `string` | id of draft order to complete |
| `orderId` | `string` | id of order completed from draft order cart |

#### Returns

`Promise`<`any`\>

the created order

#### Defined in

[services/draft-order.js:336](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L336)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`DraftOrder`\>

Retrieves a draft order with the given id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the draft order to retrieve |
| `config` | `any` | query object for findOne |

#### Returns

`Promise`<`DraftOrder`\>

the draft order

#### Defined in

[services/draft-order.js:84](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L84)

___

### retrieveByCartId

▸ **retrieveByCartId**(`cartId`, `config?`): `Promise`<`DraftOrder`\>

Retrieves a draft order based on its associated cart id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartId` | `string` | cart id that the draft orders's cart has |
| `config` | `any` | query object for findOne |

#### Returns

`Promise`<`DraftOrder`\>

the draft order

#### Defined in

[services/draft-order.js:111](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L111)

___

### update

▸ **update**(`doId`, `data`): `Promise`<`DraftOrder`\>

Updates a draft order with the given data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `doId` | `string` | id of the draft order |
| `data` | `DraftOrder` | values to update the order with |

#### Returns

`Promise`<`DraftOrder`\>

the updated draft order

#### Defined in

[services/draft-order.js:357](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L357)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`DraftOrderService`](DraftOrderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`DraftOrderService`](DraftOrderService.md)

#### Defined in

[services/draft-order.js:56](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/draft-order.js#L56)
