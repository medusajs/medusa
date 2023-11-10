# InsertEvent

InsertEvent is an object that broadcaster sends to the entity subscriber when entity is inserted to the database.

## Type parameters

| Name |
| :------ |
| `Entity` | `object` |

## Properties

### connection

 **connection**: [`DataSource`](../classes/DataSource.md)

Connection used in the event.

#### Defined in

node_modules/typeorm/subscriber/event/InsertEvent.d.ts:12

___

### entity

 **entity**: `Entity`

Inserting event.

#### Defined in

node_modules/typeorm/subscriber/event/InsertEvent.d.ts:26

___

### manager

 **manager**: [`EntityManager`](../classes/EntityManager.md)

EntityManager used in the event transaction.
All database operations in the subscribed event listener should be performed using this entity manager instance.

#### Defined in

node_modules/typeorm/subscriber/event/InsertEvent.d.ts:22

___

### metadata

 **metadata**: [`EntityMetadata`](../classes/EntityMetadata.md)

Metadata of the entity.

#### Defined in

node_modules/typeorm/subscriber/event/InsertEvent.d.ts:30

___

### queryRunner

 **queryRunner**: [`QueryRunner`](QueryRunner.md)

QueryRunner used in the event transaction.
All database operations in the subscribed event listener should be performed using this query runner instance.

#### Defined in

node_modules/typeorm/subscriber/event/InsertEvent.d.ts:17
