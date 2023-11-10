# TransactionStartEvent

TransactionStartEvent is an object that broadcaster sends to the entity subscriber before transaction is started.

## Properties

### connection

 **connection**: [`DataSource`](../classes/DataSource.md)

Connection used in the event.

#### Defined in

node_modules/typeorm/subscriber/event/TransactionStartEvent.d.ts:11

___

### manager

 **manager**: [`EntityManager`](../classes/EntityManager.md)

EntityManager used in the event transaction.
All database operations in the subscribed event listener should be performed using this entity manager instance.

#### Defined in

node_modules/typeorm/subscriber/event/TransactionStartEvent.d.ts:21

___

### queryRunner

 **queryRunner**: [`QueryRunner`](QueryRunner.md)

QueryRunner used in the event transaction.
All database operations in the subscribed event listener should be performed using this query runner instance.

#### Defined in

node_modules/typeorm/subscriber/event/TransactionStartEvent.d.ts:16
