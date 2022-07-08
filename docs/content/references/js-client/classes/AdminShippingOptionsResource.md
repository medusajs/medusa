# Class: AdminShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`AdminShippingOptionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

**`description`** creates a shipping option.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostShippingOptionsReq`](internal.AdminPostShippingOptionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

created shipping option.

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:20](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-options.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** deletes a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of shipping option to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

deleted response

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:50](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-options.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal.md#adminshippingoptionslistres)\>

**`description`** lists shipping options matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetShippingOptionsParams`](internal.AdminGetShippingOptionsParams.md) | query for searching shipping options |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsListRes`](../modules/internal.md#adminshippingoptionslistres)\>

a list of shipping options matching the query.

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:72](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-options.ts#L72)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

**`description`** get a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

the shipping option with the given id

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:61](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-options.ts#L61)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

**`description`** updates a shipping option

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to update. |
| `payload` | [`AdminPostShippingOptionsOptionReq`](internal.AdminPostShippingOptionsOptionReq.md) | update to apply to shipping option. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminShippingOptionsRes`](../modules/internal.md#adminshippingoptionsres)\>

the updated shipping option.

#### Defined in

[packages/medusa-js/src/resources/admin/shipping-options.ts:35](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/shipping-options.ts#L35)
