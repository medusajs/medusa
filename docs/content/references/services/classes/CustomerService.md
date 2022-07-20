# Class: CustomerService

## Hierarchy

- `TransactionBaseService`<[`CustomerService`](CustomerService.md)\>

  ↳ **`CustomerService`**

## Constructors

### constructor

• **new CustomerService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;CustomerService\&gt;.constructor

#### Defined in

[services/customer.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L40)

## Properties

### addressRepository\_

• `Protected` `Readonly` **addressRepository\_**: typeof `AddressRepository`

#### Defined in

[services/customer.ts:28](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L28)

___

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

### customerRepository\_

• `Protected` `Readonly` **customerRepository\_**: typeof `CustomerRepository`

#### Defined in

[services/customer.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L27)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/customer.ts:29](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L29)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/customer.ts:31](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L31)

___

### transactionManager\_

• `Protected` `Readonly` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/customer.ts:32](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L32)

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

[services/customer.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L34)

## Methods

### addAddress

▸ **addAddress**(`customerId`, `address`): `Promise`<`Address` \| `Customer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `customerId` | `string` |
| `address` | `AddressCreatePayload` |

#### Returns

`Promise`<`Address` \| `Customer`\>

#### Defined in

[services/customer.ts:471](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L471)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### count

▸ **count**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[services/customer.ts:161](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L161)

___

### create

▸ **create**(`customer`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `CreateCustomerInput` |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:255](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L255)

___

### delete

▸ **delete**(`customerId`): `Promise`<`void` \| `Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` |  |

#### Returns

`Promise`<`void` \| `Customer`\>

#### Defined in

[services/customer.ts:519](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L519)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`customerId`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

[services/customer.ts:65](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L65)

___

### hashPassword\_

▸ **hashPassword_**(`password`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

[services/customer.ts:242](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L242)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Customer`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `q?`: `string`  } |  |
| `config` | `FindConfig`<`Customer`\> |  |

#### Returns

`Promise`<`Customer`[]\>

#### Defined in

[services/customer.ts:108](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L108)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Customer`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Customer`\> & { `q?`: `string`  } |  |
| `config` | `FindConfig`<`Customer`\> |  |

#### Returns

`Promise`<[`Customer`[], `number`]\>

#### Defined in

[services/customer.ts:133](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L133)

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

[services/customer.ts:454](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L454)

___

### retrieve

▸ **retrieve**(`customerId`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` |  |
| `config` | `FindConfig`<`Customer`\> |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:228](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L228)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |
| `config` | `FindConfig`<`Customer`\> |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:198](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L198)

___

### retrieveByPhone

▸ **retrieveByPhone**(`phone`, `config?`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `phone` | `string` |  |
| `config` | `FindConfig`<`Customer`\> |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:213](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L213)

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

[services/customer.ts:168](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L168)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`customerId`, `update`): `Promise`<`Customer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customerId` | `string` |  |
| `update` | `UpdateCustomerInput` |  |

#### Returns

`Promise`<`Customer`\>

#### Defined in

[services/customer.ts:310](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L310)

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

[services/customer.ts:426](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L426)

___

### updateBillingAddress\_

▸ **updateBillingAddress_**(`customer`, `addressOrId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customer` | `Customer` |  |
| `addressOrId` | `undefined` \| `string` \| { `address_1?`: ``null`` \| `string` ; `address_2?`: ``null`` \| `string` ; `city?`: ``null`` \| `string` ; `company?`: ``null`` \| `string` ; `country?`: ``null`` \| { id?: number \| undefined; iso\_2?: string \| undefined; iso\_3?: string \| undefined; num\_code?: number \| undefined; name?: string \| undefined; display\_name?: string \| undefined; region\_id?: string \| ... 1 more ... \| undefined; region?: { ...; } \| undefined; } ; `country_code?`: ``null`` \| `string` ; `created_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `customer?`: ``null`` \| { email?: string \| undefined; first\_name?: string \| undefined; last\_name?: string \| undefined; billing\_address\_id?: string \| null \| undefined; billing\_address?: { customer\_id?: string \| null \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 10 more ...; updated\_at?: { ...; } \| undef... ; `customer_id?`: ``null`` \| `string` ; `deleted_at?`: ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `first_name?`: ``null`` \| `string` ; `id?`: `string` ; `last_name?`: ``null`` \| `string` ; `metadata?`: { [x: string]: unknown; } ; `phone?`: ``null`` \| `string` ; `postal_code?`: ``null`` \| `string` ; `province?`: ``null`` \| `string` ; `updated_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; }  } |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/customer.ts:374](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/customer.ts#L374)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
