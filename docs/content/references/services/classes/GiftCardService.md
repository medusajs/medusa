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

[medusa/src/services/gift-card.ts:39](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L39)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/gift-card.ts:33](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L33)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: `Repository`<`GiftCard`\> & { `listGiftCardsAndCount`: (`query`: `ExtendedFindConfig`<`GiftCard`\>, `q?`: `string`) => `Promise`<[`GiftCard`[], `number`]\>  }

#### Defined in

[medusa/src/services/gift-card.ts:29](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L29)

___

### giftCardTransactionRepo\_

• `Protected` `Readonly` **giftCardTransactionRepo\_**: `Repository`<`GiftCardTransaction`\>

#### Defined in

[medusa/src/services/gift-card.ts:31](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/gift-card.ts:32](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

[medusa/src/services/gift-card.ts:35](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L35)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/gift-card.ts:122](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L122)

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

[medusa/src/services/gift-card.ts:106](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L106)

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

[medusa/src/services/gift-card.ts:295](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L295)

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

[medusa/src/services/gift-card.ts:98](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L98)

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

[medusa/src/services/gift-card.ts:74](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L74)

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

[medusa/src/services/gift-card.ts:215](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L215)

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

[medusa/src/services/gift-card.ts:229](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L229)

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

[medusa/src/services/gift-card.ts:182](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L182)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/gift-card.ts:249](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L249)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### generateCode

▸ `Static` **generateCode**(): `string`

Generates a 16 character gift card code

#### Returns

`string`

the generated gift card code

#### Defined in

[medusa/src/services/gift-card.ts:58](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L58)

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

[medusa/src/services/gift-card.ts:161](https://github.com/medusajs/medusa/blob/5a42c1152/packages/medusa/src/services/gift-card.ts#L161)
