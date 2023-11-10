# ServerHeartbeatStartedEvent

Emitted when the server monitor’s hello command is started - immediately before
the hello command is serialized into raw BSON and written to the socket.

## Constructors

### constructor

**new ServerHeartbeatStartedEvent**()

## Properties

### connectionId

 **connectionId**: `string`

The connection id for the command

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4774
