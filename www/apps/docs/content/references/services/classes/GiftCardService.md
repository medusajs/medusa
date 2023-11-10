# GiftCardService

Provides layer to manipulate gift cards.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`GiftCardService`**

## Constructors

### constructor

**new GiftCardService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-12) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/gift-card.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L39)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/gift-card.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L33)

___

### giftCardRepository\_

 `Protected` `Readonly` **giftCardRepository\_**: [`Repository`](Repository.md)<[`GiftCard`](GiftCard.md)\> & { `listGiftCardsAndCount`: Method listGiftCardsAndCount  }

#### Defined in

[packages/medusa/src/services/gift-card.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L29)

___

### giftCardTransactionRepo\_

 `Protected` `Readonly` **giftCardTransactionRepo\_**: [`Repository`](Repository.md)<[`GiftCardTransaction`](GiftCardTransaction.md)\>

#### Defined in

[packages/medusa/src/services/gift-card.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L31)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/gift-card.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L32)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

[packages/medusa/src/services/gift-card.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L35)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`giftCard`): `Promise`<[`GiftCard`](GiftCard.md)\>

Creates a gift card with provided data given that the data is validated.

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCard` | [`CreateGiftCardInput`](../index.md#creategiftcardinput) | the gift card data to create |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>

-`Promise`: the result of the create operation
	-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:122](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L122)

___

### createTransaction

**createTransaction**(`data`): `Promise`<`string`\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateGiftCardTransactionInput`](../index.md#creategiftcardtransactioninput) |

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/gift-card.ts:106](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L106)

___

### delete

**delete**(`giftCardId`): `Promise`<`void` \| [`GiftCard`](GiftCard.md)\>

Deletes a gift card idempotently

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCardId` | `string` | id of gift card to delete |

#### Returns

`Promise`<`void` \| [`GiftCard`](GiftCard.md)\>

-`Promise`: the result of the delete operation
	-`void \| GiftCard`: (optional) 

#### Defined in

[packages/medusa/src/services/gift-card.ts:295](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L295)

___

### list

**list**(`selector?`, `config?`): `Promise`<[`GiftCard`](GiftCard.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`QuerySelector`](../index.md#queryselector)<[`GiftCard`](GiftCard.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`GiftCard`](GiftCard.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)[]\>

-`Promise`: the result of the find operation
	-`GiftCard[]`: 
		-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:98](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L98)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[[`GiftCard`](GiftCard.md)[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`QuerySelector`](../index.md#queryselector)<[`GiftCard`](GiftCard.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`GiftCard`](GiftCard.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`GiftCard`](GiftCard.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`GiftCard[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/gift-card.ts:74](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L74)

___

### retrieve

**retrieve**(`giftCardId`, `config?`): `Promise`<[`GiftCard`](GiftCard.md)\>

Gets a gift card by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCardId` | `string` | id of gift card to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`GiftCard`](GiftCard.md)\> | optional values to include with gift card query |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>

-`Promise`: the gift card
	-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:215](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L215)

___

### retrieveByCode

**retrieveByCode**(`code`, `config?`): `Promise`<[`GiftCard`](GiftCard.md)\>

#### Parameters

| Name |
| :------ |
| `code` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`GiftCard`](GiftCard.md)\> |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>

-`Promise`: 
	-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:229](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L229)

___

### retrieve\_

`Protected` **retrieve_**(`selector`, `config?`): `Promise`<[`GiftCard`](GiftCard.md)\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../index.md#selector)<[`GiftCard`](GiftCard.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`GiftCard`](GiftCard.md)\> |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>

-`Promise`: 
	-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:182](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L182)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`giftCardId`, `update`): `Promise`<[`GiftCard`](GiftCard.md)\>

Updates a giftCard.

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCardId` | `string` | giftCard id of giftCard to update |
| `update` | [`UpdateGiftCardInput`](../index.md#updategiftcardinput) | the data to update the giftCard with |

#### Returns

`Promise`<[`GiftCard`](GiftCard.md)\>

-`Promise`: the result of the update operation
	-`GiftCard`: 

#### Defined in

[packages/medusa/src/services/gift-card.ts:249](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L249)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`GiftCardService`](GiftCardService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`GiftCardService`](GiftCardService.md)

-`GiftCardService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### generateCode

`Static` **generateCode**(): `string`

Generates a 16 character gift card code

#### Returns

`string`

-`string`: (optional) the generated gift card code

#### Defined in

[packages/medusa/src/services/gift-card.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L58)

___

### resolveTaxRate

`Static` `Protected` **resolveTaxRate**(`giftCardTaxRate`, `region`): ``null`` \| `number`

The tax_rate of the giftcard can depend on whether regions tax gift cards, an input
provided by the user or the tax rate. Based on these conditions, tax_rate changes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCardTaxRate` | ``null`` \| `number` |
| `region` | [`Region`](Region.md) | A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries. |

#### Returns

``null`` \| `number`

-```null`` \| number`: (optional) the tax rate for the gift card

#### Defined in

[packages/medusa/src/services/gift-card.ts:161](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/gift-card.ts#L161)
