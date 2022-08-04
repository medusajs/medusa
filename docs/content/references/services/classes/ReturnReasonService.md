# Class: ReturnReasonService

## Hierarchy

- `TransactionBaseService`<[`ReturnReasonService`](ReturnReasonService.md)\>

  ↳ **`ReturnReasonService`**

## Constructors

### constructor

• **new ReturnReasonService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;ReturnReasonService\&gt;.constructor

#### Defined in

[services/return-reason.ts:21](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L21)

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/return-reason.ts:18](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L18)

___

### retReasonRepo\_

• `Protected` `Readonly` **retReasonRepo\_**: typeof `ReturnReasonRepository`

#### Defined in

[services/return-reason.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L16)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/return-reason.ts:19](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L19)

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

▸ **create**(`data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[services/return-reason.ts:29](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L29)

___

### delete

▸ **delete**(`returnReasonId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnReasonId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/return-reason.ts:110](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L110)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ReturnReason`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ReturnReason`\> |  |
| `config` | `FindConfig`<`ReturnReason`\> |  |

#### Returns

`Promise`<`ReturnReason`[]\>

#### Defined in

[services/return-reason.ts:72](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L72)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `config` | `FindConfig`<`ReturnReason`\> |  |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[services/return-reason.ts:91](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L91)

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

▸ **update**(`id`, `data`): `Promise`<`ReturnReason`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | `UpdateReturnReason` |

#### Returns

`Promise`<`ReturnReason`\>

#### Defined in

[services/return-reason.ts:50](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/return-reason.ts#L50)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ReturnReasonService`](ReturnReasonService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ReturnReasonService`](ReturnReasonService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
