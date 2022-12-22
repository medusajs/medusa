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

[packages/medusa/src/services/event-bus.ts:47](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L47)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[packages/medusa/src/services/event-bus.ts:33](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L33)

___

### cronHandlers\_

• `Protected` `Readonly` **cronHandlers\_**: `Map`<`string` \| `symbol`, `Subscriber`<`unknown`\>[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:38](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L38)

___

### cronQueue\_

• `Protected` `Readonly` **cronQueue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:41](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L41)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:45](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L45)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[packages/medusa/src/services/event-bus.ts:35](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L35)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:34](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L34)

___

### observers\_

• `Protected` `Readonly` **observers\_**: `Map`<`string` \| `symbol`, `Subscriber`<`unknown`\>[]\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:37](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L37)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[packages/medusa/src/services/event-bus.ts:42](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L42)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:39](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L39)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[packages/medusa/src/services/event-bus.ts:40](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L40)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[packages/medusa/src/services/event-bus.ts:43](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L43)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[packages/medusa/src/services/event-bus.ts:36](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L36)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[packages/medusa/src/services/event-bus.ts:44](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L44)

## Methods

### createCronJob

▸ **createCronJob**<`T`\>(`eventName`, `data`, `cron`, `handler`): `void`

Registers a cron job.

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

[packages/medusa/src/services/event-bus.ts:323](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L323)

___

### cronWorker\_

▸ **cronWorker_**<`T`\>(`job`): `Promise`<`unknown`[]\>

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

[packages/medusa/src/services/event-bus.ts:296](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L296)

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

[packages/medusa/src/services/event-bus.ts:188](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L188)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:230](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L230)

___

### registerCronHandler\_

▸ `Protected` **registerCronHandler_**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

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

[packages/medusa/src/services/event-bus.ts:167](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L167)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[packages/medusa/src/services/event-bus.ts:220](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L220)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/event-bus.ts:225](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L225)

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

[packages/medusa/src/services/event-bus.ts:127](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L127)

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

[packages/medusa/src/services/event-bus.ts:145](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L145)

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

[packages/medusa/src/services/event-bus.ts:97](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L97)

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

[packages/medusa/src/services/event-bus.ts:265](https://github.com/medusajs/medusa/blob/105c68929/packages/medusa/src/services/event-bus.ts#L265)
