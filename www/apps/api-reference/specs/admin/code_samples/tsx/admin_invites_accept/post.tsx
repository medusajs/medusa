import React from "react"
import { useAdminAcceptInvite } from "medusa-react"

const AcceptInvite = () => {
  const acceptInvite = useAdminAcceptInvite()
  // ...

  const handleAccept = (
    token: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    acceptInvite.mutate({
      token,
      user: {
        first_name: firstName,
        last_name: lastName,
        password,
      },
    }, {
      onSuccess: () => {
        // invite accepted successfully.
      }
    })
  }

  // ...
}

export default AcceptInvite
