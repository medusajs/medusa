# ConnectionCheckOutFailedEvent

An event published when a request to check a connection out fails

## Hierarchy

- [`ConnectionPoolMonitoringEvent`](ConnectionPoolMonitoringEvent.md)

  ↳ **`ConnectionCheckOutFailedEvent`**

## Constructors

### constructor

**new ConnectionCheckOutFailedEvent**()

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[constructor](ConnectionPoolMonitoringEvent.md#constructor)

## Properties

### address

 **address**: `string`

The address (host/port pair) of the pool

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[address](ConnectionPoolMonitoringEvent.md#address)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2177

___

### reason

 **reason**: `string` \| [`AnyError`](../types/AnyError.md)

The reason the attempt to check out failed

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2071

___

### time

 **time**: `Date`

A timestamp when the event was created

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[time](ConnectionPoolMonitoringEvent.md#time)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2175
