# Class: EventBusService

Can keep track of multiple subscribers to different events and run the
subscribers when events happen. Events will run asynchronously.

## Hierarchy

- `TransactionBaseService`

  ↳ **`EventBusService`**

## Implements

- `IEventBusService`

## Constructors

### constructor

• **new EventBusService**(`__namedParameters`, `config`, `isSingleton?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | `InjectedDependencies` | `undefined` |
| `config` | `any` | `undefined` |
| `isSingleton` | `boolean` | `true` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/event-bus.ts:32](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L32)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[medusa/src/services/event-bus.ts:24](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L24)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:30](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L30)

___

### eventBusModuleService\_

• `Protected` `Readonly` **eventBusModuleService\_**: `AbstractEventBusModuleService`

#### Defined in

[medusa/src/services/event-bus.ts:27](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L27)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[medusa/src/services/event-bus.ts:29](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L29)

___

### stagedJobService\_

• `Protected` `Readonly` **stagedJobService\_**: [`StagedJobService`](StagedJobService.md)

#### Defined in

[medusa/src/services/event-bus.ts:25](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L25)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### emit

▸ **emit**<`T`\>(`data`): `Promise`<`void` \| `StagedJob`[]\>

Calls all subscribers when an event occurs.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `EmitData`<`T`\>[] | The data to use to process the events |

#### Returns

`Promise`<`void` \| `StagedJob`[]\>

the jobs from our queue

#### Implementation of

EventBusTypes.IEventBusService.emit

#### Defined in

[medusa/src/services/event-bus.ts:112](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L112)

▸ **emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void` \| `StagedJob`\>

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
| `options?` | `Record`<`string`, `unknown`\> | options to add the job with |

#### Returns

`Promise`<`void` \| `StagedJob`\>

the job from our queue

#### Implementation of

EventBusTypes.IEventBusService.emit

#### Defined in

[medusa/src/services/event-bus.ts:121](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L121)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:184](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L184)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[medusa/src/services/event-bus.ts:174](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L174)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:179](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L179)

___

### subscribe

▸ **subscribe**(`event`, `subscriber`, `context?`): [`EventBusService`](EventBusService.md)

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event that the subscriber will listen for. |
| `subscriber` | `Subscriber`<`unknown`\> | the function to be called when a certain event happens. Subscribers must return a Promise. |
| `context?` | `SubscriberContext` | subscriber context |

#### Returns

[`EventBusService`](EventBusService.md)

this

#### Implementation of

EventBusTypes.IEventBusService.subscribe

#### Defined in

[medusa/src/services/event-bus.ts:78](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L78)

___

### unsubscribe

▸ **unsubscribe**(`event`, `subscriber`, `context`): [`EventBusService`](EventBusService.md)

Removes function from the list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event of the subcriber. |
| `subscriber` | `Subscriber`<`unknown`\> | the function to be removed |
| `context` | `SubscriberContext` | subscriber context |

#### Returns

[`EventBusService`](EventBusService.md)

this

#### Implementation of

EventBusTypes.IEventBusService.unsubscribe

#### Defined in

[medusa/src/services/event-bus.ts:98](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L98)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`EventBusService`](EventBusService.md)

#### Implementation of

EventBusTypes.IEventBusService.withTransaction

#### Overrides

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/services/event-bus.ts:49](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/event-bus.ts#L49)
