# ServerDescriptionChangedEvent

Emitted when server description changes, but does NOT include changes to the RTT.

## Constructors

### constructor

**new ServerDescriptionChangedEvent**()

## Properties

### address

 **address**: `string`

The address (host/port pair) of the server

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4737

___

### newDescription

 **newDescription**: [`ServerDescription`](ServerDescription.md)

The new server description

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4741

___

### previousDescription

 **previousDescription**: [`ServerDescription`](ServerDescription.md)

The previous server description

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4739

___

### topologyId

 **topologyId**: `number`

A unique identifier for the topology

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4735
