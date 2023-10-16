---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostAuthReq

[internal](../modules/internal-1.md).AdminPostAuthReq

**`Schema`**

AdminPostAuthReq
type: object
required:
  - email
  - password
properties:
  email:
    type: string
    description: The user's email.
    format: email
  password:
    type: string
    description: The user's password.
    format: password

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/auth/create-session.d.ts:78

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/auth/create-session.d.ts:79
