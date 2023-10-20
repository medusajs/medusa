---
displayed_sidebar: jsClientSidebar
---

# Class: EventBusService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).EventBusService

Can keep track of multiple subscribers to different events and run the
subscribers when events happen. Events will run asynchronously.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`EventBusService`**

## Implements

- [`IEventBusService`](../interfaces/internal-8.IEventBusService.md)

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

### config\_

• `Protected` `Readonly` **config\_**: [`ConfigModule`](../modules/internal-8.md#configmodule)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:19

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:24

___

### eventBusModuleService\_

• `Protected` `Readonly` **eventBusModuleService\_**: [`IEventBusModuleService`](../interfaces/internal-8.IEventBusModuleService.md)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:21

___

### logger\_

• `Protected` `Readonly` **logger\_**: [`Logger`](../interfaces/internal-8.Logger.md)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:22

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:23

___

### stagedJobService\_

• `Protected` `Readonly` **stagedJobService\_**: [`StagedJobService`](internal-8.internal.StagedJobService.md)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:20

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

### emit

▸ **emit**<`T`\>(`data`): `Promise`<`void` \| [`StagedJob`](internal-8.internal.StagedJob.md)[]\>

Calls all subscribers when an event occurs.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`EmitData`](../modules/internal-8.md#emitdata)<`T`\>[] | The data to use to process the events |

#### Returns

`Promise`<`void` \| [`StagedJob`](internal-8.internal.StagedJob.md)[]\>

the jobs from our queue

#### Implementation of

[IEventBusService](../interfaces/internal-8.IEventBusService.md).[emit](../interfaces/internal-8.IEventBusService.md#emit)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:49

▸ **emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void` \| [`StagedJob`](internal-8.internal.StagedJob.md)\>

Calls all subscribers when an event occurs.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the name of the event to be process. |
| `data` | `T` | the data to send to the subscriber. |
| `options?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> | options to add the job with |

#### Returns

`Promise`<`void` \| [`StagedJob`](internal-8.internal.StagedJob.md)\>

the job from our queue

#### Implementation of

EventBusTypes.IEventBusService.emit

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:57

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:60

___

### listJobs

▸ `Protected` **listJobs**(`listConfig`): `Promise`<`never`[] \| [`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `listConfig` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`StagedJob`](internal-8.internal.StagedJob.md)\> |

#### Returns

`Promise`<`never`[] \| [`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:61

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

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:58

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:59

___

### subscribe

▸ **subscribe**(`event`, `subscriber`, `context?`): [`EventBusService`](internal-8.internal.EventBusService.md)

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event that the subscriber will listen for. |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber)<`unknown`\> | the function to be called when a certain event happens. Subscribers must return a Promise. |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) | subscriber context |

#### Returns

[`EventBusService`](internal-8.internal.EventBusService.md)

this

#### Implementation of

[IEventBusService](../interfaces/internal-8.IEventBusService.md).[subscribe](../interfaces/internal-8.IEventBusService.md#subscribe)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:35

___

### unsubscribe

▸ **unsubscribe**(`event`, `subscriber`, `context`): [`EventBusService`](internal-8.internal.EventBusService.md)

Removes function from the list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event of the subcriber. |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber)<`unknown`\> | the function to be removed |
| `context` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) | subscriber context |

#### Returns

[`EventBusService`](internal-8.internal.EventBusService.md)

this

#### Implementation of

[IEventBusService](../interfaces/internal-8.IEventBusService.md).[unsubscribe](../interfaces/internal-8.IEventBusService.md#unsubscribe)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:43

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`EventBusService`](internal-8.internal.EventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`EventBusService`](internal-8.internal.EventBusService.md)

#### Implementation of

[IEventBusService](../interfaces/internal-8.IEventBusService.md).[withTransaction](../interfaces/internal-8.IEventBusService.md#withtransaction)

#### Overrides

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/services/event-bus.d.ts:26
