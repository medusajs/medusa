import React from "react"
import { useAdminLogin } from "medusa-react"

const Login = () => {
  const adminLogin = useAdminLogin()
  // ...

  const handleLogin = () => {
    adminLogin.mutate({
      email: "user@example.com",
      password: "supersecret",
    }, {
      onSuccess: ({ user }) => {
        console.log(user)
      }
    })
  }

  // ...
}

export default Login
