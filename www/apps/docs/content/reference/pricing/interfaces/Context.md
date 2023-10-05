---
displayed_sidebar: modules
---

# Context

The interface tag is used to ensure that the type is documented similar to interfaces.

A shared context object that is used to share resources between modules.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TManager` | `unknown` |

## Properties

### enableNestedTransactions

 `Optional` **enableNestedTransactions**: `boolean`

a boolean value indicating whether nested transactions are enabled.

#### Defined in

[packages/types/src/shared-context.ts:24](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/shared-context.ts#L24)

___

### isolationLevel

 `Optional` **isolationLevel**: `string`

#### Defined in

[packages/types/src/shared-context.ts:23](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/shared-context.ts#L23)

___

### manager

 `Optional` **manager**: `TManager`

An instance of a manager, typically an entity manager, of type `TManager`, which is a typed parameter passed to the context to specify the type of the `manager`.

#### Defined in

[packages/types/src/shared-context.ts:22](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/shared-context.ts#L22)

___

### transactionId

 `Optional` **transactionId**: `string`

a string indicating the ID of the current transaction.

#### Defined in

[packages/types/src/shared-context.ts:25](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/shared-context.ts#L25)

___

### transactionManager

 `Optional` **transactionManager**: `TManager`

An instance of a transaction manager of type `TManager`, which is a typed parameter passed to the context to specify the type of the `transactionManager`.

#### Defined in

[packages/types/src/shared-context.ts:21](https://github.com/medusajs/medusa/blob/0350eeb0a1/packages/types/src/shared-context.ts#L21)
