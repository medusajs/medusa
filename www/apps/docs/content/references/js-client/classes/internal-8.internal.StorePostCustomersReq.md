---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCustomersReq

**`Schema`**

StorePostCustomersReq
type: object
required:
  - first_name
  - last_name
  - email
  - password
properties:
  first_name:
    description: "The customer's first name."
    type: string
  last_name:
    description: "The customer's last name."
    type: string
  email:
    description: "The customer's email."
    type: string
    format: email
  password:
    description: "The customer's password."
    type: string
    format: password
  phone:
    description: "The customer's phone number."
    type: string

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-customer.d.ts:111

___

### first\_name

• **first\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-customer.d.ts:109

___

### last\_name

• **last\_name**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-customer.d.ts:110

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-customer.d.ts:112

___

### phone

• `Optional` **phone**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/create-customer.d.ts:113
