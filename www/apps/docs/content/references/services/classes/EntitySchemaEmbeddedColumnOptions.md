# EntitySchemaEmbeddedColumnOptions

## Constructors

### constructor

**new EntitySchemaEmbeddedColumnOptions**()

## Properties

### array

 `Optional` **array**: `boolean`

Indicates if this embedded is in array mode.

This option works only in mongodb.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaEmbeddedColumnOptions.d.ts:17

___

### prefix

 `Optional` **prefix**: `string` \| `boolean`

Embedded column prefix.
If set to empty string or false, then prefix is not set at all.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaEmbeddedColumnOptions.d.ts:11

___

### schema

 **schema**: [`EntitySchema`](EntitySchema.md)<`any`\>

Schema of embedded entity

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaEmbeddedColumnOptions.d.ts:6
