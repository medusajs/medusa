---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostAuthReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostAuthReq

**`Schema`**

StorePostAuthReq
type: object
required:
  - email
  - password
properties:
  email:
    type: string
    description: The Customer's email.
  password:
    type: string
    description: The Customer's password.

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/auth/create-session.d.ts:75

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/store/auth/create-session.d.ts:76
