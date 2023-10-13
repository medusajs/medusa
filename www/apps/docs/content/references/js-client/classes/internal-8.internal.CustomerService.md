---
displayed_sidebar: jsClientSidebar
---

# Class: CustomerService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).CustomerService

Provides layer to manipulate customers.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`CustomerService`**

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

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: `Repository`<[`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:21

___

### customerRepository\_

• `Protected` `Readonly` **customerRepository\_**: `Repository`<[`Customer`](internal-3.Customer.md)\> & { `listAndCount`: (`query`: `Object`, `q?`: `string`) => `Promise`<[[`Customer`](internal-3.Customer.md)[], `number`]\>  }

#### Defined in

packages/medusa/dist/services/customer.d.ts:20

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/customer.d.ts:22

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### retrieve\_

• `Private` **retrieve\_**: `any`

#### Defined in

packages/medusa/dist/services/customer.d.ts:62

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

packages/medusa/dist/services/customer.d.ts:23

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

### addAddress

▸ **addAddress**(`customerId`, `address`): `Promise`<[`Customer`](internal-3.Customer.md) \| [`Address`](internal-3.Address.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `address` | [`AddressCreatePayload`](internal.AddressCreatePayload.md) |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md) \| [`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:121

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

### count

▸ **count**(): `Promise`<`number`\>

Return the total number of documents in database

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

packages/medusa/dist/services/customer.d.ts:61

___

### create

▸ **create**(`customer`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Creates a customer from an email - customers can have accounts associated,
e.g. to login and view order history, etc. If a password is provided the
customer will automatically get an account, otherwise the customer is just
used to hold details of customers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | [`CreateCustomerInput`](../modules/internal-8.md#createcustomerinput) | the customer to create |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

the result of create

#### Defined in

packages/medusa/dist/services/customer.d.ts:102

___

### delete

▸ **delete**(`customerId`): `Promise`<`void` \| [`Customer`](internal-3.Customer.md)\>

Deletes a customer from a given customer id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void` \| [`Customer`](internal-3.Customer.md)\>

the result of the delete operation.

#### Defined in

packages/medusa/dist/services/customer.d.ts:128

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

packages/medusa/dist/services/customer.d.ts:38

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

packages/medusa/dist/services/customer.d.ts:93

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Customer`](internal-3.Customer.md)\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/customer.d.ts:44

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Customer`](internal-3.Customer.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Customer`](internal-3.Customer.md)\> & { `groups?`: `string`[] ; `q?`: `string`  } | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[[`Customer`](internal-3.Customer.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/customer.d.ts:53

___

### listByEmail

▸ **listByEmail**(`email`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)[]\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:73

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

packages/medusa/dist/services/customer.d.ts:120

___

### retrieve

▸ **retrieve**(`customerId`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Gets a customer by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the customer to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

the customer document.

#### Defined in

packages/medusa/dist/services/customer.d.ts:87

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Gets a registered customer by email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the customer to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

the customer document.

**`Deprecated`**

#### Defined in

packages/medusa/dist/services/customer.d.ts:70

___

### retrieveByPhone

▸ **retrieveByPhone**(`phone`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Gets a customer by phone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `phone` | `string` | the phone of the customer to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> | the config object containing query settings |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

the customer document.

#### Defined in

packages/medusa/dist/services/customer.d.ts:80

___

### retrieveRegisteredByEmail

▸ **retrieveRegisteredByEmail**(`email`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:72

___

### retrieveUnregisteredByEmail

▸ **retrieveUnregisteredByEmail**(`email`, `config?`): `Promise`<[`Customer`](internal-3.Customer.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Customer`](internal-3.Customer.md)\> |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:71

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

▸ **update**(`customerId`, `update`): `Promise`<[`Customer`](internal-3.Customer.md)\>

Updates a customer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` | the id of the variant. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateCustomerInput`](../modules/internal-8.md#updatecustomerinput) | an object with the update values. |

#### Returns

`Promise`<[`Customer`](internal-3.Customer.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/customer.d.ts:110

___

### updateAddress

▸ **updateAddress**(`customerId`, `addressId`, `address`): `Promise`<[`Address`](internal-3.Address.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `addressId` | `string` |
| `address` | [`StorePostCustomersCustomerAddressesAddressReq`](internal.StorePostCustomersCustomerAddressesAddressReq.md) |

#### Returns

`Promise`<[`Address`](internal-3.Address.md)\>

#### Defined in

packages/medusa/dist/services/customer.d.ts:119

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

Updates the customers' billing address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | [`Customer`](internal-3.Customer.md) | the Customer to update |
| `addressOrId` | `undefined` \| `string` \| `DeepPartial`<[`Address`](internal-3.Address.md)\> | the value to set the billing address to |

#### Returns

`Promise`<`void`\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/customer.d.ts:118

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomerService`](internal-8.internal.CustomerService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomerService`](internal-8.internal.CustomerService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
