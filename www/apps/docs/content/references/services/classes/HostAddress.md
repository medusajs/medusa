# HostAddress

## Constructors

### constructor

**new HostAddress**(`hostString`)

#### Parameters

| Name |
| :------ |
| `hostString` | `string` |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3259

## Properties

### host

 **host**: `undefined` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3255

___

### isIPv6

 **isIPv6**: `boolean`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3258

___

### port

 **port**: `undefined` \| `number`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3256

___

### socketPath

 **socketPath**: `undefined` \| `string`

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3257

## Methods

### inspect

**inspect**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3260

___

### toString

**toString**(): `string`

#### Returns

`string`

-`string`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3261

___

### fromHostPort

`Static` **fromHostPort**(`host`, `port`): [`HostAddress`](HostAddress.md)

#### Parameters

| Name |
| :------ |
| `host` | `string` |
| `port` | `number` |

#### Returns

[`HostAddress`](HostAddress.md)

-`HostAddress`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3263

___

### fromSrvRecord

`Static` **fromSrvRecord**(`«destructured»`): [`HostAddress`](HostAddress.md)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`SrvRecord`](../interfaces/SrvRecord.md) |

#### Returns

[`HostAddress`](HostAddress.md)

-`HostAddress`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3264

___

### fromString

`Static` **fromString**(`this`, `s`): [`HostAddress`](HostAddress.md)

#### Parameters

| Name |
| :------ |
| `this` | `void` |
| `s` | `string` |

#### Returns

[`HostAddress`](HostAddress.md)

-`HostAddress`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3262
