# PaymentService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`PaymentService`**

## Constructors

### constructor

**new PaymentService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-22) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/payment.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L39)

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

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/payment.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L27)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderService\_

 `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/payment.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L28)

___

### paymentRepository\_

 `Protected` `Readonly` **paymentRepository\_**: [`Repository`](Repository.md)<[`Payment`](Payment.md)\>

#### Defined in

[packages/medusa/src/services/payment.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L29)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PAYMENT_CAPTURED` | `string` |
| `PAYMENT_CAPTURE_FAILED` | `string` |
| `REFUND_CREATED` | `string` |
| `REFUND_FAILED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/payment.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L30)

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

### capture

**capture**(`paymentOrId`): `Promise`<[`Payment`](Payment.md)\>

Captures a payment.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentOrId` | `string` \| [`Payment`](Payment.md) | the id or the class instance of the payment |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: the payment captured.
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment.ts:153](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L153)

___

### create

**create**(`paymentInput`): `Promise`<[`Payment`](Payment.md)\>

Created a new payment.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentInput` | [`PaymentDataInput`](../index.md#paymentdatainput) | info to create the payment |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: the payment created.
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment.ts:92](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L92)

___

### refund

**refund**(`paymentOrId`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](Refund.md)\>

refunds a payment.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentOrId` | `string` \| [`Payment`](Payment.md) | the id or the class instance of the payment |
| `amount` | `number` | the amount to be refunded from the payment |
| `reason` | `string` | the refund reason |
| `note?` | `string` | additional note of the refund |

#### Returns

`Promise`<[`Refund`](Refund.md)\>

-`Promise`: the refund created.
	-`Refund`: 

#### Defined in

[packages/medusa/src/services/payment.ts:202](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L202)

___

### retrieve

**retrieve**(`paymentId`, `config?`): `Promise`<[`Payment`](Payment.md)\>

Retrieves a payment by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Payment`](Payment.md)\> | the config to retrieve the payment |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: the payment.
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L58)

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

**update**(`paymentId`, `data`): `Promise`<[`Payment`](Payment.md)\>

Updates a payment in order to link it to an order or a swap.

#### Parameters

| Name | Description |
| :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `data` | `object` | order_id or swap_id to link the payment |
| `data.order_id?` | `string` |
| `data.swap_id?` | `string` |

#### Returns

`Promise`<[`Payment`](Payment.md)\>

-`Promise`: the payment updated.
	-`Payment`: 

#### Defined in

[packages/medusa/src/services/payment.ts:121](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/payment.ts#L121)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PaymentService`](PaymentService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`PaymentService`](PaymentService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
