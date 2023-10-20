---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostCustomersReq

[internal](../modules/internal-7.md).AdminPostCustomersReq

**`Schema`**

AdminPostCustomersReq
type: object
required:
  - email
  - first_name
  - last_name
  - password
properties:
  email:
    type: string
    description: The customer's email.
    format: email
  first_name:
    type: string
    description: The customer's first name.
  last_name:
    type: string
    description: The customer's last name.
  password:
    type: string
    description: The customer's password.
    format: password
  phone:
    type: string
    description: The customer's phone number.
  metadata:
    description: An optional set of key-value pairs to hold additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:104

___

### first\_name

• **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:105

___

### last\_name

• **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:106

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:109

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:107

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/customers/create-customer.d.ts:108
