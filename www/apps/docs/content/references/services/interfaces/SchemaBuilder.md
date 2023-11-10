# SchemaBuilder

Creates complete tables schemas in the database based on the entity metadatas.

## Methods

### build

**build**(): `Promise`<`void`\>

Creates complete schemas for the given entity metadatas.

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

node_modules/typeorm/schema-builder/SchemaBuilder.d.ts:9

___

### log

**log**(): `Promise`<[`SqlInMemory`](../classes/SqlInMemory.md)\>

Returns queries to be executed by schema builder.

#### Returns

`Promise`<[`SqlInMemory`](../classes/SqlInMemory.md)\>

-`Promise`: 
	-`SqlInMemory`: 

#### Defined in

node_modules/typeorm/schema-builder/SchemaBuilder.d.ts:13
