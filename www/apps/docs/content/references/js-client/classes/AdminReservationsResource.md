# Class: AdminReservationsResource

## Hierarchy

- `default`

  ↳ **`AdminReservationsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminReservationsRes`\>

create a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostReservationsReq` |
| `customHeaders` | `Record`<`string`, `unknown`\> |

#### Returns

`ResponsePromise`<`AdminReservationsRes`\>

the created reservation

**`Description`**

create a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[admin/reservations.ts:57](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/reservations.ts#L57)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

remove a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `unknown`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

reservation removal confirmation

**`Description`**

remove a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[admin/reservations.ts:88](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/reservations.ts#L88)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminReservationsListRes`\>

List reservations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetReservationsParams` |
| `customHeaders` | `Record`<`string`, `unknown`\> |

#### Returns

`ResponsePromise`<`AdminReservationsListRes`\>

A list of reservations matching the provided query

**`Description`**

Lists reservations

#### Defined in

[admin/reservations.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/reservations.ts#L36)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminReservationsRes`\>

Get a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `unknown`\> |

#### Returns

`ResponsePromise`<`AdminReservationsRes`\>

The reservation with the provided id

**`Description`**

gets a reservation

#### Defined in

[admin/reservations.ts:21](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/reservations.ts#L21)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminReservationsRes`\>

update a reservation

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `payload` | `AdminPostReservationsReservationReq` |
| `customHeaders` | `Record`<`string`, `unknown`\> |

#### Returns

`ResponsePromise`<`AdminReservationsRes`\>

The updated reservation

**`Description`**

update a reservation
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Defined in

[admin/reservations.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/reservations.ts#L72)
