---
displayed_sidebar: jsClientSidebar
---

# Class: GiftCardService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).GiftCardService

Provides layer to manipulate gift cards.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`GiftCardService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:24

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: `Repository`<[`GiftCard`](internal-3.GiftCard.md)\> & { `listGiftCardsAndCount`: (`query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`GiftCard`](internal-3.GiftCard.md)\>, `q?`: `string`) => `Promise`<[[`GiftCard`](internal-3.GiftCard.md)[], `number`]\>  }

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:21

___

### giftCardTransactionRepo\_

• `Protected` `Readonly` **giftCardTransactionRepo\_**: `Repository`<[`GiftCardTransaction`](internal-3.GiftCardTransaction.md)\>

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:22

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:23

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:25

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`giftCard`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

Creates a gift card with provided data given that the data is validated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCard` | [`CreateGiftCardInput`](../modules/internal-8.md#creategiftcardinput) | the gift card data to create |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:52

___

### createTransaction

▸ **createTransaction**(`data`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateGiftCardTransactionInput`](../modules/internal-8.md#creategiftcardtransactioninput) |

#### Returns

`Promise`<`string`\>

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:46

___

### delete

▸ **delete**(`giftCardId`): `Promise`<`void` \| [`GiftCard`](internal-3.GiftCard.md)\>

Deletes a gift card idempotently

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to delete |

#### Returns

`Promise`<`void` \| [`GiftCard`](internal-3.GiftCard.md)\>

the result of the delete operation

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:80

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`GiftCard`](internal-3.GiftCard.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`GiftCard`](internal-3.GiftCard.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:45

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`GiftCard`](internal-3.GiftCard.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`GiftCard`](internal-3.GiftCard.md)\> | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`GiftCard`](internal-3.GiftCard.md)\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<[[`GiftCard`](internal-3.GiftCard.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:39

___

### retrieve

▸ **retrieve**(`giftCardId`, `config?`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

Gets a gift card by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | id of gift card to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`GiftCard`](internal-3.GiftCard.md)\> | optional values to include with gift card query |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

the gift card

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:66

___

### retrieveByCode

▸ **retrieveByCode**(`code`, `config?`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`GiftCard`](internal-3.GiftCard.md)\> |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:67

___

### retrieve\_

▸ `Protected` **retrieve_**(`selector`, `config?`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`GiftCard`](internal-3.GiftCard.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`GiftCard`](internal-3.GiftCard.md)\> |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:59

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`giftCardId`, `update`): `Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

Updates a giftCard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` | giftCard id of giftCard to update |
| `update` | [`UpdateGiftCardInput`](../modules/internal-8.md#updategiftcardinput) | the data to update the giftCard with |

#### Returns

`Promise`<[`GiftCard`](internal-3.GiftCard.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:74

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`GiftCardService`](internal-8.internal.GiftCardService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`GiftCardService`](internal-8.internal.GiftCardService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11

___

### generateCode

▸ `Static` **generateCode**(): `string`

Generates a 16 character gift card code

#### Returns

`string`

the generated gift card code

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:33

___

### resolveTaxRate

▸ `Static` `Protected` **resolveTaxRate**(`giftCardTaxRate`, `region`): ``null`` \| `number`

The tax_rate of the giftcard can depend on whether regions tax gift cards, an input
provided by the user or the tax rate. Based on these conditions, tax_rate changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `giftCardTaxRate` | ``null`` \| `number` |
| `region` | [`Region`](internal-3.Region.md) |

#### Returns

``null`` \| `number`

the tax rate for the gift card

#### Defined in

packages/medusa/dist/services/gift-card.d.ts:58
