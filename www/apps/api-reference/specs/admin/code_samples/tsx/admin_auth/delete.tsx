import React from "react"
import { useAdminDeleteSession } from "medusa-react"

const Logout = () => {
  const adminLogout = useAdminDeleteSession()
  // ...

  const handleLogout = () => {
    adminLogout.mutate(undefined, {
      onSuccess: () => {
        // user logged out.
      }
    })
  }

  // ...
}

export default Logout
