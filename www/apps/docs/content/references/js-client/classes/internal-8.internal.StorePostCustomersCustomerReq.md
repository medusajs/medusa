---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersCustomerReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCustomersCustomerReq

**`Schema`**

StorePostCustomersCustomerReq
type: object
properties:
  first_name:
    description: "The customer's first name."
    type: string
  last_name:
    description: "The customer's last name."
    type: string
  billing_address:
    description: "The address to be used for billing purposes."
    anyOf:
      - $ref: "#/components/schemas/AddressPayload"
        description: The full billing address object
      - type: string
        description: The ID of an existing billing address
  password:
    description: "The customer's password."
    type: string
  phone:
    description: "The customer's phone number."
    type: string
  email:
    description: "The customer's email."
    type: string
  metadata:
    description: "Additional custom data about the customer."
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### billing\_address

• `Optional` **billing\_address**: `string` \| [`AddressPayload`](internal.AddressPayload.md)

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:98

___

### email

• `Optional` **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:103

___

### first\_name

• `Optional` **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:99

___

### last\_name

• `Optional` **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:100

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:104

___

### password

• `Optional` **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:101

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/update-customer.d.ts:102
