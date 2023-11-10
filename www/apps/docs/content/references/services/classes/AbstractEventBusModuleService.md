# AbstractEventBusModuleService

## Implements

- [`IEventBusModuleService`](../interfaces/IEventBusModuleService.md)

## Constructors

### constructor

**new AbstractEventBusModuleService**()

## Properties

### eventToSubscribersMap\_

 `Protected` **eventToSubscribersMap\_**: `Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../types/SubscriberDescriptor.md)[]\>

#### Defined in

packages/utils/dist/event-bus/index.d.ts:3

## Accessors

### eventToSubscribersMap

`get` **eventToSubscribersMap**(): `Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../types/SubscriberDescriptor.md)[]\>

#### Returns

`Map`<`string` \| `symbol`, [`SubscriberDescriptor`](../types/SubscriberDescriptor.md)[]\>

-`Map`: 
	-`string \| symbol`: (optional) 
	-`SubscriberDescriptor[]`: 
		-`SubscriberDescriptor`: 

#### Defined in

packages/utils/dist/event-bus/index.d.ts:4

## Methods

### emit

`Abstract` **emit**<`T`\>(`eventName`, `data`, `options`): `Promise`<`void`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `eventName` | `string` |
| `data` | `T` |
| `options` | Record<`string`, `unknown`\> |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[IEventBusModuleService](../interfaces/IEventBusModuleService.md).[emit](../interfaces/IEventBusModuleService.md#emit)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:5

`Abstract` **emit**<`T`\>(`data`): `Promise`<`void`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `data` | [`EmitData`](../types/EmitData.md)<`T`\>[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[IEventBusModuleService](../interfaces/IEventBusModuleService.md).[emit](../interfaces/IEventBusModuleService.md#emit)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:6

___

### storeSubscribers

`Protected` **storeSubscribers**(`«destructured»`): `void`

#### Parameters

| Name |
| :------ |
| `«destructured»` | `object` |
| › `event` | `string` \| `symbol` |
| › `subscriber` | [`Subscriber`](../types/Subscriber.md)<`unknown`\> |
| › `subscriberId` | `string` |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

packages/utils/dist/event-bus/index.d.ts:7

___

### subscribe

**subscribe**(`eventName`, `subscriber`, `context?`): [`AbstractEventBusModuleService`](AbstractEventBusModuleService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../types/Subscriber.md)<`unknown`\> |
| `context?` | [`SubscriberContext`](../types/SubscriberContext.md) |

#### Returns

[`AbstractEventBusModuleService`](AbstractEventBusModuleService.md)

-`AbstractEventBusModuleService`: 

#### Implementation of

[IEventBusModuleService](../interfaces/IEventBusModuleService.md).[subscribe](../interfaces/IEventBusModuleService.md#subscribe)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:12

___

### unsubscribe

**unsubscribe**(`eventName`, `subscriber`, `context`): [`AbstractEventBusModuleService`](AbstractEventBusModuleService.md)

#### Parameters

| Name |
| :------ |
| `eventName` | `string` \| `symbol` |
| `subscriber` | [`Subscriber`](../types/Subscriber.md)<`unknown`\> |
| `context` | [`SubscriberContext`](../types/SubscriberContext.md) |

#### Returns

[`AbstractEventBusModuleService`](AbstractEventBusModuleService.md)

-`AbstractEventBusModuleService`: 

#### Implementation of

[IEventBusModuleService](../interfaces/IEventBusModuleService.md).[unsubscribe](../interfaces/IEventBusModuleService.md#unsubscribe)

#### Defined in

packages/utils/dist/event-bus/index.d.ts:13
