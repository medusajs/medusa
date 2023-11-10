# RemoveEvent

RemoveEvent is an object that broadcaster sends to the entity subscriber when entity is being removed to the database.

## Type parameters

| Name |
| :------ |
| `Entity` | `object` |

## Hierarchy

- **`RemoveEvent`**

  ↳ [`SoftRemoveEvent`](SoftRemoveEvent.md)

  ↳ [`RecoverEvent`](RecoverEvent.md)

## Properties

### connection

 **connection**: [`DataSource`](../classes/DataSource.md)

Connection used in the event.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:12

___

### databaseEntity

 **databaseEntity**: `Entity`

Database representation of entity that is being removed.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:35

___

### entity

 `Optional` **entity**: `Entity`

Entity that is being removed.
This may absent if entity is removed without being loaded (for examples by cascades).

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:27

___

### entityId

 `Optional` **entityId**: `any`

Id or ids of the entity that is being removed.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:39

___

### manager

 **manager**: [`EntityManager`](../classes/EntityManager.md)

EntityManager used in the event transaction.
All database operations in the subscribed event listener should be performed using this entity manager instance.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:22

___

### metadata

 **metadata**: [`EntityMetadata`](../classes/EntityMetadata.md)

Metadata of the entity.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:31

___

### queryRunner

 **queryRunner**: [`QueryRunner`](QueryRunner.md)

QueryRunner used in the event transaction.
All database operations in the subscribed event listener should be performed using this query runner instance.

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:17
