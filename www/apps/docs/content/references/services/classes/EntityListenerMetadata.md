# EntityListenerMetadata

This metadata contains all information about entity's listeners.

## Constructors

### constructor

**new EntityListenerMetadata**(`options`)

#### Parameters

| Name |
| :------ |
| `options` | `object` |
| `options.args` | [`EntityListenerMetadataArgs`](../interfaces/EntityListenerMetadataArgs.md) |
| `options.embeddedMetadata?` | [`EmbeddedMetadata`](EmbeddedMetadata.md) |
| `options.entityMetadata` | [`EntityMetadata`](EntityMetadata.md) |

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:31

## Properties

### embeddedMetadata

 `Optional` **embeddedMetadata**: [`EmbeddedMetadata`](EmbeddedMetadata.md)

Embedded metadata of the listener, in the case if listener is in embedded.

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:17

___

### entityMetadata

 **entityMetadata**: [`EntityMetadata`](EntityMetadata.md)

Entity metadata of the listener.

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:13

___

### propertyName

 **propertyName**: `string`

Target's property name to which this metadata is applied.

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:26

___

### target

 **target**: `string` \| `Function`

Target class to which metadata is applied.
This can be different then entityMetadata.target in the case if listener is in the embedded.

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:22

___

### type

 **type**: [`EventListenerType`](../index.md#eventlistenertype)

The type of the listener.

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:30

## Methods

### callEntityEmbeddedMethod

`Protected` **callEntityEmbeddedMethod**(`entity`, `propertyPaths`): `void`

Calls embedded entity listener method no matter how nested it is.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |
| `propertyPaths` | `string`[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:47

___

### execute

**execute**(`entity`): `any`

Executes listener method of the given entity.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`any`

-`any`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:43

___

### isAllowed

**isAllowed**(`entity`): `boolean`

Checks if entity listener is allowed to be executed on the given entity.

#### Parameters

| Name |
| :------ |
| `entity` | [`ObjectLiteral`](../interfaces/ObjectLiteral.md) |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Defined in

node_modules/typeorm/metadata/EntityListenerMetadata.d.ts:39
