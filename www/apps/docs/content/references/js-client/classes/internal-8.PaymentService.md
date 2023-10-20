---
displayed_sidebar: jsClientSidebar
---

# Class: PaymentService

[internal](../modules/internal-8.md).PaymentService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`PaymentService`**

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

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/payment.d.ts:21

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/payment.d.ts:22

___

### paymentRepository\_

• `Protected` `Readonly` **paymentRepository\_**: `Repository`<[`Payment`](internal-3.Payment.md)\>

#### Defined in

packages/medusa/dist/services/payment.d.ts:23

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

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

packages/medusa/dist/services/payment.d.ts:24

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

### capture

▸ **capture**(`paymentOrId`): `Promise`<[`Payment`](internal-3.Payment.md)\>

Captures a payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentOrId` | `string` \| [`Payment`](internal-3.Payment.md) | the id or the class instance of the payment |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

the payment captured.

#### Defined in

packages/medusa/dist/services/payment.d.ts:61

___

### create

▸ **create**(`paymentInput`): `Promise`<[`Payment`](internal-3.Payment.md)\>

Created a new payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentInput` | [`PaymentDataInput`](../modules/internal-8.md#paymentdatainput) | info to create the payment |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

the payment created.

#### Defined in

packages/medusa/dist/services/payment.d.ts:45

___

### refund

▸ **refund**(`paymentOrId`, `amount`, `reason`, `note?`): `Promise`<[`Refund`](internal-3.Refund.md)\>

refunds a payment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentOrId` | `string` \| [`Payment`](internal-3.Payment.md) | the id or the class instance of the payment |
| `amount` | `number` | the amount to be refunded from the payment |
| `reason` | `string` | the refund reason |
| `note?` | `string` | additional note of the refund |

#### Returns

`Promise`<[`Refund`](internal-3.Refund.md)\>

the refund created.

#### Defined in

packages/medusa/dist/services/payment.d.ts:70

___

### retrieve

▸ **retrieve**(`paymentId`, `config?`): `Promise`<[`Payment`](internal-3.Payment.md)\>

Retrieves a payment by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Payment`](internal-3.Payment.md)\> | the config to retrieve the payment |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

the payment.

#### Defined in

packages/medusa/dist/services/payment.d.ts:39

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

▸ **update**(`paymentId`, `data`): `Promise`<[`Payment`](internal-3.Payment.md)\>

Updates a payment in order to link it to an order or a swap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paymentId` | `string` | the id of the payment |
| `data` | `Object` | order_id or swap_id to link the payment |
| `data.order_id?` | `string` | - |
| `data.swap_id?` | `string` | - |

#### Returns

`Promise`<[`Payment`](internal-3.Payment.md)\>

the payment updated.

#### Defined in

packages/medusa/dist/services/payment.d.ts:52

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PaymentService`](internal-8.PaymentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PaymentService`](internal-8.PaymentService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
