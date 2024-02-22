import React from "react"
import { useAdminResendInvite } from "medusa-react"

type Props = {
  inviteId: string
}

const ResendInvite = ({ inviteId }: Props) => {
  const resendInvite = useAdminResendInvite(inviteId)
  // ...

  const handleResend = () => {
    resendInvite.mutate(void 0, {
      onSuccess: () => {
        // invite resent successfully
      }
    })
  }

  // ...
}

export default ResendInvite
