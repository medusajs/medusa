# Class: PaymentMethodsResource

## Hierarchy

- `default`

  ↳ **`PaymentMethodsResource`**

## Methods

### list

▸ **list**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListPaymentMethodsRes`](../modules/internal.md#storecustomerslistpaymentmethodsres)\>

Lists customer payment methods

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of cart |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreCustomersListPaymentMethodsRes`](../modules/internal.md#storecustomerslistpaymentmethodsres)\>

#### Defined in

[packages/medusa-js/src/resources/payment-methods.ts:12](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/payment-methods.ts#L12)
