# Class: ClaimItemService

## Hierarchy

- `TransactionBaseService`<[`ClaimItemService`](ClaimItemService.md)\>

  ↳ **`ClaimItemService`**

## Constructors

### constructor

• **new ClaimItemService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService&lt;ClaimItemService\&gt;.constructor

#### Defined in

[services/claim-item.ts:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L30)

## Properties

### claimImageRepository\_

• `Protected` `Readonly` **claimImageRepository\_**: typeof `ClaimImageRepository`

#### Defined in

[services/claim-item.ts:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L25)

___

### claimItemRepository\_

• `Protected` `Readonly` **claimItemRepository\_**: typeof `ClaimItemRepository`

#### Defined in

[services/claim-item.ts:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L23)

___

### claimTagRepository\_

• `Protected` `Readonly` **claimTagRepository\_**: typeof `ClaimTagRepository`

#### Defined in

[services/claim-item.ts:24](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L24)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

BaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

BaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/claim-item.ts:22](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L22)

___

### lineItemService\_

• `Protected` `Readonly` **lineItemService\_**: [`LineItemService`](LineItemService.md)

#### Defined in

[services/claim-item.ts:21](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L21)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

BaseService.manager\_

#### Defined in

[services/claim-item.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

BaseService.transactionManager\_

#### Defined in

[services/claim-item.ts:28](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L28)

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

[services/claim-item.ts:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L15)

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

BaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`data`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateClaimItemInput` |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[services/claim-item.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L49)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ClaimItem`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ClaimItem`\> |  |
| `config` | `FindConfig`<`ClaimItem`\> |  |

#### Returns

`Promise`<`ClaimItem`[]\>

#### Defined in

[services/claim-item.ts:214](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L214)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`ClaimItem`\> |  |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[services/claim-item.ts:233](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L233)

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

BaseService.shouldRetryTransaction\_

#### Defined in

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`id`, `data`): `Promise`<`ClaimItem`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `data` | `any` |

#### Returns

`Promise`<`ClaimItem`\>

#### Defined in

[services/claim-item.ts:132](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/claim-item.ts#L132)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ClaimItemService`](ClaimItemService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ClaimItemService`](ClaimItemService.md)

#### Inherited from

BaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
