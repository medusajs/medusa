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

• **new EventBusService**(`«destructured»`, `config`, `isSingleton?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `InjectedDependencies` | `undefined` |
| `config` | `any` | `undefined` |
| `isSingleton` | `boolean` | `true` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/event-bus.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L36)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[medusa/src/services/event-bus.ts:27](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L27)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:34](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L34)

___

### eventBusModuleService\_

• `Protected` `Readonly` **eventBusModuleService\_**: `IEventBusModuleService`

#### Defined in

[medusa/src/services/event-bus.ts:30](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L30)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[medusa/src/services/event-bus.ts:31](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[medusa/src/services/event-bus.ts:33](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L33)

___

### stagedJobService\_

• `Protected` `Readonly` **stagedJobService\_**: [`StagedJobService`](StagedJobService.md)

#### Defined in

[medusa/src/services/event-bus.ts:28](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L28)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/event-bus.ts:117](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L117)

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

[medusa/src/services/event-bus.ts:126](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L126)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:190](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L190)

___

### listJobs

▸ `Protected` **listJobs**(`listConfig`): `Promise`<`never`[] \| `StagedJob`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `listConfig` | `FindConfig`<`StagedJob`\> |

#### Returns

`Promise`<`never`[] \| `StagedJob`[]\>

#### Defined in

[medusa/src/services/event-bus.ts:220](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L220)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[medusa/src/services/event-bus.ts:180](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L180)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/event-bus.ts:185](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L185)

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

[medusa/src/services/event-bus.ts:83](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L83)

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

[medusa/src/services/event-bus.ts:103](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L103)

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

[medusa/src/services/event-bus.ts:54](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/event-bus.ts#L54)
