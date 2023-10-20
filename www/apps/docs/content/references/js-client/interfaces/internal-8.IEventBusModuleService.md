---
displayed_sidebar: jsClientSidebar
---

# Interface: IEventBusModuleService

[internal](../modules/internal-8.md).IEventBusModuleService

## Implemented by

- [`AbstractEventBusModuleService`](../classes/internal-8.AbstractEventBusModuleService.md)

## Methods

### emit

▸ **emit**<`T`\>(`eventName`, `data`, `options?`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `data` | `T` |
| `options?` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:3

▸ **emit**<`T`\>(`data`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`EmitData`](../modules/internal-8.md#emitdata)<`T`\>[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:4

___

### subscribe

▸ **subscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusModuleService`](internal-8.IEventBusModuleService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber) |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`IEventBusModuleService`](internal-8.IEventBusModuleService.md)

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:5

___

### unsubscribe

▸ **unsubscribe**(`eventName`, `subscriber`, `context?`): [`IEventBusModuleService`](internal-8.IEventBusModuleService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber) |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`IEventBusModuleService`](internal-8.IEventBusModuleService.md)

#### Defined in

packages/types/dist/event-bus/event-bus-module.d.ts:6
