# Class: GiftCardService

Provides layer to manipulate gift cards.

## Hierarchy

- `TransactionBaseService`

  ↳ **`GiftCardService`**

## Constructors

### constructor

• **new GiftCardService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/gift-card.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L47)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/gift-card.ts:38](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L38)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[packages/medusa/src/services/gift-card.ts:34](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L34)

___

### giftCardTransactionRepo\_

• `Protected` `Readonly` **giftCardTransactionRepo\_**: typeof `GiftCardTransactionRepository`

#### Defined in

[packages/medusa/src/services/gift-card.ts:36](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L36)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/gift-card.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L40)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/gift-card.ts:37](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L37)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/gift-card.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L41)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

[packages/medusa/src/services/gift-card.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L43)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`giftCard`): `Promise`<`GiftCard`\>

Creates a gift card with provided data given that the data is validated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCard` | `CreateGiftCardInput` | the gift card data to create |

#### Returns

`Promise`<`GiftCard`\>

the result of the create operation

#### Defined in

[packages/medusa/src/services/gift-card.ts:153](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L153)

___

### createTransaction

▸ **createTransaction**(`data`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateGiftCardTransactionInput` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/medusa/src/services/gift-card.ts:138](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L138)

___

### delete

▸ **delete**(`giftCardId`): `Promise`<`void` \| `GiftCard`\>

Deletes a gift card idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to delete |

#### Returns

`Promise`<`void` \| `GiftCard`\>

the result of the delete operation

#### Defined in

[packages/medusa/src/services/gift-card.ts:322](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L322)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`GiftCard`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`GiftCard`\> | the query object for find |
| `config` | `FindConfig`<`GiftCard`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`GiftCard`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/gift-card.ts:114](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L114)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`GiftCard`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`GiftCard`\> | the query object for find |
| `config` | `FindConfig`<`GiftCard`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`GiftCard`[], `number`]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/gift-card.ts:85](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L85)

___

### retrieve

▸ **retrieve**(`giftCardId`, `config?`): `Promise`<`GiftCard`\>

Gets a gift card by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to retrieve |
| `config` | `FindConfig`<`GiftCard`\> | optional values to include with gift card query |

#### Returns

`Promise`<`GiftCard`\>

the gift card

#### Defined in

[packages/medusa/src/services/gift-card.ts:242](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L242)

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `config?`): `Promise`<`GiftCard`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `config` | `FindConfig`<`GiftCard`\> |

#### Returns

`Promise`<`GiftCard`\>

#### Defined in

[packages/medusa/src/services/gift-card.ts:256](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L256)

___

### retrieve\_

▸ `Protected` **retrieve_**(`selector`, `config?`): `Promise`<`GiftCard`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`GiftCard`\> |
| `config` | `FindConfig`<`GiftCard`\> |

#### Returns

`Promise`<`GiftCard`\>

#### Defined in

[packages/medusa/src/services/gift-card.ts:208](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L208)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`giftCardId`, `update`): `Promise`<`GiftCard`\>

Updates a giftCard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | giftCard id of giftCard to update |
| `update` | `UpdateGiftCardInput` | the data to update the giftCard with |

#### Returns

`Promise`<`GiftCard`\>

the result of the update operation

#### Defined in

[packages/medusa/src/services/gift-card.ts:276](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L276)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`GiftCardService`](GiftCardService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`GiftCardService`](GiftCardService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### generateCode

▸ `Static` **generateCode**(): `string`

Generates a 16 character gift card code

#### Returns

`string`

the generated gift card code

#### Defined in

[packages/medusa/src/services/gift-card.ts:69](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L69)

___

### resolveTaxRate

▸ `Static` `Protected` **resolveTaxRate**(`giftCardTaxRate`, `region`): ``null`` \| `number`

The tax_rate of the giftcard can depend on whether regions tax gift cards, an input
provided by the user or the tax rate. Based on these conditions, tax_rate changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `giftCardTaxRate` | ``null`` \| `number` |
| `region` | `Region` |

#### Returns

``null`` \| `number`

the tax rate for the gift card

#### Defined in

[packages/medusa/src/services/gift-card.ts:189](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/gift-card.ts#L189)
