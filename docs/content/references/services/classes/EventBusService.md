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

[packages/medusa/src/services/event-bus.ts:80](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L80)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/event-bus.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L64)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:78](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L78)

___

### eventToSubscribersMap\_

• `Protected` `Readonly` **eventToSubscribersMap\_**: `Map`<`string` \| `symbol`, `SubscriberDescriptor`[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:69](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L69)

___

### jobSchedulerService\_

• `Protected` `Readonly` **jobSchedulerService\_**: `default`

#### Defined in

[packages/medusa/src/services/event-bus.ts:68](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L68)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/event-bus.ts:66](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L66)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L65)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:75](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L75)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:73](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L73)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:74](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L74)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:76](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L76)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[packages/medusa/src/services/event-bus.ts:67](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L67)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:77](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L77)

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

[packages/medusa/src/services/event-bus.ts:467](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L467)

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

#### Defined in

[packages/medusa/src/services/event-bus.ts:228](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L228)

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
| `options?` | `any` | options to add the job with |

#### Returns

`Promise`<`void` \| `StagedJob`\>

the job from our queue

#### Defined in

[packages/medusa/src/services/event-bus.ts:237](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L237)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:326](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L326)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/event-bus.ts:316](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L316)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:321](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L321)

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

[packages/medusa/src/services/event-bus.ts:160](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L160)

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

[packages/medusa/src/services/event-bus.ts:203](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L203)

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

[packages/medusa/src/services/event-bus.ts:128](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L128)

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

[packages/medusa/src/services/event-bus.ts:366](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/event-bus.ts#L366)
