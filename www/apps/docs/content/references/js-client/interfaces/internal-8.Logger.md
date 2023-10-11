---
displayed_sidebar: jsClientSidebar
---

# Interface: Logger

[internal](../modules/internal-8.md).Logger

## Properties

### activity

• **activity**: (`message`: `string`, `config?`: `any`) => `void`

#### Type declaration

▸ (`message`, `config?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `config?` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:6

___

### debug

• **debug**: (`message`: `any`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:11

___

### error

• **error**: (`messageOrError`: `any`, `error?`: `any`) => `void`

#### Type declaration

▸ (`messageOrError`, `error?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `messageOrError` | `any` |
| `error?` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:8

___

### failure

• **failure**: (`activityId`: `any`, `message`: `any`) => `void`

#### Type declaration

▸ (`activityId`, `message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `activityId` | `any` |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:9

___

### info

• **info**: (`message`: `any`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:12

___

### log

• **log**: (...`args`: `any`[]) => `void`

#### Type declaration

▸ (`...args`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:14

___

### panic

• **panic**: (`data`: `any`) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:2

___

### progress

• **progress**: (`activityId`: `any`, `message`: `any`) => `void`

#### Type declaration

▸ (`activityId`, `message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `activityId` | `any` |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:7

___

### setLogLevel

• **setLogLevel**: (`level`: `string`) => `void`

#### Type declaration

▸ (`level`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `string` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:4

___

### shouldLog

• **shouldLog**: (`level`: `string`) => `void`

#### Type declaration

▸ (`level`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `string` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:3

___

### success

• **success**: (`activityId`: `any`, `message`: `any`) => `void`

#### Type declaration

▸ (`activityId`, `message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `activityId` | `any` |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:10

___

### unsetLogLevel

• **unsetLogLevel**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:5

___

### warn

• **warn**: (`message`: `any`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |

##### Returns

`void`

#### Defined in

packages/types/dist/logger/index.d.ts:13
