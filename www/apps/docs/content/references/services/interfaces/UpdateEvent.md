# UpdateEvent

UpdateEvent is an object that broadcaster sends to the entity subscriber when entity is being updated in the database.

## Type parameters

| Name |
| :------ |
| `Entity` | `object` |

## Properties

### connection

 **connection**: [`DataSource`](../classes/DataSource.md)

Connection used in the event.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:15

___

### databaseEntity

 **databaseEntity**: `Entity`

Updating entity in the database.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:37

___

### entity

 **entity**: `undefined` \| [`ObjectLiteral`](ObjectLiteral.md)

Updating entity.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:29

___

### manager

 **manager**: [`EntityManager`](../classes/EntityManager.md)

EntityManager used in the event transaction.
All database operations in the subscribed event listener should be performed using this entity manager instance.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:25

___

### metadata

 **metadata**: [`EntityMetadata`](../classes/EntityMetadata.md)

Metadata of the entity.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:33

___

### queryRunner

 **queryRunner**: [`QueryRunner`](QueryRunner.md)

QueryRunner used in the event transaction.
All database operations in the subscribed event listener should be performed using this query runner instance.

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:20

___

### updatedColumns

 **updatedColumns**: [`ColumnMetadata`](../classes/ColumnMetadata.md)[]

List of updated columns. In query builder has no affected

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:41

___

### updatedRelations

 **updatedRelations**: [`RelationMetadata`](../classes/RelationMetadata.md)[]

List of updated relations. In query builder has no affected

#### Defined in

node_modules/typeorm/subscriber/event/UpdateEvent.d.ts:45
