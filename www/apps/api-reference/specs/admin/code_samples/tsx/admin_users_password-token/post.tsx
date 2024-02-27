import React from "react"
import { useAdminSendResetPasswordToken } from "medusa-react"

const Login = () => {
  const requestPasswordReset = useAdminSendResetPasswordToken()
  // ...

  const handleResetPassword = (
    email: string
  ) => {
    requestPasswordReset.mutate({
      email
    }, {
      onSuccess: () => {
        // successful
      }
    })
  }

  // ...
}

export default Login
