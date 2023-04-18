# Class: CustomerService

Provides layer to manipulate customers.

## Hierarchy

- `TransactionBaseService`

  ↳ **`CustomerService`**

## Constructors

### constructor

• **new CustomerService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/customer.ts:46](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L46)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<`Address`\>

#### Defined in

[medusa/src/services/customer.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L37)

___

### customerRepository\_

• `Protected` `Readonly` **customerRepository\_**: `Repository`<`Customer`\> & { `listAndCount`: (`query`: `Omit`<`FindOneOptions`<`Customer`\>, ``"where"`` \| ``"select"`` \| ``"relations"``\> & { `order?`: `FindOptionsOrder`<`Customer`\> ; `relations?`: `FindOptionsRelations`<`Customer`\> ; `select?`: `FindOptionsSelect`<`Customer`\> ; `skip?`: `number` ; `take?`: `number` ; `where`: `FindOptionsWhere`<`Customer`\> \| `FindOptionsWhere`<`Customer`\>[]  } & { `where`: `FindOptionsWhere`<`Customer` & { `groups?`: `FindOperator`<`string`[]\>  }\>  } & `Omit`<`FindManyOptions`<`Customer`\>, ``"where"`` \| ``"select"`` \| ``"relations"``\> & { `order?`: `FindOptionsOrder`<`Customer`\> ; `relations?`: `FindOptionsRelations`<`Customer`\> ; `select?`: `FindOptionsSelect`<`Customer`\> ; `skip?`: `number` ; `take?`: `number` ; `where`: `FindOptionsWhere`<`Customer`\> \| `FindOptionsWhere`<`Customer`\>[]  } & { `where`: `FindOptionsWhere`<`Customer` & { `groups?`: `FindOperator`<`string`[]\>  }\>  }, `q`: `undefined` \| `string`) => `Promise`<[`Customer`[], `number`]\>  }

#### Defined in

[medusa/src/services/customer.ts:36](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L36)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/customer.ts:38](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L38)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/customer.ts:40](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L40)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addAddress

▸ **addAddress**(`customerId`, `address`): `Promise`<`Customer` \| `Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `address` | `AddressCreatePayload` |

#### Returns

`Promise`<`Customer` \| `Address`\>

#### Defined in

[medusa/src/services/customer.ts:519](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L519)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### count

▸ **count**(): `Promise`<`number`\>

Return the total number of documents in database

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

[medusa/src/services/customer.ts:178](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L178)

___

### create

▸ **create**(`customer`): `Promise`<`Customer`\>

Creates a customer from an email - customers can have accounts associated,
e.g. to login and view order history, etc. If a password is provided the
customer will automatically get an account, otherwise the customer is just
used to hold details of customers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `CreateCustomerInput` | the customer to create |

#### Returns

`Promise`<`Customer`\>

the result of create

#### Defined in

[medusa/src/services/customer.ts:306](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L306)

___

### delete

▸ **delete**(`customerId`): `Promise`<`void` \| `Customer`\>

Deletes a customer from a given customer id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void` \| `Customer`\>

the result of the delete operation.

#### Defined in

[medusa/src/services/customer.ts:565](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L565)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`customerId`): `Promise`<`string`\>

Generate a JSON Web token, that will be sent to a customer, that wishes to
reset password.
The token will be signed with the customer's current password hash as a
secret a long side a payload with userId and the expiry time for the token,
which is always 15 minutes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the customer to reset the password for |

#### Returns

`Promise`<`string`\>

the generated JSON web token

#### Defined in

[medusa/src/services/customer.ts:68](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L68)

___

### hashPassword\_

▸ **hashPassword_**(`password`): `Promise`<`string`\>

Hashes a password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | the value to hash |

#### Returns

`Promise`<`string`\>

hashed password

#### Defined in

[medusa/src/services/customer.ts:293](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L293)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Customer`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/customer.ts:111](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L111)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Customer`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/customer.ts:143](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L143)

___

### listByEmail

▸ **listByEmail**(`email`, `config?`): `Promise`<`Customer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`[]\>

#### Defined in

[medusa/src/services/customer.ts:249](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L249)

___

### removeAddress

▸ **removeAddress**(`customerId`, `addressId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `addressId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/customer.ts:502](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L502)

___

### retrieve

▸ **retrieve**(`customerId`, `config?`): `Promise`<`Customer`\>

Gets a customer by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[medusa/src/services/customer.ts:274](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L274)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`Customer`\>

Gets a registered customer by email.

**`Deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[medusa/src/services/customer.ts:216](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L216)

___

### retrieveByPhone

▸ **retrieveByPhone**(`phone`, `config?`): `Promise`<`Customer`\>

Gets a customer by phone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `phone` | `string` | the phone of the customer to get. |
| `config` | `FindConfig`<`Customer`\> | the config object containing query settings |

#### Returns

`Promise`<`Customer`\>

the customer document.

#### Defined in

[medusa/src/services/customer.ts:261](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L261)

___

### retrieveRegisteredByEmail

▸ **retrieveRegisteredByEmail**(`email`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[medusa/src/services/customer.ts:239](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L239)

___

### retrieveUnregisteredByEmail

▸ **retrieveUnregisteredByEmail**(`email`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[medusa/src/services/customer.ts:230](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L230)

___

### retrieve\_

▸ `Private` **retrieve_**(`selector`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`Customer`\> |
| `config` | `FindConfig`<`Customer`\> |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[medusa/src/services/customer.ts:185](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L185)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`customerId`, `update`): `Promise`<`Customer`\>

Updates a customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the variant. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateCustomerInput` | an object with the update values. |

#### Returns

`Promise`<`Customer`\>

resolves to the update result.

#### Defined in

[medusa/src/services/customer.ts:362](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L362)

___

### updateAddress

▸ **updateAddress**(`customerId`, `addressId`, `address`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `addressId` | `string` |
| `address` | `StorePostCustomersCustomerAddressesAddressReq` |

#### Returns

`Promise`<`Address`\>

#### Defined in

[medusa/src/services/customer.ts:474](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L474)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

Updates the customers' billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `Customer` | the Customer to update |
| `addressOrId` | `undefined` \| `string` \| `DeepPartial`<`Address`\> | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

[medusa/src/services/customer.ts:422](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/customer.ts#L422)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomerService`](CustomerService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomerService`](CustomerService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
