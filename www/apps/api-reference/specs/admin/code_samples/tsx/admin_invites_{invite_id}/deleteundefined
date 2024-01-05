import React from "react"
import { useAdminDeleteInvite } from "medusa-react"

type Props = {
  inviteId: string
}

const DeleteInvite = ({ inviteId }: Props) => {
  const deleteInvite = useAdminDeleteInvite(inviteId)
  // ...

  const handleDelete = () => {
    deleteInvite.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Invite
