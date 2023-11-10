# SoftRemoveEvent

SoftRemoveEvent is an object that broadcaster sends to the entity subscriber when entity is being soft removed to the database.

## Type parameters

| Name |
| :------ |
| `Entity` | `object` |

## Hierarchy

- [`RemoveEvent`](RemoveEvent.md)<`Entity`\>

  ↳ **`SoftRemoveEvent`**

## Properties

### connection

 **connection**: [`DataSource`](../classes/DataSource.md)

Connection used in the event.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[connection](RemoveEvent.md#connection)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:12

___

### databaseEntity

 **databaseEntity**: `Entity`

Database representation of entity that is being removed.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[databaseEntity](RemoveEvent.md#databaseentity)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:35

___

### entity

 `Optional` **entity**: `Entity`

Entity that is being removed.
This may absent if entity is removed without being loaded (for examples by cascades).

#### Inherited from

[RemoveEvent](RemoveEvent.md).[entity](RemoveEvent.md#entity)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:27

___

### entityId

 `Optional` **entityId**: `any`

Id or ids of the entity that is being removed.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[entityId](RemoveEvent.md#entityid)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:39

___

### manager

 **manager**: [`EntityManager`](../classes/EntityManager.md)

EntityManager used in the event transaction.
All database operations in the subscribed event listener should be performed using this entity manager instance.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[manager](RemoveEvent.md#manager)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:22

___

### metadata

 **metadata**: [`EntityMetadata`](../classes/EntityMetadata.md)

Metadata of the entity.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[metadata](RemoveEvent.md#metadata)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:31

___

### queryRunner

 **queryRunner**: [`QueryRunner`](QueryRunner.md)

QueryRunner used in the event transaction.
All database operations in the subscribed event listener should be performed using this query runner instance.

#### Inherited from

[RemoveEvent](RemoveEvent.md).[queryRunner](RemoveEvent.md#queryrunner)

#### Defined in

node_modules/typeorm/subscriber/event/RemoveEvent.d.ts:17
