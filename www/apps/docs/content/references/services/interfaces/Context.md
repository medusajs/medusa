# Context

The interface tag is used to ensure that the type is documented similar to interfaces.

A shared context object that is used to share resources between the application and the module.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TManager` | `object` |

## Properties

### enableNestedTransactions

 `Optional` **enableNestedTransactions**: `boolean`

a boolean value indicating whether nested transactions are enabled.

#### Defined in

packages/types/dist/shared-context.d.ts:22

___

### isolationLevel

 `Optional` **isolationLevel**: `string`

A string indicating the isolation level of the context. Possible values are `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, or `SERIALIZABLE`.

#### Defined in

packages/types/dist/shared-context.d.ts:21

___

### manager

 `Optional` **manager**: `TManager`

An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.

#### Defined in

packages/types/dist/shared-context.d.ts:20

___

### transactionId

 `Optional` **transactionId**: `string`

a string indicating the ID of the current transaction.

#### Defined in

packages/types/dist/shared-context.d.ts:23

___

### transactionManager

 `Optional` **transactionManager**: `TManager`

An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Defined in

packages/types/dist/shared-context.d.ts:19
