# TopologyDescription

Representation of a deployment of servers

## Constructors

### constructor

**new TopologyDescription**(`topologyType`, `serverDescriptions?`, `setName?`, `maxSetVersion?`, `maxElectionId?`, `commonWireVersion?`, `options?`)

Create a TopologyDescription

#### Parameters

| Name |
| :------ |
| `topologyType` | [`TopologyType`](../index.md#topologytype) |
| `serverDescriptions?` | ``null`` \| `Map`<`string`, [`ServerDescription`](ServerDescription.md)\> |
| `setName?` | ``null`` \| `string` |
| `maxSetVersion?` | ``null`` \| `number` |
| `maxElectionId?` | ``null`` \| [`ObjectId`](ObjectId.md) |
| `commonWireVersion?` | ``null`` \| `number` |
| `options?` | ``null`` \| [`TopologyDescriptionOptions`](../interfaces/TopologyDescriptionOptions.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4981

## Properties

### commonWireVersion

 **commonWireVersion**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4977

___

### compatibilityError

 `Optional` **compatibilityError**: `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4973

___

### compatible

 **compatible**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4972

___

### heartbeatFrequencyMS

 **heartbeatFrequencyMS**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4975

___

### localThresholdMS

 **localThresholdMS**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4976

___

### logicalSessionTimeoutMinutes

 **logicalSessionTimeoutMinutes**: ``null`` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4974

___

### maxElectionId

 **maxElectionId**: ``null`` \| [`ObjectId`](ObjectId.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4969

___

### maxSetVersion

 **maxSetVersion**: ``null`` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4968

___

### servers

 **servers**: `Map`<`string`, [`ServerDescription`](ServerDescription.md)\>

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4970

___

### setName

 **setName**: ``null`` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4967

___

### stale

 **stale**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4971

___

### type

 **type**: [`TopologyType`](../index.md#topologytype)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4966

## Accessors

### error

`get` **error**(): ``null`` \| [`MongoServerError`](MongoServerError.md)

#### Returns

``null`` \| [`MongoServerError`](MongoServerError.md)

-```null`` \| MongoServerError`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4982

___

### hasDataBearingServers

`get` **hasDataBearingServers**(): `boolean`

Determines if this topology description has a data-bearing server available.

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4990

___

### hasKnownServers

`get` **hasKnownServers**(): `boolean`

Determines if the topology description has any known servers

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4986
