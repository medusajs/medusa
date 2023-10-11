---
displayed_sidebar: jsClientSidebar
---

# Class: AdminResetPasswordRequest

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminResetPasswordRequest

**`Schema`**

AdminResetPasswordRequest
type: object
required:
  - token
  - password
properties:
  email:
    description: "The User's email."
    type: string
    format: email
  token:
    description: "The password-reset token generated when the password reset was requested."
    type: string
  password:
    description: "The User's new password."
    type: string
    format: password

## Properties

### email

• `Optional` **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/reset-password.d.ts:93

___

### password

• **password**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/reset-password.d.ts:95

___

### token

• **token**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/reset-password.d.ts:94
