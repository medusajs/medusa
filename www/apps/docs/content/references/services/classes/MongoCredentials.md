# MongoCredentials

A representation of the credentials used by MongoDB

## Constructors

### constructor

**new MongoCredentials**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | [`MongoCredentialsOptions`](../interfaces/MongoCredentialsOptions.md) |

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3823

## Properties

### mechanism

 `Readonly` **mechanism**: [`AuthMechanism`](../index.md#authmechanism-1)

The method used to authenticate

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3820

___

### mechanismProperties

 `Readonly` **mechanismProperties**: [`AuthMechanismProperties`](../interfaces/AuthMechanismProperties.md)

Special properties used by some types of auth mechanisms

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3822

___

### password

 `Readonly` **password**: `string`

The password used for authentication

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3816

___

### source

 `Readonly` **source**: `string`

The database that the user should authenticate against

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3818

___

### username

 `Readonly` **username**: `string`

The username used for authentication

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3814

## Methods

### equals

**equals**(`other`): `boolean`

Determines if two MongoCredentials objects are equivalent

#### Parameters

| Name |
| :------ |
| `other` | [`MongoCredentials`](MongoCredentials.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3825

___

### resolveAuthMechanism

**resolveAuthMechanism**(`hello?`): [`MongoCredentials`](MongoCredentials.md)

If the authentication mechanism is set to "default", resolves the authMechanism
based on the server version and server supported sasl mechanisms.

#### Parameters

| Name | Description |
| :------ | :------ |
| `hello?` | [`Document`](../interfaces/Document.md) | A hello response from the server |

#### Returns

[`MongoCredentials`](MongoCredentials.md)

-`MongoCredentials`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3832

___

### validate

**validate**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3833

___

### merge

`Static` **merge**(`creds`, `options`): [`MongoCredentials`](MongoCredentials.md)

#### Parameters

| Name |
| :------ |
| `creds` | `undefined` \| [`MongoCredentials`](MongoCredentials.md) |
| `options` | [`Partial`](../index.md#partial)<[`MongoCredentialsOptions`](../interfaces/MongoCredentialsOptions.md)\> |

#### Returns

[`MongoCredentials`](MongoCredentials.md)

-`MongoCredentials`: 

#### Defined in

node_modules/typeorm/driver/mongodb/typings.d.ts:3834
