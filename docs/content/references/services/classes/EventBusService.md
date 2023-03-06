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

[packages/medusa/src/services/event-bus.ts:75](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L75)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/event-bus.ts:59](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L59)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:73](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L73)

___

### eventToSubscribersMap\_

• `Protected` `Readonly` **eventToSubscribersMap\_**: `Map`<`string` \| `symbol`, `SubscriberDescriptor`[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:64](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L64)

___

### jobSchedulerService\_

• `Protected` `Readonly` **jobSchedulerService\_**: `default`

#### Defined in

[packages/medusa/src/services/event-bus.ts:63](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L63)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/event-bus.ts:61](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L61)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:60](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L60)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:70](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L70)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:68](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L68)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:69](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L69)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:71](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L71)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[packages/medusa/src/services/event-bus.ts:62](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L62)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:72](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L72)

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

[packages/medusa/src/services/event-bus.ts:421](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L421)

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
| `options` | `any` | options to add the job with |

#### Returns

`Promise`<`void` \| `StagedJob`\>

the job from our queue

#### Defined in

[packages/medusa/src/services/event-bus.ts:225](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L225)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:285](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L285)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/event-bus.ts:275](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L275)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:280](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L280)

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

[packages/medusa/src/services/event-bus.ts:155](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L155)

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

[packages/medusa/src/services/event-bus.ts:198](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L198)

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

[packages/medusa/src/services/event-bus.ts:123](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L123)

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

[packages/medusa/src/services/event-bus.ts:320](https://github.com/medusajs/medusa/blob/3718f88c6/packages/medusa/src/services/event-bus.ts#L320)
