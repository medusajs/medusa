---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCustomersCustomerReq

[internal](../modules/internal-7.md).AdminPostCustomersCustomerReq

**`Schema`**

AdminPostCustomersCustomerReq
type: object
properties:
  email:
    type: string
    description: The Customer's email. You can't update the email of a registered customer.
    format: email
  first_name:
    type: string
    description:  The Customer's first name.
  last_name:
    type: string
    description:  The Customer's last name.
  phone:
    type: string
    description: The Customer's phone number.
  password:
    type: string
    description: The Customer's password.
    format: password
  groups:
    type: array
    description: A list of customer groups to which the customer belongs.
    items:
      type: object
      required:
        - id
      properties:
        id:
          description: The ID of a customer group
          type: string
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### email

• `Optional` **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:111

___

### first\_name

• `Optional` **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:112

___

### groups

• `Optional` **groups**: [`Group`](internal-7.Group.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:117

___

### last\_name

• `Optional` **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:113

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:116

___

### password

• `Optional` **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:114

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/update-customer.d.ts:115
