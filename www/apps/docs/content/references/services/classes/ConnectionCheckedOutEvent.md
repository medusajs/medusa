# ConnectionCheckedOutEvent

An event published when a connection is checked out of the connection pool

## Hierarchy

- [`ConnectionPoolMonitoringEvent`](ConnectionPoolMonitoringEvent.md)

  ↳ **`ConnectionCheckedOutEvent`**

## Constructors

### constructor

**new ConnectionCheckedOutEvent**()

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

### connectionId

 **connectionId**: `number` \| ``"<monitor>"``

The id of the connection

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2062

___

### time

 **time**: `Date`

A timestamp when the event was created

#### Inherited from

[ConnectionPoolMonitoringEvent](ConnectionPoolMonitoringEvent.md).[time](ConnectionPoolMonitoringEvent.md#time)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2175
