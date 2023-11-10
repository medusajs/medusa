# ConnectionPoolMonitoringEvent

The base export class for all monitoring events published from the connection pool

## Hierarchy

- **`ConnectionPoolMonitoringEvent`**

  ↳ [`ConnectionPoolCreatedEvent`](ConnectionPoolCreatedEvent.md)

  ↳ [`ConnectionPoolReadyEvent`](ConnectionPoolReadyEvent.md)

  ↳ [`ConnectionPoolClosedEvent`](ConnectionPoolClosedEvent.md)

  ↳ [`ConnectionPoolClearedEvent`](ConnectionPoolClearedEvent.md)

  ↳ [`ConnectionCreatedEvent`](ConnectionCreatedEvent.md)

  ↳ [`ConnectionReadyEvent`](ConnectionReadyEvent.md)

  ↳ [`ConnectionClosedEvent`](ConnectionClosedEvent.md)

  ↳ [`ConnectionCheckOutStartedEvent`](ConnectionCheckOutStartedEvent.md)

  ↳ [`ConnectionCheckOutFailedEvent`](ConnectionCheckOutFailedEvent.md)

  ↳ [`ConnectionCheckedOutEvent`](ConnectionCheckedOutEvent.md)

  ↳ [`ConnectionCheckedInEvent`](ConnectionCheckedInEvent.md)

## Constructors

### constructor

**new ConnectionPoolMonitoringEvent**()

## Properties

### address

 **address**: `string`

The address (host/port pair) of the pool

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2177

___

### time

 **time**: `Date`

A timestamp when the event was created

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:2175
