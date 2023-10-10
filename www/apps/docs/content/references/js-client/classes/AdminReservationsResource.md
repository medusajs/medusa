---
displayed_sidebar: jsClientSidebar
---

# Class: AdminReservationsResource

## Hierarchy

- `default`

  ↳ **`AdminReservationsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

create a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostReservationsReq`](internal-8.internal.AdminPostReservationsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

the created reservation

**`Description`**

create a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[packages/medusa-js/src/resources/admin/reservations.ts:57](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/reservations.ts#L57)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

remove a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

reservation removal confirmation

**`Description`**

remove a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[packages/medusa-js/src/resources/admin/reservations.ts:88](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/reservations.ts#L88)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsListRes`](../modules/internal-8.internal.md#adminreservationslistres)\>

List reservations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetReservationsParams`](internal-8.internal.AdminGetReservationsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsListRes`](../modules/internal-8.internal.md#adminreservationslistres)\>

A list of reservations matching the provided query

**`Description`**

Lists reservations

#### Defined in

[packages/medusa-js/src/resources/admin/reservations.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/reservations.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

Get a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

The reservation with the provided id

**`Description`**

gets a reservation

#### Defined in

[packages/medusa-js/src/resources/admin/reservations.ts:21](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/reservations.ts#L21)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

update a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | [`AdminPostReservationsReservationReq`](internal-8.internal.AdminPostReservationsReservationReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminReservationsRes`](../modules/internal-8.internal.md#adminreservationsres)\>

The updated reservation

**`Description`**

update a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[packages/medusa-js/src/resources/admin/reservations.ts:72](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/reservations.ts#L72)
