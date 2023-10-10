---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractEventBusModuleService

[internal](../modules/internal-8.md).AbstractEventBusModuleService

## Implements

- [`IEventBusModuleService`](../interfaces/internal-8.IEventBusModuleService.md)

## Properties

### eventToSubscribersMap\_

• `Protected` **eventToSubscribersMap\_**: `Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../modules/internal-8.md#subscriberdescriptor)[]\>

#### Defined in

packages/utils/dist/event-bus/index.d.ts:3

## Accessors

### eventToSubscribersMap

• `get` **eventToSubscribersMap**(): `Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../modules/internal-8.md#subscriberdescriptor)[]\>

#### Returns

`Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../modules/internal-8.md#subscriberdescriptor)[]\>

#### Defined in

packages/utils/dist/event-bus/index.d.ts:4

## Methods

### emit

▸ `Abstract` **emit**<`T`\>(`eventName`, `data`, `options`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `data` | `T` |
| `options` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

`Promise`<`void`\>

#### Implementation of

[IEventBusModuleService](../interfaces/internal-8.IEventBusModuleService.md).[emit](../interfaces/internal-8.IEventBusModuleService.md#emit)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:5

▸ `Abstract` **emit**<`T`\>(`data`): `Promise`<`void`\>

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

#### Implementation of

[IEventBusModuleService](../interfaces/internal-8.IEventBusModuleService.md).[emit](../interfaces/internal-8.IEventBusModuleService.md#emit)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:6

___

### storeSubscribers

▸ `Protected` **storeSubscribers**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `event` | `string` \| `symbol` |
| › `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber)<`unknown`\> |
| › `subscriberId` | `string` |

#### Returns

`void`

#### Defined in

packages/utils/dist/event-bus/index.d.ts:7

___

### subscribe

▸ **subscribe**(`eventName`, `subscriber`, `context?`): [`AbstractEventBusModuleService`](internal-8.AbstractEventBusModuleService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber)<`unknown`\> |
| `context?` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`AbstractEventBusModuleService`](internal-8.AbstractEventBusModuleService.md)

#### Implementation of

[IEventBusModuleService](../interfaces/internal-8.IEventBusModuleService.md).[subscribe](../interfaces/internal-8.IEventBusModuleService.md#subscribe)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:12

___

### unsubscribe

▸ **unsubscribe**(`eventName`, `subscriber`, `context`): [`AbstractEventBusModuleService`](internal-8.AbstractEventBusModuleService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../modules/internal-8.md#subscriber)<`unknown`\> |
| `context` | [`SubscriberContext`](../modules/internal-8.md#subscribercontext) |

#### Returns

[`AbstractEventBusModuleService`](internal-8.AbstractEventBusModuleService.md)

#### Implementation of

[IEventBusModuleService](../interfaces/internal-8.IEventBusModuleService.md).[unsubscribe](../interfaces/internal-8.IEventBusModuleService.md#unsubscribe)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:13
