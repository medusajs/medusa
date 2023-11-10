# EventBusService

Can keep track of multiple subscribers to different events and run the
subscribers when events happen. Events will run asynchronously.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`EventBusService`**

## Implements

- [`IEventBusService`](../interfaces/IEventBusService.md)

## Constructors

### constructor

**new EventBusService**(`«destructured»`, `config`, `isSingleton?`)

#### Parameters

| Name | Default value |
| :------ | :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-10) |
| `config` | `any` |
| `isSingleton` | `boolean` | true |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/event-bus.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L39)

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

### config\_

 `Protected` `Readonly` **config\_**: [`ConfigModule`](../index.md#configmodule)

#### Defined in

[packages/medusa/src/services/event-bus.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L27)

___

### enqueue\_

 `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L37)

___

### logger\_

 `Protected` `Readonly` **logger\_**: [`Logger`](../interfaces/Logger.md)

#### Defined in

[packages/medusa/src/services/event-bus.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L34)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### shouldEnqueuerRun

 `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L36)

___

### stagedJobService\_

 `Protected` `Readonly` **stagedJobService\_**: [`StagedJobService`](StagedJobService.md)

#### Defined in

[packages/medusa/src/services/event-bus.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L28)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

___

### eventBusModuleService\_

`Protected` `get` **eventBusModuleService_**(): [`IEventBusModuleService`](../interfaces/IEventBusModuleService.md)

#### Returns

[`IEventBusModuleService`](../interfaces/IEventBusModuleService.md)

-`IEventBusModuleService`: 

#### Defined in

[packages/medusa/src/services/event-bus.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L30)

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

### emit

**emit**<`T`\>(`data`): `Promise`<`void` \| [`StagedJob`](StagedJob.md)[]\>

Calls all subscribers when an event occurs.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`EmitData`](../index.md#emitdata)<`T`\>[] | The data to use to process the events |

#### Returns

`Promise`<`void` \| [`StagedJob`](StagedJob.md)[]\>

-`Promise`: the jobs from our queue
	-`void \| StagedJob[]`: (optional) 

#### Implementation of

[IEventBusService](../interfaces/IEventBusService.md).[emit](../interfaces/IEventBusService.md#emit)

#### Defined in

[packages/medusa/src/services/event-bus.ts:119](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L119)

**emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void` \| [`StagedJob`](StagedJob.md)\>

Calls all subscribers when an event occurs.

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `eventName` | `string` | the name of the event to be process. |
| `data` | `T` | the data to send to the subscriber. |
| `options?` | Record<`string`, `unknown`\> | options to add the job with |

#### Returns

`Promise`<`void` \| [`StagedJob`](StagedJob.md)\>

-`Promise`: the job from our queue
	-`void \| StagedJob`: (optional) 

#### Implementation of

EventBusTypes.IEventBusService.emit

#### Defined in

[packages/medusa/src/services/event-bus.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L128)

___

### enqueuer\_

**enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/event-bus.ts:192](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L192)

___

### listJobs

`Protected` **listJobs**(`listConfig`): `Promise`<`never`[] \| [`StagedJob`](StagedJob.md)[]\>

#### Parameters

| Name |
| :------ |
| `listConfig` | [`FindConfig`](../interfaces/FindConfig.md)<[`StagedJob`](StagedJob.md)\> |

#### Returns

`Promise`<`never`[] \| [`StagedJob`](StagedJob.md)[]\>

-`Promise`: 
	-`never[] \| StagedJob[]`: (optional) 

#### Defined in

[packages/medusa/src/services/event-bus.ts:222](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L222)

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

### startEnqueuer

**startEnqueuer**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/services/event-bus.ts:182](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L182)

___

### stopEnqueuer

**stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/event-bus.ts:187](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L187)

___

### subscribe

**subscribe**(`event`, `subscriber`, `context?`): [`EventBusService`](EventBusService.md)

Adds a function to a list of event subscribers.

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `string` \| `symbol` | the event that the subscriber will listen for. |
| `subscriber` | [`Subscriber`](../index.md#subscriber)<`unknown`\> | the function to be called when a certain event happens. Subscribers must return a Promise. |
| `context?` | [`SubscriberContext`](../index.md#subscribercontext) | subscriber context |

#### Returns

[`EventBusService`](EventBusService.md)

-`default`: this

#### Implementation of

[IEventBusService](../interfaces/IEventBusService.md).[subscribe](../interfaces/IEventBusService.md#subscribe)

#### Defined in

[packages/medusa/src/services/event-bus.ts:85](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L85)

___

### unsubscribe

**unsubscribe**(`event`, `subscriber`, `context`): [`EventBusService`](EventBusService.md)

Removes function from the list of event subscribers.

#### Parameters

| Name | Description |
| :------ | :------ |
| `event` | `string` \| `symbol` | the event of the subcriber. |
| `subscriber` | [`Subscriber`](../index.md#subscriber)<`unknown`\> | the function to be removed |
| `context` | [`SubscriberContext`](../index.md#subscribercontext) | subscriber context |

#### Returns

[`EventBusService`](EventBusService.md)

-`default`: this

#### Implementation of

[IEventBusService](../interfaces/IEventBusService.md).[unsubscribe](../interfaces/IEventBusService.md#unsubscribe)

#### Defined in

[packages/medusa/src/services/event-bus.ts:105](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L105)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`EventBusService`](EventBusService.md)

-`default`: 

#### Implementation of

[IEventBusService](../interfaces/IEventBusService.md).[withTransaction](../interfaces/IEventBusService.md#withtransaction)

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/services/event-bus.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/event-bus.ts#L56)
