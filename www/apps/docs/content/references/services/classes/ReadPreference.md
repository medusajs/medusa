# ReadPreference

The **ReadPreference** class is a class that represents a MongoDB ReadPreference and is
used to construct connections.

**See**

https://www.mongodb.com/docs/manual/core/read-preference/

## Constructors

### constructor

**new ReadPreference**(`mode`, `tags?`, `options?`)

#### Parameters

| Name | Description |
| :------ | :------ |
| `mode` | [`ReadPreferenceMode`](../index.md#readpreferencemode-1) | A string describing the read preference mode (primary\|primaryPreferred\|secondary\|secondaryPreferred\|nearest) |
| `tags?` | [`TagSet`](../index.md#tagset)[] | A tag set used to target reads to members with the specified tag(s). tagSet is not available if using read preference mode primary. |
| `options?` | [`ReadPreferenceOptions`](../interfaces/ReadPreferenceOptions.md) | Additional read preference options |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4470

## Properties

### hedge

 `Optional` **hedge**: [`HedgeOptions`](../interfaces/HedgeOptions.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4452

___

### maxStalenessSeconds

 `Optional` **maxStalenessSeconds**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4453

___

### minWireVersion

 `Optional` **minWireVersion**: `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4454

___

### mode

 **mode**: [`ReadPreferenceMode`](../index.md#readpreferencemode-1)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4450

___

### tags

 `Optional` **tags**: [`TagSet`](../index.md#tagset)[]

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4451

___

### NEAREST

 `Static` **NEAREST**: ``"nearest"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4459

___

### PRIMARY

 `Static` **PRIMARY**: ``"primary"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4455

___

### PRIMARY\_PREFERRED

 `Static` **PRIMARY\_PREFERRED**: ``"primaryPreferred"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4456

___

### SECONDARY

 `Static` **SECONDARY**: ``"secondary"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4457

___

### SECONDARY\_PREFERRED

 `Static` **SECONDARY\_PREFERRED**: ``"secondaryPreferred"``

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4458

___

### nearest

 `Static` **nearest**: [`ReadPreference`](ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4464

___

### primary

 `Static` **primary**: [`ReadPreference`](ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4460

___

### primaryPreferred

 `Static` **primaryPreferred**: [`ReadPreference`](ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4461

___

### secondary

 `Static` **secondary**: [`ReadPreference`](ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4462

___

### secondaryPreferred

 `Static` **secondaryPreferred**: [`ReadPreference`](ReadPreference.md)

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4463

## Accessors

### preference

`get` **preference**(): [`ReadPreferenceMode`](../index.md#readpreferencemode-1)

#### Returns

[`ReadPreferenceMode`](../index.md#readpreferencemode-1)

-`ReadPreferenceMode`: 
	-`nearest`: 
	-`primary`: 
	-`primaryPreferred`: 
	-`secondary`: 
	-`secondaryPreferred`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4471

## Methods

### equals

**equals**(`readPreference`): `boolean`

Check if the two ReadPreferences are equivalent

#### Parameters

| Name | Description |
| :------ | :------ |
| `readPreference` | [`ReadPreference`](ReadPreference.md) | The read preference with which to check equality |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4505

___

### isValid

**isValid**(`mode?`): `boolean`

Validate if a mode is legal

#### Parameters

| Name | Description |
| :------ | :------ |
| `mode?` | `string` | The string representing the read preference mode. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4494

___

### secondaryOk

**secondaryOk**(): `boolean`

Indicates that this readPreference needs the "SecondaryOk" bit when sent over the wire

#### Returns

`boolean`

-`boolean`: (optional) 

**See**

https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/#op-query

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4499

___

### toJSON

**toJSON**(): [`Document`](../interfaces/Document.md)

Return JSON representation

#### Returns

[`Document`](../interfaces/Document.md)

-`Document`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4507

___

### fromOptions

`Static` **fromOptions**(`options?`): `undefined` \| [`ReadPreference`](ReadPreference.md)

Construct a ReadPreference given an options object.

#### Parameters

| Name | Description |
| :------ | :------ |
| `options?` | [`ReadPreferenceFromOptions`](../interfaces/ReadPreferenceFromOptions.md) | The options object from which to extract the read preference. |

#### Returns

`undefined` \| [`ReadPreference`](ReadPreference.md)

-`undefined \| ReadPreference`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4478

___

### fromString

`Static` **fromString**(`mode`): [`ReadPreference`](ReadPreference.md)

#### Parameters

| Name |
| :------ |
| `mode` | `string` |

#### Returns

[`ReadPreference`](ReadPreference.md)

-`ReadPreference`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4472

___

### isValid

`Static` **isValid**(`mode`): `boolean`

Validate if a mode is legal

#### Parameters

| Name | Description |
| :------ | :------ |
| `mode` | `string` | The string representing the read preference mode. |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4488

___

### translate

`Static` **translate**(`options`): [`ReadPreferenceLikeOptions`](../interfaces/ReadPreferenceLikeOptions.md)

Replaces options.readPreference with a ReadPreference instance

#### Parameters

| Name |
| :------ |
| `options` | [`ReadPreferenceLikeOptions`](../interfaces/ReadPreferenceLikeOptions.md) |

#### Returns

[`ReadPreferenceLikeOptions`](../interfaces/ReadPreferenceLikeOptions.md)

-`hedge`: (optional) Server mode in which the same query is dispatched in parallel to multiple replica set members.
	-`enabled`: (optional) Explicitly enable or disable hedged reads.
-`maxStalenessSeconds`: (optional) Max secondary read staleness in seconds, Minimum value is 90 seconds.
-`readPreference`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:4482
