---
displayed_sidebar: jsClientSidebar
---

# Module: internal

## Classes

- [AdminGetCustomersParams](../classes/internal-7.AdminGetCustomersParams.md)
- [AdminListCustomerSelector](../classes/internal-7.AdminListCustomerSelector.md)
- [AdminPostCustomersCustomerReq](../classes/internal-7.AdminPostCustomersCustomerReq.md)
- [AdminPostCustomersReq](../classes/internal-7.AdminPostCustomersReq.md)
- [Group](../classes/internal-7.Group.md)

## Type Aliases

### AdminCustomersListRes

Ƭ **AdminCustomersListRes**: [`PaginatedResponse`](internal-2.md#paginatedresponse) & { `customers`: [`Customer`](../classes/internal-3.Customer.md)[]  }

**`Schema`**

AdminCustomersListRes
type: object
required:
  - customers
  - count
  - offset
  - limit
properties:
  customers:
    type: array
    description: "An array of customer details."
    items:
      $ref: "#/components/schemas/Customer"
  count:
    type: integer
    description: The total number of items available
  offset:
    type: integer
    description: The number of customers skipped when retrieving the customers.
  limit:
    type: integer
    description: The number of items per page

#### Defined in

packages/medusa/dist/api/routes/admin/customers/index.d.ts:47

___

### AdminCustomersRes

Ƭ **AdminCustomersRes**: `Object`

**`Schema`**

AdminCustomersRes
type: object
x-expanded-relations:
  field: customer
  relations:
    - orders
    - shipping_addresses
required:
  - customer
properties:
  customer:
    description: "Customer details."
    $ref: "#/components/schemas/Customer"

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customer` | [`Customer`](../classes/internal-3.Customer.md) |

#### Defined in

packages/medusa/dist/api/routes/admin/customers/index.d.ts:20
