# Class: InventoryService

## Hierarchy

- `TransactionBaseService`<[`InventoryService`](InventoryService.md)\>

  ↳ **`InventoryService`**

## Constructors

### constructor

• **new InventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InventoryServiceProps` |

#### Overrides

TransactionBaseService&lt;InventoryService\&gt;.constructor

#### Defined in

[services/inventory.ts:18](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L18)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/inventory.ts:15](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L15)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/inventory.ts:13](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L13)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/inventory.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L16)

## Methods

### adjustInventory

▸ **adjustInventory**(`variantId`, `adjustment`): `Promise`<`undefined` \| `ProductVariant`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `adjustment` | `number` |  |

#### Returns

`Promise`<`undefined` \| `ProductVariant`\>

#### Defined in

[services/inventory.ts:31](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L31)

___

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `undefined` \| ``null`` \| `string` |  |
| `quantity` | `number` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[services/inventory.ts:63](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/inventory.ts#L63)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
