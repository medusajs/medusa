# Class: EventBusService

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

[services/event-bus.ts:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L38)

## Properties

### config\_

• `Protected` `Readonly` **config\_**: `ConfigModule`

#### Defined in

[services/event-bus.ts:24](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L24)

___

### cronHandlers\_

• `Protected` `Readonly` **cronHandlers\_**: `Map`<`string` \| `symbol`, `Subscriber`<`unknown`\>[]\>

#### Defined in

[services/event-bus.ts:29](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L29)

___

### cronQueue\_

• `Protected` `Readonly` **cronQueue\_**: `Bull`

#### Defined in

[services/event-bus.ts:32](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L32)

___

### enqueue\_

• `Protected` **enqueue\_**: `Promise`<`void`\>

#### Defined in

[services/event-bus.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L36)

___

### logger\_

• `Protected` `Readonly` **logger\_**: `Logger`

#### Defined in

[services/event-bus.ts:26](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L26)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Defined in

[services/event-bus.ts:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L25)

___

### observers\_

• `Protected` `Readonly` **observers\_**: `Map`<`string` \| `symbol`, `Subscriber`<`unknown`\>[]\>

#### Defined in

[services/event-bus.ts:28](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L28)

___

### queue\_

• `Protected` **queue\_**: `Bull`

#### Defined in

[services/event-bus.ts:33](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L33)

___

### redisClient\_

• `Protected` `Readonly` **redisClient\_**: `Redis`

#### Defined in

[services/event-bus.ts:30](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L30)

___

### redisSubscriber\_

• `Protected` `Readonly` **redisSubscriber\_**: `Redis`

#### Defined in

[services/event-bus.ts:31](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L31)

___

### shouldEnqueuerRun

• `Protected` **shouldEnqueuerRun**: `boolean`

#### Defined in

[services/event-bus.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L34)

___

### stagedJobRepository\_

• `Protected` `Readonly` **stagedJobRepository\_**: typeof `StagedJobRepository`

#### Defined in

[services/event-bus.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Defined in

[services/event-bus.ts:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L35)

## Methods

### createCronJob

▸ **createCronJob**<`T`\>(`eventName`, `data`, `cron`, `handler`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` |  |
| `data` | `T` |  |
| `cron` | `string` |  |
| `handler` | `Subscriber`<`unknown`\> |  |

#### Returns

`void`

#### Defined in

[services/event-bus.ts:308](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L308)

___

### cronWorker\_

▸ **cronWorker_**<`T`\>(`job`): `Promise`<`unknown`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `Object` |  |
| `job.data` | `Object` | - |
| `job.data.data` | `T` | - |
| `job.data.eventName` | `string` | - |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[services/event-bus.ts:281](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L281)

___

### emit

▸ **emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void` \| `StagedJob`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` |  |
| `data` | `T` |  |
| `options` | `Object` |  |
| `options.delay?` | `number` | - |

#### Returns

`Promise`<`void` \| `StagedJob`\>

#### Defined in

[services/event-bus.ts:179](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L179)

___

### enqueuer\_

▸ **enqueuer_**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[services/event-bus.ts:215](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L215)

___

### registerCronHandler\_

▸ `Protected` **registerCronHandler_**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` |  |
| `subscriber` | `Subscriber`<`unknown`\> |  |

#### Returns

[`EventBusService`](EventBusService.md)

#### Defined in

[services/event-bus.ts:158](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L158)

___

### startEnqueuer

▸ **startEnqueuer**(): `void`

#### Returns

`void`

#### Defined in

[services/event-bus.ts:205](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L205)

___

### stopEnqueuer

▸ **stopEnqueuer**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[services/event-bus.ts:210](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L210)

___

### subscribe

▸ **subscribe**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` |  |
| `subscriber` | `Subscriber`<`unknown`\> |  |

#### Returns

[`EventBusService`](EventBusService.md)

#### Defined in

[services/event-bus.ts:118](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L118)

___

### unsubscribe

▸ **unsubscribe**(`event`, `subscriber`): [`EventBusService`](EventBusService.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` \| `symbol` |  |
| `subscriber` | `Subscriber`<`unknown`\> |  |

#### Returns

[`EventBusService`](EventBusService.md)

#### Defined in

[services/event-bus.ts:136](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L136)

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

[services/event-bus.ts:88](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L88)

___

### worker\_

▸ **worker_**<`T`\>(`job`): `Promise`<`unknown`[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | `Object` |  |
| `job.data` | `Object` | - |
| `job.data.data` | `T` | - |
| `job.data.eventName` | `string` | - |

#### Returns

`Promise`<`unknown`[]\>

#### Defined in

[services/event-bus.ts:250](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/event-bus.ts#L250)
