import React from "react"
import { useAdminUsers } from "medusa-react"

const Users = () => {
  const { users, isLoading } = useAdminUsers()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {users && !users.length && <span>No Users</span>}
      {users && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Users
