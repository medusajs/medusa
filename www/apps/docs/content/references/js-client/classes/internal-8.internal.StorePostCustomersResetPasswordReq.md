---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersResetPasswordReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCustomersResetPasswordReq

**`Schema`**

StorePostCustomersResetPasswordReq
type: object
required:
  - email
  - password
  - token
properties:
  email:
    description: "The customer's email."
    type: string
    format: email
  password:
    description: "The customer's password."
    type: string
    format: password
  token:
    description: "The reset password token"
    type: string

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/reset-password.d.ts:86

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/reset-password.d.ts:88

___

### token

• **token**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/reset-password.d.ts:87
