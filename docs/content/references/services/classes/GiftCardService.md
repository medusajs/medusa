# Class: GiftCardService

## Hierarchy

- `TransactionBaseService`<[`GiftCardService`](GiftCardService.md)\>

  ↳ **`GiftCardService`**

## Constructors

### constructor

• **new GiftCardService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;GiftCardService\&gt;.constructor

#### Defined in

[services/gift-card.ts:46](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L46)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/gift-card.ts:37](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L37)

___

### giftCardRepository\_

• `Protected` `Readonly` **giftCardRepository\_**: typeof `GiftCardRepository`

#### Defined in

[services/gift-card.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L34)

___

### giftCardTransactionRepo\_

• `Protected` `Readonly` **giftCardTransactionRepo\_**: typeof `GiftCardTransactionRepository`

#### Defined in

[services/gift-card.ts:35](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L35)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/gift-card.ts:39](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L39)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/gift-card.ts:36](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L36)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/gift-card.ts:40](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L40)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |

#### Defined in

[services/gift-card.ts:42](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L42)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`giftCard`): `Promise`<`GiftCard`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCard` | `CreateGiftCardInput` |  |

#### Returns

`Promise`<`GiftCard`\>

#### Defined in

[services/gift-card.ts:152](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L152)

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

[services/gift-card.ts:137](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L137)

___

### delete

▸ **delete**(`giftCardId`): `Promise`<`void` \| `GiftCard`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` |  |

#### Returns

`Promise`<`void` \| `GiftCard`\>

#### Defined in

[services/gift-card.ts:282](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L282)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`GiftCard`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`GiftCard`\> |  |
| `config` | `FindConfig`<`GiftCard`\> |  |

#### Returns

`Promise`<`GiftCard`[]\>

#### Defined in

[services/gift-card.ts:113](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L113)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`GiftCard`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `QuerySelector`<`GiftCard`\> |  |
| `config` | `FindConfig`<`GiftCard`\> |  |

#### Returns

`Promise`<[`GiftCard`[], `number`]\>

#### Defined in

[services/gift-card.ts:84](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L84)

___

### retrieve

▸ **retrieve**(`giftCardId`, `config?`): `Promise`<`GiftCard`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` |  |
| `config` | `FindConfig`<`GiftCard`\> |  |

#### Returns

`Promise`<`GiftCard`\>

#### Defined in

[services/gift-card.ts:216](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L216)

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

[services/gift-card.ts:223](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L223)

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

[services/gift-card.ts:182](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L182)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`giftCardId`, `update`): `Promise`<`GiftCard`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `giftCardId` | `string` |  |
| `update` | `UpdateGiftCardInput` |  |

#### Returns

`Promise`<`GiftCard`\>

#### Defined in

[services/gift-card.ts:236](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L236)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)

___

### generateCode

▸ `Static` **generateCode**(): `string`

#### Returns

`string`

#### Defined in

[services/gift-card.ts:68](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/gift-card.ts#L68)
