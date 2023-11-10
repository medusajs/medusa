# CustomerGroupService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`CustomerGroupService`**

## Constructors

### constructor

**new CustomerGroupService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`CustomerGroupConstructorProps`](../types/CustomerGroupConstructorProps.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/customer-group.ts:24](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L24)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerGroupRepository\_

 `Protected` `Readonly` **customerGroupRepository\_**: [`Repository`](Repository.md)<[`CustomerGroup`](CustomerGroup.md)\> & { `addCustomers`: Method addCustomers ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `removeCustomers`: Method removeCustomers  }

#### Defined in

[packages/medusa/src/services/customer-group.ts:21](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L21)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/customer-group.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L22)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCustomers

**addCustomers**(`id`, `customerIds`): `Promise`<[`CustomerGroup`](CustomerGroup.md)\>

Add a batch of customers to a customer group at once

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the customer group to add customers to |
| `customerIds` | `string` \| `string`[] | customer id's to add to the group |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)\>

-`Promise`: the customer group after insertion
	-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:89](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L89)

___

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`group`): `Promise`<[`CustomerGroup`](CustomerGroup.md)\>

Creates a customer group with the provided data.

#### Parameters

| Name | Description |
| :------ | :------ |
| `group` | [`DeepPartial`](../types/DeepPartial.md)<[`CustomerGroup`](CustomerGroup.md)\> | the customer group to create |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)\>

-`Promise`: the result of the create operation
	-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:65](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L65)

___

### delete

**delete**(`groupId`): `Promise`<`void`\>

Remove customer group

#### Parameters

| Name | Description |
| :------ | :------ |
| `groupId` | `string` | id of the customer group to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: a promise

#### Defined in

[packages/medusa/src/services/customer-group.ts:153](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L153)

___

### handleCreationFail

`Private` **handleCreationFail**(`id`, `ids`, `error`): `Promise`<`never`\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `ids` | `string`[] |
| `error` | `any` |

#### Returns

`Promise`<`never`\>

-`Promise`: 
	-`never`: (optional) 

#### Defined in

[packages/medusa/src/services/customer-group.ts:257](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L257)

___

### list

**list**(`selector?`, `config`): `Promise`<[`CustomerGroup`](CustomerGroup.md)[]\>

List customer groups.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`CustomerGroup`](CustomerGroup.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`CustomerGroup`](CustomerGroup.md)\> | the config to be used for find |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)[]\>

-`Promise`: the result of the find operation
	-`CustomerGroup[]`: 
		-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:176](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L176)

___

### listAndCount

**listAndCount**(`selector?`, `config`): `Promise`<[[`CustomerGroup`](CustomerGroup.md)[], `number`]\>

Retrieve a list of customer groups and total count of records that match the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`CustomerGroup`](CustomerGroup.md)\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`CustomerGroup`](CustomerGroup.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`CustomerGroup`](CustomerGroup.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`CustomerGroup[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/customer-group.ts:194](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L194)

___

### removeCustomer

**removeCustomer**(`id`, `customerIds`): `Promise`<[`CustomerGroup`](CustomerGroup.md)\>

Remove list of customers from a customergroup

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the customer group from which the customers are removed |
| `customerIds` | `string` \| `string`[] | id's of the customer to remove from group |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)\>

-`Promise`: the customergroup with the provided id
	-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:236](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L236)

___

### retrieve

**retrieve**(`customerGroupId`, `config?`): `Promise`<[`CustomerGroup`](CustomerGroup.md)\>

#### Parameters

| Name |
| :------ |
| `customerGroupId` | `string` |
| `config` | `object` |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)\>

-`Promise`: 
	-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L35)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`customerGroupId`, `update`): `Promise`<[`CustomerGroup`](CustomerGroup.md)\>

Update a customer group.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerGroupId` | `string` | id of the customer group |
| `update` | [`CustomerGroupUpdate`](CustomerGroupUpdate.md) | customer group partial data |

#### Returns

`Promise`<[`CustomerGroup`](CustomerGroup.md)\>

-`Promise`: resulting customer group
	-`CustomerGroup`: 

#### Defined in

[packages/medusa/src/services/customer-group.ts:120](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/customer-group.ts#L120)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`CustomerGroupService`](CustomerGroupService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`CustomerGroupService`](CustomerGroupService.md)

-`CustomerGroupService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
