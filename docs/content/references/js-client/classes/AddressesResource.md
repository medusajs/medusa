# Class: AddressesResource

## Hierarchy

- `default`

  ↳ **`AddressesResource`**

## Methods

### addAddress

▸ **addAddress**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Adds an address to a customers saved addresses

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`StorePostCustomersCustomerAddressesReq`](internal.StorePostCustomersCustomerAddressesReq.md) | contains information to create an address |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/addresses.ts:16](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/addresses.ts#L16)

___

### deleteAddress

▸ **deleteAddress**(`address_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Deletes an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of the address to delete |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/addresses.ts:29](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/addresses.ts#L29)

___

### updateAddress

▸ **updateAddress**(`address_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Update an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of customer |
| `payload` | [`StorePostCustomersCustomerAddressesAddressReq`](internal.StorePostCustomersCustomerAddressesAddressReq.md) | address update |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[packages/medusa-js/src/resources/addresses.ts:41](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/addresses.ts#L41)
