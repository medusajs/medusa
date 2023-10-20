---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostCustomersCustomerPasswordTokenReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostCustomersCustomerPasswordTokenReq

**`Schema`**

StorePostCustomersCustomerPasswordTokenReq
type: object
required:
  - email
properties:
  email:
    description: "The customer's email."
    type: string
    format: email

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/customers/reset-password-token.d.ts:72
