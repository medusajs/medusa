# Class: GiftCardService

Provides layer to manipulate gift cards.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`GiftCardService`**

## Constructors

### constructor

• **new GiftCardService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/gift-card.js:15](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L15)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

[services/gift-card.js:11](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L11)

## Methods

### create

▸ **create**(`giftCard`): `Promise`<`GiftCard`\>

Creates a gift card with provided data given that the data is validated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCard` | `GiftCard` | the gift card data to create |

#### Returns

`Promise`<`GiftCard`\>

the result of the create operation

#### Defined in

[services/gift-card.js:134](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L134)

___

### createTransaction

▸ **createTransaction**(`data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/gift-card.js:120](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L120)

___

### delete

▸ **delete**(`giftCardId`): `Promise`<`any`\>

Deletes a gift card idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to delete |

#### Returns

`Promise`<`any`\>

the result of the delete operation

#### Defined in

[services/gift-card.js:288](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L288)

___

### generateCode\_

▸ **generateCode_**(): `string`

Generates a 16 character gift card code

#### Returns

`string`

the generated gift card code

#### Defined in

[services/gift-card.js:62](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L62)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the query object for find |
| `config` | `any` | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`any`\>

the result of the find operation

#### Defined in

[services/gift-card.js:78](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L78)

___

### retrieve

▸ **retrieve**(`giftCardId`, `config?`): `Promise`<`GiftCard`\>

Gets a gift card by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to retrieve |
| `config` | `any` | optional values to include with gift card query |

#### Returns

`Promise`<`GiftCard`\>

the gift card

#### Defined in

[services/gift-card.js:175](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L175)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `config?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `any` |
| `config` | `Object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/gift-card.js:209](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L209)

___

### update

▸ **update**(`giftCardId`, `update`): `Promise`<`any`\>

Updates a giftCard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | giftCard id of giftCard to update |
| `update` | `GiftCard` | the data to update the giftCard with |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/gift-card.js:247](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L247)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`GiftCardService`](GiftCardService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`GiftCardService`](GiftCardService.md)

#### Defined in

[services/gift-card.js:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/gift-card.js#L40)
