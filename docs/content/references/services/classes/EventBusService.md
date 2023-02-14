# Class: EventBusService

Can keep track of multiple subscribers to different events and run the
subscribers when events happen. Events will run asynchronously.

## Constructors

### constructor

• **new EventBusService**(`__namedParameters`, `config`, `singleton?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | `InjectedDependencies` | `undefined` |
| `config` | `ConfigModule` | `undefined` |
| `singleton` | `boolean` | `true` |

#### Defined in

[packages/medusa/src/services/event-bus.ts:73](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L73)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/event-bus.ts:57](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L57)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:71](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L71)

___

### eventToSubscribersMap\_

• `Protected` `Readonly` **eventToSubscribersMap\_**: `Map`<`string` \| `symbol`, `SubscriberDescriptor`[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:62](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L62)

___

### jobSchedulerService\_

• `Protected` `Readonly` **jobSchedulerService\_**: `default`

#### Defined in

[packages/medusa/src/services/event-bus.ts:61](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L61)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/event-bus.ts:59](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L59)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:58](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L58)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:68](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L68)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:66](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L66)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:67](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L67)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:69](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L69)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[packages/medusa/src/services/event-bus.ts:60](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L60)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:70](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L70)

## Methods

### createCronJob

▸ **createCronJob**<`T`\>(`eventName`, `data`, `cron`, `handler`, `options?`): `Promise`<`void`\>

Registers a cron job.

**`Deprecated`**

All cron job logic has been refactored to the `JobSchedulerService`. This method will be removed in a future release.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the name of the event |
| `data` | `T` | the data to be sent with the event |
| `cron` | `string` | the cron pattern |
| `handler` | `Subscriber`<`unknown`\> | the handler to call on each cron job |
| `options?` | `CreateJobOptions` | - |

#### Returns

`Promise`<`void`\>

void

#### Defined in

[packages/medusa/src/services/event-bus.ts:416](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L416)

___

### emit

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
| `options` | `Record`<`string`, `unknown`\> & `EmitOptions` | options to add the job with |

#### Returns

`Promise`<`void` \| `StagedJob`\>

the job from our queue

#### Defined in

[packages/medusa/src/services/event-bus.ts:223](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L223)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:280](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L280)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/event-bus.ts:270](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L270)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:275](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L275)

___

### subscribe

▸ **subscribe**(`event`, `subscriber`, `context?`): [`EventBusService`](EventBusService.md)

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event that the subscriber will listen for. |
| `subscriber` | `Subscriber`<`unknown`\> | the function to be called when a certain event |
| `context?` | `SubscriberContext` | context to use when attaching subscriber happens. Subscribers must return a Promise. |

#### Returns

[`EventBusService`](EventBusService.md)

this

#### Defined in

[packages/medusa/src/services/event-bus.ts:153](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L153)

___

### unsubscribe

▸ **unsubscribe**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` | the event that the subscriber will listen for. |
| `subscriber` | `Subscriber`<`unknown`\> | the function to be called when a certain event happens. Subscribers must return a Promise. |

#### Returns

[`EventBusService`](EventBusService.md)

this

#### Defined in

[packages/medusa/src/services/event-bus.ts:196](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L196)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/event-bus.ts:121](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L121)

___

### worker\_

▸ **worker_**<`T`\>(`job`): `Promise`<`unknown`\>

Handles incoming jobs.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `BullJob`<`T`\> | The job object |

#### Returns

`Promise`<`unknown`\>

resolves to the results of the subscriber calls.

#### Defined in

[packages/medusa/src/services/event-bus.ts:315](https://github.com/medusajs/medusa/blob/1bfbe27b9/packages/medusa/src/services/event-bus.ts#L315)
