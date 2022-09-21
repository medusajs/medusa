# Class: InventoryService

## Hierarchy

- `TransactionBaseService`

  ↳ **`InventoryService`**

## Constructors

### constructor

• **new InventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InventoryServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/inventory.ts:18](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/inventory.ts:15](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L15)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/inventory.ts:13](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L13)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/inventory.ts:16](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L16)

## Methods

### adjustInventory

▸ **adjustInventory**(`variantId`, `adjustment`): `Promise`<`undefined` \| `ProductVariant`\>

Updates the inventory of a variant based on a given adjustment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to update |
| `adjustment` | `number` | the number to adjust the inventory quantity by |

#### Returns

`Promise`<`undefined` \| `ProductVariant`\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/inventory.ts:31](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L31)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`): `Promise`<`boolean`\>

Checks if the inventory of a variant can cover a given quantity. Will
return true if the variant doesn't have managed inventory or if the variant
allows backorders or if the inventory quantity is greater than `quantity`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `undefined` \| ``null`` \| `string` | the id of the variant to check |
| `quantity` | `number` | the number of units to check availability for |

#### Returns

`Promise`<`boolean`\>

true if the inventory covers the quantity

#### Defined in

[packages/medusa/src/services/inventory.ts:63](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/services/inventory.ts#L63)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`InventoryService`](InventoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`InventoryService`](InventoryService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efeb6b84/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
