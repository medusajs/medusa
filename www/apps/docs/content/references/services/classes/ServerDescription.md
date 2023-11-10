# ServerDescription

The client's view of a single server, based on the most recent hello outcome.

Internal type, not meant to be directly instantiated

## Constructors

### constructor

**new ServerDescription**()

## Properties

### $clusterTime

 `Optional` **$clusterTime**: [`ClusterTime`](../interfaces/ClusterTime.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4711

___

### address

 **address**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4692

___

### arbiters

 **arbiters**: `string`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4696

___

### electionId

 **electionId**: ``null`` \| [`ObjectId`](ObjectId.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4709

___

### error

 **error**: ``null`` \| [`MongoError`](MongoError.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4698

___

### hosts

 **hosts**: `string`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4694

___

### lastUpdateTime

 **lastUpdateTime**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4703

___

### lastWriteDate

 **lastWriteDate**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4704

___

### logicalSessionTimeoutMinutes

 **logicalSessionTimeoutMinutes**: ``null`` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4710

___

### maxWireVersion

 **maxWireVersion**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4701

___

### me

 **me**: ``null`` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4705

___

### minWireVersion

 **minWireVersion**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4700

___

### passives

 **passives**: `string`[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4695

___

### primary

 **primary**: ``null`` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4706

___

### roundTripTime

 **roundTripTime**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4702

___

### setName

 **setName**: ``null`` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4707

___

### setVersion

 **setVersion**: ``null`` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4708

___

### tags

 **tags**: [`TagSet`](../index.md#tagset)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4697

___

### topologyVersion

 **topologyVersion**: ``null`` \| [`TopologyVersion`](../interfaces/TopologyVersion.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4699

___

### type

 **type**: [`ServerType`](../index.md#servertype-1)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4693

## Accessors

### allHosts

`get` **allHosts**(): `string`[]

#### Returns

`string`[]

-`string[]`: 
	-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4713

___

### host

`get` **host**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4720

___

### hostAddress

`get` **hostAddress**(): [`HostAddress`](HostAddress.md)

#### Returns

[`HostAddress`](HostAddress.md)

-`HostAddress`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4712

___

### isDataBearing

`get` **isDataBearing**(): `boolean`

Is this server data bearing

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4717

___

### isReadable

`get` **isReadable**(): `boolean`

Is this server available for reads

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4715

___

### isWritable

`get` **isWritable**(): `boolean`

Is this server available for writes

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4719

___

### port

`get` **port**(): `number`

#### Returns

`number`

-`number`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4721

## Methods

### equals

**equals**(`other?`): `boolean`

Determines if another `ServerDescription` is equal to this one per the rules defined
in the [spec](https://github.com/mongodb/specifications/blob/master/source/server-discovery-and-monitoring/server-discovery-and-monitoring.rst#serverdescription|SDAM)

#### Parameters

| Name |
| :------ |
| `other?` | ``null`` \| [`ServerDescription`](ServerDescription.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4726
