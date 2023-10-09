# Class: AddressesResource

## Hierarchy

- `default`

  ↳ **`AddressesResource`**

## Methods

### addAddress

▸ **addAddress**(`payload`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Adds an address to a customers saved addresses

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `StorePostCustomersCustomerAddressesReq` | contains information to create an address |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[addresses.ts:16](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/addresses.ts#L16)

___

### deleteAddress

▸ **deleteAddress**(`address_id`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Deletes an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of the address to delete |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[addresses.ts:30](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/addresses.ts#L30)

___

### updateAddress

▸ **updateAddress**(`address_id`, `payload`, `customHeaders?`): `ResponsePromise`<`StoreCustomersRes`\>

Update an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of customer |
| `payload` | `StorePostCustomersCustomerAddressesAddressReq` | address update |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`StoreCustomersRes`\>

#### Defined in

[addresses.ts:45](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/addresses.ts#L45)
