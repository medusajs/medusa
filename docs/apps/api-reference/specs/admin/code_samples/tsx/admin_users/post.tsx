import React from "react"
import { useAdminCreateUser } from "medusa-react"

const CreateUser = () => {
  const createUser = useAdminCreateUser()
  // ...

  const handleCreateUser = () => {
    createUser.mutate({
      email: "user@example.com",
      password: "supersecret",
    }, {
      onSuccess: ({ user }) => {
        console.log(user.id)
      }
    })
  }

  // ...
}

export default CreateUser
