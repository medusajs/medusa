# Class: EventBusService

Can keep track of multiple subscribers to different events and run the
subscribers when events happen. Events will run asynchronously.

## Constructors

### constructor

• **new EventBusService**(`__namedParameters`, `config`, `singleton?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | `Object` | `undefined` |
| `config` | `any` | `undefined` |
| `singleton` | `boolean` | `true` |

#### Defined in

[services/event-bus.js:10](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L10)

## Properties

### config\_

• **config\_**: `any`

#### Defined in

[services/event-bus.js:31](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L31)

___

### enRun\_

• **enRun\_**: `undefined` \| `boolean`

#### Defined in

[services/event-bus.js:182](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L182)

___

### enqueue\_

• **enqueue\_**: `undefined` \| `Promise`<`void`\>

#### Defined in

[services/event-bus.js:183](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L183)

___

### redisClient\_

• **redisClient\_**: `any`

#### Defined in

[services/event-bus.js:51](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L51)

___

### redisSubscriber\_

• **redisSubscriber\_**: `any`

#### Defined in

[services/event-bus.js:52](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L52)

___

### stagedJobRepository\_

• **stagedJobRepository\_**: `any`

#### Defined in

[services/event-bus.js:39](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L39)

## Methods

### createCronJob

▸ **createCronJob**(`eventName`, `data`, `cron`, `handler`): `void`

Registers a cron job.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the name of the event |
| `data` | `any` | the data to be sent with the event |
| `cron` | `string` | the cron pattern |
| `handler` | `Function` | the handler to call on each cron job |

#### Returns

`void`

#### Defined in

[services/event-bus.js:280](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L280)

___

### cronWorker\_

▸ **cronWorker_**(`job`): `Promise`<`any`\>

Handles incoming jobs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `any` | The job object |

#### Returns

`Promise`<`any`\>

resolves to the results of the subscriber calls.

#### Defined in

[services/event-bus.js:255](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L255)

___

### emit

▸ **emit**(`eventName`, `data`, `options?`): `BullJob`

Calls all subscribers when an event occurs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the name of the event to be process. |
| `data` | `any` | the data to send to the subscriber. |
| `options` | `any` | options to add the job with |

#### Returns

`BullJob`

- the job from our queue

#### Defined in

[services/event-bus.js:154](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L154)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[services/event-bus.js:191](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L191)

___

### registerCronHandler\_

▸ **registerCronHandler_**(`event`, `subscriber`): `void`

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the event that the subscriber will listen for. |
| `subscriber` | `func` | the function to be called when a certain event happens. Subscribers must return a Promise. |

#### Returns

`void`

#### Defined in

[services/event-bus.js:135](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L135)

___

### sleep

▸ **sleep**(`ms`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/event-bus.js:175](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L175)

___

### startEnqueuer

▸ **startEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[services/event-bus.js:181](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L181)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[services/event-bus.js:186](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L186)

___

### subscribe

▸ **subscribe**(`event`, `subscriber`): `void`

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the event that the subscriber will listen for. |
| `subscriber` | `func` | the function to be called when a certain event happens. Subscribers must return a Promise. |

#### Returns

`void`

#### Defined in

[services/event-bus.js:98](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L98)

___

### unsubscribe

▸ **unsubscribe**(`event`, `subscriber`): `void`

Adds a function to a list of event subscribers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | the event that the subscriber will listen for. |
| `subscriber` | `func` | the function to be called when a certain event happens. Subscribers must return a Promise. |

#### Returns

`void`

#### Defined in

[services/event-bus.js:116](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L116)

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

[services/event-bus.js:69](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L69)

___

### worker\_

▸ **worker_**(`job`): `Promise`<`any`\>

Handles incoming jobs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `any` | The job object |

#### Returns

`Promise`<`any`\>

resolves to the results of the subscriber calls.

#### Defined in

[services/event-bus.js:226](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/event-bus.js#L226)
