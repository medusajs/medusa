import React from "react"
import { useAdminDeleteUser } from "medusa-react"

type Props = {
  userId: string
}

const User = ({ userId }: Props) => {
  const deleteUser = useAdminDeleteUser(userId)
  // ...

  const handleDeleteUser = () => {
    deleteUser.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default User
