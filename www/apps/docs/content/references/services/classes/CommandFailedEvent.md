# CommandFailedEvent

An event indicating the failure of a given command

## Constructors

### constructor

**new CommandFailedEvent**()

## Properties

### address

 **address**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1969

___

### commandName

 **commandName**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1973

___

### connectionId

 `Optional` **connectionId**: `string` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1970

___

### duration

 **duration**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1972

___

### failure

 **failure**: `Error`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1974

___

### requestId

 **requestId**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1971

___

### serviceId

 `Optional` **serviceId**: [`ObjectId`](ObjectId.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1975

## Accessors

### hasServiceId

`get` **hasServiceId**(): `boolean`

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:1976
