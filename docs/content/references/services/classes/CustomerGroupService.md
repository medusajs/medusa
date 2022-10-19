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

[packages/medusa/src/services/customer-group.ts:33](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L33)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### customerGroupRepository\_

• `Protected` `Readonly` **customerGroupRepository\_**: typeof `CustomerGroupRepository`

#### Defined in

[packages/medusa/src/services/customer-group.ts:30](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L30)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/customer-group.ts:31](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L31)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/customer-group.ts:27](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L27)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/customer-group.ts:28](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L28)

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

[packages/medusa/src/services/customer-group.ts:92](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L92)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### create

▸ **create**(`group`): `Promise`<`CustomerGroup`\>

Creates a customer group with the provided data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `group` | `Object` | the customer group to create |
| `group.created_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `group.customers?` | (`undefined` \| { email?: string \| undefined; first\_name?: string \| undefined; last\_name?: string \| undefined; billing\_address\_id?: string \| null \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 10 more ...; updated\_at?: { ...; } \| undef...)[] | - |
| `group.deleted_at?` | ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |
| `group.id?` | `string` | - |
| `group.metadata?` | { [x: string]: unknown; } | - |
| `group.name?` | `string` | - |
| `group.price_lists?` | (`undefined` \| { name?: string \| undefined; description?: string \| undefined; type?: PriceListType \| undefined; status?: PriceListStatus \| undefined; starts\_at?: { ...; } \| ... 1 more ... \| undefined; ... 7 more ...; updated\_at?: { ...; } \| undefined; })[] | - |
| `group.updated_at?` | { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } | - |

#### Returns

`Promise`<`CustomerGroup`\>

the result of the create operation

#### Defined in

[packages/medusa/src/services/customer-group.ts:68](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L68)

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

[packages/medusa/src/services/customer-group.ts:174](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L174)

___

### list

▸ **list**(`selector?`, `config`): `Promise`<`CustomerGroup`[]\>

List customer groups.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCustomerGroupProps` | the query object for find |
| `config` | `FindConfig`<`CustomerGroup`\> | the config to be used for find |

#### Returns

`Promise`<`CustomerGroup`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/customer-group.ts:197](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L197)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config`): `Promise`<[`CustomerGroup`[], `number`]\>

Retrieve a list of customer groups and total count of records that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableCustomerGroupProps` | the query object for find |
| `config` | `FindConfig`<`CustomerGroup`\> | the config to be used for find |

#### Returns

`Promise`<[`CustomerGroup`[], `number`]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/customer-group.ts:216](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L216)

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

[packages/medusa/src/services/customer-group.ts:252](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L252)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`CustomerGroup`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `config` | `Object` |

#### Returns

`Promise`<`CustomerGroup`\>

#### Defined in

[packages/medusa/src/services/customer-group.ts:45](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L45)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/customer-group.ts:141](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/customer-group.ts#L141)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
