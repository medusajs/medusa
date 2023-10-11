---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersCustomerAddressesReq

[internal](../modules/internal.md).StorePostCustomersCustomerAddressesReq

**`Schema`**

StorePostCustomersCustomerAddressesReq
type: object
required:
  - address
properties:
  address:
    description: "The Address to add to the Customer's saved addresses."
    $ref: "#/components/schemas/AddressCreatePayload"

## Properties

### address

• **address**: [`AddressCreatePayload`](internal.AddressCreatePayload.md)

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-address.d.ts:92
