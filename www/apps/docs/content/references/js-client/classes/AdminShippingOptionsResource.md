# Class: AdminShippingOptionsResource

## Hierarchy

- `default`

  ↳ **`AdminShippingOptionsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminShippingOptionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostShippingOptionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminShippingOptionsRes`\>

created shipping option.

**`Description`**

creates a shipping option.

#### Defined in

[admin/shipping-options.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-options.ts#L20)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of shipping option to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

deleted response

**`Description`**

deletes a shipping option

#### Defined in

[admin/shipping-options.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-options.ts#L50)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminShippingOptionsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetShippingOptionsParams` | query for searching shipping options |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminShippingOptionsListRes`\>

a list of shipping options matching the query.

**`Description`**

lists shipping options matching a query

#### Defined in

[admin/shipping-options.ts:78](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-options.ts#L78)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminShippingOptionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminShippingOptionsRes`\>

the shipping option with the given id

**`Description`**

get a shipping option

#### Defined in

[admin/shipping-options.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-options.ts#L64)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminShippingOptionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the shipping option to update. |
| `payload` | `AdminPostShippingOptionsOptionReq` | update to apply to shipping option. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminShippingOptionsRes`\>

the updated shipping option.

**`Description`**

updates a shipping option

#### Defined in

[admin/shipping-options.ts:35](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/shipping-options.ts#L35)
