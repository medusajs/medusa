# EmbeddedMetadataArgs

Arguments for EmbeddedMetadata class.

## Properties

### isArray

 **isArray**: `boolean`

Indicates if this embedded is array or not.

#### Defined in

node_modules/typeorm/metadata-args/EmbeddedMetadataArgs.d.ts:16

___

### prefix

 `Optional` **prefix**: `string` \| `boolean`

Prefix of the embedded, used instead of propertyName.
If set to empty string, then prefix is not set at all.

#### Defined in

node_modules/typeorm/metadata-args/EmbeddedMetadataArgs.d.ts:21

___

### propertyName

 **propertyName**: `string`

Class's property name to which this column is applied.

#### Defined in

node_modules/typeorm/metadata-args/EmbeddedMetadataArgs.d.ts:12

___

### target

 **target**: `string` \| `Function`

Class to which this column is applied.

#### Defined in

node_modules/typeorm/metadata-args/EmbeddedMetadataArgs.d.ts:8

___

### type

 **type**: (`type?`: `any`) => `string` \| `Function`

#### Type declaration

(`type?`): `string` \| `Function`

Type of the class to be embedded.

##### Parameters

| Name |
| :------ |
| `type?` | `any` |

##### Returns

`string` \| `Function`

-`string \| Function`: (optional) 

#### Defined in

node_modules/typeorm/metadata-args/EmbeddedMetadataArgs.d.ts:25
