import React from "react"
import { useAdminNotifications } from "medusa-react"

const Notifications = () => {
  const { notifications, isLoading } = useAdminNotifications()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {notifications && !notifications.length && (
        <span>No Notifications</span>
      )}
      {notifications && notifications.length > 0 && (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.to}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
