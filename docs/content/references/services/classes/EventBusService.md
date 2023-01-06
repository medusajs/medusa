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

[packages/medusa/src/services/event-bus.ts:48](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L48)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/event-bus.ts:35](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L35)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:46](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L46)

___

### jobSchedulerService\_

• `Protected` `Readonly` **jobSchedulerService\_**: `default`

#### Defined in

[packages/medusa/src/services/event-bus.ts:39](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L39)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/event-bus.ts:37](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L37)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:36](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L36)

___

### observers\_

• `Protected` `Readonly` **observers\_**: `Map`<`string` \| `symbol`, `Subscriber`<`unknown`\>[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:40](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L40)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:43](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L43)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:41](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L41)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:42](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L42)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:44](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L44)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[packages/medusa/src/services/event-bus.ts:38](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L38)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:45](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L45)

## Methods

### createCronJob

▸ **createCronJob**<`T`\>(`eventName`, `data`, `cron`, `handler`): `void`

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

#### Returns

`void`

void

#### Defined in

[packages/medusa/src/services/event-bus.ts:279](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L279)

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
| `options` | `EmitOptions` | options to add the job with |

#### Returns

`Promise`<`void` \| `StagedJob`\>

the job from our queue

#### Defined in

[packages/medusa/src/services/event-bus.ts:167](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L167)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:209](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L209)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/event-bus.ts:199](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L199)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:204](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L204)

___

### subscribe

▸ **subscribe**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

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

[packages/medusa/src/services/event-bus.ts:127](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L127)

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

[packages/medusa/src/services/event-bus.ts:145](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L145)

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

[packages/medusa/src/services/event-bus.ts:96](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L96)

___

### worker\_

▸ **worker_**<`T`\>(`job`): `Promise`<`unknown`[]\>

Handles incoming jobs.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `Object` | The job object |
| `job.data` | `Object` | - |
| `job.data.data` | `T` | - |
| `job.data.eventName` | `string` | - |

#### Returns

`Promise`<`unknown`[]\>

resolves to the results of the subscriber calls.

#### Defined in

[packages/medusa/src/services/event-bus.ts:244](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/event-bus.ts#L244)
