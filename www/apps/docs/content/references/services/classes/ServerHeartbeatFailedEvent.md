# ServerHeartbeatFailedEvent

Emitted when the server monitor’s hello fails, either with an “ok: 0” or a socket exception.

## Constructors

### constructor

**new ServerHeartbeatFailedEvent**()

## Properties

### connectionId

 **connectionId**: `string`

The connection id for the command

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4759

___

### duration

 **duration**: `number`

The execution time of the event in ms

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4761

___

### failure

 **failure**: `Error`

The command failure

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4763
