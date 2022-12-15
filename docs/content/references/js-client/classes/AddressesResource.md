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
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/addresses.ts:16](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/addresses.ts#L16)

___

### deleteAddress

▸ **deleteAddress**(`address_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Deletes an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of the address to delete |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/addresses.ts:30](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/addresses.ts#L30)

___

### updateAddress

▸ **updateAddress**(`address_id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

Update an address of a customer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address_id` | `string` | id of customer |
| `payload` | [`StorePostCustomersCustomerAddressesAddressReq`](internal.StorePostCustomersCustomerAddressesAddressReq.md) | address update |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersRes`](../modules/internal.md#storecustomersres)\>

#### Defined in

[medusa-js/src/resources/addresses.ts:45](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/addresses.ts#L45)
