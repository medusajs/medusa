# EntitySchemaRelationIdOptions

## Properties

### alias

 `Optional` **alias**: `string`

Alias of the joined (destination) table.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationIdOptions.d.ts:10

___

### queryBuilderFactory

 `Optional` **queryBuilderFactory**: (`qb`: [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>) => [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

#### Type declaration

(`qb`): [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

Extra condition applied to "ON" section of join.

##### Parameters

| Name |
| :------ |
| `qb` | [`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\> |

##### Returns

[`SelectQueryBuilder`](../classes/SelectQueryBuilder.md)<`any`\>

-`SelectQueryBuilder`: 
	-`any`: (optional) 

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationIdOptions.d.ts:14

___

### relationName

 **relationName**: `string`

Name of relation.

#### Defined in

node_modules/typeorm/entity-schema/EntitySchemaRelationIdOptions.d.ts:6
