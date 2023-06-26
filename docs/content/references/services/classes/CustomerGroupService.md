# Class: CustomerGroupService

## Hierarchy

- `TransactionBaseService`

  ↳ **`CustomerGroupService`**

## Constructors

### constructor

• **new CustomerGroupService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `CustomerGroupConstructorProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/customer-group.ts:24](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L24)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerGroupRepository\_

• `Protected` `Readonly` **customerGroupRepository\_**: `Repository`<`CustomerGroup`\> & { `addCustomers`: (`groupId`: `string`, `customerIds`: `string`[]) => `Promise`<`CustomerGroup`\> ; `findWithRelationsAndCount`: (`relations`: `FindOptionsRelations`<`CustomerGroup`\>, `idsOrOptionsWithoutRelations`: `string`[] \| `FindWithoutRelationsOptions`) => `Promise`<[`CustomerGroup`[], `number`]\> ; `removeCustomers`: (`groupId`: `string`, `customerIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

[medusa/src/services/customer-group.ts:21](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L21)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[medusa/src/services/customer-group.ts:22](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L22)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCustomers

▸ **addCustomers**(`id`, `customerIds`): `Promise`<`CustomerGroup`\>

Add a batch of customers to a customer group at once

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group to add customers to |
| `customerIds` | `string` \| `string`[] | customer id's to add to the group |

#### Returns

`Promise`<`CustomerGroup`\>

the customer group after insertion

#### Defined in

[medusa/src/services/customer-group.ts:89](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L89)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`group`): `Promise`<`CustomerGroup`\>

Creates a customer group with the provided data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | `DeepPartial`<`CustomerGroup`\> | the customer group to create |

#### Returns

`Promise`<`CustomerGroup`\>

the result of the create operation

#### Defined in

[medusa/src/services/customer-group.ts:65](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L65)

___

### delete

▸ **delete**(`groupId`): `Promise`<`void`\>

Remove customer group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groupId` | `string` | id of the customer group to delete |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[medusa/src/services/customer-group.ts:153](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L153)

___

### handleCreationFail

▸ `Private` **handleCreationFail**(`id`, `ids`, `error`): `Promise`<`never`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `ids` | `string`[] |
| `error` | `any` |

#### Returns

`Promise`<`never`\>

#### Defined in

[medusa/src/services/customer-group.ts:257](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L257)

___

### list

▸ **list**(`selector?`, `config`): `Promise`<`CustomerGroup`[]\>

List customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`CustomerGroup`\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`CustomerGroup`\> | the config to be used for find |

#### Returns

`Promise`<`CustomerGroup`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/customer-group.ts:176](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L176)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config`): `Promise`<[`CustomerGroup`[], `number`]\>

Retrieve a list of customer groups and total count of records that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`CustomerGroup`\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`CustomerGroup`\> | the config to be used for find |

#### Returns

`Promise`<[`CustomerGroup`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/customer-group.ts:194](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L194)

___

### removeCustomer

▸ **removeCustomer**(`id`, `customerIds`): `Promise`<`CustomerGroup`\>

Remove list of customers from a customergroup

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group from which the customers are removed |
| `customerIds` | `string` \| `string`[] | id's of the customer to remove from group |

#### Returns

`Promise`<`CustomerGroup`\>

the customergroup with the provided id

#### Defined in

[medusa/src/services/customer-group.ts:236](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L236)

___

### retrieve

▸ **retrieve**(`customerGroupId`, `config?`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerGroupId` | `string` |
| `config` | `Object` |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[medusa/src/services/customer-group.ts:35](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L35)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`customerGroupId`, `update`): `Promise`<`CustomerGroup`\>

Update a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerGroupId` | `string` | id of the customer group |
| `update` | `CustomerGroupUpdate` | customer group partial data |

#### Returns

`Promise`<`CustomerGroup`\>

resulting customer group

#### Defined in

[medusa/src/services/customer-group.ts:120](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/customer-group.ts#L120)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomerGroupService`](CustomerGroupService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomerGroupService`](CustomerGroupService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
