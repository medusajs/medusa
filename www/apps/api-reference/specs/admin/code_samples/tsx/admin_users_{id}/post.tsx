import React from "react"
import { useAdminUpdateUser } from "medusa-react"

type Props = {
  userId: string
}

const User = ({ userId }: Props) => {
  const updateUser = useAdminUpdateUser(userId)
  // ...

  const handleUpdateUser = (
    firstName: string
  ) => {
    updateUser.mutate({
      first_name: firstName,
    }, {
      onSuccess: ({ user }) => {
        console.log(user.first_name)
      }
    })
  }

  // ...
}

export default User
