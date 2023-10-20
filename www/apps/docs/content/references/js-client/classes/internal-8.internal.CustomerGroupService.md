---
displayed_sidebar: jsClientSidebar
---

# Class: CustomerGroupService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CustomerGroupService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`CustomerGroupService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### customerGroupRepository\_

• `Protected` `Readonly` **customerGroupRepository\_**: `Repository`<[`CustomerGroup`](internal-3.CustomerGroup.md)\> & { `addCustomers`: (`groupId`: `string`, `customerIds`: `string`[]) => `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\> ; `findWithRelationsAndCount`: (`relations?`: `FindOptionsRelations`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>, `idsOrOptionsWithoutRelations?`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions)) => `Promise`<[[`CustomerGroup`](internal-3.CustomerGroup.md)[], `number`]\> ; `removeCustomers`: (`groupId`: `string`, `customerIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:14

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:15

___

### handleCreationFail

• `Private` **handleCreationFail**: `any`

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:76

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addCustomers

▸ **addCustomers**(`id`, `customerIds`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

Add a batch of customers to a customer group at once

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group to add customers to |
| `customerIds` | `string` \| `string`[] | customer id's to add to the group |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

the customer group after insertion

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:30

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`group`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

Creates a customer group with the provided data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | `DeepPartial`<[`CustomerGroup`](internal-3.CustomerGroup.md)\> | the customer group to create |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

the result of the create operation

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:23

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

packages/medusa/dist/services/customer-group.d.ts:45

___

### list

▸ **list**(`selector`, `config`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)[]\>

List customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `undefined` \| [`Selector`](../modules/internal-8.internal.md#selector)<[`CustomerGroup`](internal-3.CustomerGroup.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`CustomerGroup`](internal-3.CustomerGroup.md)\> | the config to be used for find |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:53

___

### listAndCount

▸ **listAndCount**(`selector`, `config`): `Promise`<[[`CustomerGroup`](internal-3.CustomerGroup.md)[], `number`]\>

Retrieve a list of customer groups and total count of records that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `undefined` \| [`Selector`](../modules/internal-8.internal.md#selector)<[`CustomerGroup`](internal-3.CustomerGroup.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`CustomerGroup`](internal-3.CustomerGroup.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`CustomerGroup`](internal-3.CustomerGroup.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:64

___

### removeCustomer

▸ **removeCustomer**(`id`, `customerIds`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

Remove list of customers from a customergroup

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the customer group from which the customers are removed |
| `customerIds` | `string` \| `string`[] | id's of the customer to remove from group |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

the customergroup with the provided id

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:75

___

### retrieve

▸ **retrieve**(`customerGroupId`, `config?`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerGroupId` | `string` |
| `config?` | `Object` |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:17

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`customerGroupId`, `update`): `Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

Update a customer group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerGroupId` | `string` | id of the customer group |
| `update` | [`CustomerGroupUpdate`](internal-8.CustomerGroupUpdate.md) | customer group partial data |

#### Returns

`Promise`<[`CustomerGroup`](internal-3.CustomerGroup.md)\>

resulting customer group

#### Defined in

packages/medusa/dist/services/customer-group.d.ts:38

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomerGroupService`](internal-8.internal.CustomerGroupService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomerGroupService`](internal-8.internal.CustomerGroupService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
