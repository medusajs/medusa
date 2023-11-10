# IEventBusModuleService

## Implemented by

- [`AbstractEventBusModuleService`](../classes/AbstractEventBusModuleService.md)

## Methods

### emit

**emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `eventName` | `string` |
| `data` | `T` |
| `options?` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:3

**emit**<`T`\>(`data`): `Promise`<`void`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `data` | [`EmitData`](../index.md#emitdata)<`T`\>[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:4

___

### subscribe

**subscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusModuleService`](IEventBusModuleService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../index.md#subscriber) |
| `context?` | [`SubscriberContext`](../index.md#subscribercontext) |

#### Returns

[`IEventBusModuleService`](IEventBusModuleService.md)

-`IEventBusModuleService`: 

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:5

___

### unsubscribe

**unsubscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusModuleService`](IEventBusModuleService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../index.md#subscriber) |
| `context?` | [`SubscriberContext`](../index.md#subscribercontext) |

#### Returns

[`IEventBusModuleService`](IEventBusModuleService.md)

-`IEventBusModuleService`: 

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:6
