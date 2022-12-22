# Namespace: internal

## Classes

- [AdminPostInvitesInviteAcceptReq](../classes/internal-10.AdminPostInvitesInviteAcceptReq.md)
- [AdminPostInvitesInviteAcceptUserReq](../classes/internal-10.AdminPostInvitesInviteAcceptUserReq.md)
- [AdminPostInvitesReq](../classes/internal-10.AdminPostInvitesReq.md)
- [Invite](../classes/internal-10.Invite.md)

## Type Aliases

### AdminListInvitesRes

Ƭ **AdminListInvitesRes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `invites` | [`Invite`](../classes/internal-10.Invite.md)[] |

#### Defined in

medusa/dist/api/routes/admin/invites/index.d.ts:8

___

### AdminPostInvitesPayload

Ƭ **AdminPostInvitesPayload**: `Omit`<[`AdminPostInvitesReq`](../classes/internal-10.AdminPostInvitesReq.md), ``"role"``\> & { `role`: [`InviteUserRolesEnum`](internal-10.md#inviteuserrolesenum)  }

#### Defined in

[medusa-js/src/typings.ts:47](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L47)

___

### InviteUserRolesEnum

Ƭ **InviteUserRolesEnum**: \`${AdminPostInvitesReq["role"]}\`

#### Defined in

[medusa-js/src/typings.ts:45](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/typings.ts#L45)
