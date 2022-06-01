# Class: ClaimItemService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ClaimItemService`**

## Constructors

### constructor

• **new ClaimItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/claim-item.js:11](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L11)

## Properties

### claimImageRepository\_

• **claimImageRepository\_**: `any`

#### Defined in

[services/claim-item.js:27](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L27)

___

### claimTagRepository\_

• **claimTagRepository\_**: `any`

#### Defined in

[services/claim-item.js:26](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L26)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `CREATED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/claim-item.js:5](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L5)

## Methods

### cancel

▸ **cancel**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/claim-item.js:212](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L212)

___

### create

▸ **create**(`data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/claim-item.js:55](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L55)

___

### deleteMetadata

▸ **deleteMetadata**(`orderId`, `key`): `Promise`<`any`\>

Dedicated method to delete metadata for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderId` | `string` | the order to delete metadata from. |
| `key` | `string` | key for metadata field |

#### Returns

`Promise`<`any`\>

resolves to the updated result.

#### Defined in

[services/claim-item.js:259](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L259)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the config object for find |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/claim-item.js:219](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L219)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`Order`\>

Gets a claim item by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of ClaimItem to retrieve |
| `config` | `any` | configuration for the find operation |

#### Returns

`Promise`<`Order`\>

the ClaimItem

#### Defined in

[services/claim-item.js:234](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L234)

___

### update

▸ **update**(`id`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[services/claim-item.js:135](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L135)

___

### withTransaction

▸ **withTransaction**(`manager`): [`ClaimItemService`](ClaimItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `manager` | `any` |

#### Returns

[`ClaimItemService`](ClaimItemService.md)

#### Defined in

[services/claim-item.js:36](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/claim-item.js#L36)
