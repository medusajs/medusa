# CustomerService

Provides layer to manipulate customers.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`CustomerService`**

## Constructors

### constructor

**new CustomerService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-7) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/customer.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L46)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### addressRepository\_

 `Protected` `Readonly` **addressRepository\_**: [`Repository`](Repository.md)<[`Address`](Address.md)\>

#### Defined in

[packages/medusa/src/services/customer.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L37)

___

### customerRepository\_

 `Protected` `Readonly` **customerRepository\_**: [`Repository`](Repository.md)<[`Customer`](Customer.md)\> & { `listAndCount`: Method listAndCount  }

#### Defined in

[packages/medusa/src/services/customer.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L36)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/customer.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L38)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/customer.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L40)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addAddress

**addAddress**(`customerId`, `address`): `Promise`<[`Customer`](Customer.md) \| [`Address`](Address.md)\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerId` | `string` |
| `address` | [`AddressCreatePayload`](AddressCreatePayload.md) | Address fields used when creating an address. |

#### Returns

`Promise`<[`Customer`](Customer.md) \| [`Address`](Address.md)\>

-`Promise`: 
	-`Customer \| Address`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:519](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L519)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### count

**count**(): `Promise`<`number`\>

Return the total number of documents in database

#### Returns

`Promise`<`number`\>

-`Promise`: the result of the count operation
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:178](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L178)

___

### create

**create**(`customer`): `Promise`<[`Customer`](Customer.md)\>

Creates a customer from an email - customers can have accounts associated,
e.g. to login and view order history, etc. If a password is provided the
customer will automatically get an account, otherwise the customer is just
used to hold details of customers.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customer` | [`CreateCustomerInput`](../index.md#createcustomerinput) | the customer to create |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: the result of create
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:306](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L306)

___

### delete

**delete**(`customerId`): `Promise`<`void` \| [`Customer`](Customer.md)\>

Deletes a customer from a given customer id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerId` | `string` | the id of the customer to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void` \| [`Customer`](Customer.md)\>

-`Promise`: the result of the delete operation.
	-`void \| Customer`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:565](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L565)

___

### generateResetPasswordToken

**generateResetPasswordToken**(`customerId`): `Promise`<`string`\>

Generate a JSON Web token, that will be sent to a customer, that wishes to
reset password.
The token will be signed with the customer's current password hash as a
secret a long side a payload with userId and the expiry time for the token,
which is always 15 minutes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerId` | `string` | the customer to reset the password for |

#### Returns

`Promise`<`string`\>

-`Promise`: the generated JSON web token
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L68)

___

### hashPassword\_

**hashPassword_**(`password`): `Promise`<`string`\>

Hashes a password

#### Parameters

| Name | Description |
| :------ | :------ |
| `password` | `string` | the value to hash |

#### Returns

`Promise`<`string`\>

-`Promise`: hashed password
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:293](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L293)

___

### list

**list**(`selector?`, `config?`): `Promise`<[`Customer`](Customer.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Customer`](Customer.md)\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](Customer.md)[]\>

-`Promise`: the result of the find operation
	-`Customer[]`: 
		-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:111](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L111)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Customer`](Customer.md)[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Customer`](Customer.md)\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[[`Customer`](Customer.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`Customer[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/customer.ts:143](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L143)

___

### listByEmail

**listByEmail**(`email`, `config?`): `Promise`<[`Customer`](Customer.md)[]\>

#### Parameters

| Name |
| :------ |
| `email` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> |

#### Returns

`Promise`<[`Customer`](Customer.md)[]\>

-`Promise`: 
	-`Customer[]`: 
		-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:249](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L249)

___

### removeAddress

**removeAddress**(`customerId`, `addressId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `customerId` | `string` |
| `addressId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/customer.ts:502](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L502)

___

### retrieve

**retrieve**(`customerId`, `config?`): `Promise`<[`Customer`](Customer.md)\>

Gets a customer by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerId` | `string` | the id of the customer to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: the customer document.
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:274](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L274)

___

### retrieveByEmail

**retrieveByEmail**(`email`, `config?`): `Promise`<[`Customer`](Customer.md)\>

Gets a registered customer by email.

#### Parameters

| Name | Description |
| :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: the customer document.
	-`Customer`: 

**Deprecated**

#### Defined in

[packages/medusa/src/services/customer.ts:216](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L216)

___

### retrieveByPhone

**retrieveByPhone**(`phone`, `config?`): `Promise`<[`Customer`](Customer.md)\>

Gets a customer by phone.

#### Parameters

| Name | Description |
| :------ | :------ |
| `phone` | `string` | the phone of the customer to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: the customer document.
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:261](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L261)

___

### retrieveRegisteredByEmail

**retrieveRegisteredByEmail**(`email`, `config?`): `Promise`<[`Customer`](Customer.md)\>

#### Parameters

| Name |
| :------ |
| `email` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: 
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:239](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L239)

___

### retrieveUnregisteredByEmail

**retrieveUnregisteredByEmail**(`email`, `config?`): `Promise`<[`Customer`](Customer.md)\>

#### Parameters

| Name |
| :------ |
| `email` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: 
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:230](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L230)

___

### retrieve\_

`Private` **retrieve_**(`selector`, `config?`): `Promise`<[`Customer`](Customer.md)\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Customer`](Customer.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Customer`](Customer.md)\> |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: 
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:185](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L185)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`customerId`, `update`): `Promise`<[`Customer`](Customer.md)\>

Updates a customer.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customerId` | `string` | the id of the variant. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateCustomerInput`](../index.md#updatecustomerinput) | an object with the update values. |

#### Returns

`Promise`<[`Customer`](Customer.md)\>

-`Promise`: resolves to the update result.
	-`Customer`: 

#### Defined in

[packages/medusa/src/services/customer.ts:362](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L362)

___

### updateAddress

**updateAddress**(`customerId`, `addressId`, `address`): `Promise`<[`Address`](Address.md)\>

#### Parameters

| Name |
| :------ |
| `customerId` | `string` |
| `addressId` | `string` |
| `address` | [`StorePostCustomersCustomerAddressesAddressReq`](StorePostCustomersCustomerAddressesAddressReq.md) |

#### Returns

`Promise`<[`Address`](Address.md)\>

-`Promise`: 
	-`Address`: 

#### Defined in

[packages/medusa/src/services/customer.ts:474](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L474)

___

### updateBillingAddress\_

**updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

Updates the customers' billing address.

#### Parameters

| Name | Description |
| :------ | :------ |
| `customer` | [`Customer`](Customer.md) | the Customer to update |
| `addressOrId` | `undefined` \| `string` \| [`DeepPartial`](../index.md#deeppartial)<[`Address`](Address.md)\> | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the update operation

#### Defined in

[packages/medusa/src/services/customer.ts:422](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/customer.ts#L422)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`CustomerService`](CustomerService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`CustomerService`](CustomerService.md)

-`CustomerService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
