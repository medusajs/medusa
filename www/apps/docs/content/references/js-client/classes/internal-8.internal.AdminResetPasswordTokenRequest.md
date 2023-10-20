---
displayed_sidebar: jsClientSidebar
---

# Class: AdminResetPasswordTokenRequest

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminResetPasswordTokenRequest

**`Schema`**

AdminResetPasswordTokenRequest
type: object
required:
  - email
properties:
  email:
    description: "The User's email."
    type: string
    format: email

## Properties

### email

• **email**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/users/reset-password-token.d.ts:77
