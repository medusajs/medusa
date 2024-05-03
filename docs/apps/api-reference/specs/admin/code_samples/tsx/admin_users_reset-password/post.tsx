import React from "react"
import { useAdminResetPassword } from "medusa-react"

const ResetPassword = () => {
  const resetPassword = useAdminResetPassword()
  // ...

  const handleResetPassword = (
    token: string,
    password: string
  ) => {
    resetPassword.mutate({
      token,
      password,
    }, {
      onSuccess: ({ user }) => {
        console.log(user.id)
      }
    })
  }

  // ...
}

export default ResetPassword
