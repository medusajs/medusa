import React from "react"
import { useAdminGetSession } from "medusa-react"

const Profile = () => {
  const { user, isLoading } = useAdminGetSession()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {user && <span>{user.email}</span>}
    </div>
  )
}

export default Profile
