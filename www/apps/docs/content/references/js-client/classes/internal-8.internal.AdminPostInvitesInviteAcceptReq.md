---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostInvitesInviteAcceptReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostInvitesInviteAcceptReq

**`Schema`**

AdminPostInvitesInviteAcceptReq
type: object
required:
  - token
  - user
properties:
  token:
    description: "The token of the invite to accept. This is a unique token generated when the invite was created or resent."
    type: string
  user:
    description: "The details of the user to create."
    type: object
    required:
      - first_name
      - last_name
      - password
    properties:
      first_name:
        type: string
        description: the first name of the User
      last_name:
        type: string
        description: the last name of the User
      password:
        description: The password for the User
        type: string
        format: password

## Properties

### token

• **token**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/invites/accept-invite.d.ts:108

___

### user

• **user**: [`AdminPostInvitesInviteAcceptUserReq`](internal-8.internal.AdminPostInvitesInviteAcceptUserReq.md)

#### Defined in

packages/medusa/dist/api/routes/admin/invites/accept-invite.d.ts:109
