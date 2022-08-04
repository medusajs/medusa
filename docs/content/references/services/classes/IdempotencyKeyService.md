# Class: IdempotencyKeyService

## Hierarchy

- `TransactionBaseService`

  ↳ **`IdempotencyKeyService`**

## Constructors

### constructor

• **new IdempotencyKeyService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[services/idempotency-key.js:8](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L8)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `any`

#### Inherited from

TransactionBaseService.container

___

### transactionManager\_

• `Protected` `Abstract` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

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

▸ **create**(`payload`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:52](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L52)

___

### initializeRequest

▸ **initializeRequest**(`headerKey`, `reqMethod`, `reqParams`, `reqPath`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerKey` | `string` |  |
| `reqMethod` | `string` |  |
| `reqParams` | `string` |  |
| `reqPath` | `string` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:26](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L26)

___

### lock

▸ **lock**(`idempotencyKey`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/idempotency-key.js:90](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L90)

___

### retrieve

▸ **retrieve**(`idempotencyKey`): `Promise`<`IdempotencyKeyModel`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |

#### Returns

`Promise`<`IdempotencyKeyModel`\>

#### Defined in

[services/idempotency-key.js:73](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L73)

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

▸ **update**(`idempotencyKey`, `update`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |
| `update` | `any` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/idempotency-key.js:117](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L117)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

`any`

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)

___

### workStage

▸ **workStage**(`idempotencyKey`, `func`): `IdempotencyKeyModel`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idempotencyKey` | `string` |  |
| `func` | `Function` |  |

#### Returns

`IdempotencyKeyModel`

#### Defined in

[services/idempotency-key.js:144](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/idempotency-key.js#L144)
