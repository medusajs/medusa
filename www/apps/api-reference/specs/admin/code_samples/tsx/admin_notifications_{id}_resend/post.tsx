import React from "react"
import { useAdminResendNotification } from "medusa-react"

type Props = {
  notificationId: string
}

const Notification = ({ notificationId }: Props) => {
  const resendNotification = useAdminResendNotification(
    notificationId
  )
  // ...

  const handleResend = () => {
    resendNotification.mutate({}, {
      onSuccess: ({ notification }) => {
        console.log(notification.id)
      }
    })
  }

  // ...
}

export default Notification
