# AutoEncrypter

## Constructors

### constructor

**new AutoEncrypter**(`client`, `options`)

#### Parameters

| Name |
| :------ |
| `client` | [`MongoClient`](../classes/MongoClient.md) |
| `options` | [`AutoEncryptionOptions`](AutoEncryptionOptions.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:465

## Properties

### cryptSharedLibVersionInfo

 `Readonly` **cryptSharedLibVersionInfo**: ``null`` \| { `version`: `bigint` ; `versionStr`: `string`  }

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:471

## Methods

### decrypt

**decrypt**(`cmd`, `options`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `cmd` | [`Document`](Document.md) |
| `options` | `any` |
| `callback` | [`Callback`](../types/Callback.md)<[`Document`](Document.md)\> |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:469

___

### encrypt

**encrypt**(`ns`, `cmd`, `options`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `ns` | `string` |
| `cmd` | [`Document`](Document.md) |
| `options` | `any` |
| `callback` | [`Callback`](../types/Callback.md)<[`Document`](Document.md)\> |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:468

___

### init

**init**(`cb`): `void`

#### Parameters

| Name |
| :------ |
| `cb` | [`Callback`](../types/Callback.md)<`any`\> |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:466

___

### teardown

**teardown**(`force`, `callback`): `void`

#### Parameters

| Name |
| :------ |
| `force` | `boolean` |
| `callback` | [`Callback`](../types/Callback.md)<`any`\> |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:467
