import React from "react"
import { useAdminUser } from "medusa-react"

type Props = {
  userId: string
}

const User = ({ userId }: Props) => {
  const { user, isLoading } = useAdminUser(
    userId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {user && <span>{user.first_name} {user.last_name}</span>}
    </div>
  )
}

export default User
